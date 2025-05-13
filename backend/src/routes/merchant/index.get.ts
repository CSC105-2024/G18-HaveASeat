import type { Context } from "hono";
import type { AppEnv } from "@/types/env.js";
import { getPrisma } from "@/lib/prisma.js";

export default async function(c: Context<AppEnv>) {
  try {
    const prisma = getPrisma();

    const locationStats = await prisma.$queryRaw<{
      name: string;
      province: string;
      merchantCount: number;
    }[]>`
        SELECT address."district" AS name,
               address."province" AS province,
               COUNT(merchant.id) AS merchantCount
        FROM "MerchantAddress" address
                 JOIN "Merchant" merchant ON address."merchantId" = merchant.id
        GROUP BY address."district", address."province"
        ORDER BY COUNT(merchant.id) DESC LIMIT 5
    `;


    const topRatedMerchants = await prisma.merchant.findMany({
      take: 8,
      include: {
        address: true,
        reviews: {
          select: {
            id: true,
            rating: true
          }
        },
        _count: {
          select: {
            favouritedBy: true
          }
        }
      }

    });


    const popularMerchants = await prisma.merchant.findMany({
      take: 4,
      include: {
        address: true,
        _count: {
          select: {
            favouritedBy: true
          }
        }
      },
      orderBy: {
        favouritedBy: {
          _count: "desc"
        }
      }
    });


    const transformedTopRated = topRatedMerchants.map(merchant => {

      const totalRatings = merchant.reviews.length;
      const avgRating = totalRatings > 0
        ? merchant.reviews.reduce((sum, review) => sum + review.rating, 0) / totalRatings
        : 0;

      return {
        id: merchant.id,
        name: merchant.name,
        description: merchant.description,
        bannerImage: merchant.bannerImage,
        location: merchant.address ? merchant.address.district : null,
        averageRating: avgRating,
        reviewCount: totalRatings,
        favoriteCount: merchant._count.favouritedBy
      };
    });


    const sortedTopRated = transformedTopRated
      .sort((a, b) => b.averageRating - a.averageRating)
      .slice(0, 8);


    const transformedPopular = popularMerchants.map(merchant => {
      return {
        id: merchant.id,
        name: merchant.name,
        description: merchant.description,
        bannerImage: merchant.bannerImage,
        location: merchant.address ? merchant.address.district : null,
        favoriteCount: merchant._count.favouritedBy
      };
    });


    const featuredLocations = locationStats.map((location: any) => {
      return {
        name: location.name,
        province: location.province,
        merchantCount: Number(location.merchantCount)
      };
    });

    return c.json({
      featuredLocations,
      topRatedMerchants: sortedTopRated,
      popularMerchants: transformedPopular
    });

  } catch (error) {
    console.error("Homepage data fetch error:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
}