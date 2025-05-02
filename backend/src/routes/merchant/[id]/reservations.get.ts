import type { Context } from "hono";
import { getPrisma } from "@/lib/prisma.ts";
import { authMiddleware } from "@/middlewares/auth.middleware.js";

export default async function (c: Context) {
  try {
    await authMiddleware(c, async () => { });

    const prisma = getPrisma();
    const merchantId = c.req.param("id");

    const reservations = await prisma.reservation.findMany({
      where: {
        seat: {
          bar: {
            ownerId: merchantId,
          },
        },
      },
      include: {
        seat: {
          include: {
            bar: {
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