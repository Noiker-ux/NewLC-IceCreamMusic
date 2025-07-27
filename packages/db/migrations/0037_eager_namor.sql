CREATE TYPE "icecream"."token_types" AS ENUM('confirm', 'recover');--> statement-breakpoint
ALTER TABLE "icecream"."verification_tokens" ADD COLUMN "type" "icecream"."token_types" NOT NULL;