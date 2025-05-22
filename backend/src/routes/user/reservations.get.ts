import type { Context } from "hono";
import { authMiddleware } from "@/middlewares/auth.middleware.js";
import type { AppEnv } from "@/types/env.js";
import { getPrisma } from "@/lib/prisma.js";

export const middleware = [
  authMiddleware
];

export default async function(c: Context<AppEnv>) {
  try {
    const user = c.get("user");
    const prisma = getPrisma();

    const now = new Date();
    now.setHours(0, 0, 0, 0);

    const upcomingReservations = await prisma.reservation.findMany({
      where: {
        userId: user.id,
        startTime: {
          gte: now
        },
        status: {
          notIn: ["CANCELLED", "NO_SHOW"]
        }
      },
      include: {
        seat: {
          include: {
            merchant: {
              select: {
                id: true,
                name: true,
                bannerImage: true,
                address: {
                  select: {
                    district: true,
                    province: true
                  }
                }
              }
            }
          }
        }
      },
      orderBy: {
        startTime: "asc"
      }
    });

    const pastReservations = await prisma.reservation.findMany({
      where: {
        userId: user.id,
        OR: [
          {
            startTime: {
              lt: now
            }
          },
          {
            status: {
              in: ["CANCELLED", "NO_SHOW", "COMPLETED"]
            }
          }
        ]
      },
      include: {
        seat: {
          include: {
            merchant: {
              select: {
                id: true,
                name: true,
                bannerImage: true,
                address: {
                  select: {
                    district: true,
                    province: true
                  }
                }
              }
            }
          }
        }
      },
      orderBy: {
        startTime: "desc"
      }
    });

    const formatReservation = (reservation: any) => {
      const merchant = reservation.seat.merchant;

      return {
        id: reservation.id,
        merchantId: merchant.id,
        merchantName: merchant.name,
        merchantImage: merchant.bannerImage,
        location: merchant.address ? `${merchant.address.district}, ${merchant.address.province}` : null,
        seatNumber: reservation.seat.number,
        seatLocation: reservation.seat.location,
        startTime: reservation.startTime,
        endTime: reservation.endTime,
        numberOfGuests: reservation.numberOfGuests,
        numberOfTables: reservation.numberOfTables,
        note: reservation.note,
        status: reservation.status,
        reservationType: reservation.reservationType,
        createdAt: reservation.createdAt
      };
    };

    return c.json({
      upcoming: upcomingReservations.map(formatReservation),
      past: pastReservations.map(formatReservation)
    });

  } catch (error) {
    console.error("User reservations fetch error:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
}