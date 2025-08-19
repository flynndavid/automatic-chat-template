'use server';

import { z } from 'zod';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

const authFormSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export interface LoginActionState {
  status: 'idle' | 'in_progress' | 'success' | 'failed' | 'invalid_data';
  message?: string;
}

export const login = async (
  _: LoginActionState,
  formData: FormData,
): Promise<LoginActionState> => {
  try {
    const validatedData = authFormSchema.parse({
      email: formData.get('email'),
      password: formData.get('password'),
    });

    const supabase = await createClient();

    const { error } = await supabase.auth.signInWithPassword({
      email: validatedData.email,
      password: validatedData.password,
    });

    if (error) {
      return {
        status: 'failed',
        message: error.message,
      };
    }

    return { status: 'success' };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { status: 'invalid_data' };
    }

    return {
      status: 'failed',
      message: 'An unexpected error occurred',
    };
  }
};

export interface RegisterActionState {
  status:
    | 'idle'
    | 'in_progress'
    | 'success'
    | 'failed'
    | 'user_exists'
    | 'invalid_data';
  message?: string;
}

export const register = async (
  _: RegisterActionState,
  formData: FormData,
): Promise<RegisterActionState> => {
  try {
    const validatedData = authFormSchema.parse({
      email: formData.get('email'),
      password: formData.get('password'),
    });

    const supabase = await createClient();

    // Determine the base URL for email redirects
    const baseUrl =
      process.env.NEXT_PUBLIC_SITE_URL ||
      (process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : 'http://localhost:3000');

    // Sign up the user
    const { data, error } = await supabase.auth.signUp({
      email: validatedData.email,
      password: validatedData.password,
      options: {
        emailRedirectTo: `${baseUrl}/auth/callback`,
      },
    });

    if (error) {
      if (error.message.includes('already registered')) {
        return {
          status: 'user_exists',
          message: 'User already exists',
        };
      }
      return {
        status: 'failed',
        message: error.message,
      };
    }

    // Check if user needs email confirmation
    if (data.user && !data.session) {
      // User created but needs email confirmation
      return {
        status: 'success',
        message:
          'Account created! Please check your email to confirm your account before signing in.',
      };
    }

    // Create profile record if user was created successfully and confirmed
    if (data.user) {
      const { error: profileError } = await supabase.from('profiles').insert({
        id: data.user.id,
        email: validatedData.email,
        user_type: 'regular',
      });

      if (profileError) {
        console.error('Failed to create profile:', profileError);
        // Don't fail registration if profile creation fails, user can still sign in
      }

      // If user is immediately confirmed and we have a session, redirect
      if (data.session) {
        redirect('/');
      }
    }

    return { status: 'success' };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { status: 'invalid_data' };
    }

    return {
      status: 'failed',
      message: 'An unexpected error occurred',
    };
  }
};

export const signOut = async () => {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect('/login');
};

// Quick login for development/demo purposes - policyholder accounts
export interface QuickLoginActionState {
  status: 'idle' | 'in_progress' | 'success' | 'failed';
  message?: string;
}

export const quickLogin = async (
  _: QuickLoginActionState,
  formData: FormData,
): Promise<QuickLoginActionState> => {
  try {
    const email = formData.get('email') as string;

    // Only allow demo policyholder accounts
    const allowedEmails = [
      'morgan.ortiz1@example.com',
      'elliot.iverson2@example.com',
      'jordan.evans4@example.com',
      'morgan.cooper5@example.com',
      'rowan.turner6@example.com',
    ];

    if (!allowedEmails.includes(email)) {
      return {
        status: 'failed',
        message: 'Invalid demo account',
      };
    }

    const supabase = await createClient();

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password: 'demo123', // All demo accounts use this password
    });

    if (error) {
      return {
        status: 'failed',
        message: error.message,
      };
    }

    return { status: 'success' };
  } catch (error) {
    return {
      status: 'failed',
      message: 'An unexpected error occurred',
    };
  }
};
