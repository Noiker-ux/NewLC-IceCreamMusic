ALTER TABLE "icecream"."user" ADD COLUMN "isVerifiedAuthor" boolean DEFAULT false;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "icecream"."release" ADD CONSTRAINT "release_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "icecream"."user"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "icecream"."verification" ADD CONSTRAINT "verification_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "icecream"."user"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
