-- Enable RLS on policyholders and policies tables for user data isolation

-- Enable Row Level Security on policyholders table
ALTER TABLE "policyholders" ENABLE ROW LEVEL SECURITY;

-- Enable Row Level Security on policies table  
ALTER TABLE "policies" ENABLE ROW LEVEL SECURITY;

-- Policyholder access policies: Users can only access their own linked policyholder data
CREATE POLICY "Users can view own policyholder data" ON "policyholders"
  FOR SELECT 
  USING (profile_id = auth.uid());

CREATE POLICY "Users can update own policyholder data" ON "policyholders"
  FOR UPDATE 
  USING (profile_id = auth.uid());

-- Policy access policies: Users can access policies linked to their policyholder
CREATE POLICY "Users can view own policies" ON "policies"
  FOR SELECT 
  USING (
    policyholder_id IN (
      SELECT id FROM "policyholders" 
      WHERE profile_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own policies" ON "policies"
  FOR UPDATE 
  USING (
    policyholder_id IN (
      SELECT id FROM "policyholders" 
      WHERE profile_id = auth.uid()
    )
  );

-- Agency staff access: Allow agency members to view policies/policyholders in their agency
CREATE POLICY "Agency staff can view agency policyholders" ON "policyholders"
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM "profiles" p
      JOIN "policies" pol ON pol.policyholder_id = "policyholders".id
      WHERE p.id = auth.uid() 
        AND p.user_type IN ('admin', 'agent', 'staff')
        AND pol.agency_id = p.agency_id
    )
  );

CREATE POLICY "Agency staff can view agency policies" ON "policies"
  FOR SELECT 
  USING (
    agency_id IN (
      SELECT agency_id FROM "profiles" 
      WHERE id = auth.uid() 
        AND user_type IN ('admin', 'agent', 'staff')
        AND agency_id IS NOT NULL
    )
  );

-- System admin access: Allow admins to access all records
CREATE POLICY "Admins can access all policyholders" ON "policyholders"
  FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM "profiles" 
      WHERE id = auth.uid() AND user_type = 'admin'
    )
  );

CREATE POLICY "Admins can access all policies" ON "policies"
  FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM "profiles" 
      WHERE id = auth.uid() AND user_type = 'admin'
    )
  );
