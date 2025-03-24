import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { trimTrailingSlash } from "hono/trailing-slash";
import { compress } from "hono/compress";
import { logger } from "hono/logger";

const app = new Hono({ strict: true });

app.use(compress());
app.use(trimTrailingSlash());
app.use(logger());

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

serve({
  fetch: app.fetch,
  port: 3000
}, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`);
});
