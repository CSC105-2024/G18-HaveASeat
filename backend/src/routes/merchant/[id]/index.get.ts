import type { Context } from "hono";
import type { AppEnv } from "@/types/env.js";
import { getPrisma } from "@/lib/prisma.ts";

export default async function(c: Context<AppEnv>) {
  try {
    const id = c.req.param("id");
    const prisma = getPrisma();

    const merchant = await prisma.merchant.findUnique({
      where: { id },
      include: {
        address: true,
        promoImages: true,
        seats: true,
        owner: {
          select: {
            id: true,
            name: true,
          },
        },
        reviews: {
          include: {
            user: {
              select: {
                id: true,
                name: true
              }
            },
            replies: {
              include: {
                merchant: {
                  select: {
                    id: true,
                    name: true
                  }
                }
              }
            }
          },
          orderBy: {
            createdAt: "desc"
          }
        },
        _count: {
          select: {
            favouritedBy: true
          }
        }
      }
    });

    if (!merchant) {
      return c.json({ error: "Merchant not found" }, 404);
    }

    const totalSeats = merchant.seats.length;
    const availableSeats = merchant.seats.filter(seat => seat.isAvailable).length;
    const totalReviews = merchant.reviews.length;
    const averageRating = totalReviews > 0
      ? merchant.reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews
      : 0;
    const totalFavourites = merchant._count.favouritedBy;


    const zones = merchant.seats.reduce((acc, seat) => {
      if (!acc[seat.location]) {
        acc[seat.location] = {
          name: seat.location,
          totalSeats: 0,
          availableSeats: 0
        };
      }
      acc[seat.location].totalSeats += 1;
      if (seat.isAvailable) {
        acc[seat.location].availableSeats += 1;
      }
      return acc;
    }, {} as Record<string, { name: string; totalSeats: number; availableSeats: number }>);

    const setupStatus = {
      overview: {
        isComplete: false,
        missingFields: [] as string[]
      },
      display: {
        isComplete: false,
        missingFields: [] as string[]
      },
      reservation: {
        isComplete: false,
        missingFields: [] as string[]
      }
    };

    if (!merchant.name || merchant.name === `${merchant.owner.name}'s Business`) {
      setupStatus.overview.missingFields.push("name");
    }
    if (!merchant.address) {
      setupStatus.overview.missingFields.push("address");
    }
    setupStatus.overview.isComplete = setupStatus.overview.missingFields.length === 0;

    if (!merchant.bannerImage) {
      setupStatus.display.missingFields.push("bannerImage");
    }

    if (merchant.promoImages.length === 0) {
      setupStatus.display.missingFields.push("promoImages");
    }
    setupStatus.display.isComplete = setupStatus.display.missingFields.length === 0;

    if (!merchant.floorPlan) {
      setupStatus.reservation.missingFields.push("floorPlan");
    }
    if (merchant.seats.length === 0) {
      setupStatus.reservation.missingFields.push("zones");
    }
    setupStatus.reservation.isComplete = setupStatus.reservation.missingFields.length === 0;

    const hasCompletedSetup =
        setupStatus.overview.isComplete &&
        setupStatus.display.isComplete &&
        setupStatus.reservation.isComplete;

    return c.json({
      id: merchant.id,
      ownerId: merchant.ownerId,
      createdAt: merchant.createdAt,

      name: merchant.name,
      phone: merchant.phone,
      description: merchant.description,
      bannerImage: merchant.bannerImage,
      floorPlan: merchant.floorPlan,
      openHours: merchant.openHours,

      address: merchant.address ? {
        address: merchant.address.address,
        subDistrict: merchant.address.subDistrict,
        district: merchant.address.district,
        province: merchant.address.province,
        zipCode: merchant.address.zipCode
      } : null,

      images: merchant.promoImages.map(img => ({
        id: img.id,
        url: img.url
      })),

      statistics: {
        totalSeats,
        availableSeats,
        totalReviews,
        averageRating: Math.round(averageRating * 10) / 10,
        totalFavourites,
      },

      zones: Object.values(zones),

      reviews: merchant.reviews.map(review => ({
        id: review.id,
        rating: review.rating,
        description: review.description,
        createdAt: review.createdAt,
        user: {
          id: review.user.id,
          name: review.user.name
        },
        replies: review.replies.map(reply => ({
          id: reply.id,
          content: reply.content,
          createdAt: reply.createdAt,
          merchant: {
            id: reply.merchant.id,
            name: reply.merchant.name
          }
        }))
      })),

      hasCompletedSetup,
    });
  } catch (error) {
    console.error("Public merchant fetch error:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
}