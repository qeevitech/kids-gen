import { Template } from "@/types";
import { v4 as uuidv4 } from "uuid";

export const defaultTemplates: Template[] = [
  {
    id: crypto.randomUUID(),
    name: "Blank Canvas",
    thumbnail: "/templates/blank.png",
    category: "basic",
    width: 800,
    height: 600,
    isPublic: true,
    pages: [
      {
        id: uuidv4(),
        elements: [
          // Empty canvas with white background
          {
            type: "rect",
            left: 0,
            top: 0,
            width: 800,
            height: 600,
            fill: "#ffffff",
            selectable: false,
          },
        ],
      },
    ],
  },
  {
    id: crypto.randomUUID(),
    name: "Instagram Carousel",
    thumbnail: "/templates/instagram-carousel.png",
    category: "social",
    width: 1080,
    height: 1080,
    isPublic: true,
    pages: [
      {
        id: uuidv4(),
        elements: [
          {
            type: "rect",
            left: 0,
            top: 0,
            width: 1080,
            height: 1080,
            fill: "#f0f0f0",
            selectable: false,
          },
          {
            type: "textbox",
            left: 100,
            top: 100,
            width: 880,
            fontSize: 40,
            fontFamily: "Inter",
            fill: "#000000",
            text: "First Slide",
          },
        ],
      },
      {
        id: uuidv4(),
        elements: [
          {
            type: "rect",
            left: 0,
            top: 0,
            width: 1080,
            height: 1080,
            fill: "#ffffff",
            selectable: false,
          },
          {
            type: "textbox",
            left: 100,
            top: 100,
            width: 880,
            fontSize: 40,
            fontFamily: "Inter",
            fill: "#000000",
            text: "Second Slide",
          },
        ],
      },
    ],
  },
  {
    id: crypto.randomUUID(),
    name: "Presentation Deck",
    thumbnail: "/templates/presentation-deck.png",
    category: "presentation",
    width: 1920,
    height: 1080,
    isPublic: true,
    pages: [
      {
        id: uuidv4(),
        elements: [
          {
            type: "rect",
            left: 0,
            top: 0,
            width: 1920,
            height: 1080,
            fill: "#ffffff",
            selectable: false,
          },
          {
            type: "textbox",
            left: 100,
            top: 50,
            width: 1720,
            fontSize: 60,
            fontFamily: "Inter",
            fill: "#333333",
            text: "Title Slide",
          },
        ],
      },
      {
        id: uuidv4(),
        elements: [
          {
            type: "rect",
            left: 0,
            top: 0,
            width: 1920,
            height: 1080,
            fill: "#ffffff",
            selectable: false,
          },
          {
            type: "textbox",
            left: 100,
            top: 50,
            width: 1720,
            fontSize: 40,
            fontFamily: "Inter",
            fill: "#333333",
            text: "Content Slide",
          },
        ],
      },
    ],
  },
  {
    id: crypto.randomUUID(),
    name: "Business Card",
    thumbnail: "/templates/business-card.png",
    category: "business",
    width: 1050,
    height: 600,
    isPublic: true,
    pages: [
      {
        id: uuidv4(),
        elements: [
          // Background
          {
            type: "rect",
            left: 0,
            top: 0,
            width: 1050,
            height: 600,
            fill: "#ffffff",
            selectable: false,
          },
          // Logo placeholder
          {
            type: "circle",
            left: 50,
            top: 50,
            radius: 40,
            fill: "#2563eb",
          },
          // Name
          {
            type: "textbox",
            left: 150,
            top: 50,
            width: 400,
            fontSize: 24,
            fontFamily: "Inter",
            fill: "#333333",
            text: "John Doe",
          },
          // Title
          {
            type: "textbox",
            left: 150,
            top: 90,
            width: 400,
            fontSize: 16,
            fontFamily: "Inter",
            fill: "#666666",
            text: "Software Engineer",
          },
        ],
      },
    ],
  },
];

// Seed function
export async function seedTemplates(db: any) {
  const { templates } = await import("@/db/schema");

  for (const template of defaultTemplates) {
    await db.insert(templates).values(template).onConflictDoNothing();
  }
}
