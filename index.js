import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import ManufactureRoute from "./src/routes/manufacture/ManufactureRoute.js";
import TypeRoute from "./src/routes/type/typeRoute.js";
import ProductRoute from "./src/routes/product/productRoute.js";
import StatusRoute from "./src/routes/status/statusRoute.js";
import UserRoute from "./src/routes/user/userRoute.js";
import AssetRoute from "./src/routes/asset/assetRoute.js";
import HistoryRoute from "./src/routes/history/historyRoute.js";
import LogRoute from "./src/routes/log/logRoute.js";
import EmployeeRoute from "./src/routes/employee/employeeRoute.js";
import LoginRoute from "./src/routes/login/loginRoute.js";
import RequireAuth from "./src/middleware/requireAuth.js";
dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.use(LoginRoute);
app.use(RequireAuth); // middleware for all route
app.use(UserRoute);
app.use(ManufactureRoute);
app.use(TypeRoute);
app.use(ProductRoute);
app.use(StatusRoute);
app.use(AssetRoute);
app.use(HistoryRoute);
app.use(LogRoute);
app.use(EmployeeRoute);

app.use("*", (req, res) => {
  const uri = req.originalUrl;
  return res.status(404).json({
    result: `${uri} url not found`,
  });
});
app.listen(process.env.PORT, () => {
  console.log(`Server started on port ${process.env.PORT}`);
});
