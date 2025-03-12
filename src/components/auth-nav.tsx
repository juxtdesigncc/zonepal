'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { createClient } from '@/utils/supabase/client';
import { User } from '@supabase/supabase-js';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useRouter } from 'next/navigation';

export function AuthNav() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const mounted = useRef(true);
  const supabase = createClient();

  useEffect(() => {
    mounted.current = true;
    
    // Get initial user
    const getUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (mounted.current) {
          setUser(user);
        }
      } catch (error) {
        console.error('Error fetching user:', error);
      } finally {
        if (mounted.current) {
          setLoading(false);
        }
      }
    };

    getUser();

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (mounted.current) {
          setUser(session?.user ?? null);
        }
      }
    );

    // Clean up subscription
    return () => {
      mounted.current = false;
      subscription.unsubscribe();
    };
  }, []);

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      router.push('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (loading) {
    return <Button variant="ghost" size="sm" disabled>Loading...</Button>;
  }

  if (!user) {
    return (
      <Button variant="ghost" size="sm" asChild>
        <Link href="/auth">Sign In</Link>
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="flex items-center gap-2">
          {user.email?.split('@')[0] || 'Profile'}
          {user.user_metadata.avatar_url && (
            <Image 
              src={user.user_metadata.avatar_url} 
              alt="Profile" 
              width={24}
              height={24}
              className="rounded-full"
            />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem asChild>
          <Link href="/profile">Profile</Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut}>
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
} 