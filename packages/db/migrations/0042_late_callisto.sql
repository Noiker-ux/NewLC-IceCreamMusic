CREATE TABLE "icecream"."studio_stats" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"studioId" uuid NOT NULL,
	"name" text NOT NULL,
	"value" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "icecream"."studio_team" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"studioId" uuid NOT NULL,
	"photo" text NOT NULL,
	"name" text NOT NULL,
	"position" text NOT NULL,
	"place" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "icecream"."studio_stats" ADD CONSTRAINT "studio_stats_studioId_studios_id_fk" FOREIGN KEY ("studioId") REFERENCES "icecream"."studios"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "icecream"."studio_team" ADD CONSTRAINT "studio_team_studioId_studios_id_fk" FOREIGN KEY ("studioId") REFERENCES "icecream"."studios"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "icecream"."studio_photos" DROP COLUMN "type";--> statement-breakpoint
ALTER TABLE "icecream"."studios" DROP COLUMN "yearsOld";--> statement-breakpoint
ALTER TABLE "icecream"."studios" DROP COLUMN "number_of_releases";--> statement-breakpoint
DROP TYPE "icecream"."studio_photo_types";