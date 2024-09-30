CREATE TABLE IF NOT EXISTS "icecream"."track" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"releaseId" uuid NOT NULL,
	"fileType" text NOT NULL,
	"title" text NOT NULL,
	"sibtitle" text NOT NULL,
	"isrc" text,
	"partner_code" text NOT NULL,
	"roles" jsonb,
	"preview_start" text NOT NULL,
	"date" timestamp,
	"focus" boolean DEFAULT false NOT NULL,
	"explicit" boolean DEFAULT false NOT NULL,
	"live" boolean DEFAULT false NOT NULL,
	"cover" boolean DEFAULT false NOT NULL,
	"remix" boolean DEFAULT false NOT NULL,
	"instrumental" boolean DEFAULT false NOT NULL,
	"language" text NOT NULL,
	"text" text,
	"track_version" jsonb,
	"text_sync" text,
	"ringtone" text,
	"video" text
);
--> statement-breakpoint
ALTER TABLE "icecream"."release" ADD COLUMN "status" "icecream"."verification_status" DEFAULT 'moderating' NOT NULL;--> statement-breakpoint
ALTER TABLE "icecream"."release" ADD COLUMN "rejectReason" text NOT NULL;--> statement-breakpoint
ALTER TABLE "icecream"."verification" ADD COLUMN "rejectReason" text;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "icecream"."track" ADD CONSTRAINT "track_releaseId_release_id_fk" FOREIGN KEY ("releaseId") REFERENCES "icecream"."release"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "icecream"."release" DROP COLUMN IF EXISTS "track";