import prisma from "../../service/prisma.js";
import bcrypt from "bcrypt";

export default class UserRepository {
  async fetchAll(page, pageSize, search) {
    try {
      let whereClause = {};
      if (search) {
        whereClause = {
          OR: [
            { username: { contains: search } },
            { full_name: { contains: search } },
          ],
        };
      }
      const skip = (page - 1) * pageSize;
      const data = await prisma.user.findMany({
        skip,
        take: pageSize,
        where: whereClause,
        orderBy: {
          role: "asc",
        },
      });
      const userCount = await prisma.user.count({
        where: whereClause,
      });
      const totalPage = Math.ceil(userCount / pageSize);
      return {
        data,
        paginate: {
          page,
          pageSize,
          userCount,
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
      throw new Error("user id must be a valid integer");
    }
    try {
      const data = await prisma.user.findUnique({
        where: {
          id: isId,
        },
      });
      if (!data) {
        return `user id ${isId} not found`;
      }
      delete data["password"];
      return data;
    } catch (error) {
      throw error;
    }
  }

  async create(username, password, full_name, role) {
    const salt = 10;
    const hashPassword = await bcrypt.hash(password, salt);
    const requireField = ["username", "password", "full_name", "role"];
    requireField.forEach((item) => {
      if (!eval(item)) {
        throw new Error(`${item} is required`);
      }
    });
    try {
      const data = await prisma.user.findUnique({
        where: {
          username: username,
        },
      });
      if (data) {
        return `${username} already created`;
      }
      await prisma.user.create({
        data: {
          username: username,
          password: hashPassword,
          full_name: full_name,
          role: role,
        },
      });
      return "success create new user";
    } catch (error) {
      throw error;
    }
  }

  async update(id, username, password, full_name, role) {
    const isId = Number(id);
    const salt = 10;
    const hashPassword = await bcrypt.hash(password, salt);
    const requireField = ["id", "username", "full_name", "role"];
    requireField.forEach((item) => {
      if (!eval(item)) {
        throw new Error(`${item} is required`);
      }
    });
    if (isNaN(isId) || !Number.isInteger(isId)) {
      throw new Error("user id must be a valid integer");
    }
    try {
      const data = await prisma.user.findUnique({
        where: {
          id: isId,
        },
      });
      if (!data) {
        return `user id ${isId} not found`;
      }
      delete data["password"];
      if (!password) {
        await prisma.user.update({
          where: {
            id: isId,
          },
          data: {
            username: username,
            full_name: full_name,
            role: role,
          },
        });
      }
      await prisma.user.update({
        where: {
          id: isId,
        },
        data: {
          username: username,
          password: hashPassword,
          full_name: full_name,
          role: role,
        },
      });
      return "update success";
    } catch (error) {
      throw error;
    }
  }

  async destroy(id) {
    const isId = Number(id);
    if (isNaN(isId) || !Number.isInteger(isId)) {
      throw new Error("user id must be a valid integer");
    }
    try {
      const data = await prisma.user.findUnique({
        where: {
          id: isId,
        },
      });
      if (!data) {
        return `user id ${isId} not found`;
      }
      delete data["password"];
      await prisma.user.delete({
        where: {
          id: isId,
        },
      });
      return "delete success";
    } catch (error) {
      throw error;
    }
  }
}
