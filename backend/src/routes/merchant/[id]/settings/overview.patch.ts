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

    const body = await c.req.json();
    const {
      name,
      description,
      telephone,
      open_hours,
      address,
      sub_district,
      district,
      province,
      zipcode
    } = body;

    const merchant = await prisma.merchant.findUnique({
      where: { id }
    });

    if (!merchant) {
      return c.json({ error: "Merchant not found" }, 404);
    }

    if (merchant.ownerId !== user.id) {
      return c.json({ error: "Unauthorized" }, 403);
    }

    const updatedMerchant = await prisma.$transaction(async (tx) => {
      const merchantUpdate = await tx.merchant.update({
        where: { id },
        data: {
          name,
          description,
          phone: telephone,
          openHours: open_hours
        },
        include: {
          address: true
        }
      });

      if (address || sub_district || district || province || zipcode) {
        await tx.merchantAddress.upsert({
          where: { merchantId: id },
          update: {
            address,
            subDistrict: sub_district,
            district,
            province,
            zipCode: parseInt(zipcode)
          },
          create: {
            merchantId: id,
            address,
            subDistrict: sub_district,
            district,
            province,
            zipCode: parseInt(zipcode)
          }
        });
      }

      return merchantUpdate;
    });

    return c.json({ success: true, data: updatedMerchant });
  } catch (error) {
    console.error("Merchant update error:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
}