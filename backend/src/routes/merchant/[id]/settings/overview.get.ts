import type { Context } from "hono";
import { authMiddleware } from "@/middlewares/auth.middleware.js";
import type { AppEnv } from "@/types/env.js";
import { getPrisma } from "@/lib/prisma.js";

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
        address: true
      }
    });

    if (!merchant) {
      return c.json({ error: "Merchant not found" }, 404);
    }

    if (merchant.ownerId !== user.id) {
      return c.json({ error: "Unauthorized" }, 403);
    }


    const response = {
      name: merchant.name,
      description: merchant.description || "",
      telephone: merchant.phone,
      open_hours: merchant.openHours || [],
      address: merchant.address?.address || "",
      sub_district: merchant.address?.subDistrict || "",
      district: merchant.address?.district || "",
      province: merchant.address?.province || "",
      zipcode: merchant.address?.zipCode?.toString() || ""
    };

    return c.json(response);
  } catch (error) {
    console.error("Merchant overview error:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
}