import { z } from "zod";
import { Hono } from "hono";
import { verifyAuth } from "@hono/auth-js";
import { zValidator } from "@hono/zod-validator";

import { replicate } from "@/lib/replicate";
import { uploadToCloudflare } from "@/lib/image";
import {
  checkImageGenerationCredits,
  decrementImageGenerationCredits,
} from "@/lib/admin";

const app = new Hono()
  .post(
    "/remove-bg",
    verifyAuth(),
    zValidator(
      "json",
      z.object({
        image: z.string(),
      }),
    ),
    async (c) => {
      const { image } = c.req.valid("json");
      const auth = c.get("authUser");
      if (!auth.token?.id) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      try {
        await checkImageGenerationCredits(auth.token?.id);
      } catch (error) {
        console.error(error);
        return c.json({ error: "Insufficient credits" }, 400);
      }
      const input = {
        image: image,
      };

      const output: unknown = await replicate.run(
        "cjwbw/rembg:fb8af171cfa1616ddcf1242c093f9c46bcada5ad4cf6f2fbe8b81b330ec5c003",
        { input },
      );

      const res = output as string;
      const imageUrl = await uploadToCloudflare(res, auth.token?.id);

      await decrementImageGenerationCredits(auth.token?.id);

      return c.json({ url: imageUrl });
    },
  )
  .post(
    "/generate-image",
    verifyAuth(),
    zValidator(
      "json",
      z.object({
        prompt: z.string(),
      }),
    ),
    async (c) => {
      const { prompt } = c.req.valid("json");
      const auth = c.get("authUser");
      if (!auth.token?.id) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      try {
        await checkImageGenerationCredits(auth.token?.id);
      } catch (error) {
        console.error(error);
        return c.json({ error: "Insufficient credits" }, 400);
      }

      const fluxModel = "black-forest-labs/flux-schnell";
      const input = {
        prompt: prompt,
        go_fast: true,
        guidance: 3.5,
        megapixels: "1",
        num_outputs: 1,
        aspect_ratio: "1:1",
        output_format: "png",
        output_quality: 80,
        prompt_strength: 0.8,
        num_inference_steps: 4,
      };

      const output = (await replicate.run(fluxModel as `${string}/${string}`, {
        input,
      })) as string[];
      if (!output?.[0]) {
        throw new Error("No image generated");
      }

      // const res = output as Array<string>;
      const imageUrl = await uploadToCloudflare(output[0], auth.token?.id);
      await decrementImageGenerationCredits(auth.token?.id);

      return c.json({ url: imageUrl });
    },
  );

export default app;
