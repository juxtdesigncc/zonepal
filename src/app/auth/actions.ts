'use server'

import { z } from 'zod'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

const authSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

type AuthState = {
  error?: string | null
  message?: string | null
}

export async function login(prevState: AuthState, formData: FormData): Promise<AuthState> {
  try {
    const validatedFields = authSchema.parse({
      email: formData.get('email'),
      password: formData.get('password'),
    })

    const supabase = await createClient()

    const { error } = await supabase.auth.signInWithPassword({
      email: validatedFields.email,
      password: validatedFields.password,
    })

    if (error) {
      return { error: error.message }
    }

    revalidatePath('/', 'layout')
    redirect('/')
  } catch (err) {
    if (err instanceof z.ZodError) {
      return { error: err.errors[0].message }
    }
    const error = err as Error
    return { error: error.message || 'An unexpected error occurred' }
  }
}

export async function signup(prevState: AuthState, formData: FormData): Promise<AuthState> {
  try {
    const validatedFields = authSchema.parse({
      email: formData.get('email'),
      password: formData.get('password'),
    })

    const supabase = await createClient()

    const { error } = await supabase.auth.signUp({
      email: validatedFields.email,
      password: validatedFields.password,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
      },
    })

    if (error) {
      return { error: error.message }
    }

    return {
      message: 'Check your email to confirm your account',
    }
  } catch (err) {
    if (err instanceof z.ZodError) {
      return { error: err.errors[0].message }
    }
    const error = err as Error
    return { error: error.message || 'An unexpected error occurred' }
  }
} 