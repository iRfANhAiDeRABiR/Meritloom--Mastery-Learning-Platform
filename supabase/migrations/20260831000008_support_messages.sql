-- =========================================================================
-- Meritloom Migration: Support Messages
-- Enables public and authenticated learners to submit contact/support messages
-- =========================================================================

create table if not exists public.support_messages (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  name text not null,
  email text not null,
  topic text not null check (topic in ('course', 'video', 'account', 'progress', 'learning_path', 'bug', 'content_feedback', 'general')),
  message text not null,
  page_url text,
  status text not null default 'new' check (status in ('new', 'reviewing', 'resolved', 'closed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists support_messages_user_idx on public.support_messages(user_id);
create index if not exists support_messages_created_idx on public.support_messages(created_at desc);

-- Enable RLS
alter table public.support_messages enable row level security;

-- Policy: Anyone can insert support messages
drop policy if exists "Anyone can submit a support message" on public.support_messages;
create policy "Anyone can submit a support message"
  on public.support_messages for insert to anon, authenticated
  with check (true);
