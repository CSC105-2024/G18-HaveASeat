import type { Context } from "hono";
import { User } from "@/models/user.model.js";
import bcrypt from "bcryptjs";
import { createToken } from "@/middlewares/auth.middleware.js";

export default async function(c: Context) {
  try {
    const { email, password } = await c.req.json()

    if (!email || !password) {
      return c.json({ error: 'Email and password are required' }, 400)
    }

    const user = await User.findByEmail(email)

    if (!user) {
      return c.json({ error: 'Invalid credentials' }, 401)
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash)

    if (!isPasswordValid) {
      return c.json({ error: 'Invalid credentials' }, 401)
    }

    // @ts-ignore
    const token = await createToken(user)

    return c.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    })
  } catch (error) {
    console.error('Sign In error:', error)
    return c.json({ error: 'Internal server error' }, 500)
  }
}
