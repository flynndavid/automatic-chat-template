import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Authentication - AI Assistant',
  description:
    'Sign in or create an account to access your AI assistant.',
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
