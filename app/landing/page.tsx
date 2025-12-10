"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  Sparkles,
  BookOpen,
  Users,
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
  Menu,
  X,
} from "lucide-react";
import { FloatingParticles } from "@/components/landing/floating-particles";
import { TypewriterText } from "@/components/landing/TypewriterText";
import { HeroAnimation } from "@/components/three-animations/hero-animation";

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

  const features = [
    {
      title: "AI Lesson Generation",
      desc: "Create outstanding, curriculum-aligned lessons in seconds. Our AI understands UK National Curriculum requirements and generates differentiated content tailored to any key stage.",
      icon: <Sparkles className="w-8 h-8" />,
      badge: "Most Popular",
      gradient: "from-violet-500 to-purple-500",
    },
    {
      title: "Unified Dashboard",
      desc: "One powerful hub to manage everything—teacher lessons, tutor sessions, student profiles, and class groups. Switch seamlessly between teaching and tutoring workflows.",
      icon: <LayoutDashboard className="w-8 h-8" />,
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      title: "Student Teacher Guides",
      desc: "Comprehensive planning frameworks, pedagogy insights, and ITT-aligned resources. Build confidence and meet Teaching Standards with expert guidance at every step.",
      icon: <GraduationCap className="w-8 h-8" />,
      gradient: "from-emerald-500 to-teal-500",
    },
    {
      title: "Student & Class Profiles",
      desc: "Track individual progress, SEN requirements, and attainment data. Create detailed profiles that inform your teaching and support effective differentiation strategies.",
      icon: <Users className="w-8 h-8" />,
      gradient: "from-orange-500 to-amber-500",
    },
    {
      title: "Curriculum Alignment",
      desc: "Automatically link every lesson to National Curriculum objectives, assessment criteria, and exam board specifications with intelligent, real-time tracking.",
      icon: <Target className="w-8 h-8" />,
      gradient: "from-pink-500 to-rose-500",
    },
    {
      title: "Flexible Lesson Views",
      desc: "Toggle between detailed teacher plans, streamlined tutor formats, and student-facing resources. Adapt seamlessly to any teaching context or environment.",
      icon: <BookOpen className="w-8 h-8" />,
      gradient: "from-indigo-500 to-blue-500",
    },
  ];

  const benefits = [
    { text: "Save 6+ hours weekly on planning", icon: <Clock className="w-5 h-5" /> },
    { text: "Ofsted & ITT framework compliant", icon: <Award className="w-5 h-5" /> },
    { text: "AI trained on outstanding lessons", icon: <Brain className="w-5 h-5" /> },
    { text: "Perfect for NQTs, ECTs & trainees", icon: <GraduationCap className="w-5 h-5" /> },
    { text: "GDPR-secure student data", icon: <Shield className="w-5 h-5" /> },
    { text: "UK curriculum-specific content", icon: <FileText className="w-5 h-5" /> },
  ];

  const stats = [
    { value: 6, suffix: "hrs+", label: "Saved Weekly", icon: <Clock className="w-6 h-6" /> },
    { value: 15, suffix: "k+", label: "Lessons Created", icon: <FileText className="w-6 h-6" /> },
    { value: 97, suffix: "%", label: "User Satisfaction", icon: <TrendingUp className="w-6 h-6" /> },
    { value: 100, suffix: "%", label: "UK Aligned", icon: <Target className="w-6 h-6" /> },
  ];

  const steps = [
    {
      step: "01",
      title: "Build Your Teaching Hub",
      desc: "Set up class groups, create detailed student profiles, and organise your teaching schedule. Separate teacher and tutor workflows while managing everything from one powerful dashboard.",
      icon: <LayoutDashboard className="w-8 h-8" />,
    },
    {
      step: "02",
      title: "Let AI Create Your Lessons",
      desc: "Simply describe your topic, select the key stage and subject—our AI generates comprehensive, differentiated lesson plans aligned to curriculum objectives in seconds, not hours.",
      icon: <Sparkles className="w-8 h-8" />,
    },
    {
      step: "03",
      title: "Teach with Confidence",
      desc: "Access student teacher guides, deliver engaging lessons, and track student progress against objectives. Build and refine your growing library of outstanding lesson plans.",
      icon: <Award className="w-8 h-8" />,
    },
  ];

  const testimonials = [
    {
      quote:
        "This platform has transformed how I plan lessons. What used to take 2-3 hours now takes 15 minutes. The AI suggestions are genuinely curriculum-aligned and save me so much time.",
      name: "Sarah Mitchell",
      role: "Secondary English Teacher",
      school: "Manchester",
      avatar: "SM",
    },
    {
      quote:
        "As a trainee teacher, the planning guides have been invaluable. I feel so much more confident going into lessons knowing I've covered all the essential elements.",
      name: "James Thompson",
      role: "PGCE Student Teacher",
      school: "Birmingham",
      avatar: "JT",
    },
    {
      quote:
        "Managing both my school classes and private tutoring used to be chaotic. Now everything is in one place, beautifully organised. Game changer for busy tutors!",
      name: "Priya Sharma",
      role: "Maths Teacher & Tutor",
      school: "London",
      avatar: "PS",
    },
  ];

  const heroAnimation = useInView(0.1);
  const statsAnimation = useInView(0.2);
  const featuresAnimation = useInView(0.1);
  const benefitsAnimation = useInView(0.1);
  const stepsAnimation = useInView(0.1);
  const testimonialsAnimation = useInView(0.1);
  const ctaAnimation = useInView(0.1);

  return (
    <main className="min-h-screen bg-background text-foreground scroll-smooth overflow-x-hidden">
      {/* Hero Section - Softer Backdrop Version */}
      <section className="relative min-h-screen flex items-center pt-10" ref={heroAnimation.ref}>
        {/* Three.js Animation Background */}
        <HeroAnimation />

        {/* Gradient overlays */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 -right-32 w-[500px] h-[500px] bg-gradient-to-br from-primary/20 to-accent/10 rounded-full blur-[100px]" />
          <div className="absolute -bottom-32 -left-32 w-[600px] h-[600px] bg-gradient-to-tr from-accent/10 to-primary/5 rounded-full blur-[120px]" />
        </div>

        {/* Main Content Container */}
        <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-20 z-10">

          {/* Soft Radial Backdrop - Less Obstructive */}
          <div
            className="absolute inset-0 -mx-4 sm:-mx-6 pointer-events-none"
            style={{
              background: `radial-gradient(
                ellipse 80% 70% at 50% 50%,
                hsl(var(--background) / 0.85) 0%,
                hsl(var(--background) / 0.6) 40%,
                hsl(var(--background) / 0.3) 70%,
                transparent 100%
              )`,
            }}
          />

          {/* Content */}
          <div className="relative flex flex-col items-center text-center gap-6 sm:gap-8">

            {/* Animated Badge */}
            <div
              className={`inline-flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 rounded-full 
                bg-background/80 backdrop-blur-md
                border border-primary/30 
                shadow-xl shadow-background/20 
                ${heroAnimation.isInView ? "animate-slide-up" : "opacity-0"}`}
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

            {/* Main Headline */}
            <h1
              className={`text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold max-w-5xl leading-[1.1] tracking-tight
                drop-shadow-[0_2px_10px_hsl(var(--background))]
                ${heroAnimation.isInView ? "animate-slide-up animation-delay-100" : "opacity-0"}`}
            >
              Create Outstanding Lessons in{" "}
              <TypewriterText texts={["Minutes", "Seconds", "No Time"]} />
            </h1>

            {/* Subheadline with subtle background pill */}
            <div
              className={`max-w-3xl rounded-2xl px-6 py-4 
                border border-border/20
                ${heroAnimation.isInView ? "animate-slide-up animation-delay-200" : "bg-opacity-0"}`}
            >
              <p className="text-xl md:text-2xl lg:text-3xl max-w-4xl text-muted-foreground leading-relaxed animate-fade-up animate-once font-light">
                The intelligent planning platform built exclusively for UK teachers, tutors, and
                trainee educators. AI-powered, curriculum-aligned, and designed to save you time.
              </p>
            </div>

            {/* CTA Buttons */}
            <div
              className={`flex flex-col sm:flex-row gap-4 mt-4 w-full sm:w-auto px-4 sm:px-0 
              ${heroAnimation.isInView ? "animate-slide-up animation-delay-300" : "opacity-0"}`}
            >
              <Button
                size="lg"
                className="w-full sm:w-auto px-6 sm:px-10 py-6 sm:py-7 text-base sm:text-lg font-semibold 
                  shadow-2xl shadow-primary/30 
                  hover:shadow-2xl hover:shadow-primary/40 
                  hover:scale-[1.02] 
                  transition-all duration-300 
                  gap-3 group relative overflow-hidden"
                asChild
              >
                <Link href="/dashboard">
                  <span className="relative z-10 flex items-center gap-2">
                    <Play className="w-5 h-5" />
                    Start Planning for Free
                  </span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform relative z-10" />
                  <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary to-accent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto px-6 sm:px-10 py-6 sm:py-7 text-base sm:text-lg font-semibold 
            border-2 
            bg-background/50 backdrop-blur-sm
            hover:bg-accent/50 
            hover:scale-[1.02] 
            transition-all duration-300 
            group"
                asChild
              >
                <Link href="#features" className="flex items-center gap-2">
                  Explore Features
                  <ChevronDown className="w-5 h-5 group-hover:translate-y-1 transition-transform" />
                </Link>
              </Button>
            </div>

            {/* Trust Indicators */}
            <div
              className={`flex flex-wrap justify-center gap-4 sm:gap-6 md:gap-8 mt-6 sm:mt-10 text-xs sm:text-sm 
          px-6 py-3 rounded-full
          bg-background/40 backdrop-blur-sm
          ${heroAnimation.isInView ? "animate-slide-up animation-delay-400" : "opacity-0"}`}
            >
              {["No credit card required", "Free forever plan", "Setup in 2 minutes"].map(
                (text, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 text-foreground/80 hover:text-foreground transition-colors group cursor-default"
                  >
                    <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-primary group-hover:scale-110 transition-transform" />
                    <span className="font-semibold">{text}</span>
                  </div>
                )
              )}
            </div>

            {/* Scroll Indicator */}
            <div
              className={`mt-8 sm:mt-12 animate-bounce-subtle 
          ${heroAnimation.isInView ? "animate-slide-up animation-delay-500" : "opacity-0"}`}
            >
              <div className="p-2 rounded-full bg-background/50 backdrop-blur-sm">
                <ChevronDown className="w-6 h-6 text-muted-foreground" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section
        ref={statsAnimation.ref}
        className="px-4 sm:px-6 py-16 sm:py-20 md:py-24 border-y bg-gradient-to-br from-accent/20 via-background to-primary/10 backdrop-blur-sm relative overflow-hidden"
      >
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, rgb(var(--foreground) / 0.05) 1px, transparent 0)",
            backgroundSize: "40px 40px",
          }}
        />

        <div className="max-w-7xl mx-auto relative">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 md:gap-12">
            {stats.map((stat, i) => (
              <div
                key={i}
                className={`text-center group cursor-default ${statsAnimation.isInView ? "animate-scale-in" : "opacity-0"
                  }`}
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="flex justify-center mb-3 sm:mb-4 text-primary group-hover:scale-125 transition-transform duration-500">
                  {stat.icon}
                </div>
                <div className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent mb-2 group-hover:scale-105 transition-transform duration-300">
                  <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                </div>
                <div className="text-xs sm:text-sm md:text-base text-muted-foreground font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section
        id="features"
        ref={featuresAnimation.ref}
        className="px-4 sm:px-6 py-20 sm:py-28 md:py-32 lg:py-40 relative scroll-mt-20"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background" />

        <div className="max-w-7xl mx-auto text-center mb-12 sm:mb-16 md:mb-24 relative">
          <div
            className={`inline-flex items-center gap-2 px-4 sm:px-5 py-2 rounded-full bg-primary/10 border border-primary/30 text-primary text-xs sm:text-sm font-semibold mb-4 sm:mb-6 backdrop-blur-sm ${featuresAnimation.isInView ? "animate-slide-up" : "opacity-0"
              }`}
          >
            <Zap className="w-4 h-4" />
            Powerful Features
          </div>
          <h2
            className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 sm:mb-6 leading-tight px-4 ${featuresAnimation.isInView ? "animate-slide-up animation-delay-100" : "opacity-0"
              }`}
          >
            Everything You Need,{" "}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              All in One Place
            </span>
          </h2>
          <p
            className={`text-base sm:text-lg md:text-xl lg:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed font-light px-4 ${featuresAnimation.isInView ? "animate-slide-up animation-delay-200" : "opacity-0"
              }`}
          >
            From AI-powered lesson creation to comprehensive student management—professional tools
            designed specifically for UK educators.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 max-w-7xl mx-auto relative">
          {features.map((f, i) => (
            <div
              key={i}
              className={`relative flex flex-col items-start p-6 sm:p-8 md:p-10 rounded-2xl sm:rounded-3xl border-2 bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm hover:border-primary/60 transition-all duration-500 group hover-lift ${featuresAnimation.isInView ? "animate-scale-in" : "opacity-0"
                }`}
              style={{ animationDelay: `${i * 100}ms` }}
            >
              {f.badge && (
                <div className="absolute -top-3 -right-3 px-3 sm:px-4 py-1 sm:py-1.5 bg-gradient-to-r from-primary to-accent text-primary-foreground text-xs font-bold rounded-full shadow-lg animate-bounce-subtle">
                  {f.badge}
                </div>
              )}

              <div
                className={`p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-gradient-to-br ${f.gradient} text-white mb-4 sm:mb-6 group-hover:scale-110 group-hover:rotate-3 transform transition-all duration-500 shadow-lg`}
              >
                {f.icon}
              </div>

              <h3 className="text-xl sm:text-2xl md:text-3xl font-bold mb-3 sm:mb-4 group-hover:text-primary transition-colors">
                {f.title}
              </h3>
              <p className="text-muted-foreground text-sm sm:text-base md:text-lg leading-relaxed">
                {f.desc}
              </p>

              {/* Hover effect line */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-accent scale-x-0 group-hover:scale-x-100 transition-transform duration-500 rounded-b-3xl" />
            </div>
          ))}
        </div>
      </section>

      {/* Benefits Section */}
      <section
        ref={benefitsAnimation.ref}
        className="px-4 sm:px-6 py-20 sm:py-28 md:py-32 bg-gradient-to-br from-primary/5 via-accent/5 to-background relative overflow-hidden"
      >
        <div className="absolute top-20 right-20 w-64 sm:w-96 h-64 sm:h-96 bg-primary/10 rounded-full blur-3xl animate-morph" />
        <div
          className="absolute bottom-20 left-20 w-64 sm:w-96 h-64 sm:h-96 bg-accent/10 rounded-full blur-3xl animate-morph"
          style={{ animationDelay: "4s" }}
        />

        <div className="max-w-7xl mx-auto relative">
          <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 md:gap-16 items-center">
            <div
              className={`order-2 lg:order-1 ${benefitsAnimation.isInView ? "animate-slide-in-left" : "opacity-0"
                }`}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-background/80 backdrop-blur-sm border text-xs sm:text-sm font-semibold mb-4 sm:mb-6">
                <Clock className="w-4 h-4 text-primary" />
                Work Smarter, Not Harder
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 leading-tight">
                Built for Every Stage of Your{" "}
                <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Teaching Journey
                </span>
              </h2>
              <p className="text-base sm:text-lg md:text-xl text-muted-foreground mb-6 sm:mb-8 leading-relaxed font-light">
                {
                  "Whether you're a trainee teacher finding your feet, an NQT/ECT building your practice, or an experienced educator maximizing efficiency—our platform grows with you every step of the way."
                }
              </p>
              <Button
                size="lg"
                className="gap-2 group px-6 sm:px-8 py-5 sm:py-6 text-base sm:text-lg font-semibold shadow-xl hover:scale-105 transition-all duration-300"
                asChild
              >
                <Link href="/dashboard">
                  Start Your Free Account
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </div>

            <div
              className={`grid gap-3 sm:gap-4 order-1 lg:order-2 ${benefitsAnimation.isInView ? "animate-slide-in-right" : "opacity-0"
                }`}
            >
              {benefits.map((benefit, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 sm:gap-4 p-4 sm:p-6 rounded-xl sm:rounded-2xl bg-background/80 backdrop-blur-sm border-2 hover:border-primary/40 transition-all duration-300 hover:shadow-xl hover:-translate-x-2 group"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  <div className="p-2 sm:p-3 rounded-lg sm:rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300 group-hover:scale-110">
                    {benefit.icon}
                  </div>
                  <span className="text-sm sm:text-base md:text-lg font-semibold">
                    {benefit.text}
                  </span>
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
        className="px-4 sm:px-6 py-20 sm:py-28 md:py-32 relative scroll-mt-20"
      >
        <div className="max-w-7xl mx-auto text-center mb-12 sm:mb-16 md:mb-20">
          <div
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 text-primary text-xs sm:text-sm font-semibold mb-4 sm:mb-6 ${stepsAnimation.isInView ? "animate-slide-up" : "opacity-0"
              }`}
          >
            <Target className="w-4 h-4" />
            Simple Process
          </div>
          <h2
            className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 leading-tight px-4 ${stepsAnimation.isInView ? "animate-slide-up animation-delay-100" : "opacity-0"
              }`}
          >
            Start Creating Outstanding Lessons in{" "}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Under 3 Minutes
            </span>
          </h2>
          <p
            className={`text-base sm:text-lg md:text-xl lg:text-2xl text-muted-foreground max-w-3xl mx-auto font-light px-4 ${stepsAnimation.isInView ? "animate-slide-up animation-delay-200" : "opacity-0"
              }`}
          >
            {
              "From account creation to your first AI-generated lesson—it's incredibly quick and intuitive"
            }
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-6 sm:gap-8 md:gap-12 relative">
            {/* Connection line for desktop */}
            <div className="hidden md:block absolute top-24 left-[20%] right-[20%] h-0.5 bg-gradient-to-r from-primary/20 via-primary to-primary/20" />

            {steps.map((item, i) => (
              <div
                key={i}
                className={`relative group ${stepsAnimation.isInView ? "animate-scale-in" : "opacity-0"
                  }`}
                style={{ animationDelay: `${i * 200}ms` }}
              >
                {/* Step number circle */}
                <div className="relative mb-6 sm:mb-8 flex justify-center md:justify-start">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground font-bold text-lg sm:text-xl shadow-xl shadow-primary/30 group-hover:scale-110 transition-transform duration-300 z-10">
                    {item.step}
                  </div>
                </div>

                {/* Icon */}
                <div className="mb-4 sm:mb-6 p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-primary/10 text-primary w-fit group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300 group-hover:scale-110 transform mx-auto md:mx-0">
                  {item.icon}
                </div>

                {/* Content */}
                <h3 className="text-xl sm:text-2xl md:text-3xl font-bold mb-3 sm:mb-4 relative group-hover:text-primary transition-colors text-center md:text-left">
                  {item.title}
                </h3>
                <p className="text-muted-foreground text-sm sm:text-base md:text-lg leading-relaxed relative text-center md:text-left">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section
        id="testimonials"
        ref={testimonialsAnimation.ref}
        className="px-4 sm:px-6 py-20 sm:py-28 md:py-32 bg-gradient-to-br from-accent/10 via-background to-primary/10 relative overflow-hidden scroll-mt-20"
      >
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, rgb(var(--foreground) / 0.05) 1px, transparent 0)",
            backgroundSize: "40px 40px",
          }}
        />

        <div className="max-w-7xl mx-auto relative">
          <div className="text-center mb-12 sm:mb-16">
            <div
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 text-primary text-xs sm:text-sm font-semibold mb-4 sm:mb-6 ${testimonialsAnimation.isInView ? "animate-slide-up" : "opacity-0"
                }`}
            >
              <Award className="w-4 h-4" />
              Trusted by Educators
            </div>
            <h2
              className={`text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 px-4 ${testimonialsAnimation.isInView ? "animate-slide-up animation-delay-100" : "opacity-0"
                }`}
            >
              Join Thousands of UK Educators{" "}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Saving Time
              </span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6 sm:gap-8">
            {testimonials.map((testimonial, i) => (
              <div
                key={i}
                className={`p-6 sm:p-8 rounded-2xl sm:rounded-3xl bg-background/80 backdrop-blur-sm border-2 hover:border-primary/40 transition-all duration-500 group hover-lift ${testimonialsAnimation.isInView ? "animate-scale-in" : "opacity-0"
                  }`}
                style={{ animationDelay: `${i * 150}ms` }}
              >
                {/* Star rating with animation */}
                <div className="flex gap-1 mb-4 sm:mb-6">
                  {[...Array(5)].map((_, j) => (
                    <div
                      key={j}
                      className="text-yellow-500 transform group-hover:scale-110 transition-transform duration-300"
                      style={{ transitionDelay: `${j * 50}ms` }}
                    >
                      ★
                    </div>
                  ))}
                </div>

                <p className="text-muted-foreground text-sm sm:text-base md:text-lg leading-relaxed mb-4 sm:mb-6 italic">
                  &quot;{testimonial.quote}&quot;
                </p>

                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground font-bold text-sm sm:text-lg shadow-lg group-hover:scale-110 transition-transform duration-300">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-sm sm:text-base">{testimonial.name}</div>
                    <div className="text-xs sm:text-sm text-muted-foreground">
                      {testimonial.role}
                    </div>
                    <div className="text-xs text-muted-foreground">{testimonial.school}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section
        ref={ctaAnimation.ref}
        className="px-4 sm:px-6 py-20 sm:py-28 md:py-32 lg:py-40 bg-gradient-to-br from-primary via-primary to-primary/90 text-primary-foreground relative overflow-hidden"
      >
        {/* Animated background */}
        <div className="absolute inset-0">
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
              backgroundSize: "40px 40px",
            }}
          />
          <div className="absolute top-0 right-0 w-64 sm:w-96 h-64 sm:h-96 bg-white/5 rounded-full blur-3xl animate-morph" />
          <div
            className="absolute bottom-0 left-0 w-64 sm:w-96 h-64 sm:h-96 bg-white/5 rounded-full blur-3xl animate-morph"
            style={{ animationDelay: "3s" }}
          />
        </div>

        <div className="relative max-w-5xl mx-auto text-center">
          <h2
            className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 sm:mb-6 leading-tight px-4 ${ctaAnimation.isInView ? "animate-slide-up" : "opacity-0"
              }`}
          >
            Ready to Transform Your{" "}
            <span className="relative inline-block">
              Lesson Planning?
              <svg
                className="absolute -bottom-2 left-0 w-full"
                viewBox="0 0 200 8"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M1 5.5C47.6667 2.16667 141.4 -2.1 199 5.5"
                  stroke="currentColor"
                  strokeOpacity="0.4"
                  strokeWidth="2"
                  strokeLinecap="round"
                  className="animate-draw"
                />
              </svg>
            </span>
          </h2>
          <p
            className={`text-primary-foreground/90 text-base sm:text-lg md:text-xl lg:text-2xl max-w-3xl mx-auto mb-8 sm:mb-12 leading-relaxed font-light px-4 ${ctaAnimation.isInView ? "animate-slide-up animation-delay-100" : "opacity-0"
              }`}
          >
            {
              "Join hundreds of UK educators who've already saved countless hours while creating better, more engaging lessons for their students."
            }
          </p>

          <div
            className={`flex flex-col sm:flex-row gap-4 justify-center mb-8 sm:mb-12 px-4 ${ctaAnimation.isInView ? "animate-slide-up animation-delay-200" : "opacity-0"
              }`}
          >
            <Button
              size="lg"
              variant="secondary"
              className="text-base sm:text-lg px-6 sm:px-10 py-5 sm:py-7 gap-2 shadow-2xl hover:shadow-xl hover:scale-105 transition-all duration-300 group text-primary font-semibold"
              asChild
            >
              <Link href="/dashboard">
                Start Free Today
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-base sm:text-lg px-6 sm:px-10 py-5 sm:py-7 border-2 border-primary-foreground/60 bg-primary-foreground/10 hover:bg-primary-foreground/20 text-primary-foreground backdrop-blur-sm hover:scale-[1.02] transition-all duration-300"
              asChild
            >
              <Link href="#features">View All Features</Link>
            </Button>
          </div>

          <div
            className={`flex flex-wrap justify-center gap-4 sm:gap-6 md:gap-8 text-xs sm:text-sm text-primary-foreground/80 mb-8 px-4 ${ctaAnimation.isInView ? "animate-slide-up animation-delay-300" : "opacity-0"
              }`}
          >
            {["Free to start", "No setup fees", "Cancel anytime", "No credit card"].map(
              (text, i) => (
                <div key={i} className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5" />
                  {text}
                </div>
              )
            )}
          </div>

          {/* Trust badges */}
          <div
            className={`pt-6 sm:pt-8 border-t border-primary-foreground/20 ${ctaAnimation.isInView ? "animate-slide-up animation-delay-400" : "opacity-0"
              }`}
          >
            <p className="text-primary-foreground/60 text-xs sm:text-sm mb-4 uppercase tracking-wider font-semibold">
              Trusted & Compliant
            </p>
            <div className="flex flex-wrap justify-center gap-4 sm:gap-6 md:gap-8">
              {[
                { icon: <Shield className="w-4 h-4 sm:w-5 sm:h-5" />, text: "GDPR Compliant" },
                { icon: <Award className="w-4 h-4 sm:w-5 sm:h-5" />, text: "Ofsted Aligned" },
                { icon: <Target className="w-4 h-4 sm:w-5 sm:h-5" />, text: "UK Curriculum" },
                {
                  icon: <GraduationCap className="w-4 h-4 sm:w-5 sm:h-5" />,
                  text: "ITT Framework",
                },
              ].map((badge, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                >
                  {badge.icon}
                  <span className="font-medium text-xs sm:text-sm">{badge.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-4 sm:px-6 py-12 sm:py-16 bg-background border-t">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8 sm:mb-12">
            <div className="col-span-2 md:col-span-1">
              <Link href="/" className="flex items-center gap-2 mb-4 group">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Sparkles className="w-5 h-5 text-primary-foreground" />
                </div>
                <span className="font-bold text-xl">Lessonly</span>
              </Link>
              <p className="text-muted-foreground text-sm leading-relaxed">
                AI-powered lesson planning designed exclusively for UK educators.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link
                    href="#features"
                    className="hover:text-primary transition-colors inline-flex items-center gap-1 group"
                  >
                    Features
                    <ArrowRight className="w-3 h-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                  </Link>
                </li>
                <li>
                  <Link
                    href="/dashboard"
                    className="hover:text-primary transition-colors inline-flex items-center gap-1 group"
                  >
                    Dashboard
                    <ArrowRight className="w-3 h-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="hover:text-primary transition-colors inline-flex items-center gap-1 group"
                  >
                    Pricing
                    <ArrowRight className="w-3 h-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link
                    href="#"
                    className="hover:text-primary transition-colors inline-flex items-center gap-1 group"
                  >
                    Help Centre
                    <ArrowRight className="w-3 h-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="hover:text-primary transition-colors inline-flex items-center gap-1 group"
                  >
                    Guides
                    <ArrowRight className="w-3 h-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="hover:text-primary transition-colors inline-flex items-center gap-1 group"
                  >
                    Blog
                    <ArrowRight className="w-3 h-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link
                    href="#"
                    className="hover:text-primary transition-colors inline-flex items-center gap-1 group"
                  >
                    Privacy Policy
                    <ArrowRight className="w-3 h-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="hover:text-primary transition-colors inline-flex items-center gap-1 group"
                  >
                    Terms of Service
                    <ArrowRight className="w-3 h-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="hover:text-primary transition-colors inline-flex items-center gap-1 group"
                  >
                    GDPR
                    <ArrowRight className="w-3 h-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t text-center text-sm text-muted-foreground">
            <p>© 2025 Lessonly. Built for UK educators with ❤️</p>
          </div>
        </div>
      </footer>

      {/* Scroll to top button */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className={`fixed bottom-6 right-6 p-3 rounded-full bg-primary text-primary-foreground shadow-xl shadow-primary/30 hover:scale-110 transition-all duration-300 z-50 ${isScrolled ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10 pointer-events-none"
          }`}
      >
        <ChevronDown className="w-5 h-5 rotate-180" />
      </button>
    </main>
  );
}