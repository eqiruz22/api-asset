import prisma from "../../service/prisma.js";

export default class EmployeeRepository {
  async fetchAll(page, pageSize, search) {
    try {
      let whereClause = {};
      if (search) {
        whereClause = {
          OR: [
            { full_name: { contains: search } },
            { email: { contains: search } },
          ],
        };
      }
      const skip = (page - 1) * pageSize;
      const data = await prisma.employee.findMany({
        skip,
        take: pageSize,
        where: whereClause,
      });
      const empCount = await prisma.employee.count({
        where: whereClause,
      });
      const totalPage = Math.ceil(empCount / pageSize);
      return {
        data,
        paginate: {
          page,
          pageSize,
          empCount,
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
      throw new Error("employee id must be a valid integer");
    }
    try {
      const data = await prisma.employee.findUnique({
        where: {
          id: isId,
        },
      });
      if (!data) {
        return `employee id ${isId} not found`;
      }
      return data;
    } catch (error) {
      throw error;
    }
  }
  async create(
    nik,
    full_name,
    email,
    title,
    department,
    bussines_unit,
    userId
  ) {
    const requireField = [
      "nik",
      "email",
      "full_name",
      "title",
      "department",
      "bussines_unit",
      "userId",
    ];
    requireField.forEach((item) => {
      if (!eval(item)) {
        throw new Error(`${item} is required`);
      }
    });
    const uId = Number(userId);
    if (isNaN(uId) || !Number.isInteger(uId)) {
      throw new Error("user id must be a valid integer");
    }
    try {
      const [eNik, mail] = await Promise.all([
        prisma.employee.findUnique({
          where: {
            nik: nik,
          },
        }),
        prisma.employee.findUnique({
          where: {
            email: email,
          },
        }),
      ]);
      const errMessage = [];
      if (eNik) {
        errMessage.eNik = `employee nik ${nik} already created`;
      }
      if (mail) {
        errMessage.mail = `employee email ${email} already created`;
      }
      if (Object.keys(errMessage).length > 0) {
        return errMessage;
      }
      await prisma.$transaction([
        prisma.employee.create({
          data: {
            nik: nik,
            full_name: full_name,
            email: email,
            title: title,
            department: department,
            bussines_unit: bussines_unit,
          },
        }),
        prisma.log.create({
          data: {
            userId: uId,
            type: "Create",
            action: `Create new user with NIK ${nik} & name ${full_name}`,
          },
        }),
      ]);
      return "success create new employee";
    } catch (error) {
      throw error;
    }
  }
  async update(
    id,
    nik,
    full_name,
    email,
    title,
    department,
    bussines_unit,
    userId
  ) {
    const isId = Number(id);
    const uId = Number(userId);
    const requireField = [
      "nik",
      "email",
      "full_name",
      "title",
      "department",
      "bussines_unit",
      "userId",
    ];
    const validField = [isId, uId];
    requireField.forEach((item) => {
      if (!eval(item)) {
        throw new Error(`${item} is required`);
      }
    });
    validField.forEach((item) => {
      if (isNaN(item) || !Number.isInteger(item)) {
        throw new Error(`${item} must be a valid integer`);
      }
    });
    try {
      const data = await prisma.employee.findUnique({
        where: {
          id: isId,
        },
      });
      if (!data) {
        return `employee id ${isId} not found`;
      }
      const [eNik, mail] = await Promise.all([
        prisma.employee.findUnique({
          where: {
            nik: nik,
          },
        }),
        prisma.employee.findUnique({
          where: {
            email: email,
          },
        }),
      ]);
      const errMessage = [];
      if (eNik) {
        errMessage.eNik = `employee nik ${nik} already created`;
      }
      if (mail) {
        errMessage.mail = `employee email ${email} already created`;
      }
      if (Object.keys(errMessage).length > 0) {
        return errMessage;
      } else {
        await prisma.$transaction([
          prisma.employee.update({
            where: {
              id: isId,
            },
            data: {
              nik: nik,
              full_name: full_name,
              email: email,
              title: title,
              department: department,
              bussines_unit: bussines_unit,
            },
          }),
          prisma.log.create({
            data: {
              userId: uId,
              type: "Update",
              action: `update user with nik ${nik} & name ${full_name}`,
            },
          }),
        ]);
        return "update success";
      }
    } catch (error) {
      throw error;
    }
  }
  async destroy(id, userId) {
    const isId = Number(id);
    const uId = Number(userId);
    const validField = [isId, uId];
    validField.forEach((item) => {
      if (isNaN(item) || !Number.isInteger(item)) {
        throw new Error(`${item} must be a valid integer`);
      }
    });

    try {
      const data = await prisma.employee.findUnique({
        where: {
          id: isId,
        },
      });
      if (!data) {
        return `employee id ${isId} not found`;
      }
      await prisma.$transaction([
        prisma.log.create({
          data: {
            userId: uId,
            type: "Delete",
            action: `delete user with nik ${data["nik"]} & name ${data["full_name"]}`,
          },
        }),
        prisma.employee.delete({
          where: {
            id: isId,
          },
        }),
      ]);
      return "delete success";
    } catch (error) {
      throw error;
    }
  }

  async fetchTitle() {
    try {
      const data = await prisma.$queryRaw`SELECT DISTINCT title FROM employee`;
      return data;
    } catch (error) {
      throw error;
    }
  }
  async fetchDepartment() {
    try {
      const data =
        await prisma.$queryRaw`SELECT DISTINCT department FROM employee`;
      return data;
    } catch (error) {
      throw error;
    }
  }
  async fetchBussines() {
    try {
      const data =
        await prisma.$queryRaw`SELECT DISTINCT bussines_unit FROM employee`;
      return data;
    } catch (error) {
      throw error;
    }
  }
}
