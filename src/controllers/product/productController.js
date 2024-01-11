import ProductRepository from "../../repository/product/productRepo.js";

const product = new ProductRepository();

export const getAll = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const size = parseInt(req.query.size) || 10;
    const search = req.query.search || "";
    const data = await product.fetchAll(page, size, search);
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

export const getId = async (req, res) => {
  const id = req.params.id;
  try {
    const data = await product.fetchId(id);
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

export const createProduct = async (req, res) => {
  const item = {
    serial: req.body.serial_number,
    hostname: req.body.hostname,
    product: req.body.product_name,
    manufacture: req.body.manufactureId,
    type: req.body.typeId,
    spesification: req.body.spesification,
    warranty: req.body.warranty,
    buy: req.body.buy_date,
    user: req.body.userId,
  };
  try {
    const data = await product.create(
      item.serial,
      item.hostname,
      item.product,
      item.manufacture,
      item.type,
      item.spesification,
      item.warranty,
      item.buy,
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

export const updateProduct = async (req, res) => {
  const item = {
    id: req.params.id,
    serial: req.body.serial_number,
    hostname: req.body.hostname,
    product: req.body.product_name,
    manufacture: req.body.manufactureId,
    type: req.body.typeId,
    stats: req.body.statsId,
    spesification: req.body.spesification,
    warranty: req.body.warranty,
    buy: req.body.buy_date,
    user: req.body.userId,
  };
  try {
    const data = await product.update(
      item.id,
      item.serial,
      item.hostname,
      item.product,
      item.manufacture,
      item.type,
      item.stats,
      item.spesification,
      item.warranty,
      item.buy,
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

export const destroyProduct = async (req, res) => {
  const id = req.params.id;
  const user = req.body.userId;
  try {
    const data = await product.destroy(id, user);
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

export const getAvail = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const size = parseInt(req.query.size) || 10;
    const search = req.query.search || "";
    const data = await product.productAvail(page, size, search);
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
