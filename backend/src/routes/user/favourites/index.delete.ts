import type { Context } from "hono";
import { authMiddleware } from "@/middlewares/auth.middleware.js";
import type { AppEnv } from "@/types/env.js";
import { getPrisma } from "@/lib/prisma.js";
import { z } from "zod";


const favouriteSchema = z.object({
  merchantId: z.string().uuid()
});

export default async function(c: Context<AppEnv>) {
  await authMiddleware(c, async () => {
  });

  try {
    const user = c.get("user");
    const prisma = getPrisma();
    const body = await c.req.json();


    const validation = favouriteSchema.safeParse(body);
    if (!validation.success) {
      return c.json({ error: "Invalid request body", details: validation.error.format() }, 400);
    }

    const { merchantId } = validation.data;


    const merchant = await prisma.merchant.findUnique({
      where: { id: merchantId }
    });

    if (!merchant) {
      return c.json({ error: "Merchant not found" }, 404);
    }


    const existingFavourite = await prisma.user.findFirst({
      where: {
        id: user.id,
        favourites: {
          some: {
            id: merchantId
          }
        }
      }
    });

    if (!existingFavourite) {
      return c.json({
        message: "Merchant not in favourites",
        already: false
      });
    }


    await prisma.merchant.update({
      where: { id: merchantId },
      data: {
        favouritedBy: {
          disconnect: { id: user.id }
        }
      }
    });

    return c.json({
      message: "Removed from favourites",
      success: true
    });

  } catch (error) {
    console.error("Remove favourite error:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
}