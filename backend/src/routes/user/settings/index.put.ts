import type { Context } from "hono";
import { authMiddleware } from "@/middlewares/auth.middleware.js";
import type { AppEnv } from "@/types/env.js";
import { getPrisma } from "@/lib/prisma.js";
import { UserModel } from "@/models/user.model.js";

export const middleware = [
  authMiddleware
];

export default async function(c: Context<AppEnv>) {
  try {
    const prisma = getPrisma();
    const user = c.get("user");

    const body = await c.req.json();
    const { name, email, phoneNumber, birthday } = body;

    if (email && email !== user.email) {
      const emailExists = await UserModel.findByEmail(email);
      if (emailExists) {
        return c.json({ success: false, error: "Email already exists" }, 409);
      }
    }

    const updated = await prisma.user.update({
      where: { id: user.id },
      data: {
        name,
        email,
        phoneNumber,
        birthday: birthday ? new Date(birthday) : undefined
      }
    });

    return c.json({ success: true, data: updated });
  } catch (error) {
    console.error("Page error:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
}