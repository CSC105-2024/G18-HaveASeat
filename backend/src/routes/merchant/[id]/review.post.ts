import type { Context } from "hono";
import { getPrisma } from "@/lib/prisma.ts";
import { authMiddleware } from "@/middlewares/auth.middleware.js";
import type { AppEnv } from "@/types/env.js";

export default async function (c: Context<AppEnv>) {
  try {
    await authMiddleware(c, async () => { });

    const prisma = getPrisma();
    const user = c.get("user");
    const merchantId = c.req.param("id");

    const { rating, description } = await c.req.json();

    if (!rating || !description) {
      return c.json({
        success: false,
        error: "Missing rating or description"
      }, 400);
    }

    const review = await prisma.review.create({
      data: {
        userId: user.id,
        merchantId,
        rating,
        description,
      },
    });

    return c.json({ success: true, data: review });
  } catch (error) {
    console.error("Page error:", error);
    return c.json({ success: false, error: "Internal server error" }, 500);
  }
}