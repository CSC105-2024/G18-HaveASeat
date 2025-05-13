import type { Context } from "hono";
import { authMiddleware } from "@/middlewares/auth.middleware.js";
import type { AppEnv } from "@/types/env.js";
import { getPrisma } from "@/lib/prisma.ts";

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
        seats: true
      }
    });

    if (!merchant) {
      return c.json({ error: "Merchant not found" }, 404);
    }

    if (merchant.ownerId !== user.id) {
      return c.json({ error: "Unauthorized" }, 403);
    }


    const zones = merchant.seats.reduce((acc, seat) => {
      if (!acc[seat.location]) {
        acc[seat.location] = {
          name: seat.location,
          amount: 0
        };
      }
      acc[seat.location].amount += 1;
      return acc;
    }, {} as Record<string, { name: string; amount: number }>);


    const response = {
      floor_plan: merchant.floorPlan,
      zones: Object.values(zones)
    };

    return c.json(response);
  } catch (error) {
    console.error("Merchant reservation error:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
}