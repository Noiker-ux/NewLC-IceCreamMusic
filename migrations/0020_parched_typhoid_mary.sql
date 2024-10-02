ALTER TABLE "icecream"."track" RENAME COLUMN "track_version" TO "track";--> statement-breakpoint
ALTER TABLE "icecream"."track" ALTER COLUMN "partner_code" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "icecream"."track" ALTER COLUMN "language" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "icecream"."track" ALTER COLUMN "track" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "icecream"."track" DROP COLUMN IF EXISTS "fileType";