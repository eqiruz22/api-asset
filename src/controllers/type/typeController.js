import TypeRepository from "../../repository/type/typeRepo.js";

const type = new TypeRepository();

export const getAll = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.size) || 10;
    const search = req.query.query || "";
    const data = await type.fetchAll(page, pageSize, search);
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
    const data = await type.findId(id);
    return res.status(200).json({
      result: data,
    });
  } catch (error) {
    console.log(error);
    if (error.message.includes("not found")) {
      return res.status(404).json({
        error: error.message,
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

export const createType = async (req, res) => {
  const name = req.body.name;
  const user = req.body.userId;
  try {
    const data = await type.createType(name, user);
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

export const updateType = async (req, res) => {
  const item = {
    id: req.params.id,
    name: req.body.name,
    user: req.body.userId,
  };
  try {
    const data = await type.updateType(item.id, item.name, item.user);
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
        error: error.message,
      });
    }
    return res.status(500).json({
      error: error,
    });
  }
};

export const deleteType = async (req, res) => {
  const id = req.params.id;
  const user = req.body.userId;
  try {
    const data = await type.destroy(id, user);
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
        error: error.message,
      });
    }
    return res.status(500).json({
      error: error,
    });
  }
};
