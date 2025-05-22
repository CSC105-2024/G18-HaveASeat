import type { Context } from "hono";
import { authMiddleware } from "@/middlewares/auth.middleware.ts";
import type { AppEnv } from "@/types/env.js";
import { getPrisma } from "@/lib/prisma.js";

export const middleware = [
  authMiddleware
];

export default async function(c: Context<AppEnv>) {
  try {
    const user = c.get("user");
    const prisma = getPrisma();

    if (!user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const userData = await prisma.user.findUnique({
      where: { id: user.id },
      include: {
        merchant: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });

    if (!userData) {
      return c.json({ error: "User not found" }, 404);
    }

    let merchantStatus = null;
    if (userData.merchant && userData.merchant.length > 0) {
      const merchant = userData.merchant[0];

      const merchantData = await prisma.merchant.findUnique({
        where: { id: merchant.id },
        include: {
          address: true,
          promoImages: {
            take: 1
          },
          seats: {
            take: 1
          }
        }
      });

      if (merchantData) {
        const setupStatus = {
          hasBasicInfo: !!merchantData.name && !!merchantData.phone && !!merchantData.address,
          hasDisplayInfo: !!merchantData.bannerImage && merchantData.promoImages.length > 0,
          hasReservationInfo: !!merchantData.floorPlan && merchantData.seats.length > 0
        };

        merchantStatus = {
          id: merchant.id,
          name: merchant.name,
          isComplete: setupStatus.hasBasicInfo && setupStatus.hasDisplayInfo && setupStatus.hasReservationInfo,
          setupStatus
        };
      }
    }

    return c.json({
      id: userData.id,
      name: userData.name,
      email: userData.email,
      phoneNumber: userData.phoneNumber,
      isAdmin: userData.isAdmin,
      createdAt: userData.createdAt,
      merchant: merchantStatus ? {
        id: merchantStatus.id,
        name: merchantStatus.name,
        isComplete: merchantStatus.isComplete
      } : null,
      hasMerchant: userData.merchant.length > 0,
      merchantId: userData.merchant[0]?.id || null
    });
  } catch (error) {
    console.error("User fetch error:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
}