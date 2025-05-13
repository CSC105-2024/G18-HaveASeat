import type { Context } from "hono";
import type { AppEnv } from "@/types/env.js";
import { getPrisma } from "@/lib/prisma.js";

export default async function(c: Context<AppEnv>) {
  try {
    const prisma = getPrisma();
    const { name, location, rating, date } = c.req.query();
    const sort = c.req.query("sort") || "recent";
    const order = c.req.query("order") || "desc";


    let where: any = {};


    if (name) {
      where.name = {
        contains: name,
        mode: "insensitive"
      };
    }


    if (location) {
      where.OR = [

        {
          address: {
            district: {
              contains: location
            }
          }
        },
        {
          address: {
            province: {
              contains: location
            }
          }
        },
        {
          address: {
            subDistrict: {
              contains: location
            }
          }
        },
        {
          address: {
            address: {
              contains: location
            }
          }
        }
      ];
    }


    let orderBy: any = {};
    if (sort === "rating") {

      orderBy = { createdAt: order };
    } else if (sort === "popular") {

      orderBy = {
        favouritedBy: {
          _count: order === "desc" ? "desc" : "asc"
        }
      };
    } else {

      orderBy = {
        createdAt: order === "desc" ? "desc" : "asc"
      };
    }


    const merchants = await prisma.merchant.findMany({
      where,
      include: {
        address: true,
        reviews: {
          select: {
            id: true,
            rating: true,
            createdAt: true
          }
        },
        _count: {
          select: {
            favouritedBy: true
          }
        }
      },
      orderBy
    });


    const transformedMerchants = merchants.map(merchant => {

      const totalRatings = merchant.reviews.length;
      const avgRating = totalRatings > 0
        ? merchant.reviews.reduce((sum, review) => sum + review.rating, 0) / totalRatings
        : 0;


      const location = merchant.address
        ? `${merchant.address.district}, ${merchant.address.province}`
        : null;

      return {
        id: merchant.id,
        name: merchant.name,
        description: merchant.description,
        bannerImage: merchant.bannerImage,
        location,
        address: merchant.address,
        averageRating: avgRating,
        reviewCount: totalRatings,
        favoriteCount: merchant._count.favouritedBy
      };
    });


    if (sort === "rating") {
      transformedMerchants.sort((a, b) => {
        return order === "desc"
          ? b.averageRating - a.averageRating
          : a.averageRating - b.averageRating;
      });
    }


    let filteredMerchants = transformedMerchants;
    if (rating) {
      const minRating = parseFloat(rating);
      if (!isNaN(minRating)) {
        filteredMerchants = transformedMerchants.filter(m => m.averageRating >= minRating);
      }
    }

    return c.json({
      merchants: filteredMerchants,
      totalCount: filteredMerchants.length
    });

  } catch (error) {
    console.error("Merchant search error:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
}