import type { Context } from "hono";
import { authMiddleware } from "@/middlewares/auth.middleware.js";
import type { AppEnv } from "@/types/env.js";
import { getPrisma } from "@/lib/prisma.ts";

export const middleware = [
  authMiddleware
];

export default async function(c: Context<AppEnv>) {
  try {
    const user = c.get("user");
    const id = c.req.param("id");
    const prisma = getPrisma();

    const merchant = await prisma.merchant.findUnique({
      where: { id },
      include: {
        promoImages: true
      }
    });

    if (!merchant) {
      return c.json({ error: "Merchant not found" }, 404);
    }

    if (merchant.ownerId !== user.id) {
      return c.json({ error: "Unauthorized" }, 403);
    }

    const response = {
      banner: merchant.bannerImage,
      images: merchant.promoImages.map(img => ({
        id: img.id,
        url: img.url
      }))
    };

    return c.json(response);
  } catch (error) {
    console.error("Merchant display error:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
}