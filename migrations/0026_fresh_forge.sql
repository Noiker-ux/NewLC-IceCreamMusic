ALTER TABLE "icecream"."release" ALTER COLUMN "performer" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "icecream"."release" ALTER COLUMN "labelName" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "icecream"."track" ALTER COLUMN "subtitle" DROP NOT NULL;