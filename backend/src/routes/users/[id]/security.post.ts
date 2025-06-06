import type { Context } from "hono";
import { getPrisma } from "@/lib/prisma.ts";
import { authMiddleware } from "@/middlewares/auth.middleware.js";
import type { AppEnv } from "@/types/env.js";
import bcrypt from "bcryptjs";

export const middleware = [
  authMiddleware
];

export default async function(c: Context<AppEnv>) {
  try {
    const prisma = getPrisma();
    const id = c.req.param("id");
    const currentUser = c.get("user");

    if (id !== currentUser.id && !currentUser.isAdmin) {
      return c.json({ success: false, error: "Unauthorized" }, 403);
    }

    const body = await c.req.json();
    const { newPassword } = body;

    if (!newPassword) {
      return c.json({
        success: false,
        error: "New password are required"
      }, 400);
    }

    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      return c.json({ success: false, error: "User not found" }, 404);
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id },
      data: { password: hashedPassword }
    });

    return c.json({ success: true, message: "Password changed successfully" });
  } catch (error) {
    console.error("Change password error:", error);
    return c.json({ success: false, error: "Internal server error" }, 500);
  }
}