import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

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
