"use client";

import { useEffect, useMemo, useState } from "react";
import { SectionHeader } from "@/components/SectionHeader";
import { generateWeeklyPlan, type AssignmentInput } from "@/lib/planner";
import { apiFetch } from "@/api/client";

type Course = {
  id: string;
  name: string;
  weekly_hours: number;
};

type Assignment = {
  id: string;
  course_id: string;
  title: string;
  due_date: string;
  weight: number;
  estimated_hours: number;
  completed: boolean;
};

export default function PlannerPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      apiFetch<Course[]>("/api/courses"),
      apiFetch<Assignment[]>("/api/assignments")
    ])
      .then(([courseData, assignmentData]) => {
        setCourses(courseData);
        setAssignments(assignmentData.filter((item) => !item.completed));
      })
      .catch((err) => setError(err.message));
  }, []);

  const weeklyHours = courses.reduce((sum, course) => sum + course.weekly_hours, 0) || 6;

  const plannerInput: AssignmentInput[] = useMemo(() => {
    const courseMap = new Map(courses.map((course) => [course.id, course]));
    return assignments.map((assignment) => ({
      id: assignment.id,
      title: assignment.title,
      dueDate: assignment.due_date,
      weight: assignment.weight,
      estimatedHours: assignment.estimated_hours,
      courseName: courseMap.get(assignment.course_id)?.name
    }));
  }, [assignments, courses]);

  const assignmentMap = useMemo(
    () => new Map(assignments.map((assignment) => [assignment.id, assignment])),
    [assignments]
  );

  const plan = useMemo(
    () => generateWeeklyPlan({ assignments: plannerInput, weeklyHours }),
    [plannerInput, weeklyHours]
  );

  const logSession = async (session: (typeof plan.sessions)[number]) => {
    const assignment = assignmentMap.get(session.assignmentId);
    await apiFetch("/api/study-sessions", {
      method: "POST",
      body: JSON.stringify({
        course_id: assignment?.course_id ?? null,
        date: session.date,
        duration: session.durationMinutes,
        topic: session.title,
        completed: true
      })
    });
    setMessage("Study session logged.");
  };

  return (
    <div className="space-y-8">
      <SectionHeader
        title="Smart Study Planner"
        subtitle={`Week of ${plan.weekStart} - ${plan.weekEnd}`}
      />

      {error ? (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {error}
        </div>
      ) : null}
      {message ? (
        <div className="rounded-xl border border-emerald-400/30 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-200">
          {message}
        </div>
      ) : null}

      <div className="surface-card rounded-2xl p-6 shadow-soft">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <p className="text-sm font-semibold text-ink">Total study hours</p>
            <p className="text-2xl font-semibold text-ink">{plan.totalHours} hrs</p>
          </div>
          <div>
            <p className="text-sm font-semibold text-ink">Unallocated buffer</p>
            <p className="text-2xl font-semibold text-ink">
              {plan.unallocatedHours.toFixed(1)} hrs
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {plan.sessions.length === 0 ? (
          <p className="text-sm text-slate/70">No sessions yet. Add assignments to build a plan.</p>
        ) : (
          plan.sessions.map((session, index) => (
            <div
              key={`${session.assignmentId}-${index}`}
              className="rounded-xl border border-white/10 bg-white/5 p-4 shadow-soft"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-ink">{session.title}</p>
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-cyan/20 px-3 py-1 text-xs text-cyan">
                    {session.durationMinutes} min
                  </span>
                  <button
                    className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate/80"
                    onClick={() => logSession(session)}
                  >
                    Log session
                  </button>
                </div>
              </div>
              <p className="mt-2 text-xs text-slate/70">
                {session.courseName ?? "Course"} - {session.date}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
