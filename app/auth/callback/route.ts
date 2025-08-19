import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import type { SupabaseClient } from '@supabase/supabase-js';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/';

  if (code) {
    const supabase = await createClient();

    try {
      const { data, error } = await supabase.auth.exchangeCodeForSession(code);

      if (error) {
        console.error('Email confirmation error:', error);
        return NextResponse.redirect(
          `${origin}/auth/auth-code-error?error=confirmation_failed`,
        );
      }

      if (data.user) {
        // Create profile if it doesn't exist (for email-confirmed users)
        const { error: profileError } = await supabase
          .from('profiles')
          .upsert({
            id: data.user.id,
            email: data.user.email || '',
            user_type: 'regular',
          })
          .select()
          .single();

        if (profileError) {
          console.error('Failed to create/update profile:', profileError);
          // Don't fail the whole flow for profile errors
        } else {
          // Auto-link user to existing policyholder or create new one
          await linkUserToPolicyholder(
            supabase,
            data.user.id,
            data.user.email || '',
          );
        }

        // Redirect to home page after successful confirmation
        const forwardedHost = request.headers.get('x-forwarded-host');
        const isLocalEnv = process.env.NODE_ENV === 'development';

        if (isLocalEnv) {
          return NextResponse.redirect(`${origin}/?confirmed=true`);
        } else if (forwardedHost) {
          return NextResponse.redirect(
            `https://${forwardedHost}/?confirmed=true`,
          );
        } else {
          return NextResponse.redirect(`${origin}/?confirmed=true`);
        }
      }
    } catch (error) {
      console.error('Unexpected error during email confirmation:', error);
      return NextResponse.redirect(
        `${origin}/auth/auth-code-error?error=unexpected`,
      );
    }
  }

  // Return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/auth/auth-code-error?error=no_code`);
}

/**
 * Links a newly confirmed user to an existing policyholder by email,
 * or creates a new policyholder record if none exists.
 */
async function linkUserToPolicyholder(
  supabase: SupabaseClient,
  userId: string,
  email: string,
): Promise<void> {
  try {
    // Check if user already has a linked policyholder
    const { data: existingLink } = await supabase
      .from('policyholders')
      .select('id')
      .eq('profile_id', userId)
      .maybeSingle();

    if (existingLink) {
      console.log(
        `User ${userId} already linked to policyholder ${existingLink.id}`,
      );
      return;
    }

    // Look for existing policyholder with matching email but no profile_id
    const { data: existingPolicyholder, error: lookupError } = await supabase
      .from('policyholders')
      .select('id, email, first_name, last_name')
      .eq('email', email)
      .is('profile_id', null)
      .maybeSingle();

    if (lookupError) {
      console.error('Error looking up existing policyholder:', lookupError);
      return;
    }

    if (existingPolicyholder) {
      // Link existing policyholder to this user profile
      const { error: linkError } = await supabase
        .from('policyholders')
        .update({ profile_id: userId })
        .eq('id', existingPolicyholder.id);

      if (linkError) {
        console.error('Error linking existing policyholder:', linkError);
      } else {
        console.log(
          `Successfully linked user ${userId} to existing policyholder ${existingPolicyholder.id}`,
        );
      }
    } else {
      // No existing policyholder found - create a new one with basic info
      // Extract name from email if available, or use defaults
      const emailLocalPart = email.split('@')[0];
      const firstName = emailLocalPart.split('.')[0] || 'New';
      const lastName = emailLocalPart.split('.')[1] || 'User';

      const { error: createError } = await supabase
        .from('policyholders')
        .insert({
          holder_id: `USER_${userId.substring(0, 8)}`, // Generate unique holder_id
          first_name: firstName.charAt(0).toUpperCase() + firstName.slice(1),
          last_name: lastName.charAt(0).toUpperCase() + lastName.slice(1),
          email: email,
          phone: '', // Required field - will need to be updated by user
          date_of_birth: new Date('1900-01-01'), // Placeholder - will need to be updated
          mailing_address: {
            street: '',
            city: '',
            state: '',
            zip: '',
          },
          additional_info: {
            created_via: 'signup',
            needs_completion: true,
          },
          profile_id: userId,
        });

      if (createError) {
        console.error('Error creating new policyholder:', createError);
      } else {
        console.log(`Successfully created new policyholder for user ${userId}`);
      }
    }
  } catch (error) {
    console.error('Unexpected error in linkUserToPolicyholder:', error);
  }
}
