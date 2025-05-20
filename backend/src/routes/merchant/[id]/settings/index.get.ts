import type { Context } from "hono";
import { authMiddleware } from "@/middlewares/auth.middleware.js";
import type { AppEnv } from "@/types/env.js";
import { getPrisma } from "@/lib/prisma.ts";

export default async function(c: Context<AppEnv>) {
  await authMiddleware(c, async () => {
  });

  try {
    const user = c.get("user");
    const id = c.req.param("id");
    const prisma = getPrisma();


    const merchant = await prisma.merchant.findUnique({
      where: { id },
      include: {
        address: true,
        promoImages: true,
        seats: {
          include: {
            reservations: {
              where: {
                startTime: {
                  gte: new Date()
                }
              }
            }
          }
        },
        reviews: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
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

    if (merchant.ownerId !== user.id) {
      return c.json({ error: "Unauthorized" }, 403);
    }

    const now = new Date();
    const upcomingReservations = await prisma.reservation.findMany({
      where: {
        seat: {
          merchantId: id
        },
        startTime: {
          gte: now
        }
      },
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        },
        seat: true
      },
      orderBy: {
        startTime: "asc"
      }
    });

    const zones = merchant.seats.reduce((acc, seat) => {
      if (!acc[seat.location]) {
        acc[seat.location] = {
          name: seat.location,
          totalSeats: 0,
          availableSeats: 0,
          occupiedSeats: 0,
          currentReservations: 0
        };
      }

      acc[seat.location].totalSeats += 1;


      const hasCurrentReservation = seat.reservations.some(reservation => {
        const now = new Date();
        return reservation.startTime <= now && reservation.endTime >= now;
      });

      if (hasCurrentReservation) {
        acc[seat.location].occupiedSeats += 1;
      } else if (seat.isAvailable) {
        acc[seat.location].availableSeats += 1;
      }

      acc[seat.location].currentReservations += seat.reservations.length;

      return acc;
    }, {} as Record<string, {
      name: string;
      totalSeats: number;
      availableSeats: number;
      occupiedSeats: number;
      currentReservations: number;
    }>);


    const totalSeats = merchant.seats.length;
    const availableSeats = merchant.seats.filter(seat => seat.isAvailable).length;
    const totalReviews = merchant.reviews.length;
    const averageRating = totalReviews > 0
      ? merchant.reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews
      : 0;
    const totalFavourites = merchant._count.favouritedBy;

    return c.json({
      id: merchant.id,
      ownerId: merchant.ownerId,

      name: merchant.name,
      phone: merchant.phone,
      description: merchant.description,
      bannerImage: merchant.bannerImage,
      floorPlan: merchant.floorPlan,
      openHours: merchant.openHours,
      createdAt: merchant.createdAt,

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
        upcomingReservations: upcomingReservations.length,
        totalFavourites
      },

      zones,

      upcomingReservations: upcomingReservations.map(reservation => ({
        id: reservation.id,
        customerName: reservation.customerName,
        startTime: reservation.startTime,
        endTime: reservation.endTime,
        numberOfGuests: reservation.numberOfGuests,
        numberOfTables: reservation.numberOfTables,
        status: reservation.status,
        ...(reservation?.seat && {
          seatLocation: reservation.seat.location,
        }),
        userName: reservation.user?.name || "Walk-in",
        userEmail: reservation.user?.email
      }))
    });
  } catch (error) {
    console.error("Merchant fetch error:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
}