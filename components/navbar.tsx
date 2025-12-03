"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Menu, 
  X, 
  Sparkles, 
  Home, 
  BookOpen, 
  Users, 
  BarChart3, 
  GraduationCap,
  LucideIcon 
} from "lucide-react";
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

interface NavLink {
  name: string;
  href: string;
  icon: LucideIcon;
}

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

  // Close mobile menu when route changes
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [menuOpen]);

  const baseLinks: NavLink[] = [
    { name: "Home", href: "/dashboard", icon: Home },
    { name: "Lessons", href: "/dashboard/lesson-plans", icon: BookOpen },
    { name: "Students", href: "/dashboard/student-profiles", icon: Users },
    { name: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
  ];

  const navLinks: NavLink[] =
    mode !== "tutor"
      ? [
          baseLinks[0],  // Dashboard
          baseLinks[1],  // Lessons
          { name: "Classes", href: "/dashboard/classes", icon: GraduationCap },  // Classes
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
      
      <div className="relative mx-auto flex justify-between items-center h-14 sm:h-16 px-4 sm:px-6 lg:px-8 xl:px-12 max-w-7xl">
        {/* Logo with premium styling */}
        <Link
          href="/"
          className={`${poppins.className} group flex items-center gap-2 sm:gap-2.5 text-xl sm:text-2xl font-bold tracking-tight transition-all duration-300 hover:scale-[1.02] flex-shrink-0`}
        >
          {/* Icon container */}
          <div className="p-1 sm:p-1.5 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-all duration-300">
            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-primary group-hover:rotate-12 transition-transform duration-300" />
          </div>
          
          <span className="bg-gradient-to-r from-primary via-primary to-primary/80 bg-clip-text text-transparent group-hover:from-primary group-hover:to-accent transition-all duration-500">
            Lessonly
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-1 text-sm font-medium">
          {navLinks.map((link) => {
            const isActive = link.href === "/dashboard" 
              ? pathname === "/dashboard"
              : pathname.startsWith(link.href);
            
            const IconComponent = link.icon;
            
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`
                  relative px-3 xl:px-5 py-2.5 rounded-full
                  transition-all duration-300 ease-out
                  ${isActive ? 
                    "text-primary font-semibold bg-primary/10 shadow-sm" : 
                    "text-foreground/70 hover:text-foreground hover:bg-accent/50 active:scale-[0.97]"
                  }
                  group
                `}
              >
                <span className="flex items-center gap-2">
                  <IconComponent 
                    className={`
                      w-4 h-4 transition-all duration-300
                      ${isActive ? "text-primary" : "text-foreground/60 group-hover:text-foreground"}
                    `} 
                  />
                  <span className="whitespace-nowrap">{link.name}</span>
                </span>
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
          <div className="w-px h-6 bg-gradient-to-b from-transparent via-border/50 to-transparent mx-2 xl:mx-3" />

          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-xl hover:bg-accent/50 active:scale-95 transition-all duration-200">
              <ThemeSwitcher />
            </div>
            <LogoutButton />
          </div>
        </div>

        {/* Tablet/Mobile: Theme + Menu Toggle */}
        <div className="flex lg:hidden items-center gap-2">
          <div className="p-1.5 rounded-xl hover:bg-accent/50 active:scale-95 transition-all duration-200">
            <ThemeSwitcher />
          </div>
          
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className={`
              p-2 sm:p-2.5 rounded-xl 
              hover:bg-accent/70 active:scale-95 
              transition-all duration-200
              ${menuOpen ? "bg-accent/50" : ""}
            `}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
          >
            {menuOpen ? (
              <X size={20} className="sm:w-[22px] sm:h-[22px] rotate-90 transition-transform duration-300" />
            ) : (
              <Menu size={20} className="sm:w-[22px] sm:h-[22px] transition-transform duration-200" />
            )}
          </button>
        </div>
      </div>

      {/* Premium gradient line at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

      {/* Mobile/Tablet Dropdown - full screen on mobile */}
      {menuOpen && (
        <>
          {/* Backdrop overlay */}
          <div 
            className="lg:hidden fixed inset-0 bg-black/20 backdrop-blur-sm z-40 animate-in fade-in duration-200"
            onClick={() => setMenuOpen(false)}
            aria-hidden="true"
          />
          
          {/* Menu panel */}
          <div className="lg:hidden fixed inset-x-0 top-[57px] sm:top-[65px] bottom-0 z-50 border-t border-border/40 bg-background/98 backdrop-blur-xl shadow-2xl animate-in slide-in-from-top-4 duration-300 overflow-y-auto">
            {/* Gradient overlay for mobile menu */}
            <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
            
            <div className="relative flex flex-col px-4 sm:px-6 py-4 sm:py-6 space-y-1.5 sm:space-y-2 max-w-2xl mx-auto">
              {navLinks.map((link) => {
                const isActive = link.href === "/dashboard" 
                  ? pathname === "/dashboard"
                  : pathname.startsWith(link.href);
                
                const IconComponent = link.icon;
                
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className={`
                      px-4 sm:px-5 py-3 sm:py-3.5 rounded-xl font-medium text-base
                      transition-all duration-300 ease-out
                      ${isActive ? 
                        "text-primary font-semibold bg-primary/10 shadow-md border border-primary/20" : 
                        "text-foreground/80 hover:text-foreground hover:bg-accent/50 active:scale-[0.98] border border-transparent hover:border-border/50"
                      }
                    `}
                  >
                    <span className="flex items-center justify-between">
                      <span className="flex items-center gap-3">
                        <IconComponent 
                          className={`
                            w-5 h-5 transition-all duration-300 flex-shrink-0
                            ${isActive ? "text-primary" : "text-foreground/60"}
                          `} 
                        />
                        <span className="whitespace-nowrap">{link.name}</span>
                      </span>
                      {isActive && (
                        <span className="w-2 h-2 rounded-full bg-primary animate-pulse flex-shrink-0" />
                      )}
                    </span>
                  </Link>
                );
              })}

              {/* Mobile Actions with premium styling */}
              <div className="pt-4 sm:pt-5 mt-2 sm:mt-3 border-t border-border/40">
                <LogoutButton />
              </div>
            </div>
          </div>
        </>
      )}
    </nav>
  );
}