ALTER TABLE "icecream"."payouts" ADD COLUMN "confirmed" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "icecream"."user" ADD COLUMN "balance" double precision DEFAULT 0 NOT NULL;