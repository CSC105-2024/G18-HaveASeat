import type { Context } from "hono";
import { getPrisma } from "@/lib/prisma.ts";
import { authMiddleware } from "@/middlewares/auth.middleware.js";
import type { AppEnv } from "@/types/env.js";

export default async function (c: Context<AppEnv>) {
  try {
    await authMiddleware(c, async () => { });

    const prisma = getPrisma();
    const merchantId = c.req.param("id");

    const reservations = await prisma.reservation.findMany({
      where: {
        seat: {
          merchant: {
            ownerId: merchantId,
          },
        },
      },
      include: {
        seat: {
          include: {
            merchant: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        startTime: "asc",
      },
    });

    return c.json({ success: true, data: reservations });
  } catch (error) {
    console.error("Page error:", error);
    return c.json({ success: false, error: "Internal server error" }, 500);
  }
}