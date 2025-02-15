/* eslint-disable @typescript-eslint/no-require-imports */
/*
 * Install the Generative AI SDK
 *
 * $ npm install @google/generative-ai
 */

const { GoogleGenerativeAI } = require("@google/generative-ai");

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  responseMimeType: "application/json",
};

export const kidsStoryChat = model.startChat({
  generationConfig,
  history: [
    {
      role: "user",
      parts: [
        {
          text: "create kids story on description for 5-8 Years kids, Educational story, and all images in Paper cut style: story of boy and girls and Love , give me 5 chapter, With detailed image text prompt for each of chapter and image prompt for story cover book with story name , all in JSON field format",
        },
      ],
    },
    {
      role: "model",
      parts: [
        {
          text: '```json\n{\n  "story_cover": {\n    "image_prompt": "Paper cut illustration of a boy and a girl holding hands, smiling, surrounded by colorful flowers and hearts. The title of the story is written in a playful font above them.",\n    "title": "The Boy, The Girl, and the Love"\n  },\n  "chapters": [\n    {\n      "chapter_title": "A Sunny Day",\n      "text": "Once upon a time, in a town full of sunshine and laughter...",\n      "image_prompt": "Paper cut illustration of children playing in a sunny park",\n      "image_url": ""\n    }]\n}```',
        },
      ],
    },
  ],
});

export const adultStoryChat = model.startChat({
  generationConfig,
  history: [
    {
      role: "user",
      parts: [
        {
          text: "Create a sophisticated story for adults in Mystery genre with a Suspenseful tone. Include detailed image prompts for each chapter and cover in a specific JSON format",
        },
      ],
    },
    {
      role: "model",
      parts: [
        {
          text: '```json\n{\n  "story_cover": {\n    "image_prompt": "A dimly lit Victorian mansion silhouetted against a stormy sky, with a single lit window casting an eerie glow",\n    "title": "Shadows of the Past"\n  },\n  "chapters": [\n    {\n      "chapter_title": "The Return",\n      "text": "The old mansion loomed before her, its shadows holding secrets from decades past...",\n      "image_prompt": "Close-up of an ornate brass key in a weathered hand, with the mansion blurred in the background",\n      "image_url": ""\n    }]\n}```',
        },
      ],
    },
  ],
});
