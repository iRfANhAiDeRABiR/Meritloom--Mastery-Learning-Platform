-- =========================================================
-- MERITLOOM PRACTICE QUIZZES & KNOWLEDGE CHECKS
-- Secure server-side grading without answer leaks
-- =========================================================

-- =========================================================
-- 1. PRACTICE QUIZZES
-- =========================================================

create table if not exists public.practice_quizzes (
  id uuid primary key default gen_random_uuid(),

  lesson_id uuid unique not null
    references public.lessons(id)
    on delete cascade,

  title text not null,
  description text,

  estimated_minutes integer not null default 5
    check (estimated_minutes >= 1),

  is_published boolean not null default true,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists practice_quizzes_lesson_idx
on public.practice_quizzes(lesson_id);

drop trigger if exists practice_quizzes_set_updated_at
on public.practice_quizzes;

create trigger practice_quizzes_set_updated_at
before update on public.practice_quizzes
for each row
execute function public.set_updated_at();


-- =========================================================
-- 2. PRACTICE QUESTIONS
-- =========================================================

create table if not exists public.practice_questions (
  id uuid primary key default gen_random_uuid(),

  quiz_id uuid not null
    references public.practice_quizzes(id)
    on delete cascade,

  question_type text not null default 'single_choice'
    check (
      question_type in (
        'single_choice',
        'multiple_choice',
        'true_false'
      )
    ),

  question_text text not null,
  topic text,

  code_content text,
  code_language text,

  image_url text,

  explanation text,

  position integer not null default 1
    check (position >= 1),

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists practice_questions_quiz_idx
on public.practice_questions(quiz_id, position);

drop trigger if exists practice_questions_set_updated_at
on public.practice_questions;

create trigger practice_questions_set_updated_at
before update on public.practice_questions
for each row
execute function public.set_updated_at();


-- =========================================================
-- 3. PRACTICE QUESTION OPTIONS (Publicly readable)
-- =========================================================

create table if not exists public.practice_question_options (
  id uuid primary key default gen_random_uuid(),

  question_id uuid not null
    references public.practice_questions(id)
    on delete cascade,

  option_text text not null,

  position integer not null default 1
    check (position >= 1),

  created_at timestamptz not null default now()
);

create index if not exists practice_question_options_question_idx
on public.practice_question_options(question_id, position);


-- =========================================================
-- 4. PRIVATE CORRECT OPTIONS (NO Public / Anon SELECT Policy)
-- =========================================================
-- Kept strictly separate so client queries can NEVER inspect correct answers!

create table if not exists public.practice_question_correct_options (
  question_id uuid not null
    references public.practice_questions(id)
    on delete cascade,

  option_id uuid not null
    references public.practice_question_options(id)
    on delete cascade,

  primary key(question_id, option_id)
);

create index if not exists practice_question_correct_options_q_idx
on public.practice_question_correct_options(question_id);


-- =========================================================
-- 5. PRACTICE QUIZ ATTEMPTS
-- =========================================================

create table if not exists public.practice_quiz_attempts (
  id uuid primary key default gen_random_uuid(),

  user_id uuid not null
    references public.profiles(id)
    on delete cascade,

  quiz_id uuid not null
    references public.practice_quizzes(id)
    on delete cascade,

  started_at timestamptz not null default now(),
  completed_at timestamptz,

  correct_count integer not null default 0
    check (correct_count >= 0),

  total_questions integer not null default 0
    check (total_questions >= 0),

  created_at timestamptz not null default now()
);

create index if not exists practice_quiz_attempts_user_idx
on public.practice_quiz_attempts(user_id, quiz_id);


-- =========================================================
-- 6. PRACTICE QUIZ ANSWERS
-- =========================================================

create table if not exists public.practice_quiz_answers (
  id uuid primary key default gen_random_uuid(),

  attempt_id uuid not null
    references public.practice_quiz_attempts(id)
    on delete cascade,

  question_id uuid not null
    references public.practice_questions(id)
    on delete cascade,

  selected_option_ids uuid[] not null default '{}',

  is_correct boolean not null default false,

  answered_at timestamptz not null default now(),

  unique(attempt_id, question_id)
);

create index if not exists practice_quiz_answers_attempt_idx
on public.practice_quiz_answers(attempt_id);


-- =========================================================
-- 7. ENABLE ROW LEVEL SECURITY
-- =========================================================

alter table public.practice_quizzes enable row level security;
alter table public.practice_questions enable row level security;
alter table public.practice_question_options enable row level security;
alter table public.practice_question_correct_options enable row level security;
alter table public.practice_quiz_attempts enable row level security;
alter table public.practice_quiz_answers enable row level security;


-- =========================================================
-- 8. QUIZ & QUESTIONS RLS (Read-only for published content)
-- =========================================================

drop policy if exists "Public can read published practice quizzes"
on public.practice_quizzes;

create policy "Public can read published practice quizzes"
on public.practice_quizzes
for select
to anon, authenticated
using (
  is_published = true
  and exists (
    select 1
    from public.lessons l
    join public.course_modules m on m.id = l.module_id
    join public.courses c on c.id = m.course_id
    where l.id = practice_quizzes.lesson_id
      and l.is_published = true
      and m.is_published = true
      and c.is_published = true
      and c.is_free = true
  )
);

drop policy if exists "Public can read published practice questions"
on public.practice_questions;

create policy "Public can read published practice questions"
on public.practice_questions
for select
to anon, authenticated
using (
  exists (
    select 1
    from public.practice_quizzes q
    where q.id = practice_questions.quiz_id
      and q.is_published = true
  )
);

drop policy if exists "Public can read published practice question options"
on public.practice_question_options;

create policy "Public can read published practice question options"
on public.practice_question_options
for select
to anon, authenticated
using (
  exists (
    select 1
    from public.practice_questions q
    join public.practice_quizzes pq on pq.id = q.quiz_id
    where q.id = practice_question_options.question_id
      and pq.is_published = true
  )
);

-- NOTE: public.practice_question_correct_options has NO SELECT policy for anon or authenticated!
-- Only service role / trusted server-side execution can access it.


-- =========================================================
-- 9. USER ATTEMPTS & ANSWERS RLS
-- =========================================================

drop policy if exists "Users can read own quiz attempts"
on public.practice_quiz_attempts;

create policy "Users can read own quiz attempts"
on public.practice_quiz_attempts
for select
to authenticated
using (
  auth.uid() = user_id
);

drop policy if exists "Users can create own quiz attempts"
on public.practice_quiz_attempts;

create policy "Users can create own quiz attempts"
on public.practice_quiz_attempts
for insert
to authenticated
with check (
  auth.uid() = user_id
);

drop policy if exists "Users can update own quiz attempts"
on public.practice_quiz_attempts;

create policy "Users can update own quiz attempts"
on public.practice_quiz_attempts
for update
to authenticated
using (
  auth.uid() = user_id
)
with check (
  auth.uid() = user_id
);

drop policy if exists "Users can read own quiz answers"
on public.practice_quiz_answers;

create policy "Users can read own quiz answers"
on public.practice_quiz_answers
for select
to authenticated
using (
  exists (
    select 1
    from public.practice_quiz_attempts a
    where a.id = practice_quiz_answers.attempt_id
      and a.user_id = auth.uid()
  )
);

drop policy if exists "Users can create own quiz answers"
on public.practice_quiz_answers;

create policy "Users can create own quiz answers"
on public.practice_quiz_answers
for insert
to authenticated
with check (
  exists (
    select 1
    from public.practice_quiz_attempts a
    where a.id = practice_quiz_answers.attempt_id
      and a.user_id = auth.uid()
  )
);

