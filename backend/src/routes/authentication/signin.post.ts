import type { Context } from "hono";
import { UserModel } from "@/models/user.model.js";
import bcrypt from "bcryptjs";
import { createTokenPair } from "@/middlewares/auth.middleware.js";
import type { AppEnv } from "@/types/env.js";

export default async function(c: Context<AppEnv>) {
  try {
    const { email, password } = await c.req.json()

    if (!email || !password) {
      return c.json({ error: 'Email and password are required' }, 400)
    }

    const user = await UserModel.findByEmail(email)

    if (!user) {
      return c.json({ error: 'Invalid credentials' }, 401)
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) {
      return c.json({ error: 'Invalid credentials' }, 401)
    }

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
    })
  } catch (error) {
    console.error('Sign In error:', error)
    return c.json({ error: 'Internal server error' }, 500)
  }
}
