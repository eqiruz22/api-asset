import EmployeeRepository from "../../repository/employee/employeeRepo.js";

const employee = new EmployeeRepository();

export const getAll = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const size = parseInt(req.query.size) || 10;
    const search = req.query.query || "";
    const data = await employee.fetchAll(page, size, search);
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
    const data = await employee.fetchById(id);
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

export const createEmployee = async (req, res) => {
  const item = {
    nik: req.body.nik,
    name: req.body.full_name,
    email: req.body.email,
    title: req.body.title,
    department: req.body.department,
    unit: req.body.bussines_unit,
    user: req.body.userId,
  };
  try {
    const data = await employee.create(
      item.nik,
      item.name,
      item.email,
      item.title,
      item.department,
      item.unit,
      item.user
    );
    return res.status(200).json({
      result: data,
    });
  } catch (error) {
    console.log(error);
    if (error.message.includes("already created")) {
      return res.status(400).json({
        error: error.message,
      });
    }
    return res.status(500).json({
      error: error,
    });
  }
};

export const updateEmployee = async (req, res) => {
  const item = {
    id: req.params.id,
    nik: req.body.nik,
    name: req.body.full_name,
    email: req.body.email,
    title: req.body.title,
    department: req.body.department,
    unit: req.body.bussines_unit,
    user: req.body.userId,
  };
  try {
    const data = await employee.update(
      item.id,
      item.nik,
      item.name,
      item.email,
      item.title,
      item.department,
      item.unit,
      item.user
    );

    return res.status(200).json({
      result: data,
    });
  } catch (error) {
    console.log(error);
    if (
      error.message.includes("already created") ||
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

export const destroyEmployee = async (req, res) => {
  const id = req.params.id;
  const user = req.body.userId;
  try {
    const data = await employee.destroy(id, user);
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

export const getTitle = async (req, res) => {
  try {
    const data = await employee.fetchTitle();
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

export const getDepartment = async (req, res) => {
  try {
    const data = await employee.fetchDepartment();
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

export const getBussines = async (req, res) => {
  try {
    const data = await employee.fetchBussines();
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
