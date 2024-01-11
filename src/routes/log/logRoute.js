import express from "express";
import {
  getAll,
  getById,
  createLog,
} from "../../controllers/log/logController.js";

const route = express.Router();

route.get("/log", getAll);
route.get("/log/:id", getById);
route.post("/log", createLog);

export default route;
