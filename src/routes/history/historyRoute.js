import express from "express";
import {
  createHistory,
  destroyHistory,
  getAll,
  getById,
  updateHistory,
} from "../../controllers/history/historyController.js";

const route = express.Router();

route.get("/history/:id", getAll);
route.get("/history-detail/:id", getById);
route.post("/history", createHistory);
route.get("/history", updateHistory);
route.get("/history", destroyHistory);

export default route;
