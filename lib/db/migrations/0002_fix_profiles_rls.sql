-- Fix RLS policies for profiles table to allow user registration

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view own profile" ON "profiles";
DROP POLICY IF EXISTS "Users can update own profile" ON "profiles";

-- Allow users to insert their own profile during registration
CREATE POLICY "Users can insert own profile" ON "profiles"
FOR INSERT WITH CHECK (auth.uid() = id);

-- Allow users to view their own profile
CREATE POLICY "Users can view own profile" ON "profiles"
FOR SELECT USING (auth.uid() = id);

-- Allow users to update their own profile
CREATE POLICY "Users can update own profile" ON "profiles"
FOR UPDATE USING (auth.uid() = id);

-- Allow admins to view all profiles
CREATE POLICY "Admins can view all profiles" ON "profiles"
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM "profiles" 
    WHERE id = auth.uid() AND user_type = 'admin'
  )
);
