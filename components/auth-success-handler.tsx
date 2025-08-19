'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { toast } from '@/components/toast';

export function AuthSuccessHandler() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const confirmed = searchParams.get('confirmed');
    if (confirmed === 'true') {
      toast({
        type: 'success',
        description: 'Email confirmed successfully! Welcome to HomeFax!',
      });

      // Clean up the URL by removing the confirmation parameter
      const url = new URL(window.location.href);
      url.searchParams.delete('confirmed');
      window.history.replaceState({}, '', url.toString());
    }
  }, [searchParams]);

  return null;
}
