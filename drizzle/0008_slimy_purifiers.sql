DROP TABLE IF EXISTS "credits";

CREATE TABLE IF NOT EXISTS "credits" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "user_id" text NOT NULL REFERENCES "user" ("id") ON DELETE CASCADE,
  "image_generation_count" integer DEFAULT 0,
  "max_image_generation_count" integer DEFAULT 0,
  "model_training_count" integer DEFAULT 0,
  "max_model_training_count" integer DEFAULT 0,
  "created_at" timestamp DEFAULT now(),
  "updated_at" timestamp DEFAULT now()
); 