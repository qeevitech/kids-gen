import { z } from "zod";
import { Hono } from "hono";
import { verifyAuth } from "@hono/auth-js";
import { zValidator } from "@hono/zod-validator";

import { db } from "@/db/drizzle";
import { assets } from "@/db/schema";
import { uploadAsset } from "@/lib/upload";

const app = new Hono().post(
  "/upload",
  verifyAuth(),
  zValidator(
    "form",
    z.object({
      file: z.instanceof(File),
    }),
  ),
  async (c) => {
    const auth = c.get("authUser");
    const { file } = c.req.valid("form");

    if (!auth.token?.id) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    try {
      const { key, url, filename, size, mimeType } = await uploadAsset(
        file,
        auth.token.id,
      );

      const asset = await db
        .insert(assets)
        .values({
          userId: auth.token.id,
          type: file.type.startsWith("image/") ? "image" : "other",
          filename,
          key,
          url,
          size,
          mimeType,
        })
        .returning();

      return c.json(asset[0]);
    } catch (error) {
      console.error("Upload error:", error);
      return c.json({ error: "Upload failed" }, 500);
    }
  },
);

export default app;
