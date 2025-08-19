import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Authentication - HomeFax.ai',
  description:
    'Sign in or create an account to access your HomeFax.ai insurance policy assistant.',
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
