import { PrismaClient } from "@/prisma/generated";

export const getPrisma = (database_url: string) => {
  return new PrismaClient({
    datasourceUrl: database_url,
  })
}