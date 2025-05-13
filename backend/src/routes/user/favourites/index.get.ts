import type { Context } from "hono";
import { authMiddleware } from "@/middlewares/auth.middleware.js";
import type { AppEnv } from "@/types/env.js";
import { getPrisma } from "@/lib/prisma.js";

export default async function(c: Context<AppEnv>) {
  await authMiddleware(c, async () => {
  });

  try {
    const user = c.get("user");
    const prisma = getPrisma();


    const userData = await prisma.user.findUnique({
      where: {
        id: user.id
      },
      select: {
        favourites: {
          select: {
            id: true,
            name: true,
            bannerImage: true,
            description: true,
            address: {
              select: {
                district: true,
                province: true
              }
            },
            reviews: {
              select: {
                rating: true
              }
            }
          }
        }
      }
    });

    const userFavourites = userData?.favourites || [];


    const formattedFavourites = userFavourites?.map(merchant => {

      const averageRating = merchant.reviews.length > 0
        ? merchant.reviews.reduce((sum, review) => sum + review.rating, 0) / merchant.reviews.length
        : 0;

      return {
        merchantId: merchant.id,
        name: merchant.name,
        bannerImage: merchant.bannerImage,
        description: merchant.description,
        location: merchant.address
          ? `${merchant.address.district}, ${merchant.address.province}`
          : null,
        averageRating,
        reviewCount: merchant.reviews.length
      };
    });

    return c.json({
      favourites: formattedFavourites
    });

  } catch (error) {
    console.error("Favourite fetch error:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
}