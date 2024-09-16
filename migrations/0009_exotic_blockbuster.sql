DO $$ BEGIN
 CREATE TYPE "icecream"."release_type" AS ENUM('single', 'album', 'ep');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "icecream"."release" DROP COLUMN IF EXISTS "type";