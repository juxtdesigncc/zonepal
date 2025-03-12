'use client'

import { Button } from '@/components/ui/button'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'

export default function SignOutButton() {
  const router = useRouter()
  
  const handleSignOut = async () => {
    const supabase = createClient()
    
    try {
      await supabase.auth.signOut()
      router.push('/auth')
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  return (
    <Button variant="outline" className="w-full" onClick={handleSignOut}>
      Sign Out
    </Button>
  )
} 