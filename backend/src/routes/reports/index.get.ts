import type { Context } from "hono";
import { getPrisma } from "@/lib/prisma.ts";
import { authMiddleware } from "@/middlewares/auth.middleware.js";
import type { AppEnv } from "@/types/env.js";

export default async function (c: Context<AppEnv>) {
  try {
    await authMiddleware(c, async () => { });

    const prisma = getPrisma();
    const user = c.get("user");

    const reports = await prisma.reviewReport.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
        review: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
              },
            },
            merchant: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return c.json({ success: true, data: reports });
  } catch (error) {
    console.error("Page error:", error);
    return c.json({ success: false, error: "Internal server error" }, 500);
  }
}