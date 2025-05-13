import type { Context } from "hono";
import { getPrisma } from "@/lib/prisma.ts";
import { authMiddleware } from "@/middlewares/auth.middleware.js";
import type { AppEnv } from "@/types/env.js";
import { UserModel } from "@/models/user.model.js";

export default async function(c: Context<AppEnv>) {
  try {
    await authMiddleware(c, async () => {
    });

    const prisma = getPrisma();
    const id = c.req.param("id");

    const currentUser = c.get("user");
    if (id !== currentUser.id && !currentUser.isAdmin) {
      return c.json({ success: false, error: "Unauthorized" }, 403);
    }

    const body = await c.req.json();
    const { name, email, phoneNumber, birthday } = body;

    const existing = await UserModel.findById(id);
    if (!existing) {
      return c.json({ success: false, error: "User not found" }, 404);
    }

    if (email && email !== existing.email) {
      const emailExists = await UserModel.findByEmail(email);
      if (emailExists) {
        return c.json({ success: false, error: "Email already exists" }, 409);
      }
    }

    const updated = await prisma.user.update({
      where: { id },
      data: {
        name,
        email,
        phoneNumber,
        birthday: birthday ? new Date(birthday) : undefined
      }
    });

    return c.json({ success: true, data: updated });
  } catch (error) {
    console.error("Update user error:", error);
    return c.json({ success: false, error: "Internal server error" }, 500);
  }
}