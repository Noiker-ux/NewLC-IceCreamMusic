ALTER TABLE "icecream"."orders" ADD COLUMN "confirmed" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "icecream"."payment_methods" DROP COLUMN IF EXISTS "confirmed";