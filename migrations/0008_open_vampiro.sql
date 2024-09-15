DO $$ BEGIN
 CREATE TYPE "icecream"."verification_status" AS ENUM('moderating', 'approved', 'rejected');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "icecream"."release" ALTER COLUMN "upc" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "icecream"."release" ADD COLUMN "language" text NOT NULL;--> statement-breakpoint
ALTER TABLE "icecream"."release" ADD COLUMN "subtitle" text NOT NULL;--> statement-breakpoint
ALTER TABLE "icecream"."release" ADD COLUMN "type" text NOT NULL;--> statement-breakpoint
ALTER TABLE "icecream"."release" ADD COLUMN "performer" text NOT NULL;--> statement-breakpoint
ALTER TABLE "icecream"."release" ADD COLUMN "feat" text;--> statement-breakpoint
ALTER TABLE "icecream"."release" ADD COLUMN "remixer" text;--> statement-breakpoint
ALTER TABLE "icecream"."release" ADD COLUMN "genre" text NOT NULL;--> statement-breakpoint
ALTER TABLE "icecream"."release" ADD COLUMN "labelName" text NOT NULL;--> statement-breakpoint
ALTER TABLE "icecream"."release" ADD COLUMN "startDate" timestamp NOT NULL;--> statement-breakpoint
ALTER TABLE "icecream"."release" ADD COLUMN "preorderDate" timestamp NOT NULL;--> statement-breakpoint
ALTER TABLE "icecream"."release" ADD COLUMN "platforms" jsonb;--> statement-breakpoint
ALTER TABLE "icecream"."release" ADD COLUMN "area" jsonb;--> statement-breakpoint
ALTER TABLE "icecream"."verification" ADD COLUMN "status" "icecream"."verification_status" DEFAULT 'moderating';