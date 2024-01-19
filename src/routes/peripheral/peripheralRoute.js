import express from "express";
import {
  createPeripheral,
  destroyPeripheral,
  getAll,
  getById,
  locationPeripheral,
  upadtePeripheral,
} from "../../controllers/peripheral/peripheralController.js";
const route = express.Router();

route.get("/peripheral", getAll);
route.get("/peripheral/:id", getById);
route.get("/peripheral-location", locationPeripheral);
route.post("/peripheral", createPeripheral);
route.patch("/peripheral/:id", upadtePeripheral);
route.delete("/peripheral/:id", destroyPeripheral);

export default route;
