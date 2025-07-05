CREATE TABLE "icecream"."accounts" (
	"user_id" uuid NOT NULL,
	"type" varchar(16) NOT NULL,
	"provider" varchar(256) NOT NULL,
	"provider_ccount_id" varchar(256) NOT NULL,
	"refresh_token" varchar(256),
	"access_token" varchar(256),
	"expires_at" timestamp,
	"token_type" varchar(256),
	"scope" varchar(256),
	"id_token" varchar(256),
	"session_state" varchar(256)
);
--> statement-breakpoint
CREATE TABLE "icecream"."sessions" (
	"session_token" varchar(128) PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"expires" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "icecream"."verification_tokens" (
	"user_id" uuid NOT NULL,
	"token" text PRIMARY KEY NOT NULL,
	"expires" timestamp NOT NULL
);
--> statement-breakpoint
ALTER TABLE "icecream"."user" ALTER COLUMN "password" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "icecream"."accounts" ADD CONSTRAINT "accounts_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "icecream"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "icecream"."sessions" ADD CONSTRAINT "sessions_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "icecream"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "icecream"."verification_tokens" ADD CONSTRAINT "verification_tokens_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "icecream"."user"("id") ON DELETE cascade ON UPDATE no action;