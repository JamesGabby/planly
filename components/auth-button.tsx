import Link from "next/link";
import { Button } from "./ui/button";
import { createClient } from "@/lib/supabase/server";
import { LogoutButton } from "./logout-button";

export async function AuthButton() {
  const supabase = await createClient();

  // Use getUser() to get full user data including metadata
  const { data: { user } } = await supabase.auth.getUser();

  // Get display name from user metadata, fallback to email
  const displayName = user?.user_metadata?.full_name 
    || user?.user_metadata?.display_name 
    || user?.user_metadata?.name
    || user?.email?.split('@')[0] // fallback to email username
    || user?.email;

  return user ? (
    <div className="flex items-center gap-4">
      Welcome back, {displayName}!
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