import prisma from "../../service/prisma.js";
export default class ManufactureRepository {
  async findAll(page, pageSize, search) {
    try {
      let whereClause = {};
      if (search) {
        whereClause = {
          OR: [{ name: { contains: search } }],
        };
      }
      const skip = (page - 1) * pageSize;
      const data = await prisma.manufacture.findMany({
        skip,
        take: pageSize,
        where: whereClause,
      });
      const manufactureCount = await prisma.manufacture.count({
        where: whereClause,
      });
      const totalPage = Math.ceil(manufactureCount / pageSize);
      return {
        data,
        paginate: {
          page,
          pageSize,
          manufactureCount,
          totalPage,
        },
      };
    } catch (error) {
      throw error;
    }
  }

  async findById(id) {
    const isNumber = Number(id);
    if (isNaN(isNumber) || !Number.isInteger(isNumber)) {
      throw new Error("manufacture id must be a valid integer");
    }
    try {
      const data = await prisma.manufacture.findUnique({
        where: {
          id: isNumber,
        },
      });
      if (!data) {
        return `manufacture id ${id} not found`;
      }
      return data;
    } catch (error) {
      throw error;
    }
  }

  async create(name, userId) {
    const uId = Number(userId);
    if (!name) {
      throw new Error(`manufacture name is required`);
    }
    if (isNaN(uId) || !Number.isInteger(uId)) {
      throw new Error("user id must be a valid integer");
    }
    try {
      await prisma.$transaction([
        prisma.log.create({
          data: {
            userId: uId,
            type: "Create",
            action: `create new manufacture name ${name}`,
          },
        }),
        prisma.manufacture.create({
          data: {
            name: name,
          },
        }),
      ]);
      return `success create new manufacture`;
    } catch (error) {
      throw error;
    }
  }

  async update(id, name, userId) {
    const isNumber = Number(id);
    const uId = Number(userId);
    const validField = [isNumber, uId];
    validField.forEach((item) => {
      if (isNaN(item) || !Number.isInteger(item)) {
        throw new Error(`${item} must be a valid integer`);
      }
    });
    if (!name) {
      throw new Error("manufacture name is required");
    }
    try {
      const data = await prisma.manufacture.findUnique({
        where: {
          id: isNumber,
        },
      });
      if (!data) {
        return `manufacture id ${isNumber} not found`;
      }
      await prisma.$transaction([
        prisma.log.create({
          data: {
            userId: uId,
            type: "Update",
            action: `update manufacture name ${name}`,
          },
        }),
        prisma.manufacture.update({
          where: {
            id: isNumber,
          },
          data: {
            name: name,
          },
        }),
      ]);
      return `update success`;
    } catch (error) {
      throw error;
    }
  }

  async delete(id, userId) {
    const isNumber = Number(id);
    const uId = Number(userId);
    const validField = [isNumber, uId];
    validField.forEach((item) => {
      if (isNaN(item) || !Number.isInteger(item)) {
        throw new Error(`${item} must be a valid integer`);
      }
    });
    try {
      const data = await prisma.manufacture.findUnique({
        where: {
          id: isNumber,
        },
      });
      if (!data) {
        return `manufacture id ${id} not found`;
      }
      await prisma.$transaction([
        prisma.log.create({
          data: {
            userId: uId,
            type: "Delete",
            action: `delete manufacture name ${data["name"]}`,
          },
        }),
        prisma.manufacture.delete({
          where: {
            id: isNumber,
          },
        }),
      ]);
      return `delete success`;
    } catch (error) {
      throw error;
    }
  }
}
