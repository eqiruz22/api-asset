import express from "express";
import {
  createEmployee,
  destroyEmployee,
  getAll,
  getBussines,
  getById,
  getDepartment,
  getTitle,
  updateEmployee,
} from "../../controllers/employee/employeeController.js";

const route = express.Router();

route.get("/employee", getAll);
route.get("/employee/title", getTitle);
route.get("/employee/bussines", getBussines);
route.get("/employee/department", getDepartment);
route.get("/employee/:id", getById);
route.post("/employee", createEmployee);
route.patch("/employee/:id", updateEmployee);
route.delete("/employee/:id", destroyEmployee);

export default route;
