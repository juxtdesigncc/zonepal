'use server'

import { z } from 'zod'
import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

const updateSchema = z.object({
  full_name: z.string().min(1, 'Please enter your name'),
})

type UpdateState = {
  error?: string | null
  message?: string | null
}

export async function updateFullName(prevState: UpdateState, formData: FormData): Promise<UpdateState> {
  try {
    const validatedFields = updateSchema.parse({
      full_name: formData.get('full_name'),
    })

    const supabase = await createClient()

    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) {
      return { error: 'Not authenticated' }
    }

    // Update user metadata
    const { error: updateError } = await supabase.auth.updateUser({
      data: { full_name: validatedFields.full_name }
    })

    if (updateError) {
      return { error: updateError.message }
    }

    // Update profiles table
    const { error: profileError } = await supabase
      .from('profiles')
      .upsert({
        id: user.id,
        full_name: validatedFields.full_name,
        updated_at: new Date().toISOString(),
      })

    if (profileError) {
      return { error: profileError.message }
    }

    revalidatePath('/profile')
    return { message: 'Name updated successfully' }
  } catch (err) {
    if (err instanceof z.ZodError) {
      return { error: err.errors[0].message }
    }
    const error = err as Error
    return { error: error.message || 'An unexpected error occurred' }
  }
} 