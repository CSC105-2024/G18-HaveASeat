import type { Context } from "hono";
import { authMiddleware } from "@/middlewares/auth.middleware.js";
import type { AppEnv } from "@/types/env.js";
import { getPrisma } from "@/lib/prisma.ts";
import type { JsonObject } from "@/prisma/generated/runtime/library.js";

export default async function(c: Context<AppEnv>) {
  await authMiddleware(c, async () => {
  });

  try {
    const user = c.get("user");
    const id = c.req.param("id");
    const prisma = getPrisma();

    const merchant = await prisma.merchant.findUnique({
      where: { id },
      include: {
        address: true,
        promoImages: true,
        seats: true
      }
    });

    if (!merchant) {
      return c.json({ error: "Merchant not found" }, 404);
    }

    if (merchant.ownerId !== user.id) {
      return c.json({ error: "Unauthorized" }, 403);
    }

    const setupStatus = {
      overview: {
        isComplete: false,
        missingFields: [] as string[]
      },
      display: {
        isComplete: false,
        missingFields: [] as string[]
      },
      reservation: {
        isComplete: false,
        missingFields: [] as string[]
      }
    };


    if (!merchant.name || merchant.name === `${user.name}'s Business`) {
      setupStatus.overview.missingFields.push("name");
    }
    if (!merchant.address) {
      setupStatus.overview.missingFields.push("address");
    }
    setupStatus.overview.isComplete = setupStatus.overview.missingFields.length === 0;


    if (!merchant.bannerImage) {
      setupStatus.display.missingFields.push("bannerImage");
    }

    if (merchant.promoImages.length === 0) {
      setupStatus.display.missingFields.push("promoImages");
    }
    setupStatus.display.isComplete = setupStatus.display.missingFields.length === 0;


    if (!merchant.floorPlan) {
      setupStatus.reservation.missingFields.push("floorPlan");
    }
    if (merchant.seats.length === 0) {
      setupStatus.reservation.missingFields.push("zones");
    }
    setupStatus.reservation.isComplete = setupStatus.reservation.missingFields.length === 0;


    const isComplete =
      setupStatus.overview.isComplete &&
      setupStatus.display.isComplete &&
      setupStatus.reservation.isComplete;


    let nextStep = null;
    if (!setupStatus.overview.isComplete) {
      nextStep = "overview";
    } else if (!setupStatus.display.isComplete) {
      nextStep = "display";
    } else if (!setupStatus.reservation.isComplete) {
      nextStep = "reservation";
    }

    return c.json({
      merchantId: merchant.id,
      isComplete,
      isPublic: isComplete,
      setupStatus,
      nextStep,
      completionPercentage: Math.round(
        (Object.values(setupStatus).filter(s => s.isComplete).length / 3) * 100
      )
    });
  } catch (error) {
    console.error("Merchant status check error:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
}