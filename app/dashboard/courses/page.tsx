"use client";

import { useEffect, useState } from "react";
import { SectionHeader } from "@/components/SectionHeader";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { apiFetch } from "@/api/client";

type Course = {
  id: string;
  name: string;
  difficulty: number;
  weekly_hours: number;
  grading_weights: string | null;
  exam_date: string | null;
};

const demoCourses = [
  {
    name: "Biochemistry",
    difficulty: 5,
    weekly_hours: 6,
    exam_date: "2026-04-12",
    grading_weights: "Midterm 30%, Final 40%, Labs 30%"
  },
  {
    name: "Econometrics",
    difficulty: 4,
    weekly_hours: 4,
    exam_date: "2026-04-20",
    grading_weights: "Problem sets 40%, Midterm 20%, Final 40%"
  },
  {
    name: "Design Systems",
    difficulty: 3,
    weekly_hours: 3,
    exam_date: "2026-05-02",
    grading_weights: "Projects 50%, Quiz 20%, Final 30%"
  }
];

const demoAssignments = [
  {
    course: "Biochemistry",
    title: "Midterm Review",
    due_date: "2026-03-12",
    weight: 25,
    estimated_hours: 5
  },
  {
    course: "Econometrics",
    title: "Problem Set 4",
    due_date: "2026-03-10",
    weight: 15,
    estimated_hours: 3
  },
  {
    course: "Design Systems",
    title: "Design Systems Quiz",
    due_date: "2026-03-15",
    weight: 10,
    estimated_hours: 2
  }
];

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    difficulty: 3,
    weekly_hours: 3,
    exam_date: "",
    grading_weights: ""
  });

  const loadCourses = () =>
    apiFetch<Course[]>("/api/courses")
      .then(setCourses)
      .catch((err) => setError(err.message));

  useEffect(() => {
    loadCourses();
  }, []);

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setNotice(null);

    await apiFetch<Course>("/api/courses", {
      method: "POST",
      body: JSON.stringify({
        ...form,
        difficulty: Number(form.difficulty),
        weekly_hours: Number(form.weekly_hours),
        exam_date: form.exam_date || null,
        grading_weights: form.grading_weights || null
      })
    });

    setForm({ name: "", difficulty: 3, weekly_hours: 3, exam_date: "", grading_weights: "" });
    loadCourses();
  };

  const onDelete = async (id: string) => {
    await apiFetch(`/api/courses/${id}`, { method: "DELETE" });
    loadCourses();
  };

  const importSyllabus = async () => {
    setError(null);
    setNotice("Importing demo syllabus data...");

    const created: Course[] = [];
    for (const course of demoCourses) {
      const newCourse = await apiFetch<Course>("/api/courses", {
        method: "POST",
        body: JSON.stringify(course)
      });
      created.push(newCourse);
    }

    for (const assignment of demoAssignments) {
      const course = created.find((item) => item.name === assignment.course);
      if (!course) continue;
      await apiFetch("/api/assignments", {
        method: "POST",
        body: JSON.stringify({
          course_id: course.id,
          title: assignment.title,
          due_date: assignment.due_date,
          weight: assignment.weight,
          estimated_hours: assignment.estimated_hours
        })
      });
    }

    setNotice("Demo syllabus data imported.");
    loadCourses();
  };

  return (
    <div className="space-y-8">
      <SectionHeader
        title="Courses"
        subtitle="Manage your semester load and exam timelines."
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
            <h3 className="text-lg font-semibold text-ink">Active courses</h3>
            <Button variant="secondary" size="sm" onClick={importSyllabus}>
              Import syllabus
            </Button>
          </div>
          <div className="mt-6 space-y-4">
            {courses.length === 0 ? (
              <p className="text-sm text-slate/70">No courses yet.</p>
            ) : (
              courses.map((course) => (
                <div
                  key={course.id}
                  className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-4"
                >
                  <div>
                    <p className="text-sm font-semibold text-ink">{course.name}</p>
                    <p className="text-xs text-slate/70">
                      Difficulty {course.difficulty} - {course.weekly_hours} hrs
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {course.exam_date ? (
                      <span className="rounded-full bg-cyan/20 px-3 py-1 text-xs text-cyan">
                        Exam {course.exam_date}
                      </span>
                    ) : null}
                    <Button variant="ghost" size="sm" onClick={() => onDelete(course.id)}>
                      Remove
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="surface-card rounded-2xl p-6 shadow-soft">
          <h3 className="text-lg font-semibold text-ink">Add a course</h3>
          <form className="mt-4 space-y-4" onSubmit={onSubmit}>
            <Input
              label="Course name"
              value={form.name}
              onChange={(event) => setForm({ ...form, name: event.target.value })}
              placeholder="Intro to Neuroscience"
              required
            />
            <Input
              label="Difficulty (1-5)"
              type="number"
              min={1}
              max={5}
              value={form.difficulty}
              onChange={(event) =>
                setForm({ ...form, difficulty: Number(event.target.value) })
              }
            />
            <Input
              label="Weekly available hours"
              type="number"
              min={1}
              value={form.weekly_hours}
              onChange={(event) =>
                setForm({ ...form, weekly_hours: Number(event.target.value) })
              }
            />
            <Input
              label="Exam date"
              type="date"
              value={form.exam_date}
              onChange={(event) => setForm({ ...form, exam_date: event.target.value })}
            />
            <Input
              label="Grading weights"
              value={form.grading_weights}
              onChange={(event) => setForm({ ...form, grading_weights: event.target.value })}
              placeholder="Midterm 30%, Final 40%, Projects 30%"
            />
            <Button type="submit">Save course</Button>
          </form>
        </div>
      </div>
    </div>
  );
}
