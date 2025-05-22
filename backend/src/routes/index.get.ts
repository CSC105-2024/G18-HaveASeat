import type { Context } from "hono";
import type { AppEnv } from "@/types/env.js";

export default function(c: Context<AppEnv>) {
  return c.json({
    success: true,
    message: "Welcome to the Have a Seat API!",
    version: "1.0.0"
  });
}