"use client";

import { useEffect, useState } from "react";
import { StatCard } from "@/components/StatCard";
import { SectionHeader } from "@/components/SectionHeader";
import { ProgressBar } from "@/components/ProgressBar";
import { apiFetch } from "@/api/client";

type Metrics = {
  totalCourses: number;
  upcomingDeadlines: number;
  studyHours: number;
  completionRate: number;
  status: string;
};

const fallbackMetrics: Metrics = {
  totalCourses: 0,
  upcomingDeadlines: 0,
  studyHours: 0,
  completionRate: 0,
  status: "On-track"
};

export default function DashboardPage() {
  const [metrics, setMetrics] = useState<Metrics>(fallbackMetrics);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    apiFetch<Metrics>("/api/metrics")
      .then(setMetrics)
      .catch((err) => setError(err.message));
  }, []);

  return (
    <div className="space-y-8">
      {error ? (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {error}
        </div>
      ) : null}

      <section className="grid gap-4 md:grid-cols-4">
        <StatCard title="Total Courses" value={String(metrics.totalCourses)} />
        <StatCard
          title="Upcoming Deadlines"
          value={String(metrics.upcomingDeadlines)}
          trend="Next 7 days"
        />
        <StatCard
          title="Study Hours"
          value={String(metrics.studyHours)}
          trend="This week"
        />
        <StatCard title="Status" value={metrics.status} trend={`${metrics.completionRate}%`} />
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="surface-card rounded-2xl p-6 shadow-soft">
          <SectionHeader
            title="Weekly Planner"
            subtitle="Urgency-sorted assignments with recommended sessions."
          />
          <div className="mt-6 space-y-4">
            {[
              {
                title: "Biochem Midterm Review",
                detail: "3 x 50-min focus blocks",
                status: "High priority"
              },
              {
                title: "Econometrics Problem Set",
                detail: "2 x 50-min focus blocks",
                status: "Due in 3 days"
              },
              {
                title: "Design Systems Quiz",
                detail: "1 x 50-min focus block",
                status: "Due in 6 days"
              }
            ].map((item) => (
              <div
                key={item.title}
                className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-4"
              >
                <div>
                  <p className="text-sm font-semibold text-ink">{item.title}</p>
                  <p className="text-xs text-slate/70">{item.detail}</p>
                </div>
                <span className="rounded-full bg-cyan/20 px-3 py-1 text-xs font-medium text-cyan">
                  {item.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="surface-card rounded-2xl p-6 shadow-soft">
            <SectionHeader
              title="Study Momentum"
              subtitle="Track weekly completion for every course."
            />
            <div className="mt-6 space-y-4">
              <ProgressBar value={metrics.completionRate} label="Assignment completion" />
              <ProgressBar value={Math.min(metrics.studyHours * 10, 100)} label="Hours logged" />
            </div>
          </div>
          <div className="surface-card rounded-2xl p-6 shadow-soft">
            <SectionHeader title="AI Credits" subtitle="Monitor monthly usage." />
            <div className="mt-4 flex items-center justify-between">
              <p className="text-sm text-slate/70">Credits used</p>
              <p className="text-xl font-semibold text-ink">0 / 10</p>
            </div>
            <div className="mt-4">
              <ProgressBar value={0} label="Free plan" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
