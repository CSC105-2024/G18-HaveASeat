import type { Context } from "hono";
import { getPrisma } from "@/lib/prisma.ts";
import { authMiddleware } from "@/middlewares/auth.middleware.js";
import type { AppEnv } from "@/types/env.js";

export default async function(c: Context<AppEnv>) {
  await authMiddleware(c, async () => {
  });

  try {
    const user = c.get("user");
    const prisma = getPrisma();
    const id = c.req.param("id");

    const body = await c.req.json();
    const { status } = body;

    if (!status || !["COMPLETED", "CANCELLED", "NO_SHOW", "CHECKED_IN"].includes(status)) {
      return c.json({ error: "Invalid status" }, 400);
    }


    const reservation = await prisma.reservation.findUnique({
      where: { id },
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


    if (user.id !== reservation?.seat.merchant.ownerId && !user.isAdmin) {
      return c.json({ error: "Unauthorized" }, 403);
    }


    const updatedReservation = await prisma.reservation.update({
      where: { id },
      data: {
        status: status
      }
    });


    if (status === "COMPLETED" || status === "CANCELLED" || status === "NO_SHOW") {
      await prisma.seat.update({
        where: { id: reservation.seatId },
        data: {
          isAvailable: true
        }
      });
    }

    return c.json({
      success: true,
      message: `Reservation marked as ${status.toLowerCase()}`,
      reservation: {
        id: updatedReservation.id,
        status: updatedReservation.status
      }
    });
  } catch (error) {
    console.error("Reservation status update error:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
}