import type { Context } from "hono";
import { getPrisma } from "@/lib/prisma.ts";
import { authMiddleware } from "@/middlewares/auth.middleware.js";
import type { AppEnv } from "@/types/env.js";
import { $Enums } from "@/prisma/generated/index.js";
import ReservationType = $Enums.ReservationType;

export default async function(c: Context<AppEnv>) {
  await authMiddleware(c, async () => {
  });

  try {
    const user = c.get("user");
    const prisma = getPrisma();

    const body = await c.req.json();
    const {
      merchantId,
      seatLocation,
      date,
      startTime,
      endTime,
      customerName,
      customerPhone,
      numberOfGuests,
      numberOfTables,
      note,
      reservationType = "ONLINE"
    } = body;


    if (!merchantId || !seatLocation || !startTime || !endTime || !numberOfGuests) {
      return c.json({ error: "Missing required fields" }, 400);
    }


    const merchant = await prisma.merchant.findUnique({
      where: { id: merchantId },
      include: {
        seats: true
      }
    });

    if (!merchant) {
      return c.json({ error: "Merchant not found" }, 404);
    }


    const availableSeats = merchant.seats.filter(seat =>
      seat.location === seatLocation && seat.isAvailable
    );

    if (availableSeats.length === 0) {
      return c.json({ error: "No available seats in this location" }, 400);
    }


    const start = new Date(startTime);
    const end = new Date(endTime);

    if (start >= end) {
      return c.json({ error: "End time must be after start time" }, 400);
    }


    const now = new Date();
    if (start < now) {
      return c.json({ error: "Cannot make reservations for past times" }, 400);
    }


    let selectedSeatId = null;

    for (const seat of availableSeats) {

      const conflictingReservation = await prisma.reservation.findFirst({
        where: {
          seatId: seat.id,
          OR: [

            {
              startTime: { lte: start },
              endTime: { gt: start }
            },

            {
              startTime: { lt: end },
              endTime: { gte: end }
            },

            {
              startTime: { gte: start },
              endTime: { lte: end }
            }
          ]
        }
      });

      if (!conflictingReservation) {
        selectedSeatId = seat.id;
        break;
      }
    }

    if (!selectedSeatId) {
      return c.json({ error: "This time slot is already booked for all seats in this zone" }, 409);
    }


    const result = await prisma.$transaction(async (tx) => {

      const reservation = await tx.reservation.create({
        data: {
          userId: user.id,
          customerName,
          customerPhone,
          reservationType: reservationType as ReservationType,
          seatId: selectedSeatId,
          startTime: start,
          endTime: end,
          numberOfGuests,
          numberOfTables,
          note: note || ""
        }
      });


      await tx.seat.update({
        where: { id: selectedSeatId },
        data: { isAvailable: false }
      });

      return reservation;
    });

    return c.json({
      success: true,
      reservation: {
        id: result.id,
        customerName: result.customerName,
        startTime: result.startTime,
        endTime: result.endTime,
        numberOfGuests: result.numberOfGuests,
        numberOfTables: result.numberOfTables
      }
    }, 201);
  } catch (error) {
    console.error("Reservation creation error:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
}