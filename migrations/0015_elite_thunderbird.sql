ALTER TABLE "icecream"."orders" ALTER COLUMN "id" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "icecream"."orders" ALTER COLUMN "confirmed" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "icecream"."payment_methods" ALTER COLUMN "id" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "icecream"."release" ALTER COLUMN "confirmed" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "icecream"."user" ALTER COLUMN "isVerifiedAuthor" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "icecream"."user" ALTER COLUMN "isAdmin" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "icecream"."user" ALTER COLUMN "isSuperUser" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "icecream"."user" ALTER COLUMN "isSubscribed" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "icecream"."verification" ALTER COLUMN "status" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "icecream"."payment_methods" ADD COLUMN "isDefault" boolean DEFAULT false NOT NULL;