import { Hono } from "hono";
import { handle } from "hono/vercel";
import { AuthConfig, initAuthConfig } from "@hono/auth-js";

import ai from "./ai";
import users from "./users";
import designs from "./designs";
import assets from "./assets";
import images from "./images";
import templates from "./templates";
import train from "./train";
import webhooks from "./webhooks";
import generate from "./generate";
import subscriptions from "./subscriptions";
import authConfig from "@/auth.config";

// Revert to "edge" if planning on running on the edge
export const runtime = "nodejs";

function getAuthConfig(): AuthConfig {
  return {
    secret: process.env.AUTH_SECRET,
    ...(authConfig as any),
  };
}

const app = new Hono().basePath("/api");

app.use("*", initAuthConfig(getAuthConfig));
/* eslint-disable @typescript-eslint/no-unused-vars */
const routes = app
  .route("/ai", ai)
  .route("/users", users)
  .route("/images", images)
  .route("/designs", designs)
  .route("/assets", assets)
  .route("/templates", templates)
  .route("/webhooks", webhooks)
  .route("/generate", generate)
  .route("/subscriptions", subscriptions)
  .route("/train", train);

export const GET = handle(app);
export const POST = handle(app);
export const PATCH = handle(app);
export const DELETE = handle(app);

export type AppType = typeof routes;
