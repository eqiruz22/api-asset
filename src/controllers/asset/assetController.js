import AssetRepository from "../../repository/asset/assetRepo.js";

const asset = new AssetRepository();

export const getAll = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const size = parseInt(req.query.size) || 10;
    const search = req.query.query || "";
    const data = await asset.fetchAll(page, size, search);
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
  const id = req.params.id;
  try {
    const data = await asset.fetchById(id);
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

export const createAsset = async (req, res) => {
  const item = {
    employee: req.body.employeeId,
    product: req.body.productId,
    location: req.body.location,
    tag: req.body.tag_id,
    used: req.body.used_by,
    user: req.body.userId,
  };
  try {
    const data = await asset.create(
      item.employee,
      item.product,
      item.location,
      item.tag,
      item.used,
      item.user
    );
    return res.status(200).json({
      result: data,
    });
  } catch (error) {
    console.log(error);
    if (
      error.message.includes("valid integer") ||
      error.message.includes("is required")
    ) {
      return res.status(400).json({
        error: error.message,
      });
    }
    return res.status(500).json({
      error: error,
    });
  }
};
export const updateAsset = async (req, res) => {
  const item = {
    id: req.params.id,
    employee: req.body.employeeId,
    product: req.body.productId,
    location: req.body.location,
    tag: req.body.tag_id,
    used: req.body.used_by,
    user: req.body.userId,
  };
  try {
    const data = await asset.update(
      item.id,
      item.employee,
      item.product,
      item.location,
      item.tag,
      item.used,
      item.user
    );
    return res.status(200).json({
      result: data,
    });
  } catch (error) {
    console.log(error);
    if (
      error.message.includes("valid integer") ||
      error.message.includes("is required")
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
export const destroyAsset = async (req, res) => {
  const id = req.params.id;
  const user = req.body.userId;
  try {
    const data = await asset.destroy(id, user);
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

export const tagAsset = async (req, res) => {
  try {
    const data = await asset.distinctAsset();
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

export const fetchTag = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const size = parseInt(req.query.size) || 10;
    const search = req.query.query || "";
    const data = await asset.fetchTagAsset(page, size, search);
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
