import prisma from "../../service/prisma.js";

export default class LogRepository {
  async fetchAll(page, pageSize, search) {
    try {
      let whereClause = {};
      if (search) {
        whereClause = {
          OR: [{ full_name: { contains: search } }],
        };
      }
      const skip = (page - 1) * pageSize;
      const data = await prisma.log.findMany({
        skip,
        take: pageSize,
        select: {
          id: true,
          action: true,
          createdAt: true,
          user: {
            select: {
              full_name: true,
            },
          },
        },
        where: whereClause,
      });
      const logCount = await prisma.log.count({
        where: {
          OR: [
            {
              user: {
                full_name: {
                  contains: search,
                },
              },
            },
          ],
        },
      });
      const totalPage = Math.ceil(logCount / pageSize);
      return {
        data,
        paginate: {
          page,
          pageSize,
          logCount,
          totalPage,
        },
      };
    } catch (error) {
      throw error;
    }
  }

  async fetchId(id) {
    const isId = Number(id);
    if (isNaN(isId) || !Number.isInteger(isId)) {
      throw new Error("log id must be a valid integer");
    }
    try {
      const data = await prisma.log.findUnique({
        where: {
          id: isId,
        },
      });
      if (!data) {
        return `log id ${isId} not found`;
      }
      return data;
    } catch (error) {
      throw error;
    }
  }
  async create(userId, action) {
    const isId = Number(userId);
    if (isNaN(isId) || !Number.isInteger(isId)) {
      throw new Error("user id must be a valid integer");
    }
    if (!action) {
      throw new Error("action log is required");
    }
    try {
      await prisma.log.create({
        data: {
          userId: userId,
          action: action,
        },
      });
      return "success create new log";
    } catch (error) {
      throw error;
    }
  }
}
