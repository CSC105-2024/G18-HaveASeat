import type { Context } from "hono";
import { getPrisma } from "@/lib/prisma.ts";

export default async function (c: Context) {
  try {
    const prisma = getPrisma();
    const id = c.req.param("id");

    const merchant = await prisma.user.findUnique({
      where: { id },
      include: {
        bars: {
          include: {
            promoImages: true,
            address: true,
          },
        },
      },
    });

    if (!merchant || merchant.role !== "MERCHANT") {
      return c.json({ success: false, error: "Merchant not found" }, 404);
    }

    return c.json({ success: true, data: merchant });
  } catch (error) {
    console.error("Page error:", error);
    return c.json({ success: false, error: "Internal server error" }, 500);
  }
}