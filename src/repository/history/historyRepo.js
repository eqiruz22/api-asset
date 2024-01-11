import prisma from "../../service/prisma.js";

export default class HistoryRepository {
  async fetchAll(id) {
    const isId = Number(id);
    try {
      const data = await prisma.history.findMany({
        where: {
          assetId: isId,
        },
      });
      const count = await prisma.history.count({
        where: {
          assetId: isId,
        },
      });
      return {
        data,
        count,
      };
    } catch (error) {
      throw error;
    }
  }

  async fetchId(id) {
    const isId = Number(id);
    if (isNaN(isId) || !Number.isInteger(isId)) {
      throw new Error("history id must be a valid integer");
    }
    try {
      const data = await prisma.history.findUnique({
        where: {
          id: isId,
        },
      });
      if (!data) {
        return `history id ${isId} not found`;
      }
      return data;
    } catch (error) {
      throw error;
    }
  }

  async create(used_by, reason, assetId) {
    const requireField = ["used_by", "reason", "assetId"];
    requireField.forEach((item) => {
      if (!eval(item)) {
        throw new Error(`${item} is required`);
      }
    });
    try {
      await prisma.history.create({
        data: {
          used_by: used_by,
          reason: reason,
          assetId: assetId,
        },
      });
      return `success create history`;
    } catch (error) {
      throw error;
    }
  }

  async update(id, used_by, reason, assetId) {
    const isId = Number(id);
    if (isNaN(isId) || !Number.isInteger(isId)) {
      throw new Error(`history id must be a valid integer`);
    }
    const requireField = ["used_by", "reason", "assetId"];
    requireField.forEach((item) => {
      if (!eval(item)) {
        throw new Error(`${item} is required`);
      }
    });
    try {
      const data = await prisma.history.findUnique({
        where: {
          id: is,
        },
      });
      if (!data) {
        return `history id ${isId} not found`;
      }
      await prisma.history.update({
        where: {
          id: isId,
        },
        data: {
          used_by: used_by,
          reason: reason,
          assetId: assetId,
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
      throw new Error(`history id must be a valid integer`);
    }
    try {
      const data = await prisma.history.findUnique({
        where: {
          id: isId,
        },
      });
      if (!data) {
        return `history id ${isId} not found`;
      }
      await prisma.history.delete({
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
