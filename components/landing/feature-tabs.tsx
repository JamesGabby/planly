// components/landing/feature-tabs.tsx
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  LayoutDashboard,
  GraduationCap,
  Users,
  BarChart3,
  CheckCircle2,
  ArrowRight,
  Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface Feature {
  id: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  shortTitle: string;
  description: string;
  benefits: string[];
  image: string;
  imageAlt: string;
  gradient: string;
  comingSoon?: boolean;
  comingSoonDate?: string;
}

const features: Feature[] = [
  {
    id: "ai",
    icon: Sparkles,
    title: "AI Lesson Generation",
    shortTitle: "AI Lessons",
    description:
      "Create outstanding, curriculum-aligned lessons in seconds. Our AI understands UK National Curriculum requirements and generates differentiated content tailored to any key stage.",
    benefits: [
      "Curriculum-aligned content",
      "Differentiated for all abilities",
      "Saves 6+ hours per week",
    ],
    image: "/images/ai-g.png",
    imageAlt: "AI Lesson Generation interface showing a lesson being created automatically",
    gradient: "from-violet-500 to-purple-500",
  },
  {
    id: "dashboard",
    icon: LayoutDashboard,
    title: "Unified Dashboard",
    shortTitle: "Dashboard",
    description:
      "One powerful hub to manage everything: Teacher lessons, tutor sessions, student profiles, and class groups. Switch seamlessly between teaching and tutoring workflows.",
    benefits: [
      "All-in-one management",
      "Teacher & tutor modes",
      "Intuitive organisation",
    ],
    image: "/images/unified.png",
    imageAlt: "Unified dashboard showing lesson plans, classes, and student overview",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    id: "guides",
    icon: GraduationCap,
    title: "Teacher Guides",
    shortTitle: "Guides",
    description:
      "Comprehensive planning frameworks, pedagogy insights, and ITT-aligned resources. Build confidence and meet Teaching Standards with expert guidance at every step.",
    benefits: [
      "ITT framework aligned",
      "Pedagogy insights",
      "Standards tracking",
    ],
    image: "/images/guides.png",
    imageAlt: "Teacher guides interface with planning frameworks and pedagogy resources",
    gradient: "from-emerald-500 to-teal-500",
  },
  {
    id: "profiles",
    icon: Users,
    title: "Student Profiles",
    shortTitle: "Profiles",
    description:
      "Track individual progress, SEN requirements, and attainment data. Create detailed profiles that inform your teaching and support effective differentiation strategies.",
    benefits: [
      "Individual tracking",
      "SEN documentation",
      "Progress insights",
    ],
    image: "/images/profile.png",
    imageAlt: "Student profiles showing individual progress tracking and SEN information",
    gradient: "from-orange-500 to-amber-500",
  },
  {
    id: "analytics",
    icon: BarChart3,
    title: "Teaching Analytics",
    shortTitle: "Analytics",
    description:
      "Gain powerful insights into your teaching patterns, student progress, and lesson effectiveness. AI-powered analytics helping you identify what works and continuously improve your practice coming soon!",
    benefits: [
      "AI-powered insights",
      "Progress visualisation",
      "Personalised recommendations",
    ],
    image: "/images/analytic.png",
    imageAlt: "Teaching analytics dashboard with AI insights and progress charts",
    gradient: "from-pink-500 to-rose-500",
    comingSoon: false,
    comingSoonDate: "Q2 2025",
  },
];

export function FeatureTabs() {
  const [activeTab, setActiveTab] = useState(features[0].id);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const activeFeature = features.find((f) => f.id === activeTab)!;
  const activeIndex = features.findIndex((f) => f.id === activeTab);

  // Auto-rotate tabs every 6 seconds
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setActiveTab((current) => {
        const currentIndex = features.findIndex((f) => f.id === current);
        const nextIndex = (currentIndex + 1) % features.length;
        return features[nextIndex].id;
      });
    }, 6000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  // Pause auto-play on user interaction
  const handleTabClick = (id: string) => {
    setIsAutoPlaying(false);
    setActiveTab(id);
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Tab Navigation - Desktop */}
      <div className="hidden md:flex justify-center gap-2 mb-12">
        {features.map((feature) => (
          <button
            key={feature.id}
            onClick={() => handleTabClick(feature.id)}
            className={cn(
              "relative flex items-center gap-2 px-5 py-3 rounded-full font-medium transition-all duration-300",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
              activeTab === feature.id
                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                : "bg-muted/80 hover:bg-muted text-muted-foreground hover:text-foreground"
            )}
            aria-selected={activeTab === feature.id}
            role="tab"
          >
            <feature.icon className="w-4 h-4" />
            <span>{feature.title}</span>
            {feature.comingSoon && (
              <span className="ml-1 px-2 py-0.5 text-[10px] font-bold uppercase rounded-full bg-gradient-to-r from-pink-500 to-rose-500 text-white">
                Soon
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tab Navigation - Mobile (Scrollable) */}
      <div className="md:hidden mb-8 -mx-4 px-4">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide snap-x snap-mandatory">
          {features.map((feature) => (
            <button
              key={feature.id}
              onClick={() => handleTabClick(feature.id)}
              className={cn(
                "relative flex items-center gap-2 px-4 py-2.5 rounded-full font-medium whitespace-nowrap snap-start",
                "transition-all duration-300 flex-shrink-0",
                activeTab === feature.id
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                  : "bg-muted/80 text-muted-foreground"
              )}
            >
              <feature.icon className="w-4 h-4" />
              <span>{feature.shortTitle}</span>
              {feature.comingSoon && (
                <span className="ml-1 px-1.5 py-0.5 text-[9px] font-bold uppercase rounded-full bg-gradient-to-r from-pink-500 to-rose-500 text-white">
                  Soon
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Progress Indicators */}
      <div className="flex justify-center gap-1.5 mb-8">
        {features.map((feature) => (
          <button
            key={feature.id}
            onClick={() => handleTabClick(feature.id)}
            className={cn(
              "h-1.5 rounded-full transition-all duration-300",
              activeTab === feature.id
                ? "w-8 bg-primary"
                : "w-1.5 bg-muted-foreground/30 hover:bg-muted-foreground/50"
            )}
            aria-label={`Go to ${feature.title}`}
          />
        ))}
      </div>

      {/* Content Area */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center"
        >
          {/* Text Content */}
          <div className="order-2 lg:order-1 space-y-6">
            {/* Icon & Badge */}
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  "inline-flex p-3 rounded-2xl bg-gradient-to-br shadow-lg",
                  activeFeature.gradient
                )}
              >
                <activeFeature.icon className="w-7 h-7 text-white" />
              </div>
              {activeFeature.comingSoon && (
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-pink-500/10 to-rose-500/10 border border-pink-500/20">
                  <Clock className="w-4 h-4 text-pink-500" />
                  <span className="text-sm font-semibold text-pink-600 dark:text-pink-400">
                    Coming {activeFeature.comingSoonDate}
                  </span>
                </div>
              )}
            </div>

            {/* Title */}
            <h3 className="text-3xl sm:text-4xl font-bold leading-tight">
              {activeFeature.title}
              {activeFeature.comingSoon && (
                <span className="ml-3 inline-flex items-center px-3 py-1 text-sm font-semibold rounded-full bg-gradient-to-r from-pink-500 to-rose-500 text-white align-middle">
                  Coming Soon
                </span>
              )}
            </h3>

            {/* Description */}
            <p className="text-lg text-muted-foreground leading-relaxed">
              {activeFeature.description}
            </p>

            {/* Benefits */}
            <ul className="space-y-4">
              {activeFeature.benefits.map((benefit, i) => (
                <motion.li
                  key={benefit}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1, duration: 0.3 }}
                  className="flex items-start gap-3"
                >
                  <div
                    className={cn(
                      "flex-shrink-0 p-1 rounded-full bg-gradient-to-br mt-0.5",
                      activeFeature.gradient
                    )}
                  >
                    <CheckCircle2 className="w-4 h-4 text-white" />
                  </div>
                  <span className="font-medium text-foreground">{benefit}</span>
                </motion.li>
              ))}
            </ul>

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="pt-4"
            >
              {activeFeature.comingSoon ? (
                <Button
                  variant="outline"
                  size="lg"
                  className="gap-2 group border-pink-500/30 text-pink-600 hover:bg-pink-500/10 dark:text-pink-400"
                  asChild
                >
                  <Link href="#waitlist">
                    Join the Waitlist
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              ) : (
                <Button
                  size="lg"
                  className={cn(
                    "gap-2 group shadow-lg",
                    `shadow-${activeFeature.gradient.split(" ")[0].replace("from-", "")}/25`
                  )}
                  asChild
                >
                  <Link href="/auth/sign-up">
                    Try {activeFeature.shortTitle} Free
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              )}
            </motion.div>
          </div>

          {/* Image/Preview */}
          <div className="order-1 lg:order-2">
            <motion.div
              className="relative"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.4 }}
            >
              {/* Decorative Background */}
              <div
                className={cn(
                  "absolute -inset-4 rounded-3xl bg-gradient-to-br opacity-20 blur-2xl",
                  activeFeature.gradient
                )}
              />

              {/* Browser Frame */}
              <div className="relative rounded-2xl overflow-hidden border-2 border-border/50 shadow-2xl bg-background">
                {/* Browser Header */}
                <div className="flex items-center gap-2 px-4 py-3 bg-muted/50 border-b">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500/80" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                    <div className="w-3 h-3 rounded-full bg-green-500/80" />
                  </div>
                  <div className="flex-1 mx-4">
                    <div className="max-w-xs mx-auto px-3 py-1 rounded-md bg-background text-xs text-muted-foreground text-center font-mono truncate">
                      lessonly/{activeFeature.id}
                    </div>
                  </div>
                </div>

                {/* Image Container */}
                <div className="relative aspect-[16/10] bg-muted">
                  {activeFeature.comingSoon ? (
                    /* Coming Soon Placeholder */
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-8 bg-gradient-to-br from-muted to-muted/50">
                      <div
                        className={cn(
                          "p-6 rounded-3xl bg-gradient-to-br mb-6 shadow-xl",
                          activeFeature.gradient
                        )}
                      >
                        <activeFeature.icon className="w-16 h-16 text-white" />
                      </div>
                      <div className="text-center">
                        <p className="text-xl font-bold mb-2">Coming Soon</p>
                        <p className="text-muted-foreground">
                          AI-powered analytics launching {activeFeature.comingSoonDate}
                        </p>
                      </div>

                      {/* Animated Preview Elements */}
                      <div className="absolute inset-x-8 bottom-8 space-y-3 opacity-30">
                        <div className="h-4 bg-foreground/10 rounded-full w-3/4 animate-pulse" />
                        <div className="h-4 bg-foreground/10 rounded-full w-1/2 animate-pulse animation-delay-200" />
                        <div className="flex gap-3">
                          <div className="h-20 bg-foreground/10 rounded-xl flex-1 animate-pulse animation-delay-300" />
                          <div className="h-20 bg-foreground/10 rounded-xl flex-1 animate-pulse animation-delay-400" />
                          <div className="h-20 bg-foreground/10 rounded-xl flex-1 animate-pulse animation-delay-500" />
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* Actual Feature Image */
                    <Image
                      src={activeFeature.image}
                      alt={activeFeature.imageAlt}
                      fill
                      className="object-cover object-top"
                      sizes="(max-width: 768px) 100vw, 50vw"
                      priority={activeIndex === 0}
                    />
                  )}
                </div>
              </div>

              {/* Floating Notification - Only for non-coming-soon features */}
              {!activeFeature.comingSoon && (
                <motion.div
                  initial={{ opacity: 0, y: 20, x: -20 }}
                  animate={{ opacity: 1, y: 0, x: 0 }}
                  transition={{ delay: 0.5 }}
                  className="absolute -bottom-4 -left-4 hidden lg:block"
                >
                  <div className="p-3 rounded-xl bg-background/95 backdrop-blur border shadow-xl">
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          "p-2 rounded-lg bg-gradient-to-br",
                          activeFeature.gradient
                        )}
                      >
                        <CheckCircle2 className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold">Feature Active</p>
                        <p className="text-xs text-muted-foreground">Available now</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Keyboard Navigation Hint */}
      <p className="hidden lg:block text-center text-xs text-muted-foreground mt-8">
        Tip: Click tabs or use the progress dots to explore features
      </p>
    </div>
  );
}