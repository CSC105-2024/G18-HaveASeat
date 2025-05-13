import type { User } from "@/prisma/generated/index.js";
import { getPrisma } from "@/lib/prisma.js";

export class UserModel {
  static async findByEmail(email: string): Promise<User | null> {
    return await getPrisma().user.findUnique({
      where: {
        email
      }
    }) || null;
  }

  static async findById(id: string): Promise<User | null> {
    return await getPrisma().user.findUnique({
      where: {
        id
      }
    }) || null;
  }

  static async create(userData: Omit<User, "id" | "createdAt">): Promise<User> {
    return getPrisma().user.create({
      data: userData
    });
  }

  static async findAll(): Promise<User[]> {
    return getPrisma().user.findMany();
  }
}