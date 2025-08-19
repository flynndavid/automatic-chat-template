DO $$ BEGIN
 CREATE TYPE "public"."contact_type" AS ENUM('agent', 'lsr', 'sr', 'adjuster', 'manager');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "agencies" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"agency_code" text NOT NULL,
	"subscription_tier" text DEFAULT 'basic',
	"subscription_status" text DEFAULT 'active',
	"onboarding_config" jsonb DEFAULT '{}'::jsonb,
	"routing_preferences" jsonb DEFAULT '{}'::jsonb,
	"active_policies_count" integer DEFAULT 0,
	"billing_info" jsonb DEFAULT '{}'::jsonb,
	"primary_contact_email" text,
	"primary_contact_phone" text,
	"address" jsonb DEFAULT '{}'::jsonb,
	"ezlynx_credentials" jsonb DEFAULT '{}'::jsonb,
	"calendar_integration" jsonb DEFAULT '{}'::jsonb,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "agencies_agency_code_key" UNIQUE("agency_code")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Chat" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"title" text NOT NULL,
	"userId" uuid NOT NULL,
	"visibility" varchar DEFAULT 'private' NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Document" (
	"id" uuid DEFAULT gen_random_uuid() NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"title" text NOT NULL,
	"content" text,
	"kind" varchar DEFAULT 'text' NOT NULL,
	"userId" uuid NOT NULL,
	CONSTRAINT "Document_pkey" PRIMARY KEY("id","createdAt")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "insurance_carriers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"carrier_code" text NOT NULL,
	"billing_portal_url" text,
	"claims_portal_url" text,
	"coi_portal_url" text,
	"id_card_portal_url" text,
	"contact_info" jsonb DEFAULT '{}'::jsonb,
	"supported_states" text[] DEFAULT '{""}',
	"ezlynx_integration" jsonb DEFAULT '{}'::jsonb,
	"api_endpoints" jsonb DEFAULT '{}'::jsonb,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "insurance_carriers_carrier_code_key" UNIQUE("carrier_code")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "insurance_contacts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"agency_id" uuid,
	"contact_type" "contact_type" NOT NULL,
	"first_name" text NOT NULL,
	"last_name" text NOT NULL,
	"email" text NOT NULL,
	"phone" text,
	"license_number" text,
	"states_licensed" text[] DEFAULT '{""}',
	"calendar_link" text,
	"specializations" text[] DEFAULT '{""}',
	"availability_schedule" jsonb DEFAULT '{}'::jsonb,
	"routing_priority" integer DEFAULT 1,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Message" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"chatId" uuid NOT NULL,
	"role" varchar NOT NULL,
	"content" jsonb NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Message_v2" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"chatId" uuid NOT NULL,
	"role" varchar NOT NULL,
	"parts" jsonb NOT NULL,
	"attachments" jsonb NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "policies" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"policy_number" text NOT NULL,
	"carrier" text NOT NULL,
	"policy_type" text DEFAULT 'homeowners' NOT NULL,
	"policy_period" jsonb NOT NULL,
	"status" text DEFAULT 'active' NOT NULL,
	"property" jsonb NOT NULL,
	"coverages" jsonb NOT NULL,
	"deductibles" jsonb,
	"endorsements" jsonb DEFAULT '[]'::jsonb,
	"premium" jsonb NOT NULL,
	"mortgagees" jsonb DEFAULT '[]'::jsonb,
	"agent" jsonb,
	"documents" jsonb DEFAULT '[]'::jsonb,
	"state_specific" jsonb DEFAULT '{}'::jsonb,
	"raw_data" jsonb,
	"data_source" text,
	"ingestion_metadata" jsonb DEFAULT '{}'::jsonb,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	"policyholder_id" uuid,
	"carrier_id" uuid,
	"agency_id" uuid,
	CONSTRAINT "policies_policy_number_key" UNIQUE("policy_number")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "policy_search" (
	"id" uuid,
	"policy_number" text,
	"carrier" text,
	"status" text,
	"holder_id" text,
	"searchable_text" text,
	"first_name" text,
	"last_name" text,
	"email" text,
	"mailing_address" jsonb,
	"property" jsonb,
	"coverages" jsonb,
	"endorsements" jsonb,
	"premium" jsonb,
	"raw_data" jsonb
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "policy_summary" (
	"id" uuid,
	"policy_number" text,
	"carrier" text,
	"policy_type" text,
	"status" text,
	"first_name" text,
	"last_name" text,
	"email" text,
	"holder_id" text,
	"property_address" text,
	"property_city" text,
	"property_state" text,
	"property_zip" text,
	"effective_date" date,
	"expiration_date" date,
	"annual_premium" numeric,
	"dwelling_coverage" text,
	"created_at" timestamp with time zone,
	"updated_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "policyholders" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"holder_id" text NOT NULL,
	"first_name" text NOT NULL,
	"last_name" text NOT NULL,
	"date_of_birth" date NOT NULL,
	"email" text NOT NULL,
	"phone" text NOT NULL,
	"mailing_address" jsonb NOT NULL,
	"additional_info" jsonb DEFAULT '{}'::jsonb,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "policyholders_holder_id_key" UNIQUE("holder_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Stream" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"chatId" uuid NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Suggestion" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"documentId" uuid NOT NULL,
	"documentCreatedAt" timestamp NOT NULL,
	"originalText" text NOT NULL,
	"suggestedText" text NOT NULL,
	"description" text,
	"isResolved" boolean DEFAULT false NOT NULL,
	"userId" uuid NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "User" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" varchar(64) NOT NULL,
	"password" varchar(64)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Vote" (
	"chatId" uuid NOT NULL,
	"messageId" uuid NOT NULL,
	"isUpvoted" boolean NOT NULL,
	CONSTRAINT "Vote_pkey" PRIMARY KEY("chatId","messageId")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Vote_v2" (
	"chatId" uuid NOT NULL,
	"messageId" uuid NOT NULL,
	"isUpvoted" boolean NOT NULL,
	CONSTRAINT "Vote_v2_pkey" PRIMARY KEY("chatId","messageId")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Chat" ADD CONSTRAINT "Chat_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Document" ADD CONSTRAINT "Document_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "insurance_contacts" ADD CONSTRAINT "insurance_contacts_agency_id_fkey" FOREIGN KEY ("agency_id") REFERENCES "public"."agencies"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Message" ADD CONSTRAINT "Message_chatId_fkey" FOREIGN KEY ("chatId") REFERENCES "public"."Chat"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Message_v2" ADD CONSTRAINT "Message_v2_chatId_fkey" FOREIGN KEY ("chatId") REFERENCES "public"."Chat"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "policies" ADD CONSTRAINT "policies_agency_id_fkey" FOREIGN KEY ("agency_id") REFERENCES "public"."agencies"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "policies" ADD CONSTRAINT "policies_carrier_id_fkey" FOREIGN KEY ("carrier_id") REFERENCES "public"."insurance_carriers"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "policies" ADD CONSTRAINT "policies_policyholder_id_fkey" FOREIGN KEY ("policyholder_id") REFERENCES "public"."policyholders"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Stream" ADD CONSTRAINT "Stream_chatId_fkey" FOREIGN KEY ("chatId") REFERENCES "public"."Chat"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Suggestion" ADD CONSTRAINT "Suggestion_documentId_documentCreatedAt_fkey" FOREIGN KEY ("documentId","documentCreatedAt") REFERENCES "public"."Document"("id","createdAt") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Suggestion" ADD CONSTRAINT "Suggestion_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Vote" ADD CONSTRAINT "Vote_chatId_fkey" FOREIGN KEY ("chatId") REFERENCES "public"."Chat"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Vote" ADD CONSTRAINT "Vote_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "public"."Message"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Vote_v2" ADD CONSTRAINT "Vote_v2_chatId_fkey" FOREIGN KEY ("chatId") REFERENCES "public"."Chat"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Vote_v2" ADD CONSTRAINT "Vote_v2_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "public"."Message_v2"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_agencies_code" ON "agencies" USING btree ("agency_code");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_agencies_subscription" ON "agencies" USING btree ("subscription_status");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_carriers_code" ON "insurance_carriers" USING btree ("carrier_code");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_carriers_states" ON "insurance_carriers" USING gin ("supported_states");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_contacts_active" ON "insurance_contacts" USING btree ("is_active");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_contacts_agency" ON "insurance_contacts" USING btree ("agency_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_contacts_email" ON "insurance_contacts" USING btree ("email");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_contacts_type" ON "insurance_contacts" USING btree ("contact_type");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_policies_agency" ON "policies" USING btree ("agency_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_policies_carrier" ON "policies" USING btree ("carrier");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_policies_coverages_gin" ON "policies" USING gin ("coverages");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_policies_data_source" ON "policies" USING btree ("data_source");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_policies_effective_date" ON "policies" USING btree ((policy_period ->> 'effective_date'::text));--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_policies_endorsements_gin" ON "policies" USING gin ("endorsements");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_policies_policy_number" ON "policies" USING btree ("policy_number");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_policies_policy_type" ON "policies" USING btree ("policy_type");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_policies_policyholder_id" ON "policies" USING btree ("policyholder_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_policies_premium_gin" ON "policies" USING gin ("premium");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_policies_property_gin" ON "policies" USING gin ("property");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_policies_state" ON "policies" USING btree (((property -> 'address'::text) ->> 'state'::text));--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_policies_status" ON "policies" USING btree ("status");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_policyholders_email" ON "policyholders" USING btree ("email");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_policyholders_holder_id" ON "policyholders" USING btree ("holder_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_policyholders_last_name" ON "policyholders" USING btree ("last_name");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_policyholders_mailing_address" ON "policyholders" USING gin ("mailing_address");