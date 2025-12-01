"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, Sparkles } from "lucide-react";
import { LogoutButton } from "./logout-button";
import { Poppins } from "next/font/google";
import { ThemeSwitcher } from "./theme-switcher";
import { useUserMode } from "./UserModeContext";
import { usePathname } from "next/navigation";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { mode } = useUserMode();
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const baseLinks = [
    { name: "Dashboard", href: "/dashboard" },
    { name: "Lessons", href: "/dashboard/lesson-plans" },
    { name: "Students", href: "/dashboard/student-profiles" },
    { name: "Analytics", href: "/dashboard/analytics" },
  ];

  const navLinks =
    mode !== "tutor"
      ? [
          baseLinks[0],  // Dashboard
          baseLinks[1],  // Lessons
          { name: "Classes", href: "/dashboard/classes" },  // Classes
          ...baseLinks.slice(2),  // Students, Analytics
        ]
      : baseLinks;

  return (
    <nav 
      className={`
        sticky top-0 z-50 w-full 
        border-b border-border/40 
        bg-background/80 backdrop-blur-xl 
        supports-[backdrop-filter]:bg-background/60
        transition-all duration-300
        ${scrolled ? "shadow-lg shadow-primary/5" : "shadow-sm"}
      `}
    >
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 pointer-events-none" />
      
      <div className="relative mx-auto flex justify-between items-center h-16 px-6 sm:px-8 lg:px-12 max-w-7xl">
        {/* Logo with premium styling */}
        <Link
          href="/"
          className={`${poppins.className} group flex items-center gap-2.5 text-2xl font-bold tracking-tight transition-all duration-300 hover:scale-[1.02]`}
        >
          {/* Icon container */}
          <div className="p-1.5 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-all duration-300">
            <Sparkles className="w-5 h-5 text-primary group-hover:rotate-12 transition-transform duration-300" />
          </div>
          
          <span className="bg-gradient-to-r from-primary via-primary to-primary/80 bg-clip-text text-transparent group-hover:from-primary group-hover:to-accent transition-all duration-500">
            Lessonly
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-1 text-sm font-medium">
          {navLinks.map((link) => {
            // Fix: Use exact match for dashboard, startsWith for sub-routes
            const isActive = link.href === "/dashboard" 
              ? pathname === "/dashboard"
              : pathname.startsWith(link.href);
            
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`
                  relative px-5 py-2.5 rounded-full
                  transition-all duration-300 ease-out
                  ${isActive ? 
                    "text-primary font-semibold bg-primary/10 shadow-sm" : 
                    "text-foreground/70 hover:text-foreground hover:bg-accent/50 active:scale-[0.97]"
                  }
                  group
                `}
              >
                {link.name}
                {/* Premium animated underline */}
                <span 
                  className={`
                    absolute left-1/2 -translate-x-1/2 bottom-1 h-0.5 
                    bg-gradient-to-r from-transparent via-primary to-transparent 
                    rounded-full transition-all duration-300 ease-out
                    ${isActive ? "w-3/4 opacity-100" : "w-0 opacity-0 group-hover:w-1/2 group-hover:opacity-70"}
                  `}
                />
              </Link>
            );
          })}

          {/* Premium divider with gradient */}
          <div className="w-px h-6 bg-gradient-to-b from-transparent via-border/50 to-transparent mx-3" />

          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-xl hover:bg-accent/50 active:scale-95 transition-all duration-200">
              <ThemeSwitcher />
            </div>
            <LogoutButton />
          </div>
        </div>

        {/* Mobile Menu Toggle with premium animation */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className={`
            md:hidden p-2.5 rounded-xl 
            hover:bg-accent/70 active:scale-95 
            transition-all duration-200
            ${menuOpen ? "bg-accent/50" : ""}
          `}
          aria-label="Toggle menu"
        >
          {menuOpen ? (
            <X size={22} className="rotate-90 transition-transform duration-300" />
          ) : (
            <Menu size={22} className="transition-transform duration-200" />
          )}
        </button>
      </div>

      {/* Premium gradient line at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

      {/* Mobile Dropdown with enhanced styling */}
      {menuOpen && (
        <div className="md:hidden border-t border-border/40 bg-background/95 backdrop-blur-xl shadow-xl animate-in slide-in-from-top-2 duration-300">
          {/* Gradient overlay for mobile menu */}
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
          
          <div className="relative flex flex-col px-6 py-6 space-y-2 max-w-7xl mx-auto">
            {navLinks.map((link) => {
              // Fix: Use exact match for dashboard, startsWith for sub-routes
              const isActive = link.href === "/dashboard" 
                ? pathname === "/dashboard"
                : pathname.startsWith(link.href);
              
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className={`
                    px-5 py-3.5 rounded-xl font-medium
                    transition-all duration-300 ease-out
                    ${isActive ? 
                      "text-primary font-semibold bg-primary/10 shadow-md border border-primary/20" : 
                      "text-foreground/80 hover:text-foreground hover:bg-accent/50 active:scale-[0.98] border border-transparent hover:border-border/50"
                    }
                  `}
                >
                  <span className="flex items-center justify-between">
                    {link.name}
                    {isActive && (
                      <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                    )}
                  </span>
                </Link>
              );
            })}

            {/* Mobile Actions with premium styling */}
            <div className="pt-5 mt-3 border-t border-border/40 flex items-center justify-between gap-3">
              <div className="flex-1">
                <LogoutButton />
              </div>
              <div className="p-1.5 rounded-xl hover:bg-accent/50 active:scale-95 transition-all duration-200">
                <ThemeSwitcher />
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}