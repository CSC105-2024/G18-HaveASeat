import type { Context } from "hono";
import { getPrisma } from "@/lib/prisma.ts";
import { authMiddleware } from "@/middlewares/auth.middleware.js";
import type { AppEnv } from "@/types/env.js";

export const middleware = [
  authMiddleware
];

export default async function(c: Context<AppEnv>) {
  try {
    const user = c.get("user");
    const prisma = getPrisma();
    const reportId = c.req.param("id");

    if (!user.isAdmin) {
      return c.json({
        success: false,
        error: "Only administrators can ignore reports"
      }, 403);
    }

    const report = await prisma.reviewReport.findUnique({
      where: { id: reportId },
      include: {
        review: {
          select: {
            id: true,
            merchantId: true
          }
        }
      }
    });

    if (!report) {
      return c.json({
        success: false,
        error: "Report not found"
      }, 404);
    }

    const updatedReport = await prisma.reviewReport.update({
      where: { id: reportId },
      data: { status: "IGNORED" },
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
                name: true
              }
            }
          }
        }
      }
    });

    return c.json({
      success: true,
      message: "Report has been marked as ignored",
      data: updatedReport
    });

  } catch (error) {
    console.error("Ignore report error:", error);
    return c.json({
      success: false,
      error: "Internal server error"
    }, 500);
  }
}