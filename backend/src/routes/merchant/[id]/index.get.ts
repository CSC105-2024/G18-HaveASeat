import type { Context } from "hono";
import { getPrisma } from "@/lib/prisma.ts";
import type { AppEnv } from "@/types/env.js";

export default async function (c: Context<AppEnv>) {
  try {
    const prisma = getPrisma();
    const id = c.req.param("id");

    const merchant = await prisma.merchant.findUnique({
      where: { id },
    });

    if (!merchant) {
      return c.json({ success: false, error: "Merchant not found" }, 404);
    }

    return c.json({ success: true, data: merchant });
  } catch (error) {
    console.error("Page error:", error);
    return c.json({ success: false, error: "Internal server error" }, 500);
  }
}