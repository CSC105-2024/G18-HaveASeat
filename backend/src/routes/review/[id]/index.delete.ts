import type { Context } from "hono";
import { getPrisma } from "@/lib/prisma.ts";
import { authMiddleware } from "@/middlewares/auth.middleware.js";
import type { AppEnv } from "@/types/env.js";

export default async function(c: Context<AppEnv>) {
  await authMiddleware(c, async () => {
  });

  try {
    const user = c.get("user");
    const prisma = getPrisma();
    const id = c.req.param("id");


    const review = await prisma.review.findUnique({
      where: { id },
      include: {
        merchant: {
          select: {
            ownerId: true
          }
        }
      }
    });

    if (!review) {
      return c.json({ error: "Review not found" }, 404);
    }


    const isReviewAuthor = user.id === review.userId;
    const isMerchantOwner = user.id === review.merchant.ownerId;


    if (!isReviewAuthor && !isMerchantOwner && !user.isAdmin) {
      return c.json({ error: "Unauthorized" }, 403);
    }


    await prisma.reviewReply.deleteMany({
      where: { reviewId: id }
    });

    await prisma.reviewReport.deleteMany({
      where: { reviewId: id }
    });


    await prisma.review.delete({
      where: { id }
    });

    return c.json({
      success: true,
      message: "Review deleted successfully"
    });
  } catch (error) {
    console.error("Review deletion error:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
}