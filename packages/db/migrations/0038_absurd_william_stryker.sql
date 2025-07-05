CREATE TYPE "icecream"."studio_photo_types" AS ENUM('team_photo', 'studio_photo');--> statement-breakpoint
CREATE TABLE "icecream"."analytics" (
	"id" uuid PRIMARY KEY NOT NULL,
	"userId" uuid NOT NULL,
	"periodStart" timestamp NOT NULL,
	"periodFinish" timestamp NOT NULL,
	"reportFileUrl" text,
	"flourishReportMarkup" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "icecream"."promo_links" (
	"id" uuid PRIMARY KEY NOT NULL,
	"shortName" text NOT NULL,
	"releaseId" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "icecream"."promo_urls" (
	"id" uuid PRIMARY KEY NOT NULL,
	"url" text NOT NULL,
	"promoLinkId" uuid
);
--> statement-breakpoint
CREATE TABLE "icecream"."studio_photos" (
	"id" uuid PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"type" "icecream"."studio_photo_types" NOT NULL,
	"url" text NOT NULL,
	"studioId" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "icecream"."studios" (
	"id" uuid PRIMARY KEY NOT NULL,
	"logo" text NOT NULL,
	"name" text NOT NULL,
	"rating" smallint DEFAULT 0 NOT NULL,
	"address" text NOT NULL,
	"description" text,
	"yearsOld" smallint,
	"number_of_releases" integer
);
--> statement-breakpoint
ALTER TABLE "icecream"."news" RENAME COLUMN "announcement" TO "preview";--> statement-breakpoint
ALTER TABLE "icecream"."payouts" ADD COLUMN "recieverName" text;--> statement-breakpoint
ALTER TABLE "icecream"."payouts" ADD COLUMN "amount" double precision;--> statement-breakpoint
ALTER TABLE "icecream"."release" ADD COLUMN "earlyStartInRussia" boolean;--> statement-breakpoint
ALTER TABLE "icecream"."release" ADD COLUMN "realTimeDelivery" boolean;--> statement-breakpoint
ALTER TABLE "icecream"."release" ADD COLUMN "yandexSoonNewRelease" timestamp;--> statement-breakpoint
ALTER TABLE "icecream"."analytics" ADD CONSTRAINT "analytics_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "icecream"."user"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "icecream"."promo_links" ADD CONSTRAINT "promo_links_releaseId_release_id_fk" FOREIGN KEY ("releaseId") REFERENCES "icecream"."release"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "icecream"."promo_urls" ADD CONSTRAINT "promo_urls_promoLinkId_promo_links_id_fk" FOREIGN KEY ("promoLinkId") REFERENCES "icecream"."promo_links"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "icecream"."studio_photos" ADD CONSTRAINT "studio_photos_studioId_studios_id_fk" FOREIGN KEY ("studioId") REFERENCES "icecream"."studios"("id") ON DELETE cascade ON UPDATE cascade;