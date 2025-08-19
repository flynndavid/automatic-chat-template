'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/toast';
import { createClient } from '@/lib/supabase/client';

interface EmailConfirmationPendingProps {
  email: string;
  onBackToLogin?: () => void;
}

export function EmailConfirmationPending({
  email,
  onBackToLogin,
}: EmailConfirmationPendingProps) {
  const [isResending, setIsResending] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(false);

  const handleResendEmail = async () => {
    if (resendCooldown) {
      toast({
        type: 'error',
        description: 'Please wait a moment before requesting another email.',
      });
      return;
    }

    setIsResending(true);

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        toast({
          type: 'error',
          description: error.message || 'Failed to resend confirmation email.',
        });
      } else {
        toast({
          type: 'success',
          description: 'Confirmation email sent! Please check your inbox.',
        });

        // Set cooldown to prevent spam
        setResendCooldown(true);
        setTimeout(() => setResendCooldown(false), 60000); // 1 minute cooldown
      }
    } catch (error) {
      toast({
        type: 'error',
        description: 'An unexpected error occurred. Please try again.',
      });
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="flex h-dvh w-screen items-center justify-center bg-background">
      <div className="w-full max-w-md overflow-hidden rounded-2xl flex flex-col gap-12">
        <div className="flex flex-col items-center justify-center gap-6 px-4 text-center sm:px-16">
          {/* Email Icon */}
          <div className="relative w-20 h-20 mt-4">
            <div className="w-20 h-20 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
              <svg
                className="w-10 h-10 text-blue-600 dark:text-blue-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                />
              </svg>
            </div>
            <div className="absolute -top-1 -right-1">
              <span className="flex h-6 w-6">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-6 w-6 bg-blue-500" />
              </span>
            </div>
          </div>

          {/* Title and Description */}
          <div className="space-y-2">
            <h3 className="text-2xl font-semibold dark:text-zinc-50">
              Check Your Email
            </h3>
            <p className="text-sm text-gray-500 dark:text-zinc-400">
              We&apos;ve sent a confirmation email to:
            </p>
            <p className="text-sm font-medium text-gray-800 dark:text-zinc-200 break-all">
              {email}
            </p>
          </div>

          {/* Instructions */}
          <p className="text-sm text-gray-600 dark:text-zinc-400">
            Please click the link in the email to confirm your account and get
            started with HomeFax.
          </p>

          {/* Actions */}
          <div className="flex flex-col gap-3 w-full">
            <Button
              onClick={handleResendEmail}
              disabled={isResending || resendCooldown}
              variant="outline"
              className="w-full"
            >
              {isResending ? (
                <>
                  <div className="w-4 h-4 border-2 border-gray-600 border-t-transparent rounded-full animate-spin mr-2" />
                  Sending...
                </>
              ) : resendCooldown ? (
                'Email sent - check your inbox'
              ) : (
                'Resend confirmation email'
              )}
            </Button>

            {onBackToLogin && (
              <Button
                onClick={onBackToLogin}
                variant="ghost"
                className="w-full"
              >
                Back to login
              </Button>
            )}
          </div>

          {/* Help text */}
          <div className="space-y-2">
            <p className="text-xs text-gray-500 dark:text-zinc-500">
              Can&apos;t find the email? Check your spam folder.
            </p>
            <p className="text-xs text-gray-500 dark:text-zinc-500">
              Having trouble? Contact{' '}
              <a
                href="mailto:support@homefax.ai"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                support@homefax.ai
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
