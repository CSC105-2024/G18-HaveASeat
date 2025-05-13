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
    const { id } = c.req.param();


    if (!id) {
      return c.json({ error: "Merchant ID is required" }, 400);
    }


    const merchant = await prisma.merchant.findUnique({
      where: { id },
      select: {
        ownerId: true
      }
    });

    if (!merchant) {
      return c.json({ error: "Merchant not found" }, 404);
    }


    if (merchant.ownerId !== user.id && !user.isAdmin) {
      return c.json({ error: "Unauthorized access" }, 403);
    }


    const reservations = await prisma.reservation.findMany({
      where: {
        seat: {
          merchantId: id
        }
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phoneNumber: true
          }
        },
        seat: {
          select: {
            id: true,
            number: true,
            location: true
          }
        }
      },
      orderBy: {
        startTime: "desc"
      }
    });


    const formattedReservations = reservations.map(reservation => {
      const customerName = reservation.user?.name || reservation.customerName || "Unknown";
      const customerPhone = reservation.user?.phoneNumber || reservation.customerPhone || null;

      return {
        id: reservation.id,
        customerName,
        customerPhone,
        userId: reservation.userId,
        user: reservation.user,
        reservationType: reservation.reservationType,
        seatId: reservation.seatId,
        seat: reservation.seat,
        startTime: reservation.startTime,
        endTime: reservation.endTime,
        numberOfGuests: reservation.numberOfGuests,
        numberOfTables: reservation.numberOfTables,
        note: reservation.note,
        status: reservation.status,
        createdAt: reservation.createdAt
      };
    });

    return c.json({
      reservations: formattedReservations
    });

  } catch (error) {
    console.error("Reservations list error:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
}