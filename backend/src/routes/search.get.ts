import type { Context } from "hono";
import { getPrisma } from "@/lib/prisma.ts";

export default async function (c: Context) {
  try {
    const prisma = getPrisma();
    const keyword = (c.req.query("q") || "").toLowerCase();

    const results = await prisma.bar.findMany({
      where: {
        name: {
          contains: keyword,
        },
      },
      select: {
        id: true,
        name: true,
        description: true,
        bannerImage: true,
        promoImages: true,
      },
      take: 10,
    });
    const filtered = results.filter(bar => bar.name.toLowerCase().includes(keyword));

    return c.json({ success: true, data: filtered });
  } catch (error) {
    console.error("Page error:", error);
    return c.json({
      success: false,
      error: "Internal server error",
    }, 500);
  }
}