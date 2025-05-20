import type { Context } from "hono";
import { UserModel } from "@/models/user.model.js";
import bcrypt from "bcryptjs";
import {setAuthCookie} from "@/middlewares/auth.middleware.js";
import type { AppEnv } from "@/types/env.js";

export default async function(c: Context<AppEnv>) {
  try {
    const { email, password, name, phoneNumber, birthday } = await c.req.json();

    if (!email || !password || !name) {
      return c.json({ error: "Email, password, and name are required" }, 400);
    }

    const existingUser = await UserModel.findByEmail(email);

    if (existingUser) {
      return c.json({ error: "User already exists with this email" }, 409);
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await UserModel.create({
      email,
      password: passwordHash,
      name,
      phoneNumber,
      birthday,
      isAdmin: false
    });

    await setAuthCookie(c, {id: user.id, email: user.email});

    return c.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        isAdmin: user.isAdmin
      }
    }, 201);
  } catch (error) {
    console.error("Sign Up error:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
}