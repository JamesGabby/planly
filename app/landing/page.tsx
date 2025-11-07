import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center px-6 py-40 gap-8">
        <h1 className="text-4xl md:text-6xl font-bold max-w-3xl leading-tight">
          Plan Smarter. Teach Better.
        </h1>
        <p className="text-lg md:text-xl max-w-2xl text-muted-foreground">
          Lessonly helps teachers, student teachers and tutors easily plan, organise, and deliver effective lessons.
        </p>
        <div className="flex gap-4">
          <Button className="px-6 py-3 text-lg" asChild>
            <Link href="/dashboard/lesson-plans">Get Started</Link>
          </Button>
          <Button variant="secondary" className="px-6 py-3 text-lg" asChild>
            <Link href="#features">Learn More</Link>
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="px-6 py-24">
        <div className="max-w-6xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-semibold">Everything You Need to Stay Organised</h2>
          <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
            From curriculum planning to daily lessons, Lessonly gives you the tools to succeed.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10 max-w-6xl mx-auto">
          {[{
            title: "Lesson Planner",
            desc: "Build structured lessons with simplified, detailed or tutor views.",
          }, {
            title: "Curriculum Tracking",
            desc: "See student progression and align lessons to objectives.",
          }, {
            title: "Collaboration Tools",
            desc: "Share and co‑edit lessons with peers and mentors.",
          }].map((feature, i) => (
            <div key={i} className="p-6 rounded-xl border bg-card shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-24 bg-accent rounded-t-3xl text-center">
        <h2 className="text-3xl font-semibold mb-6">Ready to Make Lesson Planning a Breeze?</h2>
        <p className="text-muted-foreground max-w-xl mx-auto mb-8">
          Join thousands of educators improving workflow and saving time.
        </p>
        <Button size="lg" asChild>
          <Link href="/dashboard/lesson-plans">Start Now — It's Free!</Link>
        </Button>
      </section>
    </main>
  );
}
