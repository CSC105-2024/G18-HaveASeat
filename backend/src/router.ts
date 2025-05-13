import { type Env, Hono } from "hono";
import fs from "fs";
import path from "path";
import process from "process";

type HttpMethod = "get" | "post" | "put" | "delete" | "patch" | "options" | "head"
type RouteEntry = {
  path: string;
  method: HttpMethod;
  handler: any;
  filePath: string;
  isDynamic: boolean;
}

export async function loadRoutes<T extends Env>(app: Hono<T>): Promise<void> {
  const routesDir = path.join(process.cwd(), "src", "routes");

  if (!fs.existsSync(routesDir)) {
    console.error("Routes directory not found:", routesDir);
    return;
  }


  const routes: RouteEntry[] = [];
  await collectAllRoutes(routesDir, "", routes);


  routes.sort((a, b) => {

    if (a.isDynamic && !b.isDynamic) return 1;
    if (!a.isDynamic && b.isDynamic) return -1;


    const aSegments = a.path.split("/").filter(Boolean).length;
    const bSegments = b.path.split("/").filter(Boolean).length;

    return bSegments - aSegments;
  });


  registerRoutes(app, routes);
}

async function collectAllRoutes(
  baseDir: string,
  currentPath: string,
  routes: RouteEntry[]
): Promise<void> {
  const dirPath = path.join(baseDir, currentPath);
  const files = fs.readdirSync(dirPath);

  const filePromises = [];

  for (const file of files) {
    const filePath = path.join(dirPath, file);
    const stats = fs.statSync(filePath);

    if (stats.isDirectory()) {

      await collectAllRoutes(baseDir, path.join(currentPath, file), routes);
    } else if (stats.isFile() && file.endsWith(".ts")) {

      const promise = processRouteFile(baseDir, path.join(currentPath, file), routes);
      filePromises.push(promise);
    }
  }


  await Promise.all(filePromises);
}

async function processRouteFile(
  baseDir: string,
  routeFile: string,
  routes: RouteEntry[]
): Promise<void> {
  const { routePath, method, isDynamic } = parseRoutePath(routeFile);

  if (!method) {
    console.warn(`Skipping file with no HTTP method: ${routeFile}`);
    return;
  }

  const fullPath = path.join(baseDir, routeFile);

  try {
    const fileUrl = pathToFileURL(fullPath);
    const module = await import(fileUrl);
    const handler = module.default;

    if (typeof handler !== "function") {
      console.error(`Invalid route handler in ${routeFile}. Export a default function.`);
      return;
    }

    routes.push({
      path: routePath,
      method,
      handler,
      filePath: routeFile,
      isDynamic
    });
  } catch (err) {
    console.error(`\x1b[31m[Router Error]\x1b[0m Error loading route ${routeFile}:`, err);
  }
}

function registerRoutes<T extends Env>(app: Hono<T>, routes: RouteEntry[]): void {
  for (const route of routes) {
    console.log(
      `\x1b[46m[Router]\x1b[0m \x1b[37m${route.method.toUpperCase()}\x1b[0m \t${route.path}${
        route.isDynamic ? " (dynamic)" : ""
      }`
    );

    switch (route.method) {
      case "get":
        app.get(route.path, route.handler);
        break;
      case "post":
        app.post(route.path, route.handler);
        break;
      case "put":
        app.put(route.path, route.handler);
        break;
      case "delete":
        app.delete(route.path, route.handler);
        break;
      case "patch":
        app.patch(route.path, route.handler);
        break;
      case "options":
        app.options(route.path, route.handler);
        break;
      case "head":
        app.get(route.path, route.handler);
        break;
    }
  }
}

function pathToFileURL(filePath: string): string {
  const absolutePath = path.resolve(filePath);
  const normalizedPath = absolutePath.replace(/\\/g, "/");

  if (process.platform === "win32") {
    return `file:///${normalizedPath}`;
  }

  return `file://${normalizedPath}`;
}

function parseRoutePath(filePath: string): { routePath: string, method: HttpMethod | null, isDynamic: boolean } {
  let routePath = filePath.replace(/\.ts$/, "");
  let isDynamic = false;

  const methodMatch = routePath.match(/\.(get|post|put|delete|patch|options|head)$/);
  const method = methodMatch ? methodMatch[1] as HttpMethod : null;

  if (method) {
    routePath = routePath.replace(`.${method}`, "");
  }

  routePath = routePath.replace(/\\/g, "/");


  if (routePath.includes("[")) {
    isDynamic = true;
    routePath = routePath.replace(/\[([^\]]+)\]/g, ":$1");
  }

  if (routePath === "index" || routePath === "/index") {
    return { routePath: "/", method, isDynamic };
  }

  if (routePath.endsWith("/index")) {
    routePath = routePath.replace(/\/index$/, "");
  }

  if (!routePath.startsWith("/")) {
    routePath = "/" + routePath;
  }

  return { routePath, method, isDynamic };
}