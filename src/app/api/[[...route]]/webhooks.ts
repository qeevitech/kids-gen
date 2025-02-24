import { Hono } from "hono";
import crypto from "crypto";
import { replicate } from "@/lib/replicate";
import { db } from "@/db/drizzle";
import { models } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { users } from "@/db/schema";
import {
  sendTrainingCompletedEmail,
  sendTrainingFailedEmail,
} from "@/lib/mail";
import { s3Client } from "@/lib/cloudflare";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";

const app = new Hono().post("/training", async (c) => {
  try {
    const body = await c.req.json();
    const url = new URL(c.req.url);
    const userId = url.searchParams.get("userId") ?? "";
    const modelName = decodeURIComponent(
      url.searchParams.get("modelName") ?? "",
    );
    const fileName = decodeURIComponent(url.searchParams.get("fileName") ?? "");

    // Validate webhook signature
    const id = c.req.header("webhook-id") ?? "";
    const timestamp = c.req.header("webhook-timestamp") ?? "";
    const webhookSignature = c.req.header("webhook-signature") ?? "";

    const signedContent = `${id}.${timestamp}.${JSON.stringify(body)}`;
    const secret = await replicate.webhooks.default.secret.get();
    const secretBytes = Buffer.from(secret.key.split("_")[1], "base64");
    const signature = crypto
      .createHmac("sha256", secretBytes)
      .update(signedContent)
      .digest("base64");

    const expectedSignatures = webhookSignature
      .split(" ")
      .map((sig) => sig.split(",")[1]);
    const isValid = expectedSignatures.some(
      (expectedSignature) => expectedSignature === signature,
    );

    if (!isValid) {
      return c.json({ error: "Invalid signature" }, 401);
    }

    // Get user from database
    const user = await db.select().from(users).where(eq(users.id, userId));

    if (!user) {
      return c.json({ error: "User not found" }, 404);
    }

    if (body.status === "succeeded") {
      // Send success email
      await sendTrainingCompletedEmail(
        user[0].email,
        user[0].name ?? "user",
        modelName,
      );

      // Update model status in database
      await db
        .update(models)
        .set({
          trainingStatus: body.status,
          version: body.output?.version.split(":")[1] ?? null,
          trainingTime: body.metrics?.total_time ?? "0",
          updatedAt: new Date(),
        })
        .where(and(eq(models.userId, userId), eq(models.modelName, modelName)));
    } else {
      await sendTrainingFailedEmail(
        user[0].email,
        user[0].name ?? "user",
        modelName,
      );

      // Update model status for failed training
      await db
        .update(models)
        .set({
          trainingStatus: body.status,
          updatedAt: new Date(),
        })
        .where(and(eq(models.userId, userId), eq(models.modelName, modelName)));
    }

    // Delete training data from R2 storage
    try {
      await s3Client.send(
        new DeleteObjectCommand({
          Bucket: process.env.R2_BUCKET_NAME!,
          Key: fileName,
        }),
      );
      console.log(`Deleted training file: ${fileName}`);
    } catch (deleteError) {
      console.error("Error deleting file from R2:", deleteError);
      // Continue execution even if delete fails
    }

    return c.json({ success: true });
  } catch (error) {
    console.error("Webhook processing error:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
});

export default app;
