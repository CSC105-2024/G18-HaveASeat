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
    const reportId = c.req.param("id");


    if (!user.isAdmin) {
      return c.json({
        success: false,
        error: "Only administrators can delete reports"
      }, 403);
    }


    const report = await prisma.reviewReport.findUnique({
      where: { id: reportId },
      include: {
        review: true
      }
    });

    if (!report) {
      return c.json({
        success: false,
        error: "Report not found"
      }, 404);
    }


    const result = await prisma.$transaction(async (tx) => {

      const deletedReport = await tx.reviewReport.update({
        where: { id: reportId },
        data: {
          status: "DELETED"
        }
      });


      if (deletedReport.status === "DELETED") {


        await tx.reviewReply.deleteMany({
          where: { reviewId: report.review.id }
        });


        await tx.reviewReport.deleteMany({
          where: {
            reviewId: report.review.id
          }
        });


        await tx.review.delete({
          where: { id: report.review.id }
        });

        return {
          report: deletedReport,
          reviewDeleted: true
        };
      }

      return {
        report: deletedReport,
        reviewDeleted: false
      };
    });

    return c.json({
      success: true,
      message: result.reviewDeleted
        ? "Report and associated review have been deleted"
        : "Report has been deleted",
      data: result.report
    });

  } catch (error) {
    console.error("Delete report error:", error);
    return c.json({
      success: false,
      error: "Internal server error"
    }, 500);
  }
}