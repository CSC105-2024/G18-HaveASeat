import type { Context } from 'hono'
import { authMiddleware } from '@/middlewares/auth.middleware.ts'
import { UserModel } from "@/models/user.model.js";
import type { AppEnv } from "@/types/env.js";

export default async function (c: Context<AppEnv>) {
  await authMiddleware(c, async () => {})

  try {
    const currentUser = c.get('user')

    // Find complete user details
    const user = await UserModel.findById(currentUser.id)
    if (!user) {
      return c.json({ success: false, error: 'User not found' }, 404)
    }

    return c.json({ success: true, data: user });
  } catch (error) {
    console.error('Profile error:', error)
    return c.json({ success: false, error: 'Internal server error' }, 500)
  }
}