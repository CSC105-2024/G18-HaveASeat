import type { Context } from "hono";
import { getPrisma } from "@/lib/prisma.ts";
import { authMiddleware } from "@/middlewares/auth.middleware.js";
import type { AppEnv } from "@/types/env.js";

export const middleware = [
  authMiddleware
];

export default async function(c: Context<AppEnv>) {
  try {
    const prisma = getPrisma();
    const id = c.req.param("id");

    const existing = await prisma.user.findUnique({ where: { id } });
    if (!existing) {
      return c.json({ success: false, error: "User not found" }, 404);
    }

    const updated = await prisma.user.delete({
      where: { id },
    });

    return c.json({ success: true, data: updated });
  } catch (error) {
    console.error("Page error:", error);
    return c.json({ success: false, error: "Internal server error" }, 500);
  }
}