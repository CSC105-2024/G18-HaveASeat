import type { Context } from "hono";

export default async function (c: Context) {
  try {
    return c.json({});
  } catch (error) {
    console.error('Page error:', error)
    return c.json({ error: 'Internal server error' }, 500)
  }
}