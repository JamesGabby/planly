// app/actions/auth.ts
'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { headers } from 'next/headers'
import { z } from 'zod'

// ============================================
// Types
// ============================================

export type AuthState = {
  success: boolean
  message?: string
  errors?: {
    email?: string[]
    password?: string[]
    confirmPassword?: string[]
    general?: string[]
  }
  values?: {
    email?: string
  }
}

// ============================================
// Validation Schemas
// ============================================

const signInSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(6, 'Password must be at least 6 characters'),
})

const signUpSchema = z
  .object({
    email: z
      .string()
      .min(1, 'Email is required')
      .email('Please enter a valid email address'),
    password: z
      .string()
      .min(1, 'Password is required')
      .min(8, 'Password must be at least 8 characters')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        'Password must contain at least one uppercase letter, one lowercase letter, and one number'
      ),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

// ============================================
// Helper Functions
// ============================================

function mapSupabaseError(errorMessage: string): string {
  const errorMap: Record<string, string> = {
    'Invalid login credentials':
      'Invalid email or password. Please check your credentials and try again.',
    'Invalid email or password':
      'Invalid email or password. Please check your credentials and try again.',
    'Email not confirmed':
      'Please verify your email address before signing in. Check your inbox for a confirmation link.',
    'Too many requests':
      'Too many attempts. Please wait a few minutes and try again.',
    'User not found': 'No account found with this email address.',
    'User already registered':
      'An account with this email already exists. Try signing in instead.',
    'Password should be at least 6 characters':
      'Password must be at least 6 characters long.',
    'Email rate limit exceeded':
      'Too many emails sent. Please wait a few minutes and try again.',
    'For security purposes, you can only request this once every 60 seconds':
      'Please wait 60 seconds before requesting another email.',
  }

  return errorMap[errorMessage] || errorMessage
}

// ============================================
// Sign In
// ============================================

export async function signIn(
  prevState: AuthState | null,
  formData: FormData
): Promise<AuthState> {
  const rawFormData = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }
  const next = formData.get('next') as string | null

  const validatedFields = signInSchema.safeParse(rawFormData)

  if (!validatedFields.success) {
    return {
      success: false,
      errors: validatedFields.error.flatten().fieldErrors,
      values: {
        email: rawFormData.email,
      },
    }
  }

  const { email, password } = validatedFields.data

  const supabase = await createClient()

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    console.error('Sign in error:', error.message)

    return {
      success: false,
      errors: {
        general: [mapSupabaseError(error.message)],
      },
      values: {
        email,
      },
    }
  }

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) {
    const currentLoginCount = user.user_metadata?.login_count || 0
    await supabase.auth.updateUser({
      data: { login_count: currentLoginCount + 1 },
    })
  }

  revalidatePath('/', 'layout')
  redirect(next || '/dashboard')
}

// ============================================
// Sign Up
// ============================================

export async function signUp(
  prevState: AuthState | null,
  formData: FormData
): Promise<AuthState> {
  const rawFormData = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
    confirmPassword: formData.get('confirmPassword') as string,
  }

  const validatedFields = signUpSchema.safeParse(rawFormData)

  if (!validatedFields.success) {
    return {
      success: false,
      errors: validatedFields.error.flatten().fieldErrors,
      values: {
        email: rawFormData.email,
      },
    }
  }

  const { email, password } = validatedFields.data

  const supabase = await createClient()
  const headersList = await headers()
  const origin = headersList.get('origin') || process.env.NEXT_PUBLIC_SITE_URL

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
    },
  })

  if (error) {
    console.error('Sign up error:', error.message)

    return {
      success: false,
      errors: {
        general: [mapSupabaseError(error.message)],
      },
      values: {
        email,
      },
    }
  }

  redirect('/verify-email')
}

// ============================================
// OAuth Providers
// ============================================

export async function signInWithGoogle(formData: FormData) {
  const redirectTo = formData.get('redirectTo') as string | null

  const supabase = await createClient()
  const headersList = await headers()
  const origin = headersList.get('origin') || process.env.NEXT_PUBLIC_SITE_URL

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${origin}/auth/callback${redirectTo ? `?next=${encodeURIComponent(redirectTo)}` : ''}`,
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      },
    },
  })

  if (error) {
    redirect(
      `/login?error=${encodeURIComponent(mapSupabaseError(error.message))}`
    )
  }

  if (data.url) {
    redirect(data.url)
  }
}

export async function signInWithGitHub(formData: FormData) {
  const redirectTo = formData.get('redirectTo') as string | null

  const supabase = await createClient()
  const headersList = await headers()
  const origin = headersList.get('origin') || process.env.NEXT_PUBLIC_SITE_URL

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'github',
    options: {
      redirectTo: `${origin}/auth/callback${redirectTo ? `?next=${encodeURIComponent(redirectTo)}` : ''}`,
    },
  })

  if (error) {
    redirect(
      `/login?error=${encodeURIComponent(mapSupabaseError(error.message))}`
    )
  }

  if (data.url) {
    redirect(data.url)
  }
}

// ============================================
// Sign Out
// ============================================

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/login')
}

// ============================================
// Password Reset
// ============================================

export async function forgotPassword(
  prevState: AuthState | null,
  formData: FormData
): Promise<AuthState> {
  const email = formData.get('email') as string

  if (!email || !z.string().email().safeParse(email).success) {
    return {
      success: false,
      errors: {
        email: ['Please enter a valid email address'],
      },
      values: {
        email,
      },
    }
  }

  const supabase = await createClient()
  const headersList = await headers()
  const origin = headersList.get('origin') || process.env.NEXT_PUBLIC_SITE_URL

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/callback?next=/auth/reset-password`,
  })

  if (error) {
    console.error('Password reset error:', error.message)

    return {
      success: false,
      errors: {
        general: [mapSupabaseError(error.message)],
      },
      values: {
        email,
      },
    }
  }

  return {
    success: true,
    message: 'Check your email for a password reset link.',
    values: {
      email,
    },
  }
}

export async function resetPassword(
  prevState: AuthState | null,
  formData: FormData
): Promise<AuthState> {
  const password = formData.get('password') as string
  const confirmPassword = formData.get('confirmPassword') as string

  if (!password || password.length < 8) {
    return {
      success: false,
      errors: {
        password: ['Password must be at least 8 characters'],
      },
    }
  }

  if (password !== confirmPassword) {
    return {
      success: false,
      errors: {
        confirmPassword: ['Passwords do not match'],
      },
    }
  }

  const supabase = await createClient()

  const { error } = await supabase.auth.updateUser({
    password,
  })

  if (error) {
    console.error('Password update error:', error.message)

    return {
      success: false,
      errors: {
        general: [mapSupabaseError(error.message)],
      },
    }
  }

  redirect('/login?message=Password+updated+successfully')
}