CREATE TABLE IF NOT EXISTS "icecream"."faq" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"question" text NOT NULL,
	"answer" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "icecream"."genre" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "icecream"."news" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"content" text NOT NULL,
	"createdAt" timestamp DEFAULT now(),
	"announcement" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "icecream"."release" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"preview" text NOT NULL,
	"title" text NOT NULL,
	"date" timestamp NOT NULL,
	"upc" text NOT NULL,
	"track" text NOT NULL,
	"userId" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "icecream"."releaseType" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "icecream"."verification" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"userId" uuid NOT NULL,
	"firstName" text NOT NULL,
	"middleName" text NOT NULL,
	"lastName" text NOT NULL,
	"birthDate" timestamp NOT NULL,
	"birthPlace" text NOT NULL,
	"tel" text NOT NULL,
	"passSeries" text NOT NULL,
	"passNum" text NOT NULL,
	"getDate" timestamp NOT NULL,
	"givenBy" text NOT NULL,
	"subunitCode" text NOT NULL,
	"registrationAddress" text NOT NULL,
	"accountNumber" text NOT NULL,
	"bankName" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "icecream"."version" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL
);
