import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const prisma = new PrismaClient();

const createToken = (id) => {
  return jwt.sign({ id }, process.env.ACCESS_TOKEN, { expiresIn: "1d" });
};
export default class LoginRepository {
  async login(username, password) {
    const requireField = ["username", "password"];
    requireField.forEach((item) => {
      if (!eval(item)) {
        throw new Error(`${item} is required`);
      }
    });
    try {
      const data = await prisma.user.findUnique({
        where: {
          username: username,
        },
      });
      if (!data) {
        throw new Error(`wrong username or password`);
      }

      const comparePass = await bcrypt.compare(password, data["password"]);
      if (!comparePass) {
        throw new Error("credentials not match!");
      }
      delete data["password"];
      delete data["createdAt"];
      delete data["updatedAt"];
      const token = createToken(data["id"] || null);
      const decodedToken = jwt.decode(token);
      const expiresIn = decodedToken ? decodedToken.exp : null;
      return { data, token, expiresIn };
    } catch (error) {
      throw error;
    }
  }
}
