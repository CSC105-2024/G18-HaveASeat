import type { Prisma, User } from "@/prisma/generated/index.js";

export type AppEnv = {
  Bindings: {
    DATABASE_URL: string;
  };
  Variables: {
    user: User;
    merchant: Prisma.MerchantGetPayload<{
      include: {
        address: true,
        promoImages: true,
        seats: true,
      }
    }>
  };
};
