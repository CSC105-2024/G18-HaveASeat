import type { Context } from "hono";
import { authMiddleware } from "@/middlewares/auth.middleware.js";
import type { AppEnv } from "@/types/env.js";
import { getPrisma } from "@/lib/prisma.ts";
import { uploadFile } from "@/lib/upload.ts";

export const middleware = [
  authMiddleware
];

export default async function(c: Context<AppEnv>) {
  try {
    const user = c.get("user");
    const id = c.req.param("id");
    const prisma = getPrisma();

    const body = await c.req.parseBody();

    const merchant = await prisma.merchant.findUnique({
      where: { id }
    });

    if (!merchant) {
      return c.json({ error: "Merchant not found" }, 404);
    }

    if (merchant.ownerId !== user.id) {
      return c.json({ error: "Unauthorized" }, 403);
    }

    let bannerUrl = merchant.bannerImage;
    const imageUrls: string[] = [];

    let existingImageIds: string[] = [];
    if (body.existingImages) {
      try {
        existingImageIds = JSON.parse(body.existingImages as string);
      } catch (e) {
        console.error("Error parsing existing images:", e);
      }
    }

    if (body.banner instanceof File) {
      bannerUrl = await uploadFile(body.banner);
    }

    if (body.images) {
      const images = Array.isArray(body.images) ? body.images : [body.images];
      for (const image of images) {
        if (image instanceof File) {
          const url = await uploadFile(image);
          imageUrls.push(url);
        }
      }
    }

    const updatedMerchant = await prisma.$transaction(async (tx) => {

      if (bannerUrl !== merchant.bannerImage) {
        await tx.merchant.update({
          where: { id },
          data: { bannerImage: bannerUrl }
        });
      }

      await tx.merchantImage.deleteMany({
        where: {
          merchantId: id,
          id: { notIn: existingImageIds }
        }
      });

      if (imageUrls.length > 0) {
        await tx.merchantImage.createMany({
          data: imageUrls.map(url => ({
            merchantId: id,
            url
          }))
        });
      }

      return tx.merchant.findUnique({
        where: { id },
        include: { promoImages: true }
      });
    });

    return c.json({ success: true, data: updatedMerchant });
  } catch (error) {
    console.error("Merchant display update error:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
}