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

  // Insert "Classes" between Lessons (index 0) and Students (index 1)
  const navLinks =
    mode !== "tutor"
      ? [
          baseLinks[0], // Lessons
          { name: "Classes", href: "/dashboard/classes" },
          ...baseLinks.slice(1), // Students + Analytics
        ]
      : baseLinks;

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md transition-colors m-0!">
      <div className="mx-auto flex justify-between items-center h-16 px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className={`${poppins.className} text-xl font-semibold tracking-tight text-primary hover:opacity-80 transition`}
        >
          Lessonly
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6 text-sm font-medium">
          {navLinks.map((link) => {
            const isActive = pathname.startsWith(link.href);
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`
                  relative px-1 py-0.5
                  transition-all duration-300
                  ${isActive ? 
                    "text-primary font-semibold" : 
                    "text-foreground/90 hover:text-foreground"
                  }
                  after:absolute after:left-0 after:-bottom-0.5 after:h-[2px] after:w-full 
                  after:scale-x-0 after:bg-primary after:rounded-full
                  after:transition-transform after:duration-300
                  hover:after:scale-x-100
                `}
              >
                {link.name}
              </Link>
            );
          })}

          <ThemeSwitcher />
          <LogoutButton />
        </div>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden p-2 rounded-md hover:bg-accent transition-colors"
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Dropdown */}
      {menuOpen && (
        <div className="md:hidden border-t border-border bg-background/95 backdrop-blur-md animate-slide-down">
          <div className="flex flex-col items-start px-6 py-4 space-y-3 text-sm font-medium">
            {navLinks.map((link) => {
              const isActive = pathname.startsWith(link.href);
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className={`
                    w-full py-2 relative
                    transition-all duration-300
                    ${isActive ? "text-primary font-semibold" : "text-foreground/90 hover:text-foreground"}
                    after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-full 
                    after:scale-x-0 after:bg-primary after:rounded-full
                    after:transition-transform after:duration-300
                    hover:after:scale-x-100
                  `}
                >
                  {link.name}
                </Link>
              );
            })}

            <div className="pt-3 border-t border-border w-full flex items-center gap-3">
              <LogoutButton />
              <ThemeSwitcher />
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
