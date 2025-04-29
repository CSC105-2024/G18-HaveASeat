import type { Context } from "hono";
import { User } from "@/models/user.model.js";
import bcrypt from "bcryptjs";
import { createToken } from "@/middlewares/auth.middleware.js";

export default async function(c: Context) {
  try {
    const { email, password, name } = await c.req.json()

    if (!email || !password || !name) {
      return c.json({ error: 'Email, password, and name are required' }, 400)
    }

    const existingUser = await User.findByEmail(email)

    if (existingUser) {
      return c.json({ error: 'User already exists with this email' }, 409)
    }

    const passwordHash = await bcrypt.hash(password, 10)

    const user = await User.create({
      email,
      passwordHash,
      name,
      role: 'user'
    })

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
    }, 201)
  } catch (error) {
    console.error('Sign Up error:', error)
    return c.json({ error: 'Internal server error' }, 500)
  }
}