-- Migration 20260831000018: System Performance Metrics & Health Monitoring Table
-- Secure table and RPCs for Admin System Health & Operational Observability.

-- 1. Create table for operational metric samples
create table if not exists public.system_performance_metrics (
  id uuid primary key default gen_random_uuid(),
  route text not null,
  operation text,
  metric_type text not null default 'route_request', -- 'route_request', 'db_query', 'error', 'web_vital'
  duration_ms integer not null,
  status_code integer default 200,
  success boolean default true,
  error_category text,
  environment text default 'production',
  metadata jsonb default '{}'::jsonb,
  recorded_at timestamptz default now()
);

-- 2. Indexes for fast aggregation and time-range filtering
create index if not exists system_performance_metrics_recorded_at_idx
  on public.system_performance_metrics (recorded_at desc);

create index if not exists system_performance_metrics_route_idx
  on public.system_performance_metrics (route, recorded_at desc);

create index if not exists system_performance_metrics_type_idx
  on public.system_performance_metrics (metric_type, recorded_at desc);

-- 3. Enable RLS
alter table public.system_performance_metrics enable row level security;

-- 4. RLS Policies: ONLY Admin users and service role may access metrics.
-- Regular learners and anonymous visitors have ZERO SELECT, INSERT, UPDATE, or DELETE access.
drop policy if exists "Admins can view system performance metrics" on public.system_performance_metrics;
create policy "Admins can view system performance metrics"
  on public.system_performance_metrics
  for select
  to authenticated
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
      and profiles.role = 'admin'
    )
  );

-- 5. Safe RPC for recording performance metrics server-side
create or replace function public.record_performance_metric(
  p_route text,
  p_duration_ms integer,
  p_status_code integer default 200,
  p_success boolean default true,
  p_operation text default null,
  p_error_category text default null,
  p_metric_type text default 'route_request'
)
returns void
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  insert into public.system_performance_metrics (
    route,
    duration_ms,
    status_code,
    success,
    operation,
    error_category,
    metric_type,
    recorded_at
  ) values (
    coalesce(p_route, '/'),
    greatest(0, p_duration_ms),
    coalesce(p_status_code, 200),
    coalesce(p_success, true),
    p_operation,
    p_error_category,
    coalesce(p_metric_type, 'route_request'),
    now()
  );
end;
$$;

-- 6. Lightweight Database Health Check RPC
create or replace function public.admin_database_health()
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_result jsonb;
  v_course_count bigint;
  v_module_count bigint;
  v_lesson_count bigint;
  v_enrollment_count bigint;
  v_progress_count bigint;
  v_quiz_count bigint;
  v_path_count bigint;
begin
  -- Quick counts
  select count(*) into v_course_count from public.courses;
  select count(*) into v_module_count from public.course_modules;
  select count(*) into v_lesson_count from public.lessons;
  select count(*) into v_enrollment_count from public.course_enrollments;
  select count(*) into v_progress_count from public.lesson_progress;
  select count(*) into v_quiz_count from public.practice_quizzes;
  select count(*) into v_path_count from public.learning_paths;

  v_result := jsonb_build_object(
    'status', 'healthy',
    'timestamp', now(),
    'counts', jsonb_build_object(
      'courses', v_course_count,
      'modules', v_module_count,
      'lessons', v_lesson_count,
      'enrollments', v_enrollment_count,
      'progress', v_progress_count,
      'quizzes', v_quiz_count,
      'learning_paths', v_path_count
    )
  );

  return v_result;
end;
$$;
