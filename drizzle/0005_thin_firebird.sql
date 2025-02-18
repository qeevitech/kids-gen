ALTER TABLE "subscription" DROP CONSTRAINT "subscription_userId_user_id_fk";
--> statement-breakpoint
ALTER TABLE "subscription" ADD COLUMN "user_id" text NOT NULL;--> statement-breakpoint
ALTER TABLE "subscription" ADD COLUMN "price_id" text;--> statement-breakpoint
ALTER TABLE "subscription" ADD COLUMN "quantity" integer;--> statement-breakpoint
ALTER TABLE "subscription" ADD COLUMN "cancel_at" timestamp;--> statement-breakpoint
ALTER TABLE "subscription" ADD COLUMN "cancel_at_period_end" boolean;--> statement-breakpoint
ALTER TABLE "subscription" ADD COLUMN "canceled_at" timestamp;--> statement-breakpoint
ALTER TABLE "subscription" ADD COLUMN "current_period_start" timestamp NOT NULL;--> statement-breakpoint
ALTER TABLE "subscription" ADD COLUMN "current_period_end" timestamp NOT NULL;--> statement-breakpoint
ALTER TABLE "subscription" ADD COLUMN "created" timestamp NOT NULL;--> statement-breakpoint
ALTER TABLE "subscription" ADD COLUMN "ended_at" timestamp;--> statement-breakpoint
ALTER TABLE "subscription" ADD COLUMN "trial_start" timestamp;--> statement-breakpoint
ALTER TABLE "subscription" ADD COLUMN "trial_end" timestamp;--> statement-breakpoint
ALTER TABLE "subscription" ADD COLUMN "metadata" json;--> statement-breakpoint
ALTER TABLE "subscription" ADD CONSTRAINT "subscription_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "subscription" DROP COLUMN "userId";--> statement-breakpoint
ALTER TABLE "subscription" DROP COLUMN "subscriptionId";--> statement-breakpoint
ALTER TABLE "subscription" DROP COLUMN "customerId";--> statement-breakpoint
ALTER TABLE "subscription" DROP COLUMN "priceId";--> statement-breakpoint
ALTER TABLE "subscription" DROP COLUMN "currentPeriodEnd";--> statement-breakpoint
ALTER TABLE "subscription" DROP COLUMN "createdAt";--> statement-breakpoint
ALTER TABLE "subscription" DROP COLUMN "updatedAt";