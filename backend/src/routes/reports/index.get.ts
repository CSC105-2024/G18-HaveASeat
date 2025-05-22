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
    const user = c.get("user");

    if (!user.isAdmin) {
      return c.json({
        success: false,
        error: "Only administrators can view reports"
      }, 403);
    }

    const reports = await prisma.reviewReport.findMany({
      where: {
        status: "PENDING"
      },
      include: {
        user: {
          select: {
            id: true,
            name: true
          }
        },
        review: {
          include: {
            user: {
              select: {
                id: true,
                name: true
              }
            },
            merchant: {
              select: {
                id: true,
                name: true,
                ownerId: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: "desc"
      }
    });

    return c.json({
      success: true,
      data: reports
    });
  } catch (error) {
    console.error("Report list error:", error);
    return c.json({ success: false, error: "Internal server error" }, 500);
  }
}