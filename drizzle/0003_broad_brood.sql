CREATE TABLE "prices" (
	"id" text PRIMARY KEY NOT NULL,
	"active" boolean,
	"currency" text,
	"description" text,
	"interval" text,
	"interval_count" integer,
	"metadata" json,
	"product_id" text,
	"trial_period_days" integer,
	"type" text,
	"unit_amount" integer,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "prices" ADD CONSTRAINT "prices_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE cascade ON UPDATE no action;