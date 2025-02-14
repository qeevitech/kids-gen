CREATE TABLE "story_templates" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"description" text NOT NULL,
	"thumbnail" text NOT NULL,
	"category" text NOT NULL,
	"prompt" text NOT NULL,
	"is_public" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now()
);
