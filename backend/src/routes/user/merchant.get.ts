import type { Context } from "hono";
import { authMiddleware } from "@/middlewares/auth.middleware.js";
import type { AppEnv } from "@/types/env.js";
import { getPrisma } from "@/lib/prisma.ts";

export default async function(c: Context<AppEnv>) {
  await authMiddleware(c, async () => {
  });

  try {
    const user = c.get("user");
    const prisma = getPrisma();

    const merchant = await prisma.merchant.findFirst({
      where: { ownerId: user.id },
      select: { id: true }
    });

    return c.json({
      hasMerchant: !!merchant,
      merchantId: merchant?.id || null
    });
  } catch (error) {
    console.error("User merchant check error:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
}