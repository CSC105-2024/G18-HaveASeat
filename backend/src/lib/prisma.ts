import { PrismaClient } from "@/prisma/generated/index.js";

export const getPrisma = (database_url: string) => {
  return new PrismaClient({
    datasourceUrl: database_url,
  })
}