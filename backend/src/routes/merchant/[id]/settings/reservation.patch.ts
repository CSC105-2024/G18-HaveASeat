import type { Context } from "hono";
import { authMiddleware } from "@/middlewares/auth.middleware.js";
import type { AppEnv } from "@/types/env.js";
import { getPrisma } from "@/lib/prisma.ts";
import { uploadFile } from "@/lib/upload.ts";

export default async function(c: Context<AppEnv>) {
  await authMiddleware(c, async () => {
  });

  try {
    const user = c.get("user");
    const id = c.req.param("id");
    const prisma = getPrisma();


    const body = await c.req.parseBody();


    const merchant = await prisma.merchant.findUnique({
      where: { id }
    });

    if (!merchant) {
      return c.json({ error: "Merchant not found" }, 404);
    }

    if (merchant.ownerId !== user.id) {
      return c.json({ error: "Unauthorized" }, 403);
    }


    let zones: Array<{ name: string; amount: number }> = [];
    if (body.zones) {
      try {
        zones = JSON.parse(body.zones as string);
      } catch (e) {
        return c.json({ error: "Invalid zones data" }, 400);
      }
    }


    if (!zones.length) {
      return c.json({ error: "At least one zone is required" }, 400);
    }


    let floorPlanUrl = merchant.floorPlan;
    if (body.floor_plan instanceof File) {
      floorPlanUrl = await uploadFile(body.floor_plan);
    }


    const updatedMerchant = await prisma.$transaction(async (tx) => {

      if (floorPlanUrl !== merchant.floorPlan) {
        await tx.merchant.update({
          where: { id },
          data: { floorPlan: floorPlanUrl }
        });
      }


      await tx.seat.deleteMany({
        where: { merchantId: id }
      });


      let seatNumber = 1;
      for (const zone of zones) {
        const seats = [];
        for (let i = 0; i < zone.amount; i++) {
          seats.push({
            merchantId: id,
            location: zone.name,
            number: seatNumber++,
            isAvailable: true
          });
        }

        if (seats.length > 0) {
          await tx.seat.createMany({
            data: seats
          });
        }
      }

      return tx.merchant.findUnique({
        where: { id },
        include: { seats: true }
      });
    });

    return c.json({ success: true, data: updatedMerchant });
  } catch (error) {
    console.error("Merchant reservation update error:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
}