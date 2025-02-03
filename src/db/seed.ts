import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";

import { seedTemplates } from "./seed/templates";

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql);

async function main() {
  console.log("🌱 Seeding templates...");
  await seedTemplates(db);
  console.log("✅ Templates seeded");
}

main().catch((err) => {
  console.error("❌ Error seeding database:", err);
  process.exit(1);
});
