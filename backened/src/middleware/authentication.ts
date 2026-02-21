import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
//import { expressjwt, GetVerificationKey } from "express-jwt";
import { expressjwt } from "express-jwt";
import jwt from "jsonwebtoken";
import type { Request, Response } from "express";
import { getUserByEmail } from "../controllers/UserController.ts";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({
  path: path.join(__dirname, "../backend_config.env"),
});

const key = process.env.JWT_SECRET;
if (!key) {
  throw new Error("JWT_SECRET is not defined in environment variables");
}
const secret = Buffer.from(key, "base64");

export const authMiddleware = expressjwt({
  algorithms: ["HS256"],
  credentialsRequired: false,
  secret,
});

export function decodeTokenForWebSocket(token: string) {
  return jwt.verify(token, secret);
}

export async function handleLogin(req: Request, res: Response) {
  const { name, email, password } = req.body as {
    name?: string;
    email: string;
    password: string;
  };
  const user = await getUserByEmail(email);
  if (!user || user.password !== password) {
    res.sendStatus(401);
  } else {
    const claims = { name: user.name, sub: user.id, email: user.email };
    const token = jwt.sign(claims, secret);
    res.json({ token });
  }
}
