import type { Context } from "hono";
import { getPrisma } from "@/lib/prisma.ts";
import { authMiddleware } from "@/middlewares/auth.middleware.js";
import type { AppEnv } from "@/types/env.js";
import { $Enums } from "@/prisma/generated/index.js";
import ReportReason = $Enums.ReportReason;

export const middleware = [
  authMiddleware
];

export default async function(c: Context<AppEnv>) {
  try {
    const user = c.get("user");
    const prisma = getPrisma();

    const body = await c.req.json();
    const { reviewId, reason, details } = body;

    if (!reviewId || !reason) {
      return c.json({ error: "Missing required fields" }, 400);
    }

    if (!Object.values(ReportReason).includes(reason as ReportReason)) {
      return c.json({ error: "Invalid report reason" }, 400);
    }

    const review = await prisma.review.findUnique({
      where: { id: reviewId }
    });

    if (!review) {
      return c.json({ error: "Review not found" }, 404);
    }

    const existingReport = await prisma.reviewReport.findFirst({
      where: {
        reviewId,
        userId: user.id
      }
    });

    if (existingReport) {
      return c.json({ error: "You have already reported this review" }, 409);
    }

    const report = await prisma.reviewReport.create({
      data: {
        reviewId,
        userId: user.id,
        reason: reason as ReportReason,
        details: details || null,
        status: "PENDING"
      }
    });

    return c.json({
      success: true,
      message: "Review reported successfully",
      report: {
        id: report.id,
        reason: report.reason,
        createdAt: report.createdAt,
        status: report.status
      }
    }, 201);
  } catch (error) {
    console.error("Review report error:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
}