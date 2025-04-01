'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import SignOutButton from './SignOutButton'
import EditableName from './EditableName'

export default async function ProfilePage() {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    redirect('/auth')
  }

  // Fetch profile data
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  const fullName = profile?.full_name || user.user_metadata?.full_name || 'Add your name'

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader className="space-y-2">
            <CardTitle className="flex items-center gap-2">
              <EditableName initialName={fullName} />
            </CardTitle>
            <CardDescription className="text-sm text-muted-foreground">
              {user.email}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium">Account Details</p>
              <div className="mt-2 space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground">User ID</p>
                  <p className="text-xs text-gray-500 break-all">{user.id}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Last Sign In</p>
                  <p className="text-sm">
                    {user.last_sign_in_at 
                      ? new Date(user.last_sign_in_at).toLocaleString() 
                      : 'Never signed in'}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <SignOutButton />
          </CardFooter>
        </Card>
      </div>
    </div>
  )
} 