import type { Context } from "hono";
import { getPrisma } from "@/lib/prisma.ts";
import type { AppEnv } from "@/types/env.js";

export default async function(c: Context<AppEnv>) {
  try {
    const prisma = getPrisma();
    const id = c.req.param("id");


    const review = await prisma.review.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        merchant: {
          select: {
            id: true,
            name: true
          }
        },
        replies: {
          include: {
            merchant: {
              select: {
                id: true,
                name: true
              }
            }
          }
        },
        reports: true
      }
    });

    if (!review) {
      return c.json({ error: "Review not found" }, 404);
    }

    return c.json({
      id: review.id,
      rating: review.rating,
      description: review.description,
      createdAt: review.createdAt,
      user: review.user,
      merchant: review.merchant,
      replies: review.replies.map(reply => ({
        id: reply.id,
        content: reply.content,
        createdAt: reply.createdAt,
        merchant: reply.merchant
      })),
      reportCount: review.reports.length
    });
  } catch (error) {
    console.error("Review fetch error:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
}
