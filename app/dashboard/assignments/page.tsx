"use client";

import { useEffect, useState } from "react";
import { SectionHeader } from "@/components/SectionHeader";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { apiFetch } from "@/api/client";

type Course = {
  id: string;
  name: string;
};

type Assignment = {
  id: string;
  course_id: string;
  title: string;
  due_date: string;
  weight: number;
  estimated_hours: number;
  completed: boolean;
  course_name?: string;
};

export default function AssignmentsPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: "",
    course_id: "",
    due_date: "",
    weight: 10,
    estimated_hours: 2
  });

  const loadAll = () => {
    Promise.all([
      apiFetch<Course[]>("/api/courses"),
      apiFetch<Assignment[]>("/api/assignments")
    ])
      .then(([coursesData, assignmentsData]) => {
        setCourses(coursesData);
        setAssignments(assignmentsData);
        if (!form.course_id && coursesData[0]) {
          setForm((prev) => ({ ...prev, course_id: coursesData[0].id }));
        }
      })
      .catch((err) => setError(err.message));
  };

  useEffect(() => {
    loadAll();
  }, []);

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setNotice(null);

    await apiFetch<Assignment>("/api/assignments", {
      method: "POST",
      body: JSON.stringify({
        ...form,
        weight: Number(form.weight),
        estimated_hours: Number(form.estimated_hours)
      })
    });

    setForm({
      title: "",
      course_id: form.course_id,
      due_date: "",
      weight: 10,
      estimated_hours: 2
    });
    loadAll();
  };

  const toggleComplete = async (assignment: Assignment) => {
    await apiFetch(`/api/assignments/${assignment.id}`, {
      method: "PATCH",
      body: JSON.stringify({ completed: !assignment.completed })
    });
    loadAll();
  };

  const syncCalendar = () => {
    setNotice("Calendar sync will be available soon. Use the local planner for now.");
  };

  return (
    <div className="space-y-8">
      <SectionHeader
        title="Assignments"
        subtitle="Track deadlines, weight, and completion progress."
      />

      {error ? (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {error}
        </div>
      ) : null}
      {notice ? (
        <div className="rounded-xl border border-cyan/30 bg-cyan/10 px-4 py-3 text-sm text-cyan">
          {notice}
        </div>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="surface-card rounded-2xl p-6 shadow-soft">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-ink">Upcoming</h3>
            <Button variant="secondary" size="sm" onClick={syncCalendar}>
              Sync calendar
            </Button>
          </div>
          <div className="mt-6 space-y-4">
            {assignments.length === 0 ? (
              <p className="text-sm text-slate/70">No assignments yet.</p>
            ) : (
              assignments.map((assignment) => (
                <div
                  key={assignment.id}
                  className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-4"
                >
                  <div>
                    <p className="text-sm font-semibold text-ink">
                      {assignment.title}
                    </p>
                    <p className="text-xs text-slate/70">
                      {assignment.course_name} - Due {assignment.due_date} - {assignment.weight}% - {assignment.estimated_hours} hrs
                    </p>
                  </div>
                  <Button
                    variant={assignment.completed ? "secondary" : "ghost"}
                    size="sm"
                    onClick={() => toggleComplete(assignment)}
                  >
                    {assignment.completed ? "Completed" : "Mark complete"}
                  </Button>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="surface-card rounded-2xl p-6 shadow-soft">
          <h3 className="text-lg font-semibold text-ink">Add assignment</h3>
          <form className="mt-4 space-y-4" onSubmit={onSubmit}>
            <Input
              label="Title"
              value={form.title}
              onChange={(event) => setForm({ ...form, title: event.target.value })}
              placeholder="Design critique"
              required
            />
            <label className="flex flex-col gap-2 text-sm text-slate/80">
              <span className="font-medium">Course</span>
              <select
                className="h-11 rounded-xl border border-white/10 bg-black/40 px-3 text-sm text-ink shadow-soft"
                value={form.course_id}
                onChange={(event) => setForm({ ...form, course_id: event.target.value })}
                required
              >
                <option value="" disabled>
                  Select a course
                </option>
                {courses.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.name}
                  </option>
                ))}
              </select>
            </label>
            <Input
              label="Due date"
              type="date"
              value={form.due_date}
              onChange={(event) => setForm({ ...form, due_date: event.target.value })}
              required
            />
            <Input
              label="Weight %"
              type="number"
              min={1}
              max={100}
              value={form.weight}
              onChange={(event) => setForm({ ...form, weight: Number(event.target.value) })}
            />
            <Input
              label="Estimated hours"
              type="number"
              min={1}
              value={form.estimated_hours}
              onChange={(event) =>
                setForm({ ...form, estimated_hours: Number(event.target.value) })
              }
            />
            <Button type="submit">Save assignment</Button>
          </form>
        </div>
      </div>
    </div>
  );
}
