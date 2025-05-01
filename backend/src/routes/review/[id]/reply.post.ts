import type { Context } from "hono";
import { getPrisma } from "@/lib/prisma.ts";
import { authMiddleware } from "@/middlewares/auth.middleware.js";

export default async function (c: Context) {
  try {
    await authMiddleware(c, async () => {});

    const prisma = getPrisma();
    const user = c.get("user");
    const { reviewId, message } = await c.req.json();

    if (!reviewId || !message) {
      return c.json({
        success: false,
        error: "Missing reviewId or message"
      }, 400);
    }

    const reply = await prisma.reviewReply.create({
      data: {
        content: message,
        reviewId,
        merchantId: user.id,
      },
    });

    return c.json({ success: true, data: reply });
  } catch (error) {
    console.error("Page error:", error);
    return c.json({ success: false, error: "Internal server error" }, 500);
  }
}