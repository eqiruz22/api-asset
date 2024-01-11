import express from "express";
import {
  createAsset,
  destroyAsset,
  fetchTag,
  getAll,
  getById,
  tagAsset,
  updateAsset,
} from "../../controllers/asset/assetController.js";

const route = express.Router();

route.get("/asset", getAll);
route.get("/asset-tag", tagAsset);
route.get("/asset-fetch", fetchTag);
route.get("/asset/:id", getById);
route.post("/asset", createAsset);
route.patch("/asset/:id", updateAsset);
route.delete("/asset/:id", destroyAsset);

export default route;
