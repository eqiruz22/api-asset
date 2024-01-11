import StatusRepository from "../../repository/status/statusRepo.js";

const status = new StatusRepository();

export const getAll = async (req, res) => {
  try {
    const data = await status.fetchAll();
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
    const data = await status.fetchId(id);
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

export const createStatus = async (req, res) => {
  const name = req.body.name;
  try {
    const data = await status.create(name);
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

export const updateStatus = async (req, res) => {
  const item = {
    id: req.params.id,
    name: req.body.name,
  };
  try {
    const data = await status.update(item.id, item.name);
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

export const destroyStatus = async (req, res) => {
  const id = req.params.id;
  try {
    const data = await status.destroy(id);
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
