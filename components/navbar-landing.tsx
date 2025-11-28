import Link from "next/link";
import { Poppins } from "next/font/google";
import { ThemeSwitcher } from "./theme-switcher";
import { AuthButton } from "./auth-button";
import { LogoutButton } from "./logout-button";

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
    <nav className="absolute top-0 z-50 w-full border-b border-border/40 bg-background/60 backdrop-blur-xl transition-all duration-300">
      <div className="mx-auto flex justify-between items-center h-20 px-6 sm:px-8 lg:px-12">
        
        {/* Logo */}
        <Link
          href="/"
          className={`${poppins.className} text-2xl font-bold tracking-tight bg-gradient-to-r from-primary via-primary to-primary/80 bg-clip-text text-transparent hover:opacity-90 transition-opacity duration-300`}
        >
          Lessonly
        </Link>

        {/* Right side actions */}
        <div className="flex items-center gap-3">
          {/* Theme Switcher with enhanced styling */}
          <div className="p-1.5 rounded-xl hover:bg-accent/50 transition-all duration-200">
            <ThemeSwitcher />
          </div>

          {/* Desktop: Show Auth Button */}
          <div className="hidden md:flex items-center gap-3">
            <div className="w-px h-6 bg-border/50" />
            <AuthButton />
          </div>

          {/* Mobile: Show Logout Button */}
          <div className="md:hidden flex items-center gap-2">
            <div className="w-px h-6 bg-border/50" />
            <LogoutButton />
          </div>
        </div>
      </div>

      {/* Optional: Subtle gradient line at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
    </nav>
  );
}