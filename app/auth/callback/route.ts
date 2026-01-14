// app/auth/callback/route.ts

import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/dashboard'
  const error = searchParams.get('error')
  const error_description = searchParams.get('error_description')

  // Handle OAuth errors
  if (error) {
    return NextResponse.redirect(
      `${origin}/auth/error?error=${encodeURIComponent(error_description || error)}`
    )
  }

  if (code) {
    const supabase = await createClient()
    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!exchangeError) {
      const { data: { user } } = await supabase.auth.getUser()

      if (user) {
        // Increment login count (for tracking)
        const currentLoginCount = user.user_metadata?.login_count || 0
        await supabase.auth.updateUser({
          data: { login_count: currentLoginCount + 1 }
        })
      }

      // Successful authentication - redirect to next
      return NextResponse.redirect(`${origin}${next}`)
    }

    // Exchange failed
    return NextResponse.redirect(
      `${origin}/auth/error?error=${encodeURIComponent(exchangeError.message)}`
    )
  }

  // No code provided
  return NextResponse.redirect(
    `${origin}/auth/error?error=${encodeURIComponent('No authentication code provided')}`
  )
}