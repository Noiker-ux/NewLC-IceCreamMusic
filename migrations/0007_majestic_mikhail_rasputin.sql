CREATE TABLE IF NOT EXISTS "icecream"."subscriptions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"userId" uuid NOT NULL,
	"subscribeLevel" text NOT NULL,
	"createdAt" timestamp NOT NULL,
	"expiresAt" timestamp NOT NULL
);
--> statement-breakpoint
DROP TABLE "icecream"."genre";--> statement-breakpoint
DROP TABLE "icecream"."releaseType";--> statement-breakpoint
DROP TABLE "icecream"."version";--> statement-breakpoint
ALTER TABLE "icecream"."user" ADD COLUMN "isAdmin" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "icecream"."user" ADD COLUMN "isSuperUser" boolean DEFAULT false;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "icecream"."subscriptions" ADD CONSTRAINT "subscriptions_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "icecream"."user"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
