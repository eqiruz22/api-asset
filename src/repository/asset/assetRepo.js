import prisma from "../../service/prisma.js";

export default class AssetRepository {
  async fetchAll(page, pageSize, search) {
    const searching = `%${search}%`;
    try {
      const skip = (page - 1) * pageSize;
      const data = await prisma.asset.findMany({
        select: {
          id: true,
          employeeId: true,
          productId: true,
          location: true,
          tag_id: true,
          employee: {
            select: {
              id: true,
              nik: true,
              full_name: true,
              email: true,
              title: true,
              department: true,
              bussines_unit: true,
            },
          },
          product: {
            select: {
              id: true,
              serial_number: true,
              hostname: true,
              product_name: true,
              spesification: true,
              warranty: true,
            },
          },
        },
        where: {
          OR: [
            { employee: { full_name: { contains: searching } } },
            { product: { serial_number: { contains: searching } } },
          ],
        },
        orderBy: {
          id: "desc",
        },
        skip,
        take: pageSize,
      });
      const assetCount = await prisma.asset.count({
        where: {
          OR: [
            { employee: { full_name: { contains: searching } } },
            { product: { serial_number: { contains: searching } } },
          ],
        },
      });
      const totalPage = Math.ceil(assetCount / pageSize);
      return {
        data,
        paginate: {
          page,
          pageSize,
          assetCount,
          totalPage,
        },
      };
    } catch (error) {
      throw error;
    }
  }

  async fetchById(id) {
    const isId = Number(id);
    if (isNaN(isId) || !Number.isInteger(isId)) {
      throw new Error("asset id must be a valid integer");
    }
    try {
      const data = await prisma.asset.findUnique({
        select: {
          id: true,
          employeeId: true,
          productId: true,
          tag_id: true,
          location: true,
          employee: {
            select: {
              full_name: true,
            },
          },
          product: {
            select: {
              product_name: true,
              serial_number: true,
            },
          },
        },
        where: {
          id: isId,
        },
      });
      if (!data) {
        return `asset id ${isId} not found`;
      }
      // console.log(data["product"]["serial_number"]);
      return data;
    } catch (error) {
      throw error;
    }
  }

  async create(employeeId, productId, location, tag_id, used_by, userId) {
    const eId = Number(employeeId);
    const pId = Number(productId);
    const uId = Number(userId);
    const requireField = [
      "employeeId",
      "productId",
      "location",
      "tag_id",
      "used_by",
      "userId",
    ];
    requireField.forEach((item) => {
      if (!eval(item)) {
        throw new Error(`${item} is required`);
      }
    });

    const validField = [eId, pId, uId];
    validField.forEach((item) => {
      if (isNaN(item) || !Number.isInteger(item)) {
        throw new Error(`${item} must be a valid integer`);
      }
    });
    try {
      const createAsset = await prisma.asset.create({
        data: {
          employeeId: eId,
          productId: pId,
          location: location,
          tag_id: tag_id,
        },
      });
      const data = await prisma.product.findUnique({
        where: {
          id: pId,
        },
      });
      if (createAsset) {
        await prisma.$transaction([
          prisma.history.create({
            data: {
              used_by: used_by,
              reason: "use",
              assetId: createAsset["id"],
            },
          }),
          prisma.log.create({
            data: {
              userId: uId,
              type: "Create",
              action: `Create asset with SN: ${data["serial_number"]}`,
            },
          }),
          prisma.product.update({
            where: {
              id: data["id"],
            },
            data: {
              statsId: 2,
            },
          }),
        ]);
      }
      console.log(createAsset);
      return "success create new asset";
    } catch (error) {
      throw error;
    }
  }

  async update(id, employeeId, productId, location, tag_id, used_by, userId) {
    const isId = Number(id);
    const eId = Number(employeeId);
    const pId = Number(productId);
    const uId = Number(userId);
    const requireField = [
      "employeeId",
      "productId",
      "location",
      "tag_id",
      "used_by",
      "userId",
    ];
    requireField.forEach((item) => {
      if (!eval(item)) {
        throw new Error(`${item} is required`);
      }
    });

    const validField = [eId, pId, isId, uId];
    validField.forEach((item) => {
      if (isNaN(item) || !Number.isInteger(item)) {
        throw new Error(`${item} must be a valid integer`);
      }
    });
    try {
      const data = await prisma.asset.findUnique({
        select: {
          id: true,
          employeeId: true,
          productId: true,
          tag_id: true,
          location: true,
          product: {
            select: {
              product_name: true,
              serial_number: true,
            },
          },
        },
        where: {
          id: isId,
        },
      });
      const prod = await prisma.product.findUnique({
        select: {
          id: true,
          product_name: true,
          serial_number: true,
        },
        where: {
          id: pId,
        },
      });
      if (!data) {
        return `asset id ${isId} not found`;
      }
      const shouldUpdateProductStats = data["productId"] !== pId;
      const shouldCreateHistoryAsset = data["employeeId"] !== eId;
      if (shouldUpdateProductStats) {
        await prisma.product.update({
          where: {
            id: data["productId"],
          },
          data: {
            statsId: 1,
          },
        });
      }
      if (shouldCreateHistoryAsset) {
        await prisma.history.create({
          data: {
            used_by: used_by,
            reason: "use",
            assetId: isId,
          },
        });
      }
      await prisma.$transaction([
        prisma.asset.update({
          where: {
            id: isId,
          },
          data: {
            employeeId: eId,
            productId: pId,
            location: location,
            tag_id: tag_id,
          },
        }),
        prisma.product.update({
          where: {
            id: pId,
          },
          data: {
            statsId: 2,
          },
        }),
        prisma.log.create({
          data: {
            userId: uId,
            type: "Update",
            action: `Update asset with SN: ${prod["serial_number"]}`,
          },
        }),
      ]);
      return "update success";
    } catch (error) {
      throw error;
    }
  }

  async destroy(id, userId) {
    const isId = Number(id);
    const uId = Number(userId);
    if (isNaN(isId) || !Number.isInteger(isId)) {
      throw new Error("asset id must be a valid integer");
    }
    try {
      const data = await prisma.asset.findUnique({
        select: {
          id: true,
          employeeId: true,
          productId: true,
          tag_id: true,
          location: true,
          product: {
            select: {
              product_name: true,
              serial_number: true,
            },
          },
        },
        where: {
          id: isId,
        },
      });
      if (!data) {
        return `asset id ${isId} not found`;
      } else {
        await prisma.product.update({
          where: {
            id: data.productId,
          },
          data: {
            statsId: 1,
          },
        });
        await prisma.log.create({
          data: {
            userId: uId,
            type: "Delete",
            action: `deleted asset with SN: ${data["product"]["serial_number"]}`,
          },
        });
        await prisma.asset.delete({
          where: {
            id: isId,
          },
        });
        return "delete success";
      }
    } catch (error) {
      throw error;
    }
  }

  async distinctAsset() {
    try {
      const data = await prisma.asset.findMany({
        select: {
          tag_id: true,
        },
        distinct: ["tag_id"],
      });
      return data;
    } catch (error) {
      throw error;
    }
  }

  async fetchTagAsset(page, pageSize, search) {
    try {
      const skip = (page - 1) * pageSize;
      const data = await prisma.asset.findMany({
        skip,
        take: pageSize,
        select: {
          id: true,
          tag_id: true,
        },
        where: {
          OR: [{ tag_id: { contains: `%${search}%` } }],
        },
      });
      return {
        data,
        paginate: {
          page,
          pageSize,
        },
      };
    } catch (error) {
      throw error;
    }
  }
}
