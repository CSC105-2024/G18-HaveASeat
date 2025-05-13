import type { Context, Next } from "hono";
import { sign, verify } from "hono/jwt";
import type { User } from "@/prisma/generated/index.js";
import { UserModel } from "@/models/user.model.js";

const JWT_SECRET = process.env.JWT_SECRET as string;

export const authMiddleware = async (c: Context, next: Next) => {
  try {
    const authHeader = c.req.header("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const token = authHeader.split(" ")[1];
    const payload = await verify(token, JWT_SECRET);
    if (!payload) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const user = await UserModel.findById(payload.id as string);
    if (!user) {
      return c.json({ error: "User not found" }, 401);
    }

    c.set("user", user);

    await next();
  } catch (error) {
    return c.json({ error: "Unauthorized" }, 401);
  }
};

export const createTokenPair = async (user: User) => {
  const accessToken = await sign(
    { id: user.id, email: user.email, exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 },
    JWT_SECRET
  );

  const refreshToken = await sign(
    { id: user.id, email: user.email, exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7 },
    JWT_SECRET
  );

  return { accessToken, refreshToken };
};
