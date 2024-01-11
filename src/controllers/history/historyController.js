import HistoryRepository from "../../repository/history/historyRepo.js";

const history = new HistoryRepository();

export const getAll = async (req, res) => {
  try {
    const id = req.params.id;
    const data = await history.fetchAll(id);
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
    const data = await history.fetchId(id);
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

export const createHistory = async (req, res) => {
  const item = {
    used: req.body.used_by,
    move: req.body.move_to,
    reason: req.body.reason,
    asset: req.body.assetId,
  };
  try {
    const data = await history.create(
      item.used,
      item.move,
      item.reason,
      item.asset
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

export const updateHistory = async (req, res) => {
  const item = {
    used: req.body.used_by,
    move: req.body.move_to,
    reason: req.body.reason,
    asset: req.body.assetId,
    id: req.params.id,
  };
  try {
    const data = await history.update(
      item.id,
      item.used,
      item.move,
      item.reason,
      item.asset
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
    return res.status(500).json({
      error: error,
    });
  }
};

export const destroyHistory = async (req, res) => {
  const id = req.params.id;
  try {
    const data = await history.destroy(id);
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
