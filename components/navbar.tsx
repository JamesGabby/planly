"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
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
  const { mode } = useUserMode();
  const pathname = usePathname();

  const baseLinks = [
    { name: "Lessons", href: "/dashboard/lesson-plans" },
    { name: "Students", href: "/dashboard/student-profiles" },
    { name: "Analytics", href: "/dashboard/analytics" },
  ];

  const navLinks =
    mode !== "tutor"
      ? [
          baseLinks[0],
          { name: "Classes", href: "/dashboard/classes" },
          ...baseLinks.slice(1),
        ]
      : baseLinks;

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/60 backdrop-blur-xl shadow-sm transition-all duration-300 m-0!">
      <div className="mx-auto flex justify-between items-center h-20 px-6 sm:px-8 lg:px-12">
        {/* Logo */}
        <Link
          href="/"
          className={`${poppins.className} text-2xl font-bold tracking-tight bg-gradient-to-r from-primary via-primary to-primary/80 bg-clip-text text-transparent hover:opacity-90 transition-opacity duration-300`}
        >
          Lessonly
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-1 text-sm font-medium">
          {navLinks.map((link) => {
            const isActive = pathname.startsWith(link.href);
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`
                  relative px-4 py-2 rounded-full
                  transition-all duration-300 ease-out
                  ${isActive ? 
                    "text-primary font-semibold bg-primary/10" : 
                    "text-foreground/70 hover:text-foreground hover:bg-accent/50"
                  }
                  group
                `}
              >
                {link.name}
                {/* Premium underline effect */}
                <span 
                  className={`
                    absolute left-1/2 -translate-x-1/2 bottom-0 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent rounded-full
                    transition-all duration-300 ease-out
                    ${isActive ? "w-3/4 opacity-100" : "w-0 opacity-0 group-hover:w-1/2 group-hover:opacity-70"}
                  `}
                />
              </Link>
            );
          })}

          {/* Divider */}
          <div className="w-px h-6 bg-border/50 mx-2" />

          <div className="flex items-center gap-2">
            <ThemeSwitcher />
            <LogoutButton />
          </div>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden p-2.5 rounded-xl hover:bg-accent/70 active:scale-95 transition-all duration-200"
          aria-label="Toggle menu"
        >
          {menuOpen ? (
            <X size={22} className="transition-transform duration-200" />
          ) : (
            <Menu size={22} className="transition-transform duration-200" />
          )}
        </button>
      </div>

      {/* Mobile Dropdown */}
      {menuOpen && (
        <div className="md:hidden border-t border-border/40 bg-background/95 backdrop-blur-xl shadow-lg animate-in slide-in-from-top-2 duration-300">
          <div className="flex flex-col px-6 py-6 space-y-1 max-w-7xl mx-auto">
            {navLinks.map((link) => {
              const isActive = pathname.startsWith(link.href);
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className={`
                    px-4 py-3 rounded-xl
                    transition-all duration-300 ease-out
                    ${isActive ? 
                      "text-primary font-semibold bg-primary/10 shadow-sm" : 
                      "text-foreground/80 hover:text-foreground hover:bg-accent/50 active:scale-[0.98]"
                    }
                  `}
                >
                  {link.name}
                </Link>
              );
            })}

            {/* Mobile Actions */}
            <div className="pt-4 mt-2 border-t border-border/40 flex items-center justify-between gap-3">
              <LogoutButton />
              <ThemeSwitcher />
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}