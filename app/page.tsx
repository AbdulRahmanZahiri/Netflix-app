import Link from "next/link";
import { buttonClasses } from "@/components/Button";
import { FeatureCard } from "@/components/FeatureCard";
import { PricingCard } from "@/components/PricingCard";
import { Logo } from "@/components/Logo";

const features = [
  {
    title: "Smart Study Planner",
    description: "Urgency scoring + 50-minute blocks that adapt to exam timelines.",
    icon: "PLAN"
  },
  {
    title: "Course Load Intelligence",
    description: "Track difficulty, weights, and weekly hours in one unified view.",
    icon: "LOAD"
  },
  {
    title: "AI Study Studio",
    description: "Safe, structured assistance for notes, flashcards, and quizzes.",
    icon: "AI"
  }
];

const stats = [
  { label: "Weekly focus blocks", value: "12" },
  { label: "Upcoming deadlines", value: "6" },
  { label: "On-track score", value: "74%" }
];

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <header className="px-6 pt-8">
        <nav className="mx-auto flex max-w-6xl items-center justify-between">
          <Logo size="sm" />
          <div className="flex items-center gap-3">
            <Link className="text-sm font-medium text-slate/80" href="/login">
              Login
            </Link>
            <Link className={buttonClasses({ size: "sm" })} href="/register">
              Start Free
            </Link>
          </div>
        </nav>
      </header>

      <section className="px-6 pt-16">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="text-sm font-semibold text-cyan">Study Smarter. Not Harder.</p>
            <h1 className="mt-4 text-4xl font-semibold text-ink md:text-5xl">
              Scholarflow is the AI study OS for university students.
            </h1>
            <p className="mt-5 text-lg text-slate/80">
              Plan every week, track progress, and turn notes into mastery-ready
              flashcards. The safest way to use AI for academic success.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link className={buttonClasses({ size: "lg" })} href="/register">
                Start Free
              </Link>
              <Link
                className={buttonClasses({ size: "lg", variant: "secondary" })}
                href="/dashboard"
              >
                View Dashboard
              </Link>
            </div>
            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="surface-card rounded-xl px-4 py-3 text-sm"
                >
                  <p className="text-slate/70">{stat.label}</p>
                  <p className="mt-2 text-lg font-semibold text-ink">{stat.value}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-cyan/20 to-accent/20 blur-2xl" />
            <div className="relative rounded-3xl border border-white/10 bg-black/40 p-6 shadow-card backdrop-blur">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-wide text-slate/70">On-track</p>
                  <p className="text-3xl font-semibold text-ink">74%</p>
                </div>
                <div className="rounded-full bg-cyan/20 px-3 py-1 text-xs text-cyan">
                  +8% this week
                </div>
              </div>
              <div className="mt-6 space-y-4">
                {["Biochem Midterm", "Econometrics Problem Set", "Design Systems Quiz"].map(
                  (item) => (
                    <div key={item} className="rounded-xl border border-white/10 bg-white/5 p-4">
                      <p className="text-sm font-medium text-ink">{item}</p>
                      <p className="text-xs text-slate/70">Focus block scheduled</p>
                    </div>
                  )
                )}
              </div>
              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                {[
                  { label: "Study hours", value: "12.5" },
                  { label: "Sessions", value: "9" },
                  { label: "AI credits", value: "6" }
                ].map((item) => (
                  <div
                    key={item.label}
                    className="rounded-xl border border-white/10 bg-white/5 px-3 py-2"
                  >
                    <p className="text-xs text-slate/70">{item.label}</p>
                    <p className="text-sm font-semibold text-ink">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 flex flex-col gap-2">
            <p className="text-sm font-semibold text-cyan">Features</p>
            <h2 className="text-3xl font-semibold text-ink">
              A full command center for your semester
            </h2>
            <p className="text-sm text-slate/70">
              Designed for clarity, accountability, and academic integrity.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {features.map((feature) => (
              <FeatureCard key={feature.title} {...feature} />
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 pb-24">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 flex flex-col gap-2">
            <p className="text-sm font-semibold text-cyan">Pricing</p>
            <h2 className="text-3xl font-semibold text-ink">
              Choose the plan that fits your semester
            </h2>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            <PricingCard
              name="Free"
              price="$0"
              subtitle="Perfect for getting started"
              features={["2 courses", "10 AI credits / month", "Basic planner"]}
              cta="Start Free"
            />
            <PricingCard
              name="Pro"
              price="$12 / month"
              subtitle="Power users and heavy course loads"
              features={[
                "Unlimited courses",
                "500 AI credits / month",
                "Unlimited flashcards",
                "Advanced planner"
              ]}
              cta="Go Pro"
              highlighted
            />
          </div>
        </div>
      </section>

      <section className="px-6 pb-20">
        <div className="mx-auto max-w-6xl rounded-2xl border border-white/10 bg-white/5 p-10 text-center shadow-soft">
          <h2 className="text-3xl font-semibold text-ink">Launch your best semester</h2>
          <p className="mt-3 text-sm text-slate/70">
            Build a plan in minutes and stay ahead of every deadline.
          </p>
          <div className="mt-6 flex justify-center">
            <Link className={buttonClasses({ size: "lg" })} href="/register">
              Start Free
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/5 bg-black/20 px-6 py-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-sm text-slate/70">Copyright 2026 Scholarflow.</p>
          <div className="flex gap-4 text-sm text-slate/70">
            <Link href="/privacy">Privacy</Link>
            <Link href="/terms">Terms</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
