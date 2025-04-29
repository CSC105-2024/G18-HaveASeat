import type { Context } from 'hono'
import { authMiddleware } from '@/middlewares/auth.middleware.ts'
import { User } from "@/models/user.model.js";

export default async function (c: Context) {
  await authMiddleware(c, async () => {})

  try {
    const user = c.get('user')

    // Find complete user details
    const userDetails = await User.findById(user.id)

    if (!userDetails) {
      return c.json({ error: 'User not found' }, 404)
    }

    return c.json({
      user: {
        id: userDetails.id,
        email: userDetails.email,
        name: userDetails.name,
        role: userDetails.role
      }
    })
  } catch (error) {
    console.error('Profile error:', error)
    return c.json({ error: 'Internal server error' }, 500)
  }
}