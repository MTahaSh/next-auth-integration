CREATE TABLE IF NOT EXISTS "cortech_account" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text,
	"type" text,
	"provider" text,
	"provider_account_id" text,
	"refresh_token" text,
	"access_token" text,
	"expires_at" integer,
	"token_type" text,
	"scope" text,
	"id_token" text,
	"session_state" text,
	CONSTRAINT "cortech_account_provider_unique" UNIQUE("provider"),
	CONSTRAINT "cortech_account_provider_account_id_unique" UNIQUE("provider_account_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "cortech_auth" (
	"id" text PRIMARY KEY NOT NULL,
	"email" text,
	"email_verified" text,
	"username" text,
	"password" text,
	"role" text DEFAULT 'USER',
	CONSTRAINT "cortech_auth_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "cortech_verification" (
	"id" text PRIMARY KEY NOT NULL,
	"email" text,
	"token" text,
	"expires" text,
	CONSTRAINT "cortech_verification_email_unique" UNIQUE("email"),
	CONSTRAINT "cortech_verification_token_unique" UNIQUE("token")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "cortech_account" ADD CONSTRAINT "cortech_account_user_id_cortech_auth_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."cortech_auth"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
