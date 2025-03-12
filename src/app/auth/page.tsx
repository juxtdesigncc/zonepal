import { Metadata } from 'next'
import { AuthForm } from '@/components/auth-form'

export const metadata: Metadata = {
  title: 'ZonePal - Sign In',
  description: 'Sign in to save and share your timezone configurations',
}

export default function AuthPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-md">
        <AuthForm />
      </div>
    </div>
  )
} 