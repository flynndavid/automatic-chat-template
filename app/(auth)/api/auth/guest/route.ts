import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const redirectUrl = searchParams.get('redirectUrl') || '/';

  const supabase = await createClient();

  // Check if user already has a session
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    // User already authenticated, just redirect
    return NextResponse.redirect(new URL(redirectUrl, request.url));
  }

  // Create anonymous guest user
  const { data, error } = await supabase.auth.signInAnonymously();

  if (error) {
    console.error('Guest auth error:', error);
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (data.user) {
    // Create guest profile
    await supabase.from('profiles').upsert({
      id: data.user.id,
      email: `guest_${data.user.id}@example.com`,
      user_type: 'guest',
    });
  }

  return NextResponse.redirect(new URL(redirectUrl, request.url));
}
