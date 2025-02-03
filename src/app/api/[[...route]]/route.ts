import { Context, Hono } from "hono";
import { handle } from "hono/vercel";
import { AuthConfig, initAuthConfig } from "@hono/auth-js";

import ai from "./ai";
import users from "./users";
import designs from "./designs";
import assets from "./assets";
import images from "./images";
import templates from "./templates";
import authConfig from "@/auth.config";

// Revert to "edge" if planning on running on the edge
export const runtime = "nodejs";

function getAuthConfig(c: Context): AuthConfig {
  return {
    secret: process.env.AUTH_SECRET,
    ...(authConfig as any),
  };
}

const app = new Hono().basePath("/api");

app.use("*", initAuthConfig(getAuthConfig));

const routes = app
  .route("/ai", ai)
  .route("/users", users)
  .route("/images", images)
  .route("/designs", designs)
  .route("/assets", assets)
  .route("/templates", templates);

export const GET = handle(app);
export const POST = handle(app);
export const PATCH = handle(app);
export const DELETE = handle(app);

export type AppType = typeof routes;
