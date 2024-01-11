import UserRepository from "../../repository/user/userRepo.js";

const user = new UserRepository();

export const getAll = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.size) || 10;
    const search = req.query.query || "";
    const data = await user.fetchAll(page, pageSize, search);
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
    const data = await user.fetchById(id);
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

export const createUser = async (req, res) => {
  const item = {
    username: req.body.username,
    password: req.body.password,
    fullname: req.body.full_name,
    role: req.body.role,
  };
  try {
    const data = await user.create(
      item.username,
      item.password,
      item.fullname,
      item.role
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

export const updateUser = async (req, res) => {
  const item = {
    username: req.body.username,
    password: req.body.password,
    fullname: req.body.full_name,
    role: req.body.role,
    id: req.params.id,
  };
  try {
    const data = await user.update(
      item.id,
      item.username,
      item.password,
      item.fullname,
      item.role
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

export const deleteUser = async (req, res) => {
  const id = req.params.id;
  try {
    const data = await user.destroy(id);
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
