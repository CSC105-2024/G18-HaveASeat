import type { Context } from "hono";
import { getPrisma } from "@/lib/prisma.ts";
import { authMiddleware } from "@/middlewares/auth.middleware.js";
import type { AppEnv } from "@/types/env.js";

export default async function (c: Context<AppEnv>) {
  try {
    await authMiddleware(c, async () => {}); 

    const prisma = getPrisma();

    const users = await prisma.user.findMany({
      omit: {
        password: true,
      },
      orderBy: {
        created_at: "desc",
      },
    });

    return c.json({ success: true, data: users });
  } catch (error) {
    console.error("Page error:", error);
    return c.json({
      success: false,
      error: "Internal server error"
    }, 500);
  }
}