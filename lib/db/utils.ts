// Note: Password hashing is now handled by Supabase Auth
// These functions are kept for backward compatibility during migration

export function generateHashedPassword(password: string) {
  // This function is deprecated - Supabase handles password hashing
  throw new Error('Password hashing is now handled by Supabase Auth');
}

export function generateDummyPassword() {
  // This function is deprecated - no longer needed with Supabase Auth
  throw new Error('Dummy passwords are no longer needed with Supabase Auth');
}
