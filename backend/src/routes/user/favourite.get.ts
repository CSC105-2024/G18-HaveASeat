import type { Context } from "hono";
import { authMiddleware } from "@/middlewares/auth.middleware.js";

export default async function (c: Context) {
  await authMiddleware(c, async () => {})

  try {
    const user = c.get('user');
    return c.json({});
  } catch (error) {
      console.error('Page error:', error)
      return c.json({ error: 'Internal server error' }, 500)
    }
}