// components/landing/navigation.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/logo";
import {
  Menu,
  X,
  ChevronDown,
  Sparkles,
  BookOpen,
  Users,
  GraduationCap,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  {
    label: "Features",
    href: "#features",
    children: [
      { label: "AI Lesson Generation", href: "#features", icon: Sparkles },
      { label: "Student Profiles", href: "#features", icon: Users },
      { label: "Curriculum Alignment", href: "#features", icon: BookOpen },
      { label: "Teacher Guides", href: "#features", icon: GraduationCap },
    ],
  },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Testimonials", href: "#testimonials" },
  { label: "Pricing", href: "#pricing" },
];

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) setIsMobileMenuOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isMobileMenuOpen]);

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          isScrolled
            ? "bg-background/80 backdrop-blur-xl border-b shadow-sm"
            : "bg-transparent"
        )}
      >
        <nav className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <Link href="/" className="flex-shrink-0">
              <Logo />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1">
              {navItems.map((item) => (
                <div
                  key={item.label}
                  className="relative"
                  onMouseEnter={() => item.children && setActiveDropdown(item.label)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center gap-1 px-4 py-2 text-sm font-medium rounded-lg transition-colors",
                      "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                    )}
                  >
                    {item.label}
                    {item.children && (
                      <ChevronDown className={cn(
                        "w-4 h-4 transition-transform",
                        activeDropdown === item.label && "rotate-180"
                      )} />
                    )}
                  </Link>

                  {/* Dropdown */}
                  {item.children && (
                    <div
                      className={cn(
                        "absolute top-full left-0 mt-2 w-64 p-2 rounded-xl",
                        "bg-background/95 backdrop-blur-xl border shadow-xl",
                        "transition-all duration-200 origin-top",
                        activeDropdown === item.label
                          ? "opacity-100 scale-100 visible"
                          : "opacity-0 scale-95 invisible"
                      )}
                    >
                      {item.children.map((child) => (
                        <Link
                          key={child.label}
                          href={child.href}
                          className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent transition-colors group"
                        >
                          <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                            <child.icon className="w-4 h-4" />
                          </div>
                          <span className="font-medium">{child.label}</span>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Desktop CTA */}
            <div className="hidden lg:flex items-center gap-3">
              <Button variant="ghost" asChild>
                <Link href="/auth/login">Log in</Link>
              </Button>
              <Button asChild className="gap-2 shadow-lg shadow-primary/25">
                <Link href="/auth/sign-up">
                  Get Started Free
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-accent transition-colors"
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile Menu Overlay */}
      <div
        className={cn(
          "fixed inset-0 z-40 lg:hidden transition-all duration-300",
          isMobileMenuOpen
            ? "opacity-100 visible"
            : "opacity-0 invisible pointer-events-none"
        )}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-background/80 backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />

        {/* Menu Panel */}
        <div
          className={cn(
            "absolute top-16 left-0 right-0 bottom-0 bg-background border-t",
            "overflow-y-auto transition-transform duration-300",
            isMobileMenuOpen ? "translate-y-0" : "-translate-y-full"
          )}
        >
          <div className="p-4 space-y-2">
            {navItems.map((item) => (
              <div key={item.label}>
                <Link
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-between p-4 rounded-xl hover:bg-accent transition-colors"
                >
                  <span className="font-medium">{item.label}</span>
                  <ArrowRight className="w-5 h-5 text-muted-foreground" />
                </Link>
                {item.children && (
                  <div className="ml-4 mt-1 space-y-1">
                    {item.children.map((child) => (
                      <Link
                        key={child.label}
                        href={child.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent/50 transition-colors"
                      >
                        <child.icon className="w-4 h-4 text-primary" />
                        <span className="text-sm text-muted-foreground">{child.label}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {/* Mobile CTAs */}
            <div className="pt-4 mt-4 border-t space-y-3">
              <Button variant="outline" className="w-full" asChild>
                <Link href="/auth/login">Log in</Link>
              </Button>
              <Button className="w-full gap-2" asChild>
                <Link href="/auth/sign-up">
                  Get Started Free
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}