import express from "express";
import {
  getAll,
  getById,
  createManufacture,
  updateManufacture,
  destroyManufacture,
} from "../../controllers/manufacture/manufactureController.js";

const route = express.Router();

route.get("/manufacture", getAll);
route.get("/manufacture/:id", getById);
route.post("/manufacture", createManufacture);
route.patch("/manufacture/:id", updateManufacture);
route.delete("/manufacture/:id", destroyManufacture);

export default route;
