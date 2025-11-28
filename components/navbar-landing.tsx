import Link from "next/link";
import { Poppins } from "next/font/google";
import { ThemeSwitcher } from "./theme-switcher";
import { AuthButton } from "./auth-button";
import { LogoutButton } from "./logout-button";
import { Sparkles } from "lucide-react";

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
    <nav className="fixed top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl transition-all duration-300 supports-[backdrop-filter]:bg-background/60">
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 pointer-events-none" />
      
      <div className="relative mx-auto flex justify-between items-center h-16 px-6 sm:px-8 lg:px-12 max-w-7xl">
        
        {/* Logo with enhanced styling */}
        <Link
          href="/"
          className={`${poppins.className} group flex items-center gap-2.5 text-2xl font-bold tracking-tight transition-all duration-300 hover:scale-[1.02]`}
        >
          {/* Optional icon */}
          <div className="p-1.5 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors duration-300">
            <Sparkles className="w-5 h-5 text-primary" />
          </div>
          
          <span className="bg-gradient-to-r from-primary via-primary to-primary/80 bg-clip-text text-transparent group-hover:from-primary group-hover:to-accent transition-all duration-500">
            Lessonly
          </span>
        </Link>

        {/* Right side actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Theme Switcher with premium styling */}
          <div className="p-1.5 rounded-xl hover:bg-accent/50 active:scale-95 transition-all duration-200 backdrop-blur-sm">
            <ThemeSwitcher />
          </div>

          {/* Vertical divider */}
          <div className="hidden sm:block w-px h-6 bg-gradient-to-b from-transparent via-border/50 to-transparent" />

          {/* Desktop: Show Auth Button */}
          <div className="hidden md:flex items-center">
            <AuthButton />
          </div>

          {/* Mobile: Show Logout Button */}
          <div className="md:hidden flex items-center">
            <LogoutButton />
          </div>
        </div>
      </div>

      {/* Premium gradient line at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
      
      {/* Optional: Subtle shadow on scroll effect */}
      <div className="absolute -bottom-1 left-0 right-0 h-4 bg-gradient-to-b from-background/20 to-transparent opacity-0 transition-opacity duration-300 pointer-events-none" />
    </nav>
  );
}