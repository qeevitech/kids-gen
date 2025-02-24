import { Hono } from "hono";
import { verifyAuth } from "@hono/auth-js";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import { replicate } from "@/lib/replicate";
import { s3Client, BUCKET_NAME } from "@/lib/cloudflare";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { db } from "@/db/drizzle";
import { models } from "@/db/schema";
import { eq, desc, and } from "drizzle-orm";

const TrainModelSchema = z.object({
  fileKey: z.string().min(1),
  modelName: z.string().min(1),
  gender: z.string().min(1),
});

// const WEBHOOK_URL = process.env.NEXT_PUBLIC_SITE_URL ?? process.env.NGROK_HOST;
const WEBHOOK_URL = "https://05f2-49-206-4-106.ngrok-free.app";

async function getStorageUrl(fileKey: string) {
  const command = new GetObjectCommand({
    Bucket: BUCKET_NAME,
    Key: fileKey,
  });

  const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
  return { signedUrl };
}

const app = new Hono()
  .get(
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
      const auth = c.get("authUser");
      const { page, limit } = c.req.valid("query");

      if (!auth.token?.id) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const data = await db
        .select()
        .from(models)
        .where(eq(models.userId, auth.token.id))
        .limit(limit)
        .offset((page - 1) * limit)
        .orderBy(desc(models.updatedAt));

      return c.json({
        data,
        nextPage: data.length === limit ? page + 1 : null,
      });
    },
  )
  .post("/", verifyAuth(), zValidator("json", TrainModelSchema), async (c) => {
    const auth = c.get("authUser");
    const data = c.req.valid("json");

    if (!auth.token?.id) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    try {
      const fileUrl = await getStorageUrl(data.fileKey);
      const userId = auth.token!.id;

      const modelId = `${userId}_${Date.now()}_${data.modelName
        .toLowerCase()
        .replaceAll(" ", "_")}`;

      // Create model on Replicate
      await replicate.models.create(
        `${process.env.NEXT_PUBLIC_REPLICATE_USER_NAME}`,
        modelId,
        {
          visibility: "private",
          hardware: "gpu-a100-large",
        },
      );

      // Start training
      const training = await replicate.trainings.create(
        "ostris",
        "flux-dev-lora-trainer",
        "e440909d3512c31646ee2e0c7d6f6f4923224863a6a10c494606e79fb5844497",
        {
          destination: `${process.env.NEXT_PUBLIC_REPLICATE_USER_NAME}/${modelId}`,
          input: {
            steps: 1200,
            resolution: "1024",
            input_images: fileUrl.signedUrl,
            trigger_word: "ohwx",
          },
          webhook: `${WEBHOOK_URL}/api/webhooks/training?userId=${userId}&modelName=${encodeURIComponent(
            data.modelName,
          )}&fileName=${encodeURIComponent(data.fileKey)}`,
          webhook_events_filter: ["completed"],
        },
      );

      // Save model details to database
      await db
        .insert(models)
        .values({
          userId,
          modelId,
          modelName: data.modelName,
          gender: data.gender,
          version: "",
          trainingTime: "",
          trainingStatus: training.status,
          triggerWord: "ohwx",
          trainingSteps: 1200,
          trainingId: training.id,
        })
        .returning();

      return c.json({
        success: true,
        modelId,
      });
    } catch (error) {
      console.error("Training error:", error);
      return c.json({ error: "Failed to start training" }, 500);
    }
  })
  .delete(
    "/:modelId",
    verifyAuth(),
    zValidator("param", z.object({ modelId: z.string() })),
    async (c) => {
      const auth = c.get("authUser");
      const { modelId } = c.req.valid("param");

      if (!auth.token?.id) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      try {
        const model = await db
          .select()
          .from(models)
          .where(and(eq(models.id, modelId), eq(models.userId, auth.token.id)))
          .limit(1);

        if (!model[0]) {
          return c.json({ error: "Model not found" }, 404);
        }

        // Delete from Replicate
        if (model[0].version) {
          try {
            await fetch(
              `https://api.replicate.com/v1/models/${process.env.NEXT_PUBLIC_REPLICATE_USER_NAME}/${model[0].modelId}/versions/${model[0].version}`,
              {
                method: "DELETE",
                headers: {
                  Authorization: `Bearer ${process.env.REPLICATE_API_TOKEN}`,
                },
              },
            );
          } catch (error) {
            console.error(
              "Failed to delete model version from replicate:",
              error,
            );
          }
        }

        if (model[0].modelId) {
          try {
            await fetch(
              `https://api.replicate.com/v1/models/${process.env.NEXT_PUBLIC_REPLICATE_USER_NAME}/${model[0].modelId}`,
              {
                method: "DELETE",
                headers: {
                  Authorization: `Bearer ${process.env.REPLICATE_API_TOKEN}`,
                },
              },
            );
          } catch (error) {
            console.error("Failed to delete model from replicate:", error);
          }
        }

        // Delete from database
        await db.delete(models).where(eq(models.id, modelId));

        return c.json({ success: true });
      } catch (error) {
        console.error("Delete error:", error);
        return c.json({ error: "Failed to delete model" }, 500);
      }
    },
  );

export default app;
