import type { User } from "@/prisma/generated/index.js";

export type AppEnv = {
  Bindings: {
    DATABASE_URL: string;
  };
  Variables: {
    user: User;
  };
};
