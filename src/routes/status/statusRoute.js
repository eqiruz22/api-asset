import express from "express";
import {
  createStatus,
  destroyStatus,
  getAll,
  getId,
  updateStatus,
} from "../../controllers/status/statusController.js";

const route = express.Router();

route.get("/status", getAll);
route.get("/status/:id", getId);
route.post("/status", createStatus);
route.patch("/status/:id", updateStatus);
route.delete("/status/:id", destroyStatus);

export default route;
