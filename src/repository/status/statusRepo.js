import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default class StatusRepository {
  async fetchAll() {
    try {
      const data = await prisma.statsAsset.findMany();
      return data;
    } catch (error) {
      throw error;
    }
  }

  async fetchId(id) {
    const isId = Number(id);
    if (isNaN(isId) || !Number.isInteger(isId)) {
      throw new Error("status asset id must be a valid integer");
    }
    try {
      const data = await prisma.statsAsset.findUnique({
        where: {
          id: isId,
        },
      });
      if (!data) {
        return `status asset id ${isId} not found`;
      }
      return data;
    } catch (error) {
      throw error;
    }
  }

  async create(name) {
    if (!name) {
      throw new Error("status name is required");
    }
    try {
      await prisma.statsAsset.create({
        data: {
          name: name,
        },
      });
      return `success create status`;
    } catch (error) {
      throw error;
    }
  }

  async update(id, name) {
    const isId = Number(id);
    if (isNaN(isId) || !Number.isInteger(isId)) {
      throw new Error("status asset id must be a valid integer");
    }
    if (!name) {
      throw new Error("status name is required");
    }
    try {
      const data = await prisma.statsAsset.findUnique({
        where: {
          id: isId,
        },
      });
      if (!data) {
        return `status asset id ${isId} not found`;
      }
      await prisma.statsAsset.update({
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
      throw new Error("status asset id must be a valid integer");
    }
    try {
      const data = await prisma.statsAsset.findUnique({
        where: {
          id: isId,
        },
      });
      if (!data) {
        return `status asset id ${isId} not found`;
      }

      await prisma.statsAsset.delete({
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
