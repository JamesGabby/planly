import Link from "next/link";
import { Poppins } from "next/font/google";
import { ThemeSwitcher } from "./theme-switcher";
import { AuthButton } from "./auth-button";
import { LogoutButton } from "./logout-button"; // <-- make sure this exists

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata = {
  title: "Lessonly",
  description: "Learning management made simple.",
};

export function NavbarLanding() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md transition-colors">
      <div className="max-w-6xl mx-auto flex justify-between items-center h-16 px-4 sm:px-6 lg:px-8">
        
        {/* Logo */}
        <Link
          href="/"
          className={`${poppins.className} text-xl font-semibold tracking-tight text-primary hover:opacity-80 transition`}
        >
          Lessonly
        </Link>

        {/* Right side actions */}
        <div className="flex items-center gap-4">
          <ThemeSwitcher />

          {/* Desktop: Show Auth Button */}
          <div className="hidden md:block">
            <AuthButton />
          </div>

          {/* Mobile: Show Logout Button */}
          <div className="md:hidden">
            <LogoutButton />
          </div>
        </div>
      </div>
    </nav>
  );
}
