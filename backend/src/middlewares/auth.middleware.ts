import type { Context, Next } from "hono";
import { sign, verify } from "hono/jwt";
import { UserModel } from "@/models/user.model.js";
import {getCookie, setCookie } from "hono/cookie";
import type {AppEnv} from "@/types/env.js";

export const JWT_SECRET = process.env.JWT_SECRET || "jwt-secret-key";
export const COOKIE_NAME = "auth_token";

const cookieOptions = {
  httpOnly: false,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: 60 * 60 * 24 * 7,
};

export const setAuthCookie = async (c: Context<AppEnv>, payload: object) => {
  const token = await sign({...payload, exp: Math.floor(Date.now() / 1000) + cookieOptions.maxAge}, JWT_SECRET);
  setCookie(c, COOKIE_NAME, token, cookieOptions);
  return token;
};

export const clearAuthCookie = (c: Context<AppEnv>) => {
  setCookie(c, COOKIE_NAME, "", {...cookieOptions, maxAge: 0});
};

export const authMiddleware = async (c: Context, next: Next) => {
  const token = getCookie(c, COOKIE_NAME);
  if (!token) {
    return c.json({
      error: 'Authentication required'
    }, 401);
  }

  try {
    const payload = await verify(token, JWT_SECRET);
    if (!payload || !payload?.id) {
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
