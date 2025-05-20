import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { trimTrailingSlash } from "hono/trailing-slash";
import { compress } from "hono/compress";
import { logger } from "hono/logger";
import { serveStatic } from "@hono/node-server/serve-static";
import * as process from "node:process";
import { getPrisma } from "@/lib/prisma.js";
import { loadRoutes } from "@/router.ts";
import type { AppEnv } from "@/types/env.js";
import { cors } from "hono/cors";
import { CronJob } from "cron";
import { checkCurrentReservations, updateReservationStatuses } from "@/lib/reservation.js";

const db = getPrisma();
const app = new Hono<AppEnv>({ strict: true });

app.use(
    "*",
    cors({
      origin: ["http://localhost:5173"],
      credentials: true,
      allowMethods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
      maxAge: 86400,
    })
);

app.use(compress());
app.use(trimTrailingSlash());
app.use(logger());

app.get(
  "/uploads/*",
  serveStatic({
    root: "./",
    rewriteRequestPath: (path) =>
      path.replace(/^\/uploads/, "/uploads")
  })
);

await loadRoutes(app);

db.$connect()
  .then(() => {
    console.log("\x1b[44m[Database]\x1b[0m \x1b[32mConnected to the database\x1b[0m");
  })
  .catch((error) => {
    console.error("\x1b[44m[Prisma]\x1b[0m \x1b[31mError connecting to the database:\x1b[0m", error);
  });

serve({
  fetch: app.fetch,
  port: process.env.PORT as (number | undefined) || 3000
}, (info) => {
  console.log(`\x1b[31m[Hono]\x1b[0m Server is running on http://localhost:${info.port}`);
});

const reservationCleanupJob = new CronJob("*/5 * * * *", async () => {
  const prisma = getPrisma();
  await updateReservationStatuses(prisma);
  await checkCurrentReservations(prisma);
});

reservationCleanupJob.start();