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
    const merchantId = c.req.query("merchantId");

    if (!merchantId) {

      const reservations = await prisma.reservation.findMany({
        where: {
          userId: user.id
        },
        include: {
          seat: {
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
          startTime: "desc"
        }
      });

      return c.json({
        reservations: reservations.map(res => ({
          id: res.id,
          customerName: res.customerName,
          startTime: res.startTime,
          endTime: res.endTime,
          numberOfGuests: res.numberOfGuests,
          numberOfTables: res.numberOfTables,
          ...(res?.seat && {
            seat: {
              id: res.seat.id,
              number: res.seat.number,
              location: res.seat.location
            },
            merchant: res.seat.merchant,
          }),
          createdAt: res.createdAt
        }))
      });
    } else {

      const merchant = await prisma.merchant.findUnique({
        where: { id: merchantId }
      });

      if (!merchant) {
        return c.json({ error: "Merchant not found" }, 404);
      }


      if (merchant.ownerId !== user.id && !user.isAdmin) {
        return c.json({ error: "Unauthorized" }, 403);
      }

      const reservations = await prisma.reservation.findMany({
        where: {
          seat: {
            merchantId: merchantId
          }
        },
        include: {
          seat: true,
          user: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        },
        orderBy: {
          startTime: "asc"
        }
      });

      return c.json({
        reservations: reservations.map(res => ({
          id: res.id,
          customerName: res.customerName,
          startTime: res.startTime,
          endTime: res.endTime,
          numberOfGuests: res.numberOfGuests,
          numberOfTables: res.numberOfTables,
          reservationType: res.reservationType,
          note: res.note,
          ...(res.seat && {
            seat: {
              id: res.seat.id,
              number: res.seat.number,
              location: res.seat.location
            }
          }),
          user: res.user,
          createdAt: res.createdAt
        }))
      });
    }
  } catch (error) {
    console.error("Reservation list error:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
}