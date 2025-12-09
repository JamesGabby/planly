import Link from "next/link";
import { Button } from "./ui/button";
import { createClient } from "@/lib/supabase/server";
import { LogoutButton } from "./logout-button";

export async function AuthButton() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  // Get display name from user metadata
  const displayName = user?.user_metadata?.full_name 
    || user?.user_metadata?.display_name 
    || user?.user_metadata?.name
    || user?.email?.split('@')[0]
    || user?.email;

  // Check login count to determine welcome message
  const loginCount = user?.user_metadata?.login_count || 0;
  const welcomeMessage = loginCount <= 1 
    ? `Welcome, ${displayName}!` 
    : `Welcome back, ${displayName}!`;

  return user ? (
    <div className="flex items-center gap-4">
      {welcomeMessage}
      <LogoutButton />
    </div>
  ) : (
    <div className="flex gap-2">
      <Button asChild size="sm" variant={"outline"}>
        <Link href="/auth/login">Sign in</Link>
      </Button>
      <Button asChild size="sm" variant={"default"}>
        <Link href="/auth/sign-up">Sign up</Link>
      </Button>
    </div>
  );
}