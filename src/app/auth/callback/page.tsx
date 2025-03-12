'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();
    
    const handleCallback = async () => {
      try {
        // Try to get session from URL
        const { error } = await supabase.auth.exchangeCodeForSession(window.location.search);
        
        if (error) {
          console.error('Error exchanging code for session:', error);
          throw error;
        }

        // Get the session
        const { data: { session } } = await supabase.auth.getSession();
        
        // If we have a session, redirect to home page
        if (session) {
          router.push('/');
        }
      } catch (error) {
        console.error('Error in auth callback:', error);
        router.push('/auth?error=Could not authenticate user');
      }
    };

    handleCallback();
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h2 className="text-xl font-semibold mb-2">Signing you in...</h2>
        <p className="text-muted-foreground">Please wait while we complete the authentication process.</p>
      </div>
    </div>
  );
} 