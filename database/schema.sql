create extension if not exists "pgcrypto";

create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  university text,
  created_at timestamptz not null default now()
);

create table if not exists courses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  name text not null,
  difficulty integer not null check (difficulty between 1 and 5),
  weekly_hours integer not null,
  grading_weights jsonb,
  exam_date date,
  created_at timestamptz not null default now()
);

create table if not exists assignments (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references courses(id) on delete cascade,
  title text not null,
  due_date date not null,
  weight numeric not null,
  estimated_hours numeric not null,
  completed boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists study_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  course_id uuid references courses(id) on delete set null,
  date date not null,
  duration integer not null,
  topic text,
  completed boolean not null default false
);

create table if not exists flashcards (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  question text not null,
  answer text not null,
  mastery_level integer not null default 0,
  next_review date not null,
  created_at timestamptz not null default now()
);

create table if not exists ai_usage (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  tokens_used integer not null,
  created_at timestamptz not null default now()
);

create table if not exists subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  stripe_customer_id text,
  status text not null,
  plan text not null,
  created_at timestamptz not null default now()
);

create index if not exists idx_courses_user_id on courses(user_id);
create index if not exists idx_assignments_course_id on assignments(course_id);
create index if not exists idx_assignments_due_date on assignments(due_date);
create index if not exists idx_study_sessions_user_id on study_sessions(user_id);
create index if not exists idx_study_sessions_date on study_sessions(date);
create index if not exists idx_flashcards_user_id on flashcards(user_id);
create index if not exists idx_flashcards_next_review on flashcards(next_review);
create index if not exists idx_ai_usage_user_id on ai_usage(user_id);
create index if not exists idx_ai_usage_created_at on ai_usage(created_at);
create index if not exists idx_subscriptions_user_id on subscriptions(user_id);
create index if not exists idx_subscriptions_customer on subscriptions(stripe_customer_id);
