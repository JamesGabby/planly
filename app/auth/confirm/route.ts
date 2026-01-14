// app/auth/confirm/route.ts

import { createClient } from "@/lib/supabase/server";
import { type EmailOtpType } from "@supabase/supabase-js";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const code = searchParams.get("code"); // Some flows use code instead
  const next = searchParams.get("next") ?? "/dashboard";

  const supabase = await createClient();

  // Handle token_hash flow (email confirmation)
  if (token_hash && type) {
    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    });

    if (!error) {
      // For signup, redirect to dashboard
      return NextResponse.redirect(`${origin}${next}`);
    }
    
    // Error - redirect to error page
    return NextResponse.redirect(
      `${origin}/auth/error?error=${encodeURIComponent(error.message)}`
    );
  }

  // Handle code flow (OAuth/magic link)
  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }

    return NextResponse.redirect(
      `${origin}/auth/error?error=${encodeURIComponent(error.message)}`
    );
  }

  // No token_hash or code - redirect to error
  return NextResponse.redirect(
    `${origin}/auth/error?error=${encodeURIComponent("Invalid confirmation link")}`
  );
}