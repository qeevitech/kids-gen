import { drizzle } from "drizzle-orm/neon-http";
import { Pool } from "pg";
import { templates } from "@/db/schema";
import * as dotenv from "dotenv";
dotenv.config({ path: "./.env.local" });

import { defaultTemplates } from "./seed/templates";
import { neon } from "@neondatabase/serverless";

async function main() {
  console.log("🌱 Seeding templates...");
  const client = neon(process.env.DATABASE_URL!);
  const db = drizzle(client);

  // await seedTemplates(db);

  for (const template of defaultTemplates) {
    await db.insert(templates).values(template).onConflictDoNothing();
  }
  console.log("✅ Templates seeded");
}

main().catch((err) => {
  console.error("❌ Error seeding database:", err);
  process.exit(1);
});
