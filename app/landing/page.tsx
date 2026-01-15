// app/page.tsx
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  Sparkles,
  Target,
  GraduationCap,
  LayoutDashboard,
  Clock,
  Award,
  CheckCircle2,
  Brain,
  FileText,
  TrendingUp,
  Zap,
  Shield,
  Play,
  ChevronDown,
  Globe,
  Star,
} from "lucide-react";
import { TypewriterText } from "@/components/landing/TypewriterText";
import { HeroAnimation } from "@/components/three-animations/hero-animation";
import { Logo } from "@/components/logo";
import { SocialProofBar } from "@/components/landing/social-proof-bar";
import { FeatureTabs } from "@/components/landing/feature-tabs";
import { cn } from "@/lib/utils";

// Custom hook for intersection observer animations
function useInView(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
        }
      },
      { threshold }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [threshold]);

  return { ref, isInView };
}

// Animated counter component
function AnimatedCounter({ value, suffix = "" }: { value: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const { ref, isInView } = useInView();

  useEffect(() => {
    if (isInView) {
      const duration = 2000;
      const steps = 60;
      const increment = value / steps;
      let current = 0;

      const timer = setInterval(() => {
        current += increment;
        if (current >= value) {
          setCount(value);
          clearInterval(timer);
        } else {
          setCount(Math.floor(current));
        }
      }, duration / steps);

      return () => clearInterval(timer);
    }
  }, [isInView, value]);

  return (
    <span ref={ref}>
      {count}
      {suffix}
    </span>
  );
}

export default function LandingPage() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const stats = [
    { value: 6, suffix: "+", label: "Hours Saved Weekly", icon: Clock },
    { value: 15, suffix: "k+", label: "Lessons Created", icon: FileText },
    { value: 97, suffix: "%", label: "User Satisfaction", icon: TrendingUp },
    { value: 100, suffix: "%", label: "UK Aligned", icon: Target },
  ];

  const benefits = [
    { text: "Save 6+ hours weekly on planning", icon: Clock },
    { text: "Ofsted & ITT framework compliant", icon: Award },
    { text: "AI trained on outstanding lessons", icon: Brain },
    { text: "Perfect for teachers, tutors, ECTs & trainees", icon: GraduationCap },
    { text: "GDPR-secure student data", icon: Shield },
    { text: "UK curriculum-specific content", icon: FileText },
    { text: "Global tools for tutors", icon: Globe },
  ];

  const steps = [
    {
      step: "01",
      title: "Build Your Teaching Hub",
      desc: "Set up class groups, create student profiles, and organise your schedule. Manage teacher and tutor workflows from one dashboard.",
      icon: LayoutDashboard,
    },
    {
      step: "02",
      title: "Let AI Create Your Lessons",
      desc: "Describe your topic, select year group and subject. Get comprehensive, differentiated lesson plans in seconds.",
      icon: Sparkles,
    },
    {
      step: "03",
      title: "Teach with Confidence",
      desc: "Access guides, deliver engaging lessons, and track progress. Build your library of outstanding lesson plans.",
      icon: Award,
    },
  ];

  const testimonials = [
    {
      quote:
        "This platform has transformed how I plan. What used to take 2-3 hours now takes 15 minutes. The AI suggestions are genuinely curriculum-aligned.",
      name: "Sarah Mitchell",
      role: "Secondary English Teacher",
      location: "Manchester",
      rating: 5,
    },
    {
      quote:
        "As a trainee teacher, the planning guides have been invaluable. I feel so much more confident going into lessons.",
      name: "James Thompson",
      role: "PGCE Student Teacher",
      location: "Birmingham",
      rating: 5,
    },
    {
      quote:
        "Managing both my school classes and private tutoring used to be chaotic. Now everything is beautifully organised. Game changer!",
      name: "Priya Sharma",
      role: "Maths Teacher & Tutor",
      location: "London",
      rating: 5,
    },
  ];

  const heroAnimation = useInView(0.1);
  const statsAnimation = useInView(0.2);
  const featuresAnimation = useInView(0.1);
  const benefitsAnimation = useInView(0.1);
  const stepsAnimation = useInView(0.1);
  const testimonialsAnimation = useInView(0.1);
  const ctaAnimation = useInView(0.1);

  const currentYear = new Date().getFullYear();

  return (
    <>
      {/* Navigation */}
      {/* <Navigation /> */}

      <main className="min-h-screen bg-background text-foreground scroll-smooth overflow-x-hidden">
        {/* Hero Section */}
        <section
          className="relative min-h-screen flex items-center pt-20 lg:pt-24"
          ref={heroAnimation.ref}
        >
          {/* Background */}
          <HeroAnimation />
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-1/4 -right-32 w-[500px] h-[500px] bg-gradient-to-br from-primary/20 to-accent/10 rounded-full blur-[100px]" />
            <div className="absolute -bottom-32 -left-32 w-[600px] h-[600px] bg-gradient-to-tr from-accent/10 to-primary/5 rounded-full blur-[120px]" />
          </div>

          <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-20 z-10">
            {/* Soft backdrop */}
            <div
              className="absolute inset-0 -mx-4 sm:-mx-6 pointer-events-none"
              style={{
                background: `radial-gradient(ellipse 80% 70% at 50% 50%, hsl(var(--background) / 0.85) 0%, hsl(var(--background) / 0.6) 40%, hsl(var(--background) / 0.3) 70%, transparent 100%)`,
              }}
            />

            <div className="relative flex flex-col items-center text-center gap-6 sm:gap-8">
              {/* Badge */}
              <div
                className={cn(
                  "inline-flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 rounded-full",
                  "bg-background/80 backdrop-blur-md border border-primary/30",
                  "shadow-xl shadow-background/20",
                  heroAnimation.isInView ? "animate-slide-up" : "opacity-0"
                )}
              >
                <div className="relative">
                  <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                  <div className="absolute inset-0 animate-ping">
                    <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-primary opacity-50" />
                  </div>
                </div>
                <span className="text-xs sm:text-sm font-semibold text-primary">
                  AI-Powered Lesson Planning for UK Educators
                </span>
              </div>

              {/* Headline */}
              <h1
                className={cn(
                  "text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold max-w-5xl leading-[1.1] tracking-tight",
                  heroAnimation.isInView ? "animate-slide-up animation-delay-100" : "opacity-0"
                )}
              >
                <span className="block sm:inline">Create Outstanding Lessons in</span>{" "}
                <span className="inline-block min-w-[4.5ch] sm:min-w-0 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  <TypewriterText texts={["Minutes", "Seconds", "No Time"]} />
                </span>
              </h1>

              {/* Subheadline */}
              <p
                className={cn(
                  "text-lg sm:text-xl md:text-2xl max-w-3xl text-muted-foreground leading-relaxed",
                  heroAnimation.isInView ? "animate-slide-up animation-delay-200" : "opacity-0"
                )}
              >
                The intelligent planning platform built exclusively for UK teachers, tutors, and
                trainee educators. AI-powered, curriculum-aligned, and designed to save you time.
              </p>

              {/* CTAs */}
              <div
                className={cn(
                  "flex flex-col sm:flex-row gap-4 mt-4 w-full sm:w-auto",
                  heroAnimation.isInView ? "animate-slide-up animation-delay-300" : "opacity-0"
                )}
              >
                <Button
                  size="lg"
                  className="h-14 px-8 text-lg font-semibold shadow-xl shadow-primary/25 hover:shadow-2xl hover:shadow-primary/30 hover:scale-[1.02] transition-all gap-2 group"
                  asChild
                >
                  <Link href="/auth/sign-up">
                    <Play className="w-5 h-5" />
                    Start Planning for Free
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="h-14 px-8 text-lg font-semibold border-2 hover:bg-accent/50 hover:scale-[1.02] transition-all group"
                  asChild
                >
                  <Link href="#features">
                    Explore Features
                    <ChevronDown className="w-5 h-5 ml-2 group-hover:translate-y-1 transition-transform" />
                  </Link>
                </Button>
              </div>

              {/* Trust Indicators */}
              <div
                className={cn(
                  "flex flex-wrap justify-center gap-x-6 gap-y-2 mt-6 text-sm text-muted-foreground",
                  heroAnimation.isInView ? "animate-slide-up animation-delay-400" : "opacity-0"
                )}
              >
                {["No credit card required", "Free forever plan", "Setup in 2 minutes"].map(
                  (text) => (
                    <div key={text} className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-primary" />
                      <span>{text}</span>
                    </div>
                  )
                )}
              </div>
            </div>

            {/* Product Preview */}
            {/* <div
              className={cn(
                "mt-16 sm:mt-20",
                heroAnimation.isInView ? "animate-slide-up animation-delay-500" : "opacity-0"
              )}
            >
              <ProductPreview />
            </div>  */}
          </div>
        </section>

        {/* Social Proof Bar */}
        <SocialProofBar />

        {/* Stats Section */}
        <section
          ref={statsAnimation.ref}
          className="py-20 sm:py-24 bg-gradient-to-b from-muted/50 to-background"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
              {stats.map((stat, i) => (
                <div
                  key={i}
                  className={cn(
                    "text-center group",
                    statsAnimation.isInView ? "animate-scale-in" : "opacity-0"
                  )}
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  <div className="flex justify-center mb-4">
                    <div className="p-3 rounded-2xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      <stat.icon className="w-6 h-6" />
                    </div>
                  </div>
                  <div className="text-4xl sm:text-5xl font-bold mb-2">
                    <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                  </div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section with Tabs */}
        <section
          id="features"
          ref={featuresAnimation.ref}
          className="py-24 sm:py-32 scroll-mt-20"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-16">
              <div
                className={cn(
                  "inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 text-primary text-sm font-semibold mb-6",
                  featuresAnimation.isInView ? "animate-slide-up" : "opacity-0"
                )}
              >
                <Zap className="w-4 h-4" />
                Powerful Features
              </div>
              <h2
                className={cn(
                  "text-3xl sm:text-4xl lg:text-5xl font-bold mb-6",
                  featuresAnimation.isInView ? "animate-slide-up animation-delay-100" : "opacity-0"
                )}
              >
                Everything You Need,{" "}
                <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  All in One Place
                </span>
              </h2>
              <p
                className={cn(
                  "text-lg text-muted-foreground max-w-2xl mx-auto",
                  featuresAnimation.isInView ? "animate-slide-up animation-delay-200" : "opacity-0"
                )}
              >
                From AI-powered lesson creation to comprehensive student management. Professional
                tools designed specifically for UK educators.
              </p>
            </div>

            <div
              className={cn(
                featuresAnimation.isInView ? "animate-slide-up animation-delay-300" : "opacity-0"
              )}
            >
              <FeatureTabs />
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section
          ref={benefitsAnimation.ref}
          className="py-24 sm:py-32 bg-gradient-to-br from-primary/5 via-accent/5 to-background"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              <div
                className={cn(
                  benefitsAnimation.isInView ? "animate-slide-in-left" : "opacity-0"
                )}
              >
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-background border text-sm font-semibold mb-6">
                  <Clock className="w-4 h-4 text-primary" />
                  Work Smarter, Not Harder
                </div>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
                  Built for Every Stage of Your{" "}
                  <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    Teaching Journey
                  </span>
                </h2>
                <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                  Whether you&apos;re a trainee finding your feet, an ECT building your practice, or
                  an experienced educator maximising efficiency—our platform grows with you.
                </p>
                <Button size="lg" className="gap-2 group" asChild>
                  <Link href="/auth/sign-up">
                    Start Your Free Account
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              </div>

              <div
                className={cn(
                  "space-y-3",
                  benefitsAnimation.isInView ? "animate-slide-in-right" : "opacity-0"
                )}
              >
                {benefits.map((benefit, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-4 p-4 sm:p-5 rounded-xl bg-background/80 backdrop-blur-sm border hover:border-primary/40 hover:shadow-lg hover:-translate-x-2 transition-all group"
                  >
                    <div className="p-2.5 rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      <benefit.icon className="w-5 h-5" />
                    </div>
                    <span className="font-medium">{benefit.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section
          id="how-it-works"
          ref={stepsAnimation.ref}
          className="py-24 sm:py-32 scroll-mt-20"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-16">
              <div
                className={cn(
                  "inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 text-primary text-sm font-semibold mb-6",
                  stepsAnimation.isInView ? "animate-slide-up" : "opacity-0"
                )}
              >
                <Target className="w-4 h-4" />
                Simple Process
              </div>
              <h2
                className={cn(
                  "text-3xl sm:text-4xl lg:text-5xl font-bold mb-6",
                  stepsAnimation.isInView ? "animate-slide-up animation-delay-100" : "opacity-0"
                )}
              >
                Start Creating Outstanding Lessons in{" "}
                <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Under 3 Minutes
                </span>
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-8 lg:gap-12 relative">
              {/* Connection line */}
              <div className="hidden md:block absolute top-20 left-[20%] right-[20%] h-0.5 bg-gradient-to-r from-primary/20 via-primary to-primary/20" />

              {steps.map((item, i) => (
                <div
                  key={i}
                  className={cn(
                    "relative text-center md:text-left",
                    stepsAnimation.isInView ? "animate-scale-in" : "opacity-0"
                  )}
                  style={{ animationDelay: `${i * 200}ms` }}
                >
                  <div className="flex justify-center md:justify-start mb-6">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground font-bold text-xl shadow-xl shadow-primary/30 z-10">
                      {item.step}
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-primary/10 text-primary w-fit mx-auto md:mx-0 mb-4">
                    <item.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold mb-3">{item.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section
          id="testimonials"
          ref={testimonialsAnimation.ref}
          className="py-24 sm:py-32 bg-gradient-to-br from-accent/10 via-background to-primary/10 scroll-mt-20"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-16">
              <div
                className={cn(
                  "inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 text-primary text-sm font-semibold mb-6",
                  testimonialsAnimation.isInView ? "animate-slide-up" : "opacity-0"
                )}
              >
                <Award className="w-4 h-4" />
                Trusted by Educators
              </div>
              <h2
                className={cn(
                  "text-3xl sm:text-4xl lg:text-5xl font-bold mb-6",
                  testimonialsAnimation.isInView
                    ? "animate-slide-up animation-delay-100"
                    : "opacity-0"
                )}
              >
                Join Thousands of UK Educators{" "}
                <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Saving Time
                </span>
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
              {testimonials.map((testimonial, i) => (
                <div
                  key={i}
                  className={cn(
                    "p-6 sm:p-8 rounded-2xl bg-background/80 backdrop-blur-sm border hover:border-primary/40 hover:shadow-xl transition-all group",
                    testimonialsAnimation.isInView ? "animate-scale-in" : "opacity-0"
                  )}
                  style={{ animationDelay: `${i * 150}ms` }}
                >
                  {/* Rating */}
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, j) => (
                      <Star
                        key={j}
                        className="w-5 h-5 fill-yellow-400 text-yellow-400"
                      />
                    ))}
                  </div>

                  <p className="text-muted-foreground leading-relaxed mb-6">
                    &quot;{testimonial.quote}&quot;
                  </p>

                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground font-bold">
                      {testimonial.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                    <div>
                      <div className="font-semibold">{testimonial.name}</div>
                      <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                      <div className="text-xs text-muted-foreground">{testimonial.location}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Newsletter Section */}
        {/* <section className="py-16 bg-muted/30 border-y">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
            <div className="flex justify-center mb-4">
              <div className="p-3 rounded-2xl bg-primary/10 text-primary">
                <Mail className="w-6 h-6" />
              </div>
            </div>
            <h3 className="text-2xl font-bold mb-2">Get Free Teaching Tips</h3>
            <p className="text-muted-foreground mb-6">
              Join 5,000+ educators receiving weekly lesson ideas and teaching strategies.
            </p>
            <NewsletterSignup />
            <p className="text-xs text-muted-foreground mt-4">
              No spam. Unsubscribe anytime.
            </p>
          </div>
        </section> */}

        {/* Final CTA */}
        <section
          ref={ctaAnimation.ref}
          className="py-24 sm:py-32 bg-gradient-to-br from-primary via-primary to-primary/90 text-primary-foreground relative overflow-hidden"
        >
          {/* Background pattern */}
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
              backgroundSize: "32px 32px",
            }}
          />

          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
            <h2
              className={cn(
                "text-3xl sm:text-4xl lg:text-5xl font-bold mb-6",
                ctaAnimation.isInView ? "animate-slide-up" : "opacity-0"
              )}
            >
              Ready to Transform Your Lesson Planning?
            </h2>
            <p
              className={cn(
                "text-xl text-primary-foreground/80 mb-10 max-w-2xl mx-auto",
                ctaAnimation.isInView ? "animate-slide-up animation-delay-100" : "opacity-0"
              )}
            >
              Join thousands of UK educators who&apos;ve already saved countless hours while
              creating better, more engaging lessons.
            </p>

            <div
              className={cn(
                "flex flex-col sm:flex-row gap-4 justify-center mb-10",
                ctaAnimation.isInView ? "animate-slide-up animation-delay-200" : "opacity-0"
              )}
            >
              <Button
                size="lg"
                variant="secondary"
                className="h-14 px-8 text-lg font-semibold gap-2 group"
                asChild
              >
                <Link href="/auth/sign-up">
                  Start Free Today
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-14 px-8 text-lg font-semibold border-2 border-primary-foreground/30 bg-transparent hover:bg-primary-foreground/10 text-primary-foreground"
                asChild
              >
                <Link href="#features">View All Features</Link>
              </Button>
            </div>

            {/* Trust badges */}
            <div
              className={cn(
                "flex flex-wrap justify-center gap-6 text-sm text-primary-foreground/70",
                ctaAnimation.isInView ? "animate-slide-up animation-delay-300" : "opacity-0"
              )}
            >
              {[
                { icon: Shield, text: "GDPR Compliant" },
                { icon: Award, text: "Ofsted Aligned" },
                { icon: Target, text: "UK Curriculum" },
                { icon: GraduationCap, text: "ITT Framework" },
              ].map((badge) => (
                <div key={badge.text} className="flex items-center gap-2">
                  <badge.icon className="w-4 h-4" />
                  <span>{badge.text}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-16 bg-background border-t">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
              <div className="col-span-2">
                <Logo />
                <p className="text-muted-foreground text-sm mt-4 mb-6 max-w-xs">
                  AI-powered lesson planning designed exclusively for UK educators. Save time,
                  teach better.
                </p>
                {/* Social Links */}
                {/* <div className="flex gap-3">
                  {["twitter", "linkedin", "instagram"].map((social) => (
                    <a
                      key={social}
                      href={`https://${social}.com`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg bg-muted hover:bg-primary hover:text-primary-foreground transition-colors"
                    >
                      <span className="sr-only">{social}</span>
                      <div className="w-5 h-5" />
                    </a>
                  ))}
                </div> */}
              </div>

              {[
                {
                  title: "Product",
                  links: [
                    { label: "Features", href: "#features" },
                    { label: "Dashboard", href: "/dashboard" },
                    { label: "Pricing", href: "#pricing" },
                    { label: "Changelog", href: "#" },
                  ],
                },
                {
                  title: "Resources",
                  links: [
                    { label: "Help Centre", href: "#" },
                    { label: "Guides", href: "#" },
                    { label: "Blog", href: "#" },
                    { label: "Community", href: "#" },
                  ],
                },
                {
                  title: "Legal",
                  links: [
                    { label: "Privacy Policy", href: "/privacy-policy" },
                    { label: "Terms of Service", href: "/terms-of-service" },
                    { label: "GDPR", href: "/gdpr" },
                    { label: "Cookies", href: "/cookie-policy" },
                  ],
                },
              ].map((section) => (
                <div key={section.title}>
                  <h4 className="font-semibold mb-4">{section.title}</h4>
                  <ul className="space-y-3">
                    {section.links.map((link) => (
                      <li key={link.label}>
                        <Link
                          href={link.href}
                          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div className="pt-8 border-t flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
              <p>© {currentYear} Planly. Built for UK educators with ❤️</p>
              <p>Made in London, UK 🇬🇧</p>
            </div>
          </div>
        </footer>

        {/* Scroll to Top */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className={cn(
            "fixed bottom-6 right-6 p-3 rounded-full bg-primary text-primary-foreground shadow-lg",
            "hover:scale-110 transition-all z-50",
            isScrolled
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-10 pointer-events-none"
          )}
          aria-label="Scroll to top"
        >
          <ChevronDown className="w-5 h-5 rotate-180" />
        </button>

        {/* Mobile Bottom CTA Bar (Shows on scroll) */}
        <div
          className={cn(
            "fixed bottom-0 left-0 right-0 p-4 bg-background/95 backdrop-blur-xl border-t shadow-lg z-40",
            "transform transition-transform duration-300 lg:hidden",
            isScrolled ? "translate-y-0" : "translate-y-full"
          )}
        >
          <div className="flex items-center justify-between gap-4 max-w-lg mx-auto">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate">Start planning smarter</p>
              <p className="text-xs text-muted-foreground truncate">Free forever • No credit card</p>
            </div>
            <Button size="sm" className="flex-shrink-0 gap-1" asChild>
              <Link href="/auth/sign-up">
                Get Started
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </div>
        </div>
      </main>
    </>
  );
}