import { drizzle } from "drizzle-orm/neon-http";
import { Pool } from "pg";
import { templates, credits } from "@/db/schema";
import * as dotenv from "dotenv";
dotenv.config({ path: "./.env.local" });

import { defaultTemplates } from "./seed/templates";
import { neon } from "@neondatabase/serverless";

async function main() {
  console.log("🌱 Starting seed...");
  const client = neon(process.env.DATABASE_URL!);
  const db = drizzle(client);

  // await seedTemplates(db);

  // for (const template of defaultTemplates) {
  //   await db.insert(templates).values(template).onConflictDoNothing();
  // }

  // Seed user credits
  await db
    .insert(credits)
    .values({
      user_id: "94eb8258-8513-4b42-8292-f9ea46d33382",
      image_generation_count: 0,
      model_training_count: 0,
      max_image_generation_count: 0,
      max_model_training_count: 0,
      created_at: new Date(),
      updated_at: new Date(),
    })
    .onConflictDoNothing();

  console.log("✅ Seed completed");
}

main().catch((err) => {
  console.error("❌ Error seeding database:", err);
  process.exit(1);
});
