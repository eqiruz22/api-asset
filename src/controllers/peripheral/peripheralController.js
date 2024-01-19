import PeripheralRepository from "../../repository/peripheral/peripheralRepo.js";

const peripheral = new PeripheralRepository();

export const getAll = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const size = parseInt(req.query.size) || 10;
    const search = req.query.query || "";
    const data = await peripheral.fetchAll(search, page, size);
    return res.status(200).json({
      result: data,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: error,
    });
  }
};

export const getById = async (req, res) => {
  try {
    const id = req.params.id;
    const data = await peripheral.fetchById(id);
    return res.status(200).json({
      result: data,
    });
  } catch (error) {
    console.log(error);
    if (error.message.includes("not found")) {
      return res.status(404).json({
        result: error.message,
      });
    }
    if (error.message.includes("valid integer")) {
      return res.status(400).json({
        error: error.message,
      });
    }
    return res.status(500).json({
      error: error,
    });
  }
};

export const createPeripheral = async (req, res) => {
  const item = {
    name: req.body.name,
    sn: req.body.serial_number,
    stats: req.body.stats_id,
    manufac: req.body.manufac_id,
    location: req.body.location,
    user: req.body.userId,
  };
  try {
    const data = await peripheral.create(
      item.name,
      item.sn,
      item.stats,
      item.manufac,
      item.location,
      item.user
    );
    return res.status(200).json({
      result: data,
    });
  } catch (error) {
    console.log(error);
    if (error.message.includes("is required")) {
      return res.status(400).json({
        error: error.message,
      });
    }
    return res.status(500).json({
      error: error,
    });
  }
};

export const upadtePeripheral = async (req, res) => {
  const item = {
    name: req.body.name,
    sn: req.body.serial_number,
    stats: req.body.stats_id,
    manufac: req.body.manufac_id,
    location: req.body.location,
    user: req.body.userId,
    id: req.params.id,
  };
  try {
    const data = await peripheral.update(
      item.id,
      item.name,
      item.sn,
      item.stats,
      item.manufac,
      item.location,
      item.user
    );
    return res.status(200).json({
      result: data,
    });
  } catch (error) {
    console.log(error);
    if (
      error.message.includes("is required") ||
      error.message.includes("valid integer")
    ) {
      return res.status(400).json({
        error: error.message,
      });
    }
    if (error.message.includes("not found")) {
      return res.status(404).json({
        result: error.message,
      });
    }
    return res.status(500).json({
      error: error,
    });
  }
};

export const destroyPeripheral = async (req, res) => {
  const item = {
    id: req.params.id,
    user: req.body.userId,
  };
  try {
    const data = await peripheral.destroy(item.id, item.user);
    return res.status(200).json({
      result: data,
    });
  } catch (error) {
    console.log(error);
    if (error.message.includes("valid integer")) {
      return res.status(400).json({
        error: error.message,
      });
    }
    if (error.message.includes("not found")) {
      return res.status(404).json({
        result: error.message,
      });
    }
    return res.status(500).json({
      error: error,
    });
  }
};

export const locationPeripheral = async (req, res) => {
  try {
    const search = req.query.query || "";
    const data = await peripheral.findLocation(search);
    return res.status(200).json({
      result: data,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: error,
    });
  }
};
