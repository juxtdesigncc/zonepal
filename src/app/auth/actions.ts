'use server'

import { z } from 'zod'
import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

const signupSchema = loginSchema.extend({
  full_name: z.string().min(1, 'Please enter your name'),
})

type AuthState = {
  error?: string | null
  message?: string | null
  success?: boolean
}

export async function login(prevState: AuthState, formData: FormData): Promise<AuthState> {
  try {
    const validatedFields = loginSchema.parse({
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
    return { success: true }
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
    const validatedFields = signupSchema.parse({
      email: formData.get('email'),
      password: formData.get('password'),
      full_name: formData.get('full_name'),
    })

    const supabase = await createClient()

    const { error } = await supabase.auth.signUp({
      email: validatedFields.email,
      password: validatedFields.password,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
        data: {
          full_name: validatedFields.full_name,
        },
      },
    })

    if (error) {
      return { error: error.message }
    }

    // The profile will be created automatically by the database trigger
    // We don't need to create it manually anymore

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