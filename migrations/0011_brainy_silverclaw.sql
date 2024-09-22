DO $$ BEGIN
 CREATE TYPE "icecream"."order_type" AS ENUM('subscription', 'release');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "icecream"."subscribe_level" AS ENUM('standard', 'professional', 'premium');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "icecream"."orders" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"createdAt" timestamp DEFAULT now(),
	"userId" uuid NOT NULL,
	"type" "icecream"."order_type" NOT NULL,
	"metadata" jsonb NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "icecream"."payment_methods" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"userId" uuid NOT NULL,
	"metadata" jsonb NOT NULL
);
--> statement-breakpoint
DROP TABLE "icecream"."subscriptions";--> statement-breakpoint
ALTER TABLE "icecream"."user" ADD COLUMN "isSubscribed" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "icecream"."user" ADD COLUMN "subscribeLevel" "icecream"."subscribe_level";--> statement-breakpoint
ALTER TABLE "icecream"."user" ADD COLUMN "expiresAt" timestamp;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "icecream"."orders" ADD CONSTRAINT "orders_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "icecream"."user"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "icecream"."payment_methods" ADD CONSTRAINT "payment_methods_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "icecream"."user"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
