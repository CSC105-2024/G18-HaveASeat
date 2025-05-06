import type { Context } from "hono";
import type { AppEnv } from "@/types/env.js";

const isAdmin = (c: Context<AppEnv>): boolean => {
  return c.get("user")?.isAdmin;
};