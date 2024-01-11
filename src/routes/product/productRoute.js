import express from "express";
import {
  createProduct,
  destroyProduct,
  getAll,
  getAvail,
  getId,
  updateProduct,
} from "../../controllers/product/productController.js";

const route = express.Router();

route.get("/product", getAll);
route.get("/product-available", getAvail);
route.get("/product/:id", getId);
route.post("/product", createProduct);
route.patch("/product/:id", updateProduct);
route.delete("/product/:id", destroyProduct);

export default route;
