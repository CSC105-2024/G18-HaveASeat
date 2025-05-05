import type { Context } from "hono";
import { getPrisma } from "@/lib/prisma.ts";
import { authMiddleware } from "@/middlewares/auth.middleware.js";
import type { AppEnv } from "@/types/env.js";

export default async function (c: Context<AppEnv>) {
  try {
    await authMiddleware(c, async () => {});

    const prisma = getPrisma();
    const id = c.req.param("id");

    const body = await c.req.json();
    const { name, phone_number, birthday } = body;

    const existing = await prisma.user.findUnique({ where: { id } });
    if (!existing) {
      return c.json({ success: false, error: "User not found" }, 404);
    }

    const updated = await prisma.user.update({
      where: { id },
      data: {
        name,
        phone_number,
        birthday: birthday ? new Date(birthday) : undefined,
      },
    });

    return c.json({ success: true, data: updated });
  } catch (error) {
    console.error("Page error:", error);
    return c.json({ success: false, error: "Internal server error" }, 500);
  }
}