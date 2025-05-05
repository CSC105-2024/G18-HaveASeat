import type { Context } from "hono";
import { verify, sign } from "hono/jwt";
import type { AppEnv } from "@/types/env.js";

const JWT_SECRET = process.env.JWT_SECRET as string;

export default async function (c: Context<AppEnv>) {
  try {
    const { refreshToken } = await c.req.json();

    if (!refreshToken) {
      return c.json({ error: 'Refresh token required' }, 400);
    }

    const payload = await verify(refreshToken, JWT_SECRET);

    const newAccessToken = await sign(
      { id: payload.id, email: payload.email, exp: Math.floor(Date.now() / 1000) + 60 * 15 },
      JWT_SECRET
    );

    return c.json({ accessToken: newAccessToken });
  } catch (err) {
    console.error('Refresh error:', err);
    return c.json({ error: 'Invalid refresh token' }, 401);
  }
}