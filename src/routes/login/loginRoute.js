import express from "express";
import { loginUser } from "../../controllers/login/loginController.js";

const route = express.Router();

route.post("/auth", loginUser);

export default route;
