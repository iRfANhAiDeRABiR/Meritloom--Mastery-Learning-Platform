-- =========================================================
-- MERITLOOM PRACTICE WORKSPACE DRAFTS
-- Stores private learner practice code (HTML, CSS, JS) with strict RLS
-- =========================================================

create table if not exists public.lesson_practice_drafts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  lesson_id uuid not null references public.lessons(id) on delete cascade,
  html_code text not null default '',
  css_code text not null default '',
  javascript_code text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(user_id, lesson_id)
);

create index if not exists lesson_practice_drafts_user_idx
on public.lesson_practice_drafts(user_id);

create index if not exists lesson_practice_drafts_lesson_idx
on public.lesson_practice_drafts(lesson_id);

-- Enable RLS
alter table public.lesson_practice_drafts enable row level security;

-- Strict Isolation Policies: Learner only accesses their own practice draft
drop policy if exists "Learners can select own practice drafts" on public.lesson_practice_drafts;
create policy "Learners can select own practice drafts"
  on public.lesson_practice_drafts for select to authenticated
  using (auth.uid() = user_id);

drop policy if exists "Learners can insert own practice drafts" on public.lesson_practice_drafts;
create policy "Learners can insert own practice drafts"
  on public.lesson_practice_drafts for insert to authenticated
  with check (auth.uid() = user_id);

drop policy if exists "Learners can update own practice drafts" on public.lesson_practice_drafts;
create policy "Learners can update own practice drafts"
  on public.lesson_practice_drafts for update to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "Learners can delete own practice drafts" on public.lesson_practice_drafts;
create policy "Learners can delete own practice drafts"
  on public.lesson_practice_drafts for delete to authenticated
  using (auth.uid() = user_id);
