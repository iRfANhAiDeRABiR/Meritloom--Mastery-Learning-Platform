-- Migration 20260831000019: User, Staff, Role & Account Management
-- Implements role hierarchy (learner, instructor, sub_admin, admin), account suspension,
-- staff permissions, course instructors, staff invitations, and immutable administrative audit logs.

-- 1. EXTEND PROFILES TABLE WITH ACCOUNT STATUS AND EXPANDED ROLES
alter table public.profiles
  add column if not exists account_status text not null default 'active',
  add column if not exists suspended_at timestamptz,
  add column if not exists suspended_by uuid references public.profiles(id) on delete set null,
  add column if not exists suspension_reason text;

-- Update role check constraint safely
alter table public.profiles drop constraint if exists profiles_role_check;
alter table public.profiles
  add constraint profiles_role_check
  check (role in ('learner', 'instructor', 'sub_admin', 'admin'));

-- Add account_status check constraint safely
alter table public.profiles drop constraint if exists profiles_account_status_check;
alter table public.profiles
  add constraint profiles_account_status_check
  check (account_status in ('active', 'suspended'));

create index if not exists profiles_role_status_idx
  on public.profiles(role, account_status);

-- 2. STAFF PERMISSIONS TABLE (FOR SUB-ADMINS)
create table if not exists public.staff_permissions (
  id uuid primary key default gen_random_uuid(),
  staff_user_id uuid not null references public.profiles(id) on delete cascade,
  permission text not null,
  created_at timestamptz not null default now(),
  created_by uuid references public.profiles(id) on delete set null,
  constraint staff_permissions_user_perm_unique unique (staff_user_id, permission)
);

create index if not exists staff_permissions_user_idx
  on public.staff_permissions(staff_user_id);

alter table public.staff_permissions enable row level security;

-- 3. COURSE INSTRUCTORS ASSIGNMENT TABLE
create table if not exists public.course_instructors (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  role text not null default 'instructor',
  created_at timestamptz not null default now(),
  assigned_by uuid references public.profiles(id) on delete set null,
  constraint course_instructors_course_user_unique unique (course_id, user_id)
);

create index if not exists course_instructors_user_idx
  on public.course_instructors(user_id);

create index if not exists course_instructors_course_idx
  on public.course_instructors(course_id);

alter table public.course_instructors enable row level security;

-- 4. STAFF INVITATIONS TABLE
create table if not exists public.staff_invitations (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  role text not null check (role in ('instructor', 'sub_admin')),
  display_name text,
  permissions text[] not null default '{}'::text[],
  assigned_course_ids uuid[] not null default '{}'::uuid[],
  token text unique not null,
  status text not null default 'pending' check (status in ('pending', 'accepted', 'expired', 'canceled')),
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  expires_at timestamptz not null default (now() + interval '7 days'),
  accepted_at timestamptz
);

create index if not exists staff_invitations_email_idx
  on public.staff_invitations(email, status);

alter table public.staff_invitations enable row level security;

-- 5. IMMUTABLE ADMINISTRATIVE AUDIT LOG TABLE
create table if not exists public.admin_audit_log (
  id uuid primary key default gen_random_uuid(),
  actor_user_id uuid references public.profiles(id) on delete set null,
  action text not null,
  target_type text not null check (target_type in ('user', 'staff', 'course', 'system', 'learning_path', 'category', 'quiz')),
  target_id uuid,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists admin_audit_log_created_at_idx
  on public.admin_audit_log(created_at desc);

create index if not exists admin_audit_log_actor_idx
  on public.admin_audit_log(actor_user_id, created_at desc);

create index if not exists admin_audit_log_target_idx
  on public.admin_audit_log(target_type, target_id);

alter table public.admin_audit_log enable row level security;

-- 6. SECURITY DEFINER HELPER FUNCTIONS
create or replace function public.is_root_admin()
returns boolean
language sql
security definer
set search_path = public, pg_temp
stable
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid()
      and role = 'admin'
      and account_status = 'active'
  );
$$;

create or replace function public.is_admin_or_sub_admin()
returns boolean
language sql
security definer
set search_path = public, pg_temp
stable
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid()
      and role in ('admin', 'sub_admin')
      and account_status = 'active'
  );
$$;

create or replace function public.has_staff_permission(p_user_id uuid, p_permission text)
returns boolean
language sql
security definer
set search_path = public, pg_temp
stable
as $$
  select exists (
    select 1 from public.profiles
    where id = p_user_id
      and role = 'admin'
      and account_status = 'active'
  ) or exists (
    select 1 from public.staff_permissions sp
    join public.profiles p on p.id = sp.staff_user_id
    where sp.staff_user_id = p_user_id
      and sp.permission = p_permission
      and p.role = 'sub_admin'
      and p.account_status = 'active'
  );
$$;

create or replace function public.is_course_instructor(p_user_id uuid, p_course_id uuid)
returns boolean
language sql
security definer
set search_path = public, pg_temp
stable
as $$
  select exists (
    select 1 from public.profiles
    where id = p_user_id
      and role = 'admin'
      and account_status = 'active'
  ) or exists (
    select 1 from public.course_instructors ci
    join public.profiles p on p.id = ci.user_id
    where ci.user_id = p_user_id
      and ci.course_id = p_course_id
      and p.role in ('instructor', 'sub_admin', 'admin')
      and p.account_status = 'active'
  );
$$;

-- 7. AUDIT EVENT RECORDER RPC
create or replace function public.record_admin_audit_event(
  p_actor_id uuid,
  p_action text,
  p_target_type text,
  p_target_id uuid default null,
  p_metadata jsonb default '{}'::jsonb
)
returns uuid
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_id uuid;
begin
  insert into public.admin_audit_log (
    actor_user_id,
    action,
    target_type,
    target_id,
    metadata,
    created_at
  ) values (
    p_actor_id,
    p_action,
    p_target_type,
    p_target_id,
    coalesce(p_metadata, '{}'::jsonb),
    now()
  ) returning id into v_id;

  return v_id;
end;
$$;

-- 8. ROW LEVEL SECURITY POLICIES

-- PROFILES UPDATE POLICY: Learners cannot modify role, account_status, or suspension fields
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
    -- Admins can update any profile
    public.is_root_admin()
    -- Normal users cannot tamper with role or account_status
    or (
      role = (select p.role from public.profiles p where p.id = auth.uid())
      and account_status = (select p.account_status from public.profiles p where p.id = auth.uid())
      and suspended_at is not distinct from (select p.suspended_at from public.profiles p where p.id = auth.uid())
      and suspended_by is not distinct from (select p.suspended_by from public.profiles p where p.id = auth.uid())
    )
  )
);

-- STAFF PERMISSIONS POLICIES
drop policy if exists "Admins can manage staff permissions" on public.staff_permissions;
create policy "Admins can manage staff permissions"
on public.staff_permissions
for all
to authenticated
using (public.is_root_admin())
with check (public.is_root_admin());

drop policy if exists "Staff can view own permissions" on public.staff_permissions;
create policy "Staff can view own permissions"
on public.staff_permissions
for select
to authenticated
using (staff_user_id = auth.uid());

-- COURSE INSTRUCTORS POLICIES
drop policy if exists "Admins can manage course instructors" on public.course_instructors;
create policy "Admins can manage course instructors"
on public.course_instructors
for all
to authenticated
using (public.is_admin_or_sub_admin())
with check (public.is_admin_or_sub_admin());

drop policy if exists "Instructors and learners can view course instructors" on public.course_instructors;
create policy "Instructors and learners can view course instructors"
on public.course_instructors
for select
to authenticated
using (true);

-- STAFF INVITATIONS POLICIES
drop policy if exists "Admins can manage staff invitations" on public.staff_invitations;
create policy "Admins can manage staff invitations"
on public.staff_invitations
for all
to authenticated
using (public.is_root_admin())
with check (public.is_root_admin());

-- AUDIT LOG POLICIES (Immutable: Only select allowed for Admins; No update, no delete)
drop policy if exists "Admins can view audit logs" on public.admin_audit_log;
create policy "Admins can view audit logs"
on public.admin_audit_log
for select
to authenticated
using (public.is_admin_or_sub_admin());
