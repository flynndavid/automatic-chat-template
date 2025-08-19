CREATE TABLE IF NOT EXISTS "profiles" (
	"id" uuid PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"user_type" text DEFAULT 'regular',
	"agency_id" uuid,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
DROP TABLE "User";--> statement-breakpoint
ALTER TABLE "Chat" DROP CONSTRAINT "Chat_userId_fkey";
--> statement-breakpoint
ALTER TABLE "Document" DROP CONSTRAINT "Document_userId_fkey";
--> statement-breakpoint
ALTER TABLE "Suggestion" DROP CONSTRAINT "Suggestion_userId_fkey";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "profiles" ADD CONSTRAINT "profiles_agency_id_agencies_id_fk" FOREIGN KEY ("agency_id") REFERENCES "public"."agencies"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_profiles_email" ON "profiles" USING btree ("email");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_profiles_agency" ON "profiles" USING btree ("agency_id");