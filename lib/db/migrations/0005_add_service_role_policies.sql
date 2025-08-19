-- Add service role policies for n8n integration

-- Allow service role to access all policyholders (for n8n workflows)
CREATE POLICY "Service role can access all policyholders" ON "policyholders"
  FOR ALL 
  USING (
    -- Check if the current role is the service role
    current_setting('role') = 'service_role'
    OR
    -- Fallback: check if this is a service account request
    auth.jwt() ->> 'role' = 'service_role'
  );

-- Allow service role to access all policies (for n8n workflows)  
CREATE POLICY "Service role can access all policies" ON "policies"
  FOR ALL 
  USING (
    -- Check if the current role is the service role
    current_setting('role') = 'service_role'
    OR
    -- Fallback: check if this is a service account request
    auth.jwt() ->> 'role' = 'service_role'
  );
