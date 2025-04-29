import type { Context, Next } from 'hono'
import { verify, sign } from 'hono/jwt'

const JWT_SECRET = process.env.JWT_SECRET as string;

export const authMiddleware = async (c: Context, next: Next) => {
  try {
    const authHeader = c.req.header('Authorization')

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    const token = authHeader.split(' ')[1]
    const payload = await verify(token, JWT_SECRET)

    c.set('user', payload)

    await next()
  } catch (error) {
    return c.json({ error: 'Unauthorized' }, 401)
  }
}

export const createToken = (user: { id: string | number, email: string }) => {
  return sign({
    id: user.id,
    email: user.email,
    exp: Math.floor(Date.now() / 1000) + 60 * 60 * 30
  }, JWT_SECRET)
}

export const roleMiddleware = (allowedRoles: string[]) => {
  return async (c: Context, next: Next) => {
    const user = c.get('user')

    if (!user || !user.role) {
      return c.json({ error: 'Forbidden' }, 403)
    }

    if (!allowedRoles.includes(user.role)) {
      return c.json({ error: 'Forbidden' }, 403)
    }

    await next()
  }
}