-- Create profiles table for Supabase auth integration
CREATE TABLE IF NOT EXISTS "profiles" (
	"id" uuid PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"user_type" text DEFAULT 'regular',
	"agency_id" uuid REFERENCES "agencies"("id"),
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now()
);

-- Enable RLS on profiles table
ALTER TABLE "profiles" ENABLE ROW LEVEL SECURITY;

-- Profile access policies
CREATE POLICY "Users can view own profile" ON "profiles"
FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON "profiles"
FOR UPDATE USING (auth.uid() = id);

-- Update existing tables to reference auth.users
-- Update Chat table
ALTER TABLE "Chat" 
ALTER COLUMN "userId" TYPE uuid USING "userId"::uuid;

-- Update Document table  
ALTER TABLE "Document"
ALTER COLUMN "userId" TYPE uuid USING "userId"::uuid;

-- Enable RLS on existing tables
ALTER TABLE "Chat" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Document" ENABLE ROW LEVEL SECURITY;

-- Chat access policies
CREATE POLICY "Users can access own chats" ON "Chat"
FOR ALL USING (auth.uid()::text = "userId"::text);

-- Document access policies  
CREATE POLICY "Users can access own documents" ON "Document"
FOR ALL USING (auth.uid()::text = "userId"::text);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS "idx_profiles_email" ON "profiles"("email");
CREATE INDEX IF NOT EXISTS "idx_profiles_agency" ON "profiles"("agency_id");
CREATE INDEX IF NOT EXISTS "idx_chat_user" ON "Chat"("userId");
CREATE INDEX IF NOT EXISTS "idx_document_user" ON "Document"("userId");
