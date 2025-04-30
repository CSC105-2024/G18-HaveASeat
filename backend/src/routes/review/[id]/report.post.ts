import type { Context } from "hono";
import { getPrisma } from "@/lib/prisma.ts";
import { authMiddleware } from "@/middlewares/auth.middleware.js";

export default async function (c: Context) {
  try {
    await authMiddleware(c, async () => {});

    const prisma = getPrisma();
    const user = c.get("user");

    const { reviewId, reason } = await c.req.json();

    if (!reviewId || !reason) {
      return c.json({
        success: false,
        error: "Missing reviewId or reason"
      }, 400);
    }

    const report = await prisma.reviewReport.create({
      data: {
        reviewId,
        reason,
        userId: user.id,
      },
    });

    return c.json({ success: true, data: report });
  } catch (error) {
    console.error("Page error:", error);
    return c.json({
      success: false,
      error: "Internal server error"
    }, 500);
  }
}