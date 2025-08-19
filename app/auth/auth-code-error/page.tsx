import Link from 'next/link';

interface AuthCodeErrorProps {
  searchParams: Promise<{ error?: string }>;
}

export default async function AuthCodeError({ searchParams }: AuthCodeErrorProps) {
  const { error } = await searchParams;

  const getErrorMessage = () => {
    switch (error) {
      case 'confirmation_failed':
        return 'Email confirmation failed. The link may have expired or already been used.';
      case 'unexpected':
        return 'An unexpected error occurred during email confirmation.';
      case 'no_code':
        return 'No confirmation code was provided.';
      default:
        return "Sorry, we couldn't confirm your email. The link may have expired or already been used.";
    }
  };

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-background">
      <div className="w-full max-w-md overflow-hidden rounded-2xl flex flex-col gap-12">
        <div className="flex flex-col items-center justify-center gap-2 px-4 text-center sm:px-16">
          <h3 className="text-xl font-semibold dark:text-zinc-50">
            Authentication Error
          </h3>
          <p className="text-sm text-gray-500 dark:text-zinc-400">
            {getErrorMessage()}
          </p>
          <div className="flex flex-col gap-2 mt-4">
            <Link
              href="/register"
              className="text-sm font-semibold text-blue-600 hover:underline dark:text-blue-400"
            >
              Try registering again
            </Link>
            <Link
              href="/login"
              className="text-sm font-semibold text-gray-800 hover:underline dark:text-zinc-200"
            >
              Already have an account? Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
