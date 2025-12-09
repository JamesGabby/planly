// app/auth/callback/route.ts
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/dashboard'

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error) {
      // Increment login count for OAuth users
      const { data: { user } } = await supabase.auth.getUser()

      if (user) {
        const currentLoginCount = user.user_metadata?.login_count || 0
        await supabase.auth.updateUser({
          data: { login_count: currentLoginCount + 1 }
        })
      }

      // Successful authentication
      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  // Auth error - redirect to login with error
  return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent('Authentication failed')}`)
}