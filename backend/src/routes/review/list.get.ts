import type { Context } from "hono";
import { getPrisma } from "@/lib/prisma.ts";
import type { AppEnv } from "@/types/env.js";
import { authMiddleware } from "@/middlewares/auth.middleware.js";

export default async function(c: Context<AppEnv>) {
  try {
    const prisma = getPrisma();
    const merchantId = c.req.query("merchantId");
    const userId = c.req.query("userId");
    const sort = c.req.query("sort") || "recent";
    const order = c.req.query("order") || "desc";


    let where = {};
    if (merchantId) {
      where = { ...where, merchantId };
    }
    if (userId) {
      if (userId === "current") {
        await authMiddleware(c, async () => {
        });
        where = { ...where, userId: c.get("user")?.id || undefined };
      } else {
        where = { ...where, userId };
      }
    }


    let orderBy = {};
    if (sort === "rating") {
      orderBy = { rating: order };
    } else {
      orderBy = { createdAt: order };
    }


    const reviews = await prisma.review.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            isAdmin: true
          }
        },
        merchant: {
          select: {
            id: true,
            name: true,
            ownerId: true
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
          },
          orderBy: {
            createdAt: "asc"
          }
        }
      },
      orderBy
    });

    return c.json({
      reviews: reviews.map(review => ({
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
        }))
      }))
    });
  } catch (error) {
    console.error("Review list error:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
}
