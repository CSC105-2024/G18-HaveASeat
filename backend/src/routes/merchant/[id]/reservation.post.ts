import type { Context } from "hono";
import { getPrisma } from "@/lib/prisma.ts";
import { authMiddleware } from "@/middlewares/auth.middleware.js";
import type { AppEnv } from "@/types/env.js";

export default async function (c: Context<AppEnv>) {
  try {
    await authMiddleware(c, async () => { });

    const prisma = getPrisma();
    const user = c.get("user");
    const merchantId = c.req.param("id");

    const {
      seatId,
      customerName,
      reservationType,
      startTime,
      endTime,
      numberOfGuests,
      numberOfTables
    } = await c.req.json();

    if (!seatId || !customerName || !reservationType || !startTime || !endTime) {
      return c.json({
        success: false,
        error: "Missing required fields"
      }, 400);
    }

    const seat = await prisma.seat.findUnique({
      where: { id: seatId },
      include: { merchant: true }
    });

    if (!seat || seat.merchant.ownerId !== merchantId) {
      return c.json({ success: false, error: "Unauthorized to reserve this seat" }, 403);
    }

    const reservation = await prisma.reservation.create({
      data: {
        seatId,
        customerName,
        reservationType,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        numberOfGuests,
        numberOfTables,
      },
    });

    return c.json({ success: true, data: reservation });
  } catch (error) {
    console.error("Page error:", error);
    return c.json({
      success: false,
      error: "Internal server error"
    }, 500);
  }
}