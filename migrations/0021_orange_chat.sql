DO $$ BEGIN
 CREATE TYPE "icecream"."release_status" AS ENUM('moderating', 'approved', 'rejected', 'not_paid');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "icecream"."release" ALTER COLUMN "rejectReason" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "icecream"."track" ADD COLUMN "video_shot" text;--> statement-breakpoint
ALTER TABLE "icecream"."user" ADD COLUMN "freeReleases" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "icecream"."release" DROP COLUMN IF EXISTS "status";