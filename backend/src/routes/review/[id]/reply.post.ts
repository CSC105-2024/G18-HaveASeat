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

    const body = await c.req.json();
    const { reviewId, content } = body;


    if (!reviewId || !content) {
      return c.json({ error: "Missing required fields" }, 400);
    }


    const review = await prisma.review.findUnique({
      where: { id: reviewId },
      include: {
        merchant: true
      }
    });

    if (!review) {
      return c.json({ error: "Review not found" }, 404);
    }


    if (review.merchant.ownerId !== user.id && !user.isAdmin) {
      return c.json({ error: "Only the merchant owner can reply to reviews" }, 403);
    }


    const existingReply = await prisma.reviewReply.findFirst({
      where: {
        reviewId,
        merchantId: user.id
      }
    });

    if (existingReply) {

      const updatedReply = await prisma.reviewReply.update({
        where: { id: existingReply.id },
        data: { content }
      });

      return c.json({
        success: true,
        message: "Reply updated successfully",
        reply: {
          id: updatedReply.id,
          content: updatedReply.content,
          createdAt: updatedReply.createdAt
        }
      });
    }


    const reply = await prisma.reviewReply.create({
      data: {
        reviewId,
        merchantId: user.id,
        content
      }
    });

    return c.json({
      success: true,
      reply: {
        id: reply.id,
        content: reply.content,
        createdAt: reply.createdAt
      }
    }, 201);
  } catch (error) {
    console.error("Review reply error:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
}