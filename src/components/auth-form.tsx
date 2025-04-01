'use client'

import { login, signup } from '@/app/auth/actions'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useFormState, useFormStatus } from 'react-dom'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

const initialState = {
  error: null,
  message: null,
  success: false,
}

function SubmitButton({ children }: { children: React.ReactNode }) {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? 'Please wait...' : children}
    </Button>
  )
}

export function AuthForm() {
  const router = useRouter()
  const [loginState, loginAction] = useFormState(login, initialState)
  const [signupState, signupAction] = useFormState(signup, initialState)

  useEffect(() => {
    if (loginState?.success) {
      router.push('/')
      router.refresh()
    }
  }, [loginState?.success, router])

  return (
    <Card>
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl">Welcome to ZonePal</CardTitle>
        <CardDescription>
          Sign in to save your timezone configurations
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Tabs defaultValue="signin" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signin">Sign In</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>
          
          <TabsContent value="signin">
            <form action={loginAction} className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="signin-email">Email</Label>
                <Input
                  id="signin-email"
                  name="email"
                  type="email"
                  placeholder="your@email.com"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="signin-password">Password</Label>
                <Input
                  id="signin-password"
                  name="password"
                  type="password"
                  required
                />
              </div>
              <SubmitButton>Sign In</SubmitButton>
              {loginState?.error && (
                <Alert variant="destructive">
                  <AlertDescription>{loginState.error}</AlertDescription>
                </Alert>
              )}
            </form>
          </TabsContent>
          
          <TabsContent value="signup">
            <form action={signupAction} className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="signup-full-name">Full Name</Label>
                <Input
                  id="signup-full-name"
                  name="full_name"
                  type="text"
                  placeholder="Enter your full name"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="signup-email">Email</Label>
                <Input
                  id="signup-email"
                  name="email"
                  type="email"
                  placeholder="your@email.com"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="signup-password">Password</Label>
                <Input
                  id="signup-password"
                  name="password"
                  type="password"
                  required
                />
              </div>
              <SubmitButton>Create Account</SubmitButton>
              {signupState?.error && (
                <Alert variant="destructive">
                  <AlertDescription>{signupState.error}</AlertDescription>
                </Alert>
              )}
              {signupState?.message && (
                <Alert>
                  <AlertDescription>{signupState.message}</AlertDescription>
                </Alert>
              )}
            </form>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
} 