import { Hono } from "hono";
import { verifyAuth } from "@hono/auth-js";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { replicate } from "@/lib/replicate";
import { supportedLanguages } from "@/lib/languages";
import { kidsStoryChat, adultStoryChat } from "@/lib/geminiAi";
import { stories, designs, templates } from "@/db/schema";
import { db } from "@/db/drizzle";
import { imageMeta } from "image-meta";
import { BUCKET_NAME, s3Client } from "@/lib/cloudflare";

import { randomUUID } from "crypto";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { eq } from "drizzle-orm";

const generateStorySchema = z.object({
  storySubject: z.string(),
  gender: z.enum(["man", "women", "boy", "girl"]),
  modelId: z.string().optional().default("default"),
  modelName: z.string().optional().default("default"),
  templateId: z.string().optional().default("default"),
  // Kids specific fields
  storyType: z.string().optional(),
  imageStyle: z.string().optional(),
  ageGroup: z.string().optional(),
  mood: z.string().optional(),
  length: z.string().optional(),
  protagonist: z.string().optional(),
  // Grown-ups specific fields
  genre: z.string().optional(),
  tone: z.string().optional(),
  plotElements: z.array(z.string()).optional(),
  characterDescription: z.string().optional(),
  themes: z.array(z.string()).optional(),
  pageCount: z.number().optional(),
  // Common fields
  language: z.string(),
  setting: z.string().optional(),
  moralLesson: z.string().optional(),
  designId: z.string(),
});

function getLanguageName(code: string | undefined): string {
  if (!code) return "English";
  return (
    supportedLanguages.find((lang) => lang.value === code)?.label || "English"
  );
}

function getKidsPrompt(data: any) {
  return `
  Create a children's story with these details:
  - Main Subject: ${data.storySubject}
  - Illustration Style: ${data.imageStyle}
  - Emotional Tone: ${data.mood}
  - Age Group: ${data.ageGroup}
  - Story Type: ${data.storyType}
  - Protagonist: ${data.protagonist}
  - Story Length: ${data.length} (Generate exactly ${
    data.length === "Short" ? "5" : data.length === "Medium" ? "8" : "12"
  } chapters)
  - Language: ${data.language}
  - Main Character Type: ${data.protagonist}
  - Story Setting: ${data.setting || "Not specified"}
  - Moral/Educational Value: ${data.moralLesson || "Not specified"}
  
  Please create an engaging children's story in ${getLanguageName(
    data.language,
  )} that follows these guidelines:
  1. Age-appropriate language and themes
  2. Clear narrative structure (beginning, middle, end)
  3. Engaging dialogue and descriptions
  4. Interactive elements for reader engagement
  5. Educational or moral message woven naturally
  6. Vivid scene descriptions for illustrations
  7. IMPORTANT: Create exactly ${
    data.length === "Short" ? "3-5" : data.length === "Medium" ? "6-8" : "9-12"
  } chapters, no more, no less.
  
  Important Note: While the story text should be in ${getLanguageName(
    data.language,
  )}, please provide all image_prompt fields in English only and use the age group to determine the style of the illustrations.
  
  Format the response as a JSON with this exact structure:
  {
    "story_cover": {
      "title": "The story's title",
      "subtitle": "Optional subtitle",
      "image_prompt": "Detailed description for cover illustration (in English)"
    },
    "chapters": [
      {
        "chapter_title": "Chapter or section title",
        "text": "The story text for this section",
        "image_prompt": "Detailed description for section illustration (in English)",
        "image_url": "",
      }
    ]
  }`;
}

function getAdultPrompt(data: any) {
  return `
  Create a story with these details:
  - Main Subject: ${data.storySubject}
  - Genre: ${data.genre}
  - Tone: ${data.tone}
  - Number of Chapters: ${data.pageCount}
  - Language: ${data.language}
  - Character Description: ${data.characterDescription || "Not specified"}
  - Themes: ${data.themes?.join(", ") || "Not specified"}
  - Plot Elements: ${data.plotElements?.join(", ") || "Not specified"}
  - Setting: ${data.setting || "Not specified"}
  - Illustration Style: ${data.imageStyle}
  
  Please create a compelling story in ${getLanguageName(data.language)} that:
  1. Follows the specified genre conventions
  2. Maintains consistent tone and pacing
  3. Develops complex characters and relationships
  4. Incorporates specified themes meaningfully
  5. Creates vivid, atmospheric scenes
  6. Builds tension and resolution effectively
  7. Provides detailed image prompts in the ${data.imageStyle} style
  
  Important Note: While the story text should be in ${getLanguageName(
    data.language,
  )}, please provide all image_prompt fields in English only, specifically describing scenes in ${
    data.imageStyle
  } art style for story illustrations.
  
  Format the response as a JSON with this exact structure:
  {
    "story_cover": {
      "title": "The story's title",
      "subtitle": "Optional subtitle",
      "image_prompt": "Detailed description for cover illustration in ${
        data.imageStyle
      } style (in English)"
    },
    "chapters": [
      {
        "chapter_title": "Chapter title",
        "text": "The story text for this chapter",
        "image_prompt": "Detailed description for chapter illustration in ${
          data.imageStyle
        } style (in English)",
        "image_url": ""
      }
    ]
  }`;
}

// Add helper function for image generation
async function generateImage(
  prompt: string,
  modelName: string,
  userId: string,
  gender: string,
  seed: number,
) {
  const fluxModel = modelName.startsWith(
    `${process.env.NEXT_PUBLIC_REPLICATE_USER_NAME}/`,
  )
    ? modelName
    : "black-forest-labs/flux-schnell";
  const modelInput = modelName.startsWith(
    `${process.env.NEXT_PUBLIC_REPLICATE_USER_NAME}/`,
  )
    ? {
        model: "dev",
        prompt: `Image of a ohwx, ${gender}, ${prompt}`,
        lora_scale: 1,
        guidance: 3.5,
        num_outputs: 1,
        output_format: "png",
        aspect_ratio: "1:1",
        output_quality: 80,
        num_inference_steps: 28,
        prompt_strength: 0.8,
        extra_lora_scale: 0,
        seed,
      }
    : {
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
        seed,
      };

  try {
    const output = (await replicate.run(fluxModel as `${string}/${string}`, {
      input: modelInput,
    })) as string[];

    if (!output?.[0]) {
      throw new Error("No image generated");
    }

    // Upload to Cloudflare
    const imageUrl = await uploadToCloudflare(output[0], userId);
    return imageUrl;
  } catch (error) {
    console.error("Image generation error:", error);
    return null;
  }
}

export async function imgUrlToBlob(url: string) {
  const response = await fetch(url);
  const blob = await response.blob();
  return blob.arrayBuffer();
}

const uploadToCloudflare = async (image: string, userId: string) => {
  try {
    const arrayBuffer = await imgUrlToBlob(image);
    const { type } = imageMeta(new Uint8Array(arrayBuffer));
    const fileName = `image_${randomUUID()}.${type}`;
    const filePath = `${userId}/${fileName}`;

    await s3Client.send(
      new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: filePath,
        Body: new Uint8Array(arrayBuffer),
        ContentType: "image/png",
      }),
    );

    return `${process.env.NEXT_PUBLIC_R2_URL}/${filePath}`;
  } catch (error) {
    console.error("Error uploading to Cloudflare:", error);
    throw new Error("Failed to upload image");
  }
};

const app = new Hono().post(
  "/",
  verifyAuth(),
  zValidator("json", generateStorySchema),
  async (c) => {
    const auth = c.get("authUser");
    const data = c.req.valid("json");

    if (!auth.token?.id) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    try {
      // Generate story text
      const chat = data.storyType ? kidsStoryChat : adultStoryChat;
      const prompt = data.storyType
        ? getKidsPrompt(data)
        : getAdultPrompt(data);
      const result = await chat.sendMessage(prompt);
      const response = JSON.parse(
        result.response.text().replace(/```json\n|\n```/g, ""),
      );
      const seed = Math.floor(Math.random() * 1000000);

      // Generate cover image
      const coverImageUrl = await generateImage(
        response.story_cover.image_prompt,
        data.modelName,
        auth.token.id,
        data.gender,
        seed,
      );

      // Generate chapter images in parallel
      const chapterImagesPromises = response.chapters.map((chapter: any) =>
        generateImage(
          chapter.image_prompt,
          data.modelName,
          auth.token?.id || "",
          data.gender,
          seed,
        ),
      );
      const chapterImageUrls = await Promise.all(chapterImagesPromises);

      // Update chapters with image URLs
      const updatedChapters = response.chapters.map(
        (chapter: any, index: number) => ({
          ...chapter,
          image_url: chapterImageUrls[index] || "",
        }),
      );

      console.log(updatedChapters);
      console.log(coverImageUrl);

      // Save to database
      const existingStory = await db
        .select()
        .from(stories)
        .where(eq(stories.designId, data.designId))
        .limit(1)
        .then((rows) => rows[0]);

      // Update design pages
      await updateDesignPages(
        data.designId,
        data.templateId,
        response,
        coverImageUrl || "",
        chapterImageUrls,
      );

      // Update or insert story
      const story = existingStory
        ? await db
            .update(stories)
            .set({
              title: response.story_cover.title,
              coverImagePrompt: response.story_cover.image_prompt,
              coverImageUrl,
              chapters: updatedChapters,
              language: data.language,
              imageStyle: data.imageStyle || "default",
              ...(response.story_cover.subtitle && {
                subtitle: response.story_cover.subtitle,
              }),
              ...(data.genre && { genre: data.genre }),
              ...(data.tone && { tone: data.tone }),
              ...(data.storyType && { storyType: data.storyType }),
            })
            .where(eq(stories.id, existingStory.id))
            .returning()
        : await db
            .insert(stories)
            .values({
              designId: data.designId,
              title: response.story_cover.title,
              coverImagePrompt: response.story_cover.image_prompt,
              coverImageUrl,
              chapters: updatedChapters,
              language: data.language,
              imageStyle: data.imageStyle || "default",
              ...(response.story_cover.subtitle && {
                subtitle: response.story_cover.subtitle,
              }),
              ...(data.genre && { genre: data.genre }),
              ...(data.tone && { tone: data.tone }),
              ...(data.storyType && { storyType: data.storyType }),
            })
            .returning();

      return c.json({
        success: true,
        data: story[0],
        error: null,
      });
    } catch (error) {
      console.error("Story generation error:", error);
      return c.json(
        {
          success: false,
          data: null,
          error: "Failed to generate story",
        },
        500,
      );
    }
  },
);

async function updateDesignPages(
  designId: string,
  templateId: string,
  storyData: any,
  coverImageUrl: string,
  chapterImages: string[],
) {
  // Get template
  const template = (await db
    .select()
    .from(templates)
    .where(eq(templates.id, templateId))
    .limit(1)
    .then((rows) => rows[0])) as {
    pages: Array<{
      id: string;
      elements: any;
    }>;
  };

  if (!template) throw new Error("Template not found");

  const pages = [];

  // Update cover page
  const coverPage = {
    ...template.pages[0],
    id: crypto.randomUUID(),
    elements: {
      ...template.pages[0].elements,
      objects: template.pages[0].elements.objects.map((obj: any) => {
        if (obj.type === "image") {
          return { ...obj, src: coverImageUrl };
        }
        if (obj.type === "textbox") {
          return { ...obj, text: storyData.story_cover.title };
        }
        return obj;
      }),
    },
  };
  pages.push(coverPage);

  // Create chapter pages using template[1] as base
  const chapterTemplate = template.pages[1];
  storyData.chapters.forEach((chapter: any, index: number) => {
    const textboxes = chapterTemplate.elements.objects.filter(
      (obj: any) => obj.type === "textbox",
    );

    const chapterPage = {
      ...chapterTemplate,
      id: crypto.randomUUID(),
      elements: {
        ...chapterTemplate.elements,
        objects: chapterTemplate.elements.objects.map((obj: any) => {
          if (obj.type === "image") {
            return { ...obj, src: chapterImages[index] };
          }
          if (obj.type === "textbox") {
            // If multiple textboxes exist
            if (textboxes.length > 1) {
              // First textbox gets chapter title
              if (obj === textboxes[0]) {
                return { ...obj, text: chapter.chapter_title };
              }
              // Second textbox gets chapter text
              if (obj === textboxes[1]) {
                return { ...obj, text: chapter.text };
              }
            } else {
              // If only one textbox, use it for chapter text
              return { ...obj, text: chapter.text };
            }
          }
          return obj;
        }),
      },
    };
    pages.push(chapterPage);
  });

  // Update design with new pages
  await db.update(designs).set({ pages }).where(eq(designs.id, designId));

  return pages;
}

export default app;
