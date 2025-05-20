import type { PrismaClient } from "@/prisma/generated/index.d.ts";

export async function updateReservationStatuses(prisma: PrismaClient) {
  const now = new Date();

  const reservationsToUpdate = await prisma.reservation.findMany({
    where: {
      status: "PENDING",
      OR: [

        {
          endTime: { lt: now }
        },

        {
          startTime: { lt: new Date(now.getTime() - 30 * 60 * 1000) },
          status: "PENDING"
        }
      ]
    },
    include: {
      seat: true
    }
  });


  for (const reservation of reservationsToUpdate) {
    const newStatus = reservation.endTime < now ? "COMPLETED" : "NO_SHOW";

    await prisma.$transaction([

      prisma.reservation.update({
        where: { id: reservation.id },
        data: { status: newStatus }
      }),

        ...[reservation.seat && prisma.seat.update({
          where: { id: reservation?.seat.id },
          data: { isAvailable: true }
        })]
    ]);
  }

  return reservationsToUpdate.length;
}

export async function checkCurrentReservations(prisma: PrismaClient) {
  const now = new Date();


  const activeReservations = await prisma.reservation.findMany({
    where: {
      startTime: { lte: now },
      endTime: { gt: now },
      status: "PENDING"
    },
    include: {
      seat: true
    }
  });


  for (const reservation of activeReservations) {
    if (reservation.seat?.isAvailable) {
      await prisma.seat.update({
        where: { id: reservation.seat?.id },
        data: { isAvailable: false }
      });
    }
  }

  return activeReservations.length;
}