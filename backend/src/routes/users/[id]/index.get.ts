import type { Context } from "hono";
import { getPrisma } from "@/lib/prisma.ts";
import { authMiddleware } from "@/middlewares/auth.middleware.js";
import type { AppEnv } from "@/types/env.js";

export default async function (c: Context<AppEnv>) {
  try {
    await authMiddleware(c, async () => {}); 

    const prisma = getPrisma();
    const id = c.req.param("id");

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        password: false,
        reservations: {
          select: {
            id: true,
            startTime: true,
            endTime: true,
            seat: {
              include: {
                merchant: {
                  select: {
                    id: true,
                    name: true
                  }
                }
              }
            }
          }
        },
        reviews: {
          include: {
            merchant: {
              select: {
                id: true,
                name: true
              }
            }
          }
        }
      },
    });

    if (!user) {
      return c.json({ success: false, error: "User not found" }, 404);
    }

    return c.json({ success: true, data: user });
  } catch (error) {
    console.error("Page error:", error);
    return c.json({ success: false, error: "Internal server error" }, 500);
  }
}