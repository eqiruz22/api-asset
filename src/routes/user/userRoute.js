import express from "express";
import {
  createUser,
  deleteUser,
  getAll,
  getById,
  updateUser,
} from "../../controllers/user/userController.js";

const route = express.Router();

route.get("/user", getAll);
route.get("/user/:id", getById);
route.post("/user", createUser);
route.patch("/user/:id", updateUser);
route.delete("/user/:id", deleteUser);

export default route;
