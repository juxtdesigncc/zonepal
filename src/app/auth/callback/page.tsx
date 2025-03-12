'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export default async function AuthCallbackPage({
  searchParams,
}: {
  searchParams: { code: string }
}) {
  const supabase = await createClient()

  if (searchParams.code) {
    const { error } = await supabase.auth.exchangeCodeForSession(searchParams.code)
    if (error) {
      console.error('Error exchanging code for session:', error)
      redirect('/auth?error=Could not authenticate user')
    }
  }

  // Redirect to home page
  redirect('/')
} 