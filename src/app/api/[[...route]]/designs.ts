import { z } from "zod";
import { Hono } from "hono";
import { eq, and, desc } from "drizzle-orm";
import { verifyAuth } from "@hono/auth-js";
import { zValidator } from "@hono/zod-validator";

import { db } from "@/db/drizzle";
import { designs } from "@/db/schema";
import { users } from "@/db/schema";

// Validation schema for design pages
const pageSchema = z.object({
  id: z.string().uuid(),
  elements: z.any(),
  thumbnail: z.string().optional(),
});

// Validation schema for create/update
const designSchema = z.object({
  name: z.string().min(1),
  thumbnail: z.string().optional(),
  width: z.number().min(1),
  height: z.number().min(1),
  isPublic: z.boolean().default(false),
  pages: z.array(pageSchema).default([]),
  currentPage: z.number().default(0),
});

const app = new Hono()
  .get(
    "/",
    verifyAuth(),
    zValidator(
      "query",
      z.object({
        page: z.coerce.number(),
        limit: z.coerce.number(),
      }),
    ),
    async (c) => {
      const auth = c.get("authUser");
      const { page, limit } = c.req.valid("query");

      if (!auth.token?.id) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const data = await db
        .select()
        .from(designs)
        .where(eq(designs.userId, auth.token.id))
        .limit(limit)
        .offset((page - 1) * limit)
        .orderBy(desc(designs.updatedAt));

      return c.json({
        data,
        nextPage: data.length === limit ? page + 1 : null,
      });
    },
  )
  .get(
    "/:id",
    verifyAuth(),
    zValidator("param", z.object({ id: z.string().uuid() })),
    async (c) => {
      const auth = c.get("authUser");
      const { id } = c.req.valid("param");

      if (!auth.token?.id) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const design = await db
        .select()
        .from(designs)
        .where(and(eq(designs.id, id), eq(designs.userId, auth.token.id)));

      if (!design[0]) {
        return c.json({ error: "Design not found" }, 404);
      }

      return c.json(design[0]);
    },
  )
  .post("/", verifyAuth(), zValidator("json", designSchema), async (c) => {
    const auth = c.get("authUser");
    const data = c.req.valid("json");

    if (!auth.token?.id) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    try {
      const design = await db
        .insert(designs)
        .values({
          ...data,
          userId: auth.token.id,
        })
        .returning();

      return c.json(design[0]);
    } catch (error) {
      console.error("Create design error:", error);
      return c.json({ error: "Failed to create design" }, 500);
    }
  })
  .patch(
    "/:id",
    verifyAuth(),
    zValidator("param", z.object({ id: z.string().uuid() })),
    zValidator("json", designSchema.partial()),
    async (c) => {
      const auth = c.get("authUser");
      const { id } = c.req.valid("param");
      const data = c.req.valid("json");

      if (!auth.token?.id) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const design = await db
        .update(designs)
        .set({
          ...data,
          updatedAt: new Date(),
        })
        .where(and(eq(designs.id, id), eq(designs.userId, auth.token.id)))
        .returning();

      if (!design[0]) {
        return c.json({ error: "Design not found" }, 404);
      }

      return c.json(design[0]);
    },
  );

export default app;
