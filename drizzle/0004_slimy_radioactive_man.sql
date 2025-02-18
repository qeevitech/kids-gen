CREATE TABLE "credits" (
	"id" integer PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"image_generation_count" integer DEFAULT 0,
	"max_image_generation_count" integer DEFAULT 0,
	"model_training_count" integer DEFAULT 0,
	"max_model_training_count" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "credits" ADD CONSTRAINT "credits_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;