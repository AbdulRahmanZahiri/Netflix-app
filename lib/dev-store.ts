import { promises as fs } from "fs";
import path from "path";
import { randomUUID } from "crypto";

const DB_PATH = path.join(process.cwd(), "data", "dev-db.json");
const DEV_USER_ID = "dev-user";

export type DevCourse = {
  id: string;
  user_id: string;
  name: string;
  difficulty: number;
  weekly_hours: number;
  grading_weights: string | null;
  exam_date: string | null;
  created_at: string;
};

export type DevAssignment = {
  id: string;
  course_id: string;
  title: string;
  due_date: string;
  weight: number;
  estimated_hours: number;
  completed: boolean;
  created_at: string;
};

export type DevStudySession = {
  id: string;
  user_id: string;
  course_id: string | null;
  date: string;
  duration: number;
  topic: string | null;
  completed: boolean;
};

export type DevFlashcard = {
  id: string;
  user_id: string;
  question: string;
  answer: string;
  mastery_level: number;
  next_review: string;
  created_at: string;
};

type DevDb = {
  courses: DevCourse[];
  assignments: DevAssignment[];
  study_sessions: DevStudySession[];
  flashcards: DevFlashcard[];
};

const defaultDb: DevDb = {
  courses: [],
  assignments: [],
  study_sessions: [],
  flashcards: []
};

async function readDb(): Promise<DevDb> {
  try {
    const raw = await fs.readFile(DB_PATH, "utf-8");
    return JSON.parse(raw) as DevDb;
  } catch {
    return { ...defaultDb };
  }
}

async function writeDb(db: DevDb) {
  await fs.mkdir(path.dirname(DB_PATH), { recursive: true });
  await fs.writeFile(DB_PATH, JSON.stringify(db, null, 2));
}

export async function listCourses() {
  const db = await readDb();
  return db.courses;
}

export async function createCourse(input: {
  name: string;
  difficulty: number;
  weekly_hours: number;
  grading_weights?: string | null;
  exam_date?: string | null;
}) {
  const db = await readDb();
  const course: DevCourse = {
    id: randomUUID(),
    user_id: DEV_USER_ID,
    name: input.name,
    difficulty: input.difficulty,
    weekly_hours: input.weekly_hours,
    grading_weights: input.grading_weights ?? null,
    exam_date: input.exam_date ?? null,
    created_at: new Date().toISOString()
  };
  db.courses.push(course);
  await writeDb(db);
  return course;
}

export async function updateCourse(
  id: string,
  updates: Partial<Omit<DevCourse, "id" | "user_id" | "created_at">>
) {
  const db = await readDb();
  const index = db.courses.findIndex((course) => course.id === id);
  if (index === -1) return null;
  db.courses[index] = { ...db.courses[index], ...updates };
  await writeDb(db);
  return db.courses[index];
}

export async function deleteCourse(id: string) {
  const db = await readDb();
  db.courses = db.courses.filter((course) => course.id !== id);
  db.assignments = db.assignments.filter((assignment) => assignment.course_id !== id);
  await writeDb(db);
}

export async function listAssignments() {
  const db = await readDb();
  return db.assignments;
}

export async function createAssignment(input: {
  course_id: string;
  title: string;
  due_date: string;
  weight: number;
  estimated_hours: number;
}) {
  const db = await readDb();
  const assignment: DevAssignment = {
    id: randomUUID(),
    course_id: input.course_id,
    title: input.title,
    due_date: input.due_date,
    weight: input.weight,
    estimated_hours: input.estimated_hours,
    completed: false,
    created_at: new Date().toISOString()
  };
  db.assignments.push(assignment);
  await writeDb(db);
  return assignment;
}

export async function updateAssignment(
  id: string,
  updates: Partial<Omit<DevAssignment, "id" | "course_id" | "created_at">>
) {
  const db = await readDb();
  const index = db.assignments.findIndex((assignment) => assignment.id === id);
  if (index === -1) return null;
  db.assignments[index] = { ...db.assignments[index], ...updates };
  await writeDb(db);
  return db.assignments[index];
}

export async function deleteAssignment(id: string) {
  const db = await readDb();
  db.assignments = db.assignments.filter((assignment) => assignment.id !== id);
  await writeDb(db);
}

export async function listFlashcards() {
  const db = await readDb();
  return db.flashcards;
}

export async function createFlashcard(input: {
  question: string;
  answer: string;
}) {
  const db = await readDb();
  const today = new Date();
  const nextReview = new Date(today);
  nextReview.setDate(today.getDate() + 3);

  const flashcard: DevFlashcard = {
    id: randomUUID(),
    user_id: DEV_USER_ID,
    question: input.question,
    answer: input.answer,
    mastery_level: 0,
    next_review: nextReview.toISOString().slice(0, 10),
    created_at: new Date().toISOString()
  };
  db.flashcards.push(flashcard);
  await writeDb(db);
  return flashcard;
}

export async function updateFlashcard(
  id: string,
  updates: Partial<Omit<DevFlashcard, "id" | "user_id" | "created_at">>
) {
  const db = await readDb();
  const index = db.flashcards.findIndex((card) => card.id === id);
  if (index === -1) return null;
  db.flashcards[index] = { ...db.flashcards[index], ...updates };
  await writeDb(db);
  return db.flashcards[index];
}

export async function deleteFlashcard(id: string) {
  const db = await readDb();
  db.flashcards = db.flashcards.filter((card) => card.id !== id);
  await writeDb(db);
}

export async function listStudySessions() {
  const db = await readDb();
  return db.study_sessions;
}

export async function createStudySession(input: {
  course_id?: string | null;
  date: string;
  duration: number;
  topic?: string | null;
  completed?: boolean;
}) {
  const db = await readDb();
  const session: DevStudySession = {
    id: randomUUID(),
    user_id: DEV_USER_ID,
    course_id: input.course_id ?? null,
    date: input.date,
    duration: input.duration,
    topic: input.topic ?? null,
    completed: input.completed ?? false
  };
  db.study_sessions.push(session);
  await writeDb(db);
  return session;
}

export async function updateStudySession(
  id: string,
  updates: Partial<Omit<DevStudySession, "id" | "user_id">>
) {
  const db = await readDb();
  const index = db.study_sessions.findIndex((session) => session.id === id);
  if (index === -1) return null;
  db.study_sessions[index] = { ...db.study_sessions[index], ...updates };
  await writeDb(db);
  return db.study_sessions[index];
}

export async function deleteStudySession(id: string) {
  const db = await readDb();
  db.study_sessions = db.study_sessions.filter((session) => session.id !== id);
  await writeDb(db);
}
