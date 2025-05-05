import type { Context } from "hono";
import { authMiddleware } from "@/middlewares/auth.middleware.js";
import { getPrisma } from "@/lib/prisma.ts";
import type { AppEnv } from "@/types/env.js";

const prisma = getPrisma();

export default async function (c: Context<AppEnv>) {
  await authMiddleware(c, async () => {})

  try {
    const user = c.get('user');
    const id = c.req.param('id');

    const existingReview = await prisma.review.findUnique({
      where: { id },
    });

    if (!existingReview) {
      return c.json({
        success: false,
        error: 'Review not found'
      }, 404);
    }

    if (existingReview.userId !== user.id) {
      return c.json({
        success: false,
        error: 'Unauthorized'
      }, 403);
    }

    await prisma.review.delete({
      where: { id },
    });

    return c.json({
      success: true,
      message: 'Review deleted successfully'
    });
  } catch (error) {
    console.error('Delete review error:', error);
    return c.json({
      success: false,
      error: 'Internal server error'
    }, 500);
  }
}