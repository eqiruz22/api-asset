import prisma from "../../service/prisma.js";

export default class PeripheralRepository {
  async fetchAll(search, page, pageSize) {
    try {
      let whereClause = {};
      if (search) {
        whereClause = {
          OR: [
            { name: { contains: search } },
            { serial_number: { contains: search } },
          ],
        };
      }
      const skip = (page - 1) * pageSize;
      const data = await prisma.peripheral.findMany({
        skip,
        take: pageSize,
        select: {
          id: true,
          name: true,
          serial_number: true,
          location: true,
          createdAt: true,
          updatedAt: true,
          statsasset: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        where: whereClause,
      });
      const peripheralCount = await prisma.peripheral.count({
        where: whereClause,
      });
      const totalPage = Math.ceil(peripheralCount / pageSize);
      return {
        data,
        paginate: {
          page,
          pageSize,
          peripheralCount,
          totalPage,
        },
      };
    } catch (error) {
      throw error;
    }
  }

  async findLocation(search) {
    try {
      let whereClause = {};
      if (search) {
        whereClause = {
          OR: [
            { name: { contains: search } },
            { serial_number: { contains: search } },
          ],
        };
      }
      const data = await prisma.peripheral.findMany({
        select: {
          location: true,
        },
        where: whereClause,
        distinct: ["location"],
      });
      return data;
    } catch (error) {
      throw error;
    }
  }
  async fetchById(id) {
    const isId = Number(id);
    if (isNaN(isId) || !Number.isInteger(isId)) {
      throw new Error("peripheral id must be a valid integer");
    }
    try {
      const data = await prisma.peripheral.findUnique({
        select: {
          id: true,
          name: true,
          serial_number: true,
          stats_id: true,
          manufac_id: true,
          location: true,
          statsasset: {
            select: {
              id: true,
              name: true,
            },
          },
          manufacture: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        where: {
          id: isId,
        },
      });
      if (!data) {
        return `peripheral id ${isId} not found`;
      }
      return data;
    } catch (error) {
      throw error;
    }
  }

  async create(name, serial_number, stats_id, manufac_id, location, userId) {
    const requireField = [
      "name",
      "serial_number",
      "stats_id",
      "manufac_id",
      "location",
      "userId",
    ];
    const uId = Number(userId);
    const sId = Number(stats_id);
    const mId = Number(manufac_id);
    const validField = [uId, sId, mId];
    validField.forEach((item) => {
      if (isNaN(item) || !Number.isInteger(item)) {
        throw new Error(`${item} must be a valid integer`);
      }
    });
    requireField.forEach((item) => {
      if (!eval(item)) {
        throw new Error(`${item} is required`);
      }
    });
    try {
      await prisma.$transaction([
        prisma.peripheral.create({
          data: {
            name: name,
            serial_number: serial_number,
            stats_id: sId,
            manufac_id: mId,
            location: location,
          },
        }),
        prisma.log.create({
          data: {
            userId: uId,
            type: "Create",
            action: `Create new peripheral with name ${name} & SN: ${serial_number}`,
          },
        }),
      ]);
      return `success create peripheral`;
    } catch (error) {
      throw error;
    }
  }

  async update(
    id,
    name,
    serial_number,
    stats_id,
    manufac_id,
    location,
    userId
  ) {
    const isId = Number(id);
    const uId = Number(userId);
    const sId = Number(stats_id);
    const mId = Number(manufac_id);
    const requireField = [
      "name",
      "serial_number",
      "stats_id",
      "manufac_id",
      "location",
      "userId",
    ];
    const validField = [isId, uId, sId, mId];

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
      const data = await prisma.peripheral.findUnique({
        where: {
          id: isId,
        },
      });
      if (!data) {
        return `peripheral id ${isId} not found`;
      }
      await prisma.$transaction([
        prisma.peripheral.update({
          where: {
            id: isId,
          },
          data: {
            name: name,
            serial_number: serial_number,
            stats_id: sId,
            manufac_id: mId,
            location: location,
          },
        }),
        prisma.log.create({
          data: {
            userId: uId,
            type: "Update",
            action: `Update peripheral name ${name} & SN: ${serial_number}`,
          },
        }),
      ]);
      return `update success`;
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
      const data = await prisma.peripheral.findUnique({
        where: {
          id: isId,
        },
      });
      if (!data) {
        return `peripheral id ${isId} not found`;
      }
      await prisma.$transaction([
        prisma.log.create({
          data: {
            userId: uId,
            type: "Delete",
            action: `Delete peripheral name ${data["name"]} & SN: ${data["serial_number"]}`,
          },
        }),
        prisma.peripheral.delete({
          where: {
            id: isId,
          },
        }),
      ]);
      return `delete success`;
    } catch (error) {
      throw error;
    }
  }
}
