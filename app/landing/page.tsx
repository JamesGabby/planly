import Link from "next/link";
import { Button } from "@/components/ui/button";
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
  Shield
} from "lucide-react";

export default function LandingPage() {
  const features = [
    {
      title: "AI Lesson Generation",
      desc: "Create outstanding, curriculum-aligned lessons in seconds. Our AI understands UK National Curriculum requirements and generates differentiated content tailored to any key stage.",
      icon: <Sparkles className="w-10 h-10 mb-4 text-primary" />,
      badge: "Most Popular"
    },
    {
      title: "Unified Dashboard",
      desc: "One powerful hub to manage everything—teacher lessons, tutor sessions, student profiles, and class groups. Switch seamlessly between teaching and tutoring workflows.",
      icon: <LayoutDashboard className="w-10 h-10 mb-4 text-primary" />,
    },
    {
      title: "Student Teacher Guides",
      desc: "Comprehensive planning frameworks, pedagogy insights, and ITT-aligned resources. Build confidence and meet Teaching Standards with expert guidance at every step.",
      icon: <GraduationCap className="w-10 h-10 mb-4 text-primary" />,
    },
    {
      title: "Student & Class Profiles",
      desc: "Track individual progress, SEN requirements, and attainment data. Create detailed profiles that inform your teaching and support effective differentiation strategies.",
      icon: <Users className="w-10 h-10 mb-4 text-primary" />,
    },
    {
      title: "Curriculum Alignment",
      desc: "Automatically link every lesson to National Curriculum objectives, assessment criteria, and exam board specifications with intelligent, real-time tracking.",
      icon: <Target className="w-10 h-10 mb-4 text-primary" />,
    },
    {
      title: "Flexible Lesson Views",
      desc: "Toggle between detailed teacher plans, streamlined tutor formats, and student-facing resources. Adapt seamlessly to any teaching context or environment.",
      icon: <BookOpen className="w-10 h-10 mb-4 text-primary" />,
    },
  ];

  const benefits = [
    { text: "Save 6+ hours weekly on planning", icon: <Clock className="w-5 h-5" /> },
    { text: "Ofsted & ITT framework compliant", icon: <Award className="w-5 h-5" /> },
    { text: "AI trained on outstanding lessons", icon: <Brain className="w-5 h-5" /> },
    { text: "Perfect for NQTs, ECTs & trainees", icon: <GraduationCap className="w-5 h-5" /> },
    { text: "GDPR-secure student data", icon: <Shield className="w-5 h-5" /> },
    { text: "UK curriculum-specific content", icon: <FileText className="w-5 h-5" /> }
  ];

  const stats = [
    { value: "6hrs+", label: "Saved Weekly", icon: <Clock className="w-5 h-5" /> },
    { value: "15k+", label: "Lessons Created", icon: <FileText className="w-5 h-5" /> },
    { value: "97%", label: "User Satisfaction", icon: <TrendingUp className="w-5 h-5" /> },
    { value: "100%", label: "UK Aligned", icon: <Target className="w-5 h-5" /> }
  ];

  const steps = [
    {
      step: "01",
      title: "Build Your Teaching Hub",
      desc: "Set up class groups, create detailed student profiles, and organize your teaching schedule. Separate teacher and tutor workflows while managing everything from one powerful dashboard.",
      icon: <LayoutDashboard className="w-8 h-8" />
    },
    {
      step: "02",
      title: "Let AI Create Your Lessons",
      desc: "Simply describe your topic, select the key stage and subject—our AI generates comprehensive, differentiated lesson plans aligned to curriculum objectives in seconds, not hours.",
      icon: <Sparkles className="w-8 h-8" />
    },
    {
      step: "03",
      title: "Teach with Confidence",
      desc: "Access student teacher guides, deliver engaging lessons, and track student progress against objectives. Build and refine your growing library of outstanding lesson plans.",
      icon: <Award className="w-8 h-8" />
    }
  ];

  return (
    <main className="min-h-screen bg-background text-foreground scroll-smooth overflow-hidden">
      {/* Hero Section */}
      <section className="relative">
        {/* Animated background effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-accent/10" />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-accent/20 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }} />

        <div className="relative flex flex-col items-center justify-center text-center px-6 py-24 gap-8 max-w-7xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary/10 border border-primary/30 backdrop-blur-sm text-primary text-sm font-semibold shadow-lg animate-fade-up animate-once">
            <Sparkles className="w-4 h-4" />
            AI-Powered Lesson Planning for UK Educators
          </div>

          {/* Headline */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold max-w-5xl leading-[1.05] tracking-tight animate-fade-up animate-once" style={{ animationDelay: '100ms' }}>
            Create Outstanding Lessons in{" "}
            <span className="bg-gradient-to-r from-primary via-primary to-accent bg-clip-text text-transparent">
              Minutes, Not Hours
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-xl md:text-2xl lg:text-3xl max-w-4xl text-muted-foreground leading-relaxed animate-fade-up animate-once font-light" style={{ animationDelay: '200ms' }}>
            The intelligent planning platform built exclusively for UK teachers, tutors, and trainee educators. AI-powered, curriculum-aligned, and designed to save you time.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 animate-fade-up animate-once mt-6" style={{ animationDelay: '300ms' }}>
            <Button
              size="lg"
              className="px-10 py-7 text-lg font-semibold shadow-2xl shadow-primary/30 hover:shadow-2xl hover:shadow-primary/40 hover:scale-[1.02] transition-all duration-300 gap-3 group relative overflow-hidden"
              asChild
            >
              <Link href="/dashboard/lesson-plans">
                <span className="relative z-10">Start Planning for Free</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform relative z-10" />
                <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="px-10 py-7 text-lg font-semibold border-2 hover:bg-accent/50 backdrop-blur-sm hover:scale-[1.02] transition-all duration-300"
              asChild
            >
              <Link href="#features">Explore Features</Link>
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap justify-center gap-6 md:gap-8 mt-10 text-sm animate-fade-up animate-once" style={{ animationDelay: '400ms' }}>
            <div className="flex items-center gap-2 text-muted-foreground">
              <CheckCircle2 className="w-5 h-5 text-primary" />
              <span className="font-medium">No credit card required</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <CheckCircle2 className="w-5 h-5 text-primary" />
              <span className="font-medium">Free forever plan</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <CheckCircle2 className="w-5 h-5 text-primary" />
              <span className="font-medium">Setup in 2 minutes</span>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="px-6 py-16 md:py-20 border-y bg-gradient-to-br from-accent/20 via-background to-primary/10 backdrop-blur-sm relative">
        <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgb(var(--foreground) / 0.05) 1px, transparent 0)', backgroundSize: '40px 40px' }} />
        <div className="max-w-7xl mx-auto relative">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            {stats.map((stat, i) => (
              <div key={i} className="text-center group cursor-default">
                <div className="flex justify-center mb-3 text-primary group-hover:scale-110 transition-transform duration-300">
                  {stat.icon}
                </div>
                <div className="text-4xl md:text-6xl font-bold bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent mb-2 group-hover:scale-105 transition-transform duration-300">
                  {stat.value}
                </div>
                <div className="text-sm md:text-base text-muted-foreground font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="px-6 py-24 md:py-32 lg:py-40 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background" />

        <div className="max-w-7xl mx-auto text-center mb-16 md:mb-24 relative">
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-primary/10 border border-primary/30 text-primary text-sm font-semibold mb-6 backdrop-blur-sm">
            <Zap className="w-4 h-4" />
            Powerful Features
          </div>
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            Everything You Need,{" "}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              All in One Place
            </span>
          </h2>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed font-light">
            From AI-powered lesson creation to comprehensive student management—professional tools designed specifically for UK educators.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-7xl mx-auto relative">
          {features.map((f, i) => (
            <div
              key={i}
              className="relative flex flex-col items-start p-8 md:p-10 rounded-3xl border-2 bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm hover:border-primary/60 hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 group hover:-translate-y-2"
            >
              {f.badge && (
                <div className="absolute -top-3 -right-3 px-4 py-1.5 bg-primary text-primary-foreground text-xs font-bold rounded-full shadow-lg">
                  {f.badge}
                </div>
              )}
              <div className="p-4 rounded-2xl bg-primary/10 group-hover:bg-primary/20 transition-all duration-300 mb-6 group-hover:scale-110 transform">
                {f.icon}
              </div>
              <h3 className="text-2xl md:text-3xl font-bold mb-4 group-hover:text-primary transition-colors">
                {f.title}
              </h3>
              <p className="text-muted-foreground text-base md:text-lg leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Benefits Section */}
      <section className="px-6 py-24 md:py-32 bg-gradient-to-br from-primary/5 via-accent/5 to-background relative overflow-hidden">
        <div className="absolute top-20 right-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />

        <div className="max-w-7xl mx-auto relative">
          <div className="grid lg:grid-cols-2 gap-12 md:gap-16 items-center">
            <div className="order-2 lg:order-1">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-background/80 backdrop-blur-sm border text-sm font-semibold mb-6">
                <Clock className="w-4 h-4 text-primary" />
                Work Smarter, Not Harder
              </div>
              <h2 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                Built for Every Stage of Your{" "}
                <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Teaching Journey
                </span>
              </h2>
              <p className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed font-light">
                {"Whether you're a trainee teacher finding your feet, an NQT/ECT building your practice, or an experienced educator maximizing efficiency—our platform grows with you every step of the way."}
              </p>
              <Button size="lg" className="gap-2 group px-8 py-6 text-lg font-semibold shadow-xl hover:scale-105 transition-all duration-300" asChild>
                <Link href="/dashboard/lesson-plans">
                  Start Your Free Account
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </div>

            <div className="grid gap-4 order-1 lg:order-2">
              {benefits.map((benefit, i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 p-6 rounded-2xl bg-background/80 backdrop-blur-sm border-2 hover:border-primary/40 transition-all duration-300 hover:shadow-xl hover:-translate-x-2 group"
                >
                  <div className="p-3 rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                    {benefit.icon}
                  </div>
                  <span className="text-base md:text-lg font-semibold">{benefit.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="px-6 py-24 md:py-32 relative">
        <div className="max-w-7xl mx-auto text-center mb-16 md:mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 text-primary text-sm font-semibold mb-6">
            <Target className="w-4 h-4" />
            Simple Process
          </div>
          <h2 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Start Creating Outstanding Lessons in{" "}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Under 3 Minutes
            </span>
          </h2>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto font-light">
            {"From account creation to your first AI-generated lesson—it's incredibly quick and intuitive"}
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 md:gap-12">
            {steps.map((item, i) => (
              <div key={i} className="relative group">
                {/* Step number background */}
                <div className="text-[120px] md:text-[140px] font-bold text-primary/5 absolute -top-8 left-0 select-none group-hover:text-primary/10 transition-colors duration-300">
                  {item.step}
                </div>

                {/* Icon */}
                <div className="relative mb-6 p-4 rounded-2xl bg-primary/10 text-primary w-fit group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300 group-hover:scale-110 transform">
                  {item.icon}
                </div>

                {/* Content */}
                <h3 className="text-2xl md:text-3xl font-bold mb-4 relative group-hover:text-primary transition-colors">
                  {item.title}
                </h3>
                <p className="text-muted-foreground text-base md:text-lg leading-relaxed relative">
                  {item.desc}
                </p>

                {/* Connector arrow (not on last item) */}
                {i < steps.length - 1 && (
                  <div className="hidden md:block absolute top-16 -right-6 lg:-right-8">
                    <ArrowRight className="w-8 h-8 lg:w-10 lg:h-10 text-primary/20 group-hover:text-primary/40 transition-colors" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial/Social Proof Section */}
      <section className="px-6 py-24 md:py-32 bg-gradient-to-br from-accent/10 via-background to-primary/10 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgb(var(--foreground) / 0.05) 1px, transparent 0)', backgroundSize: '40px 40px' }} />

        <div className="max-w-7xl mx-auto relative">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 text-primary text-sm font-semibold mb-6">
              <Award className="w-4 h-4" />
              Trusted by Educators
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Join Thousands of UK Educators{" "}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Saving Time
              </span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                quote: "This platform has transformed how I plan lessons. What used to take 2-3 hours now takes 15 minutes. The AI suggestions are genuinely curriculum-aligned and save me so much time.",
                name: "Sarah Mitchell",
                role: "Secondary English Teacher",
                school: "Manchester"
              },
              {
                quote: "As a trainee teacher, the planning guides have been invaluable. I feel so much more confident going into lessons knowing I've covered all the essential elements.",
                name: "James Thompson",
                role: "PGCE Student Teacher",
                school: "Birmingham"
              },
              {
                quote: "Managing both my school classes and private tutoring used to be chaotic. Now everything is in one place, beautifully organized. Game changer for busy tutors!",
                name: "Priya Sharma",
                role: "Maths Teacher & Tutor",
                school: "London"
              }
            ].map((testimonial, i) => (
              <div
                key={i}
                className="p-8 rounded-3xl bg-background/80 backdrop-blur-sm border-2 hover:border-primary/40 transition-all duration-300 hover:shadow-xl hover:-translate-y-2 group"
              >
                <div className="flex gap-1 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="w-5 h-5 text-yellow-500 fill-yellow-500">★</div>
                  ))}
                </div>
                <p className="text-muted-foreground text-base md:text-lg leading-relaxed mb-6 italic">
                  &quot;{testimonial.quote}&quot;
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-lg">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-semibold">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                    <div className="text-xs text-muted-foreground">{testimonial.school}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="px-6 py-24 md:py-32 lg:py-40 bg-gradient-to-br from-primary via-primary to-primary/90 text-primary-foreground relative overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/5 rounded-full blur-3xl" />

        <div className="relative max-w-5xl mx-auto text-center">
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            Ready to Transform Your{" "}
            <span className="underline decoration-wavy decoration-primary-foreground/40 underline-offset-8">
              Lesson Planning?
            </span>
          </h2>
          <p className="text-primary-foreground/90 text-xl md:text-2xl max-w-3xl mx-auto mb-12 leading-relaxed font-light">
            {"Join hundreds of UK educators who've already saved countless hours while creating better, more engaging lessons for their students."}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button
              size="lg"
              variant="secondary"
              className="text-lg px-10 py-7 gap-2 shadow-2xl hover:shadow-xl hover:scale-105 transition-all duration-300 group text-primary font-semibold"
              asChild
            >
              <Link href="/dashboard/lesson-plans">
                Start Free Today
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-lg px-10 py-7 border-2 border-primary-foreground/30 hover:bg-primary-foreground/10 text-primary-foreground backdrop-blur-sm"
              asChild
            >
              <Link href="#features">View All Features</Link>
            </Button>
          </div>

          <div className="flex flex-wrap justify-center gap-6 md:gap-8 text-sm text-primary-foreground/80 mb-8">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5" />
              Free to start
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5" />
              No setup fees
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5" />
              Cancel anytime
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5" />
              No credit card required
            </div>
          </div>

          {/* Trust badges */}
          <div className="pt-8 border-t border-primary-foreground/20">
            <p className="text-primary-foreground/60 text-sm mb-4 uppercase tracking-wider font-semibold">
              Trusted & Compliant
            </p>
            <div className="flex flex-wrap justify-center gap-6 md:gap-8">
              <div className="flex items-center gap-2 text-primary-foreground/80">
                <Shield className="w-5 h-5" />
                <span className="font-medium">GDPR Compliant</span>
              </div>
              <div className="flex items-center gap-2 text-primary-foreground/80">
                <Award className="w-5 h-5" />
                <span className="font-medium">Ofsted Aligned</span>
              </div>
              <div className="flex items-center gap-2 text-primary-foreground/80">
                <Target className="w-5 h-5" />
                <span className="font-medium">UK Curriculum</span>
              </div>
              <div className="flex items-center gap-2 text-primary-foreground/80">
                <GraduationCap className="w-5 h-5" />
                <span className="font-medium">ITT Framework</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-12 bg-background border-t">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-bold text-lg mb-4">Lessonly</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                AI-powered lesson planning designed exclusively for UK educators.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="#features" className="hover:text-primary transition-colors">Features</Link></li>
                <li><Link href="/dashboard/lesson-plans" className="hover:text-primary transition-colors">Dashboard</Link></li>
                <li><Link href="#" className="hover:text-primary transition-colors">Pricing</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="#" className="hover:text-primary transition-colors">Help Centre</Link></li>
                <li><Link href="#" className="hover:text-primary transition-colors">Guides</Link></li>
                <li><Link href="#" className="hover:text-primary transition-colors">Blog</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="#" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
                <li><Link href="#" className="hover:text-primary transition-colors">Terms of Service</Link></li>
                <li><Link href="#" className="hover:text-primary transition-colors">GDPR</Link></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t text-center text-sm text-muted-foreground">
            <p>© 2025 Lessonly. Built for UK educators with ❤️</p>
          </div>
        </div>
      </footer>
    </main>
  );
}