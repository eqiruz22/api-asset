import express from "express";
import {
  createType,
  deleteType,
  getAll,
  getById,
  updateType,
} from "../../controllers/type/typeController.js";

const route = express.Router();

route.get("/type", getAll);
route.get("/type/:id", getById);
route.post("/type", createType);
route.patch("/type/:id", updateType);
route.delete("/type/:id", deleteType);

export default route;
