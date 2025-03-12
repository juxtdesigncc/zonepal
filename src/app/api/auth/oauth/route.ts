import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const requestUrl = new URL(request.url)
  const supabase = await createClient()

  try {
    const { provider } = await request.json()

    if (!provider) {
      return NextResponse.json(
        { error: 'Provider is required' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${requestUrl.origin}/auth/callback`,
      },
    })

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ url: data.url })
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 