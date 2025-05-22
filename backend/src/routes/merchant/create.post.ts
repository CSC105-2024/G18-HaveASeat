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
    const prisma = getPrisma();

    const existingMerchant = await prisma.merchant.findFirst({
      where: { ownerId: user.id }
    });

    if (existingMerchant) {
      return c.json({
        error: "User already has a merchant",
        merchantId: existingMerchant.id
      }, 400);
    }

    const merchant = await prisma.merchant.create({
      data: {
        id: crypto.randomUUID(),
        name: `${user.name}'s Business`,
        phone: "",
        ownerId: user.id,
        description: null,
        bannerImage: null,
        floorPlan: null,
        openHours: []
      }
    });

    return c.json({
      success: true,
      merchantId: merchant.id,
      isComplete: false,
      message: "Merchant created. Please complete setup."
    }, 201);
  } catch (error) {
    console.error("Merchant creation error:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
}