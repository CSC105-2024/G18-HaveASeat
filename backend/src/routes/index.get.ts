import type { Context } from "hono";

export default function (c: Context) {
  return c.json({ message: 'Welcome to the Hono API' })
}