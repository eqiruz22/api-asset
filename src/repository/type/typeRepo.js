import prisma from "../../service/prisma.js";

export default class TypeRepository {
  async fetchAll(page, pageSize, search) {
    try {
      let whereClasuse = {};
      if (search) {
        whereClasuse = {
          OR: [{ name: { contains: search } }],
        };
      }
      const skip = (page - 1) * pageSize;
      const data = await prisma.type.findMany({
        skip,
        take: pageSize,
        where: whereClasuse,
      });
      const typeCount = await prisma.type.count({
        where: whereClasuse,
      });
      const totalPage = Math.ceil(typeCount / pageSize);
      return {
        data,
        paginate: {
          page,
          pageSize,
          typeCount,
          totalPage,
        },
      };
    } catch (error) {
      throw error;
    }
  }

  async findId(id) {
    const isId = Number(id);
    if (isNaN(isId) || !Number.isInteger(isId)) {
      throw new Error(`type id must be a valid integer`);
    }

    try {
      const data = await prisma.type.findUnique({
        where: {
          id: isId,
        },
      });
      if (!data) {
        return `type id ${isId} not found`;
      }
      return data;
    } catch (error) {
      throw error;
    }
  }

  async createType(name) {
    if (!name) {
      throw new Error("type name is required");
    }
    try {
      await prisma.type.create({
        data: {
          name: name,
        },
      });
      return "success create";
    } catch (error) {
      throw error;
    }
  }

  async updateType(id, name) {
    const isId = Number(id);
    if (isNaN(isId) || !Number.isInteger(isId)) {
      throw new Error("type id must be a valid integer");
    }
    if (!name) {
      throw new Error("type name is required");
    }
    try {
      const data = await prisma.type.findUnique({
        where: {
          id: isId,
        },
      });
      if (!data) {
        return `type id ${isId} not found`;
      }
      await prisma.type.update({
        where: {
          id: isId,
        },
        data: {
          name: name,
        },
      });
      return `update success`;
    } catch (error) {
      throw error;
    }
  }

  async destroy(id) {
    const isId = Number(id);
    if (isNaN(isId) || !Number.isInteger(isId)) {
      throw new Error(`type id must be a valid integer`);
    }
    try {
      const data = await prisma.type.findUnique({
        where: {
          id: isId,
        },
      });
      if (!data) {
        return `type id ${isId} not found`;
      }
      await prisma.type.delete({
        where: {
          id: isId,
        },
      });
      return `delete success`;
    } catch (error) {
      throw error;
    }
  }
}
