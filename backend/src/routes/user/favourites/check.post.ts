import type { Context } from "hono";
import { authMiddleware } from "@/middlewares/auth.middleware.js";
import type { AppEnv } from "@/types/env.js";
import { getPrisma } from "@/lib/prisma.js";

export const middleware = [
  authMiddleware
];

export default async function(c: Context<AppEnv>) {
  try {
    const prisma = getPrisma();
    const user = c.get("user");
    const { ids } = await c.req.json();

    if (!user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    if (!Array.isArray(ids)) {
      return c.json({ error: "Invalid request. Expected \"ids\" array" }, 400);
    }

    const favorites = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        favourites: {
          where: {
            id: {
              in: ids
            }
          },
          select: {
            id: true
          }
        }
      }
    });

    const favoriteIds = favorites?.favourites.map(fav => fav.id) || [];

    const favoriteStatusMap = ids.reduce((map, id) => {
      map[id] = favoriteIds.includes(id);
      return map;
    }, {});

    return c.json({
      favoriteStatusMap
    });

  } catch (error) {
    console.error("Check favorites error:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
}