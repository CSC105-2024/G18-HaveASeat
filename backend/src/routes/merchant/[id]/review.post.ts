import type { Context } from "hono";
import { getPrisma } from "@/lib/prisma.ts";
import { authMiddleware } from "@/middlewares/auth.middleware.js";

export default async function (c: Context) {
  try {
    await authMiddleware(c, async () => { });

    const prisma = getPrisma();
    const user = c.get("user");
    const barId = c.req.param("id");

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
        barId,
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