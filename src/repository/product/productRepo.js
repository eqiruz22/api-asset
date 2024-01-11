import prisma from "../../service/prisma.js";
import moment from "moment";

const parseDate = (date) => {
  const parse = moment(date, moment.ISO_8601, true);
  return parse.isValid();
};
export default class ProductRepository {
  async fetchAll(page, pageSize, search) {
    try {
      let whereClause = {};
      if (search) {
        whereClause = {
          OR: [
            { serial_number: { contains: search } },
            { product_name: { contains: search } },
            { hostname: { contains: search } },
          ],
        };
      }
      const skip = (page - 1) * pageSize;
      const data = await prisma.product.findMany({
        skip,
        take: pageSize,
        select: {
          id: true,
          serial_number: true,
          hostname: true,
          product_name: true,
          manufactureId: true,
          typeId: true,
          spesification: true,
          warranty: true,
          buy_date: true,
          createdAt: true,
          updatedAt: true,
          manufacture: {
            select: {
              id: true,
              name: true,
            },
          },
          type: {
            select: {
              id: true,
              name: true,
            },
          },
          statsasset: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        where: whereClause,
      });
      const productCount = await prisma.product.count({
        where: whereClause,
      });
      const totalPage = Math.ceil(productCount / pageSize);
      return { data, paginate: { page, pageSize, productCount, totalPage } };
    } catch (error) {
      throw error;
    }
  }

  async fetchId(id) {
    const isId = Number(id);
    if (isNaN(isId) || !Number.isInteger(isId)) {
      return "product id must be a valid integer";
    }
    try {
      const data = await prisma.product.findUnique({
        where: {
          id: isId,
        },
        select: {
          id: true,
          serial_number: true,
          hostname: true,
          product_name: true,
          manufactureId: true,
          typeId: true,
          spesification: true,
          warranty: true,
          statsId: true,
          buy_date: true,
          createdAt: true,
          updatedAt: true,
          manufacture: {
            select: {
              id: true,
              name: true,
            },
          },
          type: {
            select: {
              id: true,
              name: true,
            },
          },
          statsasset: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });
      if (!data) {
        return `product id ${id} not found`;
      }
      const stats = await prisma.statsAsset.findMany();
      return { data, stats };
    } catch (error) {
      throw error;
    }
  }

  async create(
    serial_number,
    hostname,
    product_name,
    manufactureId,
    typeId,
    spesification,
    warranty,
    buy_date,
    userId
  ) {
    const mId = Number(manufactureId);
    const tId = Number(typeId);
    const uId = Number(userId);
    const requireField = [
      "serial_number",
      "hostname",
      "product_name",
      "manufactureId",
      "typeId",
      "spesification",
      "warranty",
      "buy_date",
      "userId",
    ];
    requireField.forEach((item) => {
      if (!eval(item)) {
        throw new Error(`${item} is required`);
      }
    });

    const validateField = [mId, tId, uId];
    validateField.forEach((item) => {
      if (isNaN(item) || !Number.isInteger(item)) {
        throw new Error(`${item} must be a valid integer`);
      }
    });

    try {
      const parseField = [warranty, buy_date];
      parseField.forEach((item) => {
        if (!parseDate(item)) {
          throw new Error(`invalid argument ${item} type`);
        }
      });
      await prisma.$transaction([
        prisma.product.create({
          data: {
            serial_number: serial_number,
            hostname: hostname,
            product_name: product_name,
            manufactureId: mId,
            typeId: tId,
            spesification: spesification,
            warranty: moment(warranty).toISOString(),
            buy_date: moment(buy_date).toISOString(),
          },
        }),
        prisma.log.create({
          data: {
            userId: uId,
            type: "Create",
            action: `create new product with SN: ${serial_number}`,
          },
        }),
      ]);
      return `success create product`;
    } catch (error) {
      throw error;
    }
  }

  async update(
    id,
    serial_number,
    hostname,
    product_name,
    manufactureId,
    typeId,
    spesification,
    warranty,
    statsId,
    buy_date,
    userId
  ) {
    const pId = Number(id);
    const mId = Number(manufactureId);
    const tId = Number(typeId);
    const uId = Number(userId);
    const requireField = [
      "serial_number",
      "hostname",
      "product_name",
      "manufactureId",
      "typeId",
      "spesification",
      "warranty",
      "statsId",
      "buy_date",
      "userId",
    ];
    requireField.forEach((item) => {
      if (!eval(item)) {
        throw new Error(`${item} is required`);
      }
    });

    const validateField = [pId, mId, tId];
    validateField.forEach((item) => {
      if (isNaN(item) || !Number.isInteger(item)) {
        throw new Error(`${item} must be a valid integer`);
      }
    });
    try {
      const parseField = [warranty, buy_date];
      parseField.forEach((item) => {
        if (!parseDate(item)) {
          throw new Error(`invalid argument ${item} type`);
        }
      });
      const data = await prisma.product.findUnique({
        where: {
          id: pId,
        },
      });
      if (!data) {
        return `product id ${pId} not found`;
      }
      await prisma.$transaction([
        prisma.product.update({
          where: {
            id: pId,
          },
          data: {
            serial_number: serial_number,
            hostname: hostname,
            product_name: product_name,
            manufactureId: mId,
            typeId: tId,
            spesification: spesification,
            statsId: statsId,
            warranty: moment(warranty).toISOString(),
            buy_date: moment(buy_date).toISOString(),
          },
        }),
        prisma.log.create({
          data: {
            userId: uId,
            type: "Update",
            action: `update product with SN: ${serial_number}`,
          },
        }),
      ]);
      return `update success`;
    } catch (error) {
      throw error;
    }
  }

  async destroy(id, userId) {
    const pId = Number(id);
    const uId = Number(userId);
    const validField = [pId, uId];
    validField.forEach((item) => {
      if (isNaN(item) || !Number.isInteger(item)) {
        throw new Error(`must be a valid integer`);
      }
    });
    try {
      const data = await prisma.product.findUnique({
        where: {
          id: pId,
        },
      });
      if (!data) {
        return `product id ${pId} not found`;
      }
      await prisma.$transaction([
        prisma.log.create({
          data: {
            userId: uId,
            type: "Delete",
            action: `delete product with SN: ${data["serial_number"]}`,
          },
        }),
        prisma.product.delete({
          where: {
            id: pId,
          },
        }),
      ]);
      return "delete ssucce";
    } catch (error) {
      throw error;
    }
  }

  async productAvail(page, pageSize, search) {
    try {
      const skip = (page - 1) * pageSize;
      const data = await prisma.product.findMany({
        skip,
        take: pageSize,
        select: {
          id: true,
          product_name: true,
        },
        where: {
          OR: [{ product_name: { contains: `%${search}%` } }],
          statsId: 1,
        },
      });
      return { data, page, pageSize };
    } catch (error) {
      throw error;
    }
  }
}
