-- =========================================================
-- MERITLOOM ADMIN AUTHORIZATION & CONTENT MANAGEMENT POLICIES
-- Adds profiles.role ('learner', 'admin') and secure RLS policies.
-- Resilient execution: safely checks for table existence before creating policies.
-- =========================================================

-- 1. ADD ROLE COLUMN TO PROFILES TABLE
alter table public.profiles
  add column if not exists role text not null default 'learner';

-- Add check constraint if not exists
do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'profiles_role_check'
  ) then
    alter table public.profiles
      add constraint profiles_role_check check (role in ('learner', 'admin'));
  end if;
end $$;

-- 2. CREATE HELPER FUNCTION: is_admin()
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role = 'admin'
  );
$$;

-- 3. SECURE PROFILES UPDATE POLICY
-- Normal learners cannot elevate themselves to admin.
drop policy if exists "Users can update own profile" on public.profiles;

create policy "Users can update own profile"
on public.profiles
for update
to authenticated
using (
  id = auth.uid()
)
with check (
  id = auth.uid()
  and (
    public.is_admin()
    or role = 'learner'
  )
);

-- 4. ADMIN RLS POLICIES FOR CORE CONTENT TABLES

-- CATEGORIES
do $$ begin
  if exists (select 1 from pg_tables where schemaname = 'public' and tablename = 'categories') then
    drop policy if exists "Admins can manage categories" on public.categories;
    create policy "Admins can manage categories"
      on public.categories for all to authenticated
      using (public.is_admin()) with check (public.is_admin());
  end if;
end $$;

-- COURSES
do $$ begin
  if exists (select 1 from pg_tables where schemaname = 'public' and tablename = 'courses') then
    drop policy if exists "Admins can select all courses" on public.courses;
    create policy "Admins can select all courses"
      on public.courses for select to authenticated
      using (public.is_admin());

    drop policy if exists "Admins can manage courses" on public.courses;
    create policy "Admins can manage courses"
      on public.courses for all to authenticated
      using (public.is_admin()) with check (public.is_admin());
  end if;
end $$;

-- COURSE MODULES
do $$ begin
  if exists (select 1 from pg_tables where schemaname = 'public' and tablename = 'course_modules') then
    drop policy if exists "Admins can select all modules" on public.course_modules;
    create policy "Admins can select all modules"
      on public.course_modules for select to authenticated
      using (public.is_admin());

    drop policy if exists "Admins can manage modules" on public.course_modules;
    create policy "Admins can manage modules"
      on public.course_modules for all to authenticated
      using (public.is_admin()) with check (public.is_admin());
  end if;
end $$;

-- LESSONS
do $$ begin
  if exists (select 1 from pg_tables where schemaname = 'public' and tablename = 'lessons') then
    drop policy if exists "Admins can select all lessons" on public.lessons;
    create policy "Admins can select all lessons"
      on public.lessons for select to authenticated
      using (public.is_admin());

    drop policy if exists "Admins can manage lessons" on public.lessons;
    create policy "Admins can manage lessons"
      on public.lessons for all to authenticated
      using (public.is_admin()) with check (public.is_admin());
  end if;
end $$;

-- COURSE OUTCOMES
do $$ begin
  if exists (select 1 from pg_tables where schemaname = 'public' and tablename = 'course_learning_outcomes') then
    drop policy if exists "Admins can manage outcomes" on public.course_learning_outcomes;
    create policy "Admins can manage outcomes"
      on public.course_learning_outcomes for all to authenticated
      using (public.is_admin()) with check (public.is_admin());
  end if;
end $$;

-- COURSE PREREQUISITES
do $$ begin
  if exists (select 1 from pg_tables where schemaname = 'public' and tablename = 'course_prerequisites') then
    drop policy if exists "Admins can manage prerequisites" on public.course_prerequisites;
    create policy "Admins can manage prerequisites"
      on public.course_prerequisites for all to authenticated
      using (public.is_admin()) with check (public.is_admin());
  end if;
end $$;

-- SKILLS
do $$ begin
  if exists (select 1 from pg_tables where schemaname = 'public' and tablename = 'skills') then
    drop policy if exists "Admins can manage skills" on public.skills;
    create policy "Admins can manage skills"
      on public.skills for all to authenticated
      using (public.is_admin()) with check (public.is_admin());
  end if;
end $$;

-- COURSE SKILLS
do $$ begin
  if exists (select 1 from pg_tables where schemaname = 'public' and tablename = 'course_skills') then
    drop policy if exists "Admins can manage course skills" on public.course_skills;
    create policy "Admins can manage course skills"
      on public.course_skills for all to authenticated
      using (public.is_admin()) with check (public.is_admin());
  end if;
end $$;

-- LESSON OBJECTIVES
do $$ begin
  if exists (select 1 from pg_tables where schemaname = 'public' and tablename = 'lesson_objectives') then
    drop policy if exists "Admins can manage lesson objectives" on public.lesson_objectives;
    create policy "Admins can manage lesson objectives"
      on public.lesson_objectives for all to authenticated
      using (public.is_admin()) with check (public.is_admin());
  end if;
end $$;

-- LESSON RESOURCES
do $$ begin
  if exists (select 1 from pg_tables where schemaname = 'public' and tablename = 'lesson_resources') then
    drop policy if exists "Admins can manage lesson resources" on public.lesson_resources;
    create policy "Admins can manage lesson resources"
      on public.lesson_resources for all to authenticated
      using (public.is_admin()) with check (public.is_admin());
  end if;
end $$;

-- PRACTICE QUIZZES
do $$ begin
  if exists (select 1 from pg_tables where schemaname = 'public' and tablename = 'practice_quizzes') then
    drop policy if exists "Admins can select all practice quizzes" on public.practice_quizzes;
    create policy "Admins can select all practice quizzes"
      on public.practice_quizzes for select to authenticated
      using (public.is_admin());

    drop policy if exists "Admins can manage practice quizzes" on public.practice_quizzes;
    create policy "Admins can manage practice quizzes"
      on public.practice_quizzes for all to authenticated
      using (public.is_admin()) with check (public.is_admin());
  end if;
end $$;

-- PRACTICE QUESTIONS
do $$ begin
  if exists (select 1 from pg_tables where schemaname = 'public' and tablename = 'practice_questions') then
    drop policy if exists "Admins can select all practice questions" on public.practice_questions;
    create policy "Admins can select all practice questions"
      on public.practice_questions for select to authenticated
      using (public.is_admin());

    drop policy if exists "Admins can manage practice questions" on public.practice_questions;
    create policy "Admins can manage practice questions"
      on public.practice_questions for all to authenticated
      using (public.is_admin()) with check (public.is_admin());
  end if;
end $$;

-- PRACTICE QUESTION OPTIONS
do $$ begin
  if exists (select 1 from pg_tables where schemaname = 'public' and tablename = 'practice_question_options') then
    drop policy if exists "Admins can manage practice question options" on public.practice_question_options;
    create policy "Admins can manage practice question options"
      on public.practice_question_options for all to authenticated
      using (public.is_admin()) with check (public.is_admin());
  end if;
end $$;

-- PRIVATE CORRECT OPTIONS
do $$ begin
  if exists (select 1 from pg_tables where schemaname = 'public' and tablename = 'practice_question_correct_options') then
    drop policy if exists "Admins can select correct options" on public.practice_question_correct_options;
    create policy "Admins can select correct options"
      on public.practice_question_correct_options for select to authenticated
      using (public.is_admin());

    drop policy if exists "Admins can manage correct options" on public.practice_question_correct_options;
    create policy "Admins can manage correct options"
      on public.practice_question_correct_options for all to authenticated
      using (public.is_admin()) with check (public.is_admin());
  end if;
end $$;

-- LEARNING PATHS (creates tables if missing, then adds admin policies)
create table if not exists public.learning_paths (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  subtitle text,
  summary text,
  description text,
  difficulty text not null default 'beginner' check (difficulty in ('beginner', 'intermediate', 'advanced', 'all_levels')),
  estimated_minutes integer not null default 0,
  course_count integer not null default 0,
  cover_image_url text,
  is_published boolean not null default false,
  is_featured boolean not null default false,
  position integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.learning_path_items (
  id uuid primary key default gen_random_uuid(),
  learning_path_id uuid not null references public.learning_paths(id) on delete cascade,
  course_id uuid references public.courses(id) on delete set null,
  item_type text not null default 'course' check (item_type in ('course', 'project')),
  title text,
  description text,
  step_label text,
  position integer not null default 1,
  is_required boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.learning_paths enable row level security;
alter table public.learning_path_items enable row level security;

-- Public read policies for learning paths
drop policy if exists "Public can read published learning paths" on public.learning_paths;
create policy "Public can read published learning paths"
  on public.learning_paths for select to anon, authenticated
  using (is_published = true);

drop policy if exists "Public can read published path items" on public.learning_path_items;
create policy "Public can read published path items"
  on public.learning_path_items for select to anon, authenticated
  using (
    exists (
      select 1 from public.learning_paths lp
      where lp.id = learning_path_items.learning_path_id
        and lp.is_published = true
    )
  );

-- Admin policies for learning paths
drop policy if exists "Admins can select all learning paths" on public.learning_paths;
create policy "Admins can select all learning paths"
  on public.learning_paths for select to authenticated
  using (public.is_admin());

drop policy if exists "Admins can manage learning paths" on public.learning_paths;
create policy "Admins can manage learning paths"
  on public.learning_paths for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Admins can select all learning path items" on public.learning_path_items;
create policy "Admins can select all learning path items"
  on public.learning_path_items for select to authenticated
  using (public.is_admin());

drop policy if exists "Admins can manage learning path items" on public.learning_path_items;
create policy "Admins can manage learning path items"
  on public.learning_path_items for all to authenticated
  using (public.is_admin()) with check (public.is_admin());
