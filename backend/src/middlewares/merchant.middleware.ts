import type { Context, Next } from "hono";
import { getPrisma } from "@/lib/prisma.ts";
import type { AppEnv } from "@/types/env.js";

export async function merchantSetupMiddleware(c: Context<AppEnv>, next: Next) {
  const id = c.req.param("id");
  const path = c.req.path;
  const prisma = getPrisma();

  if (path.includes("/settings")) {
    return next();
  }

  try {
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

    const isSetupComplete = checkMerchantSetupComplete(merchant);

    if (!isSetupComplete) {

      if (path.includes("/public")) {
        return c.json({ error: "Merchant setup incomplete" }, 404);
      }

      return c.json({
        error: "Merchant setup incomplete",
        redirect: `/merchant/${id}/setup`,
        setupRequired: true
      }, 302);
    }

    c.set("merchant", merchant);

    return next();
  } catch (error) {
    console.error("Merchant middleware error:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
}

function checkMerchantSetupComplete(merchant: any): boolean {

  const hasOverview =
    merchant.name &&
    merchant.name !== `${merchant.owner?.name}'s Business` &&
    merchant.phone &&
    merchant.address &&
    merchant.openHours?.length > 0;

  const hasDisplay =
    merchant.bannerImage &&
    merchant.promoImages.length > 0;

  const hasReservation =
    merchant.floorPlan &&
    merchant.seats.length > 0;

  return hasOverview && hasDisplay && hasReservation;
}