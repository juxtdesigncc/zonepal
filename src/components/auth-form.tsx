'use client'

import { useState } from 'react'
import { login, signup } from '@/app/auth/actions'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useFormState } from 'react-dom'

const initialState = {
  error: null,
  message: null,
}

export function AuthForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [loginState, loginAction] = useFormState(login, initialState)
  const [signupState, signupAction] = useFormState(signup, initialState)

  const handleOAuthSignIn = async (provider: 'google') => {
    setIsLoading(true)
    try {
      const res = await fetch('/api/auth/oauth', {
        method: 'POST',
        body: JSON.stringify({ provider }),
      })
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      window.location.href = data.url
    } catch (error) {
      console.error('OAuth error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl">Welcome to ZonePal</CardTitle>
        <CardDescription>
          Sign in to save your timezone configurations
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-2">
          <Button 
            variant="outline" 
            onClick={() => handleOAuthSignIn('google')}
            disabled={isLoading}
          >
            Continue with Google
          </Button>
        </div>
        
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>

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
                  placeholder="you@example.com"
                  disabled={isLoading}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="signin-password">Password</Label>
                <Input
                  id="signin-password"
                  name="password"
                  type="password"
                  disabled={isLoading}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Signing in...' : 'Sign In'}
              </Button>
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
                <Label htmlFor="signup-email">Email</Label>
                <Input
                  id="signup-email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  disabled={isLoading}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="signup-password">Password</Label>
                <Input
                  id="signup-password"
                  name="password"
                  type="password"
                  disabled={isLoading}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Creating account...' : 'Create Account'}
              </Button>
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