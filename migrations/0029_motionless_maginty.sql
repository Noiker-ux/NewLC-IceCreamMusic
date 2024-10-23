CREATE TABLE IF NOT EXISTS "icecream"."payouts" (
	"id" uuid PRIMARY KEY NOT NULL,
	"userId" uuid NOT NULL,
	"createdAt" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "icecream"."social_links" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"userId" uuid NOT NULL,
	"type" text NOT NULL,
	"link" text NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "icecream"."payouts" ADD CONSTRAINT "payouts_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "icecream"."user"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "icecream"."social_links" ADD CONSTRAINT "social_links_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "icecream"."user"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "icecream"."user" DROP COLUMN IF EXISTS "isSuperUser";