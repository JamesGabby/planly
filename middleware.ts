// middleware.ts

import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { ratelimit } from '@/lib/rate-limit'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // ========================================
  // HANDLE AUTH PARAMS AT ROOT (Supabase fallback)
  // ========================================
  if (request.nextUrl.pathname === '/') {
    const code = request.nextUrl.searchParams.get('code')
    const token_hash = request.nextUrl.searchParams.get('token_hash')
    const type = request.nextUrl.searchParams.get('type')
    
    // Password reset / OAuth code flow
    if (code) {
      const url = new URL('/auth/callback', request.url)
      url.searchParams.set('code', code)
      // Default to update-password if this looks like a reset, otherwise dashboard
      url.searchParams.set('next', '/dashboard')
      return NextResponse.redirect(url)
    }
    
    // Email confirmation flow
    if (token_hash && type) {
      const url = new URL('/auth/confirm', request.url)
      url.searchParams.set('token_hash', token_hash)
      url.searchParams.set('type', type)
      return NextResponse.redirect(url)
    }
  }

  const { data: { user } } = await supabase.auth.getUser()

  // --- Rate Limiting (only for API routes) ---
  if (request.nextUrl.pathname.startsWith('/api')) {
    try {
      const ip = request.headers.get('x-forwarded-for')?.split(',')[0] ?? '127.0.0.1'
      const identifier = user?.id ?? ip
      const isAuthRoute = request.nextUrl.pathname.startsWith('/api/auth')

      const limiter = isAuthRoute
        ? ratelimit.auth
        : user
          ? ratelimit.authenticated
          : ratelimit.anonymous

      const { success, limit, remaining, reset } = await limiter.limit(identifier)

      if (!success) {
        return NextResponse.json(
          {
            error: 'Too many requests',
            message: 'Please try again later',
            retryAfter: Math.ceil((reset - Date.now()) / 1000),
          },
          {
            status: 429,
            headers: {
              'X-RateLimit-Limit': limit.toString(),
              'X-RateLimit-Remaining': '0',
              'X-RateLimit-Reset': reset.toString(),
              'Retry-After': Math.ceil((reset - Date.now()) / 1000).toString(),
            },
          }
        )
      }

      supabaseResponse.headers.set('X-RateLimit-Limit', limit.toString())
      supabaseResponse.headers.set('X-RateLimit-Remaining', remaining.toString())
      supabaseResponse.headers.set('X-RateLimit-Reset', reset.toString())
    } catch (error) {
      console.error('Rate limiting error:', error)
    }
  }

  // --- Auth Redirects ---
  if (!user && request.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }

  if (user && request.nextUrl.pathname === '/auth/login') {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}