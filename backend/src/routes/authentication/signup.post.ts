import type { Context } from "hono";
import { UserModel } from "@/models/user.model.js";
import bcrypt from "bcryptjs";
import { createTokenPair } from "@/middlewares/auth.middleware.js";
import type { AppEnv } from "@/types/env.js";

export default async function(c: Context<AppEnv>) {
  try {
    const { email, password, name, phone_number, birthday } = await c.req.json()

    if (!email || !password || !name) {
      return c.json({ error: 'Email, password, and name are required' }, 400)
    }

    const existingUser = await UserModel.findByEmail(email)

    if (existingUser) {
      return c.json({ error: 'User already exists with this email' }, 409)
    }

    const passwordHash = await bcrypt.hash(password, 10)

    const user = await UserModel.create({
      email,
      password: passwordHash,
      name,
      phone_number,
      birthday,
      isAdmin: false
    })

    const { accessToken, refreshToken } = await createTokenPair(user);

    return c.json({
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        isAdmin: user.isAdmin
      }
    }, 201)
  } catch (error) {
    console.error('Sign Up error:', error)
    return c.json({ error: 'Internal server error' }, 500)
  }
}