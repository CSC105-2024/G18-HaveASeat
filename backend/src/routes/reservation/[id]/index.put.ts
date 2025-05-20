import type { Context } from "hono";
import { getPrisma } from "@/lib/prisma.ts";
import { authMiddleware } from "@/middlewares/auth.middleware.js";
import type { AppEnv } from "@/types/env.js";
import { $Enums } from "@/prisma/generated/index.js";
import ReservationStatus = $Enums.ReservationStatus;

export default async function(c: Context<AppEnv>) {
  await authMiddleware(c, async () => {
  });

  try {
    const user = c.get("user");
    const reservationId = c.req.param("id");
    const prisma = getPrisma();

    const body = await c.req.json();
    const { status } = body;

    if (!Object.values(ReservationStatus).includes(status)) {
      return c.json({ error: "Invalid status" }, 400);
    }


    const reservation = await prisma.reservation.findUnique({
      where: { id: reservationId },
      include: {
        seat: {
          include: {
            merchant: true
          }
        }
      }
    });

    if (!reservation) {
      return c.json({ error: "Reservation not found" }, 404);
    }


    if (reservation?.seat.merchant.ownerId !== user.id) {
      return c.json({ error: "Unauthorized" }, 403);
    }


    const shouldReleaseSeat = ["COMPLETED", "CANCELLED", "NO_SHOW"].includes(status);

    await prisma.$transaction([

      prisma.reservation.update({
        where: { id: reservationId },
        data: { status: status as ReservationStatus }
      }),

      ...(shouldReleaseSeat ? [
        prisma.seat.update({
          where: { id: reservation?.seat.id },
          data: { isAvailable: true }
        })
      ] : [])
    ]);

    return c.json({
      success: true,
      message: `Reservation status updated to ${status}`
    });
  } catch (error) {
    console.error("Reservation status update error:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
}