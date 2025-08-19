'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useActionState, useEffect, useState, Suspense } from 'react';
import { toast } from '@/components/toast';

import { AuthForm } from '@/components/auth-form';
import { SubmitButton } from '@/components/submit-button';

import { login, type LoginActionState } from '../actions';

function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState('');
  const [isSuccessful, setIsSuccessful] = useState(false);
  const [isProcessingCode, setIsProcessingCode] = useState(false);

  const [state, formAction] = useActionState<LoginActionState, FormData>(
    login,
    {
      status: 'idle',
    },
  );

  // Redirect email confirmation codes to proper callback handler
  useEffect(() => {
    const code = searchParams.get('code');
    if (code && !isProcessingCode) {
      setIsProcessingCode(true);
      // Redirect to the proper server-side callback handler
      router.replace(`/auth/callback?code=${code}`);
    }
  }, [searchParams, router, isProcessingCode]);

  useEffect(() => {
    if (state.status === 'failed') {
      toast({
        type: 'error',
        description: state.message || 'Invalid credentials!',
      });
    } else if (state.status === 'invalid_data') {
      toast({
        type: 'error',
        description: 'Failed validating your submission!',
      });
    } else if (state.status === 'success') {
      setIsSuccessful(true);
      router.push('/');
      router.refresh();
    }
  }, [state.status, state.message, router]);

  const handleSubmit = (formData: FormData) => {
    setEmail(formData.get('email') as string);
    formAction(formData);
  };

  // Show loading state when processing email confirmation
  if (isProcessingCode) {
    return (
      <div className="flex h-dvh w-screen items-start pt-12 md:pt-0 md:items-center justify-center bg-background">
        <div className="w-full max-w-md overflow-hidden rounded-2xl flex flex-col gap-12">
          <div className="flex flex-col items-center justify-center gap-2 px-4 text-center sm:px-16">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4" />
            <h3 className="text-xl font-semibold dark:text-zinc-50">
              Confirming Email
            </h3>
            <p className="text-sm text-gray-500 dark:text-zinc-400">
              Please wait while we confirm your email address...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-dvh w-screen items-start pt-12 md:pt-0 md:items-center justify-center bg-background">
      <div className="w-full max-w-md overflow-hidden rounded-2xl flex flex-col gap-12">
        <div className="flex flex-col items-center justify-center gap-2 px-4 text-center sm:px-16">
          <h3 className="text-xl font-semibold dark:text-zinc-50">Sign In</h3>
          <p className="text-sm text-gray-500 dark:text-zinc-400">
            Use your email and password to sign in
          </p>
        </div>
        <AuthForm action={handleSubmit} defaultEmail={email}>
          <SubmitButton isSuccessful={isSuccessful}>Sign in</SubmitButton>
          <p className="text-center text-sm text-gray-600 mt-4 dark:text-zinc-400">
            {"Don't have an account? "}
            <Link
              href="/register"
              className="font-semibold text-gray-800 hover:underline dark:text-zinc-200"
            >
              Sign up
            </Link>
            {' for free.'}
          </p>
        </AuthForm>
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginPage />
    </Suspense>
  );
}
