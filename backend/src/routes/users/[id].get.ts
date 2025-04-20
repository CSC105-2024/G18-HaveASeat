import type { Context } from "hono";

export default function (c: Context) {
  const id = c.req.param('id')
  return c.json({ id, name: `User ${id}` })
}