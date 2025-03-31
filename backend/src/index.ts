import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { trimTrailingSlash } from "hono/trailing-slash";
import { compress } from "hono/compress";
import { logger } from "hono/logger";
import { serveStatic } from "@hono/node-server/serve-static";
import * as process from "node:process";

const app = new Hono<{
  Bindings: {
    DATABASE_URL: string
  },
  Variables: {

  }
}>({ strict: true });

app.use(compress());
app.use(trimTrailingSlash());
app.use(logger());

app.use('*', serveStatic({ root: '../public' }))

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

serve({
  fetch: app.fetch,
  port: process.env.PORT as (number | undefined) || 3000
}, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`);
});
