import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle, Calendar, Users } from "lucide-react";

export default function LandingPage() {
  const features = [
    {
      title: "Lesson Planner",
      desc: "Build structured lessons with simplified, detailed or tutor views.",
      icon: <Calendar className="w-8 h-8 mb-4" />,
    },
    {
      title: "Curriculum Tracking",
      desc: "See student progression and align lessons to objectives.",
      icon: <CheckCircle className="w-8 h-8 mb-4" />,
    },
    {
      title: "Collaboration Tools",
      desc: "Share and co‑edit lessons with peers and mentors.",
      icon: <Users className="w-8 h-8 mb-4" />,
    },
  ];

  return (
    <main className="min-h-screen bg-background text-foreground scroll-smooth">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center px-6 py-40 gap-8 bg-gradient-to-b from-primary/10 to-background">
        <h1 className="text-5xl md:text-7xl font-bold max-w-3xl leading-tight animate-fade-up animate-once">
          Plan Smarter. Teach Better.
        </h1>
        <p className="text-lg md:text-xl max-w-2xl text-muted-foreground animate-fade-up animate-delay-200 animate-once">
          Lessonly helps teachers, student teachers and tutors easily plan, organise, and deliver effective lessons.
        </p>
        <div className="flex gap-4 animate-fade-up animate-delay-300 animate-once">
          <Button className="px-6 py-3 text-lg shadow-lg hover:shadow-xl" asChild>
            <Link href="/dashboard/lesson-plans">Get Started</Link>
          </Button>
          <Button variant="secondary" className="px-6 py-3 text-lg smooth" asChild>
            <Link href="#features">Learn More</Link>
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="px-6 py-28">
        <div className="max-w-6xl mx-auto text-center mb-20">
          <h2 className="text-4xl font-semibold">Everything You Need to Stay Organised</h2>
          <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
            From curriculum planning to daily lessons, Lessonly gives you the tools to succeed.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-12 max-w-6xl mx-auto">
          {features.map((f, i) => (
            <div
              key={i}
              className="flex flex-col items-center text-center p-8 rounded-2xl border bg-card shadow-sm hover:border-primary/50 hover:shadow-xl transition-all group"
            >
              {f.icon}
              <h3 className="text-2xl font-semibold mb-2 group-hover:text-primary transition-colors">
                {f.title}
              </h3>
              <p className="text-muted-foreground text-base">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-28 bg-primary text-primary-foreground rounded-t-[4rem] text-center">
        <h2 className="text-4xl font-semibold mb-6">Ready to Make Lesson Planning a Breeze?</h2>
        <p className="text-primary-foreground/80 max-w-xl mx-auto mb-10 text-lg">
          Join thousands of educators improving workflow and saving time.
        </p>
        <Button size="lg" variant="secondary" className="text-lg px-8 py-6 gap-2" asChild>
          <Link href="/dashboard/lesson-plans">
            Start Now — It's Free! <ArrowRight className="w-5 h-5" />
          </Link>
        </Button>
      </section>
    </main>
  );
}
