import { z } from "zod";
import { Hono } from "hono";
import { eq, desc, asc, and } from "drizzle-orm";
import { verifyAuth } from "@hono/auth-js";
import { zValidator } from "@hono/zod-validator";

import { db } from "@/db/drizzle";
import { templates } from "@/db/schema";

const app = new Hono().get(
  "/",
  verifyAuth(),
  zValidator(
    "query",
    z.object({
      category: z.string().optional(),
      page: z.coerce.number(),
      limit: z.coerce.number(),
    }),
  ),
  async (c) => {
    const { page, limit, category } = c.req.valid("query");

    const data = await db
      .select()
      .from(templates)
      .where(
        category
          ? and(eq(templates.isPro, true), eq(templates.category, category))
          : eq(templates.isPro, true),
      )
      .limit(limit)
      .offset((page - 1) * limit)
      .orderBy(asc(templates.isPro), desc(templates.createdAt));

    return c.json({ data });
  },
);

export default app;
