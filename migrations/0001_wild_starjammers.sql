DROP TABLE "icecream"."account";--> statement-breakpoint
DROP TABLE "icecream"."authenticator";--> statement-breakpoint
DROP TABLE "icecream"."session";--> statement-breakpoint
DROP TABLE "icecream"."verificationToken";--> statement-breakpoint
ALTER TABLE "icecream"."user" RENAME COLUMN "image" TO "avatar";--> statement-breakpoint
ALTER TABLE "icecream"."user" ALTER COLUMN "name" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "icecream"."user" ADD COLUMN "password" text;