'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  useActionState,
  useEffect,
  useState,
  Suspense,
  startTransition,
} from 'react';
import { toast } from '@/components/toast';

import { AuthForm } from '@/components/auth-form';
import { SubmitButton } from '@/components/submit-button';

import {
  login,
  quickLogin,
  type LoginActionState,
  type QuickLoginActionState,
} from '../actions';

function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState('');
  const [isSuccessful, setIsSuccessful] = useState(false);
  const [isProcessingCode, setIsProcessingCode] = useState(false);
  const [showQuickLogin, setShowQuickLogin] = useState(false);

  const [state, formAction] = useActionState<LoginActionState, FormData>(
    login,
    {
      status: 'idle',
    },
  );

  const [quickLoginState, quickLoginAction] = useActionState<
    QuickLoginActionState,
    FormData
  >(quickLogin, {
    status: 'idle',
  });

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

  useEffect(() => {
    if (quickLoginState.status === 'failed') {
      toast({
        type: 'error',
        description: quickLoginState.message || 'Quick login failed!',
      });
    } else if (quickLoginState.status === 'success') {
      setIsSuccessful(true);
      router.push('/');
      router.refresh();
    }
  }, [quickLoginState.status, quickLoginState.message, router]);

  // Close popup with Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && showQuickLogin) {
        setShowQuickLogin(false);
      }
    };

    if (showQuickLogin) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [showQuickLogin]);

  const handleSubmit = (formData: FormData) => {
    setEmail(formData.get('email') as string);
    formAction(formData);
  };

  const handleQuickLogin = (email: string) => {
    startTransition(() => {
      const formData = new FormData();
      formData.append('email', email);
      quickLoginAction(formData);
    });
  };

  // Sample users data for quick login buttons
  const sampleUsers = [
    {
      name: 'Morgan Ortiz',
      email: 'morgan.ortiz1@example.com',
      policies: 'PCA005, PTN001',
    },
    {
      name: 'Elliot Iverson',
      email: 'elliot.iverson2@example.com',
      policies: 'PCA006, PTN002',
    },
    {
      name: 'Jordan Evans',
      email: 'jordan.evans4@example.com',
      policies: 'PCA008, PTN004',
    },
    {
      name: 'Morgan Cooper',
      email: 'morgan.cooper5@example.com',
      policies: 'PCA009, PTN005',
    },
    {
      name: 'Rowan Turner',
      email: 'rowan.turner6@example.com',
      policies: 'PTN006, PCA010',
    },
  ];

  // Show loading state when processing email confirmation
  if (isProcessingCode) {
    return (
      <div className="flex h-dvh w-screen items-start pt-12 md:pt-0 md:items-center justify-center bg-background">
        <div className="w-full max-w-md overflow-hidden rounded-2xl flex flex-col gap-12">
          <div className="flex flex-col items-center justify-center gap-2 px-4 text-center sm:px-16">
            <div className="size-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4" />
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

          {/* Demo accounts button */}
          <div className="text-center mt-4">
            <button
              type="button"
              onClick={() => setShowQuickLogin(true)}
              className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-zinc-800 dark:text-zinc-300 dark:border-zinc-600 dark:hover:bg-zinc-700 dark:focus:ring-blue-400 transition-colors"
            >
              <svg
                className="size-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"
                />
              </svg>
              Demo Accounts
            </button>
          </div>
        </AuthForm>

        {/* Quick Login Popup */}
        {showQuickLogin && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-xl max-w-md w-full max-h-[80vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-zinc-100">
                    Demo Policyholders
                  </h3>
                  <button
                    type="button"
                    onClick={() => setShowQuickLogin(false)}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-zinc-300 text-xl"
                  >
                    ×
                  </button>
                </div>

                <p className="text-sm text-gray-600 dark:text-zinc-400 mb-4">
                  Click any user below to instantly log in as that policyholder
                  and access their policy data.
                </p>

                <div className="space-y-2">
                  {sampleUsers.map((user) => (
                    <button
                      key={user.email}
                      type="button"
                      onClick={() => {
                        handleQuickLogin(user.email);
                        setShowQuickLogin(false);
                      }}
                      disabled={quickLoginState.status === 'in_progress'}
                      className="w-full text-left p-3 bg-gray-50 dark:bg-zinc-700 border border-gray-200 dark:border-zinc-600 rounded-md hover:bg-gray-100 dark:hover:bg-zinc-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-medium text-sm text-gray-900 dark:text-zinc-100">
                            {user.name}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-zinc-400">
                            {user.email}
                          </div>
                          <div className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                            Policies: {user.policies}
                          </div>
                        </div>
                        <div className="text-xs text-gray-400 dark:text-zinc-500">
                          Click to login
                        </div>
                      </div>
                    </button>
                  ))}
                </div>

                <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md">
                  <p className="text-xs text-blue-700 dark:text-blue-300">
                    <strong>Password:</strong> demo123 (for all accounts)
                  </p>
                  <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                    Each user has access to their own policy data and can ask
                    questions about coverage, claims, and property details.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
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
