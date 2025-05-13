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
    const { merchantId, rating, description } = body;


    if (!merchantId || !rating || !description) {
      return c.json({ error: "Missing required fields" }, 400);
    }


    const merchant = await prisma.merchant.findUnique({
      where: { id: merchantId }
    });

    if (!merchant) {
      return c.json({ error: "Merchant not found" }, 404);
    }


    const ratingNumber = Number(rating);
    if (isNaN(ratingNumber) || ratingNumber < 1 || ratingNumber > 5) {
      return c.json({ error: "Rating must be between 1 and 5" }, 400);
    }


    const existingReview = await prisma.review.findFirst({
      where: {
        userId: user.id,
        merchantId
      }
    });

    if (existingReview) {
      return c.json({ error: "You have already reviewed this merchant" }, 409);
    }


    const review = await prisma.review.create({
      data: {
        userId: user.id,
        merchantId,
        rating: ratingNumber,
        description
      }
    });

    return c.json({
      success: true,
      review: {
        id: review.id,
        rating: review.rating,
        description: review.description,
        createdAt: review.createdAt
      }
    }, 201);
  } catch (error) {
    console.error("Review creation error:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
}