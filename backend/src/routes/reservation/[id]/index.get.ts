import type { Context } from "hono";
import { getPrisma } from "@/lib/prisma.ts";
import { authMiddleware } from "@/middlewares/auth.middleware.js";
import type { AppEnv } from "@/types/env.js";

export const middleware = [
  authMiddleware
];

export default async function(c: Context<AppEnv>) {
  try {
    const user = c.get("user");
    const prisma = getPrisma();
    const id = c.req.param("id");

    const reservation = await prisma.reservation.findUnique({
      where: { id },
      include: {
        seat: {
          include: {
            merchant: true
          }
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    if (!reservation) {
      return c.json({ error: "Reservation not found" }, 404);
    }

    const isMerchantOwner = user.id === reservation.seat?.merchant.ownerId;
    const isUserReservation = user.id === reservation.userId;

    if (!isMerchantOwner && !isUserReservation && !user.isAdmin) {
      return c.json({ error: "Unauthorized" }, 403);
    }

    return c.json({
      id: reservation.id,
      customerName: reservation.customerName,
      startTime: reservation.startTime,
      endTime: reservation.endTime,
      numberOfGuests: reservation.numberOfGuests,
      numberOfTables: reservation.numberOfTables,
      note: reservation.note,
      reservationType: reservation.reservationType,
      createdAt: reservation.createdAt,
      ...(reservation.seat && {
        seat: {
          id: reservation.seat.id,
          number: reservation.seat.number,
          location: reservation.seat.location
        },
        merchant: {
          id: reservation.seat.merchant.id,
          name: reservation.seat.merchant.name
        }
      }),
      user: reservation.user
    });
  } catch (error) {
    console.error("Reservation fetch error:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
}