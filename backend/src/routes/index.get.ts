import type { Context } from "hono";
import type { AppEnv } from "@/types/env.js";

export default function (c: Context<AppEnv>) {
  return c.json({ message: 'Welcome to the Hono API' })
}