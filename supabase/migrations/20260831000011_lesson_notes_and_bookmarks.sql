-- =========================================================
-- MERITLOOM LESSON NOTES & LESSON BOOKMARKS
-- Secure learner notes & bookmarks with strict RLS isolation
-- =========================================================

-- 1. Ensure lesson_bookmarks table exists
create table if not exists public.lesson_bookmarks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  lesson_id uuid not null references public.lessons(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique(user_id, lesson_id)
);

create index if not exists lesson_bookmarks_user_idx on public.lesson_bookmarks(user_id);
create index if not exists lesson_bookmarks_lesson_idx on public.lesson_bookmarks(lesson_id);

-- Enable RLS
alter table public.lesson_bookmarks enable row level security;

-- Policies for lesson_bookmarks
drop policy if exists "Learners can select own lesson bookmarks" on public.lesson_bookmarks;
create policy "Learners can select own lesson bookmarks"
  on public.lesson_bookmarks for select to authenticated
  using (auth.uid() = user_id);

drop policy if exists "Learners can insert own lesson bookmarks" on public.lesson_bookmarks;
create policy "Learners can insert own lesson bookmarks"
  on public.lesson_bookmarks for insert to authenticated
  with check (auth.uid() = user_id);

drop policy if exists "Learners can delete own lesson bookmarks" on public.lesson_bookmarks;
create policy "Learners can delete own lesson bookmarks"
  on public.lesson_bookmarks for delete to authenticated
  using (auth.uid() = user_id);

-- 2. Ensure lesson_notes table & RLS policies
create table if not exists public.lesson_notes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  lesson_id uuid not null references public.lessons(id) on delete cascade,
  content text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(user_id, lesson_id)
);

create index if not exists lesson_notes_user_idx on public.lesson_notes(user_id);
create index if not exists lesson_notes_lesson_idx on public.lesson_notes(lesson_id);

alter table public.lesson_notes enable row level security;

drop policy if exists "Learners can select own lesson notes" on public.lesson_notes;
create policy "Learners can select own lesson notes"
  on public.lesson_notes for select to authenticated
  using (auth.uid() = user_id);

drop policy if exists "Learners can insert own lesson notes" on public.lesson_notes;
create policy "Learners can insert own lesson notes"
  on public.lesson_notes for insert to authenticated
  with check (auth.uid() = user_id);

drop policy if exists "Learners can update own lesson notes" on public.lesson_notes;
create policy "Learners can update own lesson notes"
  on public.lesson_notes for update to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "Learners can delete own lesson notes" on public.lesson_notes;
create policy "Learners can delete own lesson notes"
  on public.lesson_notes for delete to authenticated
  using (auth.uid() = user_id);
