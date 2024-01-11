import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
const RequireAuth = async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(403).json({
      error: "authorization token is required",
    });
  }

  const token = authorization.split(" ")[1];

  try {
    const { id } = jwt.verify(token, process.env.ACCESS_TOKEN);
    req.user = await prisma.user.findUnique({
      where: {
        id: id,
      },
    });
    next();
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: error,
    });
  }
};

export default RequireAuth;
