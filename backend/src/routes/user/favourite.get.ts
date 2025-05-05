import type { Context } from "hono";
import { authMiddleware } from "@/middlewares/auth.middleware.js";
import type { AppEnv } from "@/types/env.js";

export default async function (c: Context<AppEnv>) {
  await authMiddleware(c, async () => {})

  try {
    const user = c.get('user');
    return c.json({});
  } catch (error) {
      console.error('Page error:', error)
      return c.json({ error: 'Internal server error' }, 500)
    }
}