-- =========================================================
-- MERITLOOM ADMIN ACCESS POLICIES:
-- Support Messages, Instructor Profiles, Learners & Enrollments
-- =========================================================

-- 1. ADMIN POLICIES FOR SUPPORT MESSAGES
do $$ begin
  if exists (select 1 from pg_tables where schemaname = 'public' and tablename = 'support_messages') then
    drop policy if exists "Admins can select all support messages" on public.support_messages;
    create policy "Admins can select all support messages"
      on public.support_messages for select to authenticated
      using (public.is_admin());

    drop policy if exists "Admins can manage support messages" on public.support_messages;
    create policy "Admins can manage support messages"
      on public.support_messages for all to authenticated
      using (public.is_admin()) with check (public.is_admin());
  end if;
end $$;

-- 2. ADMIN POLICIES FOR INSTRUCTOR PROFILES
do $$ begin
  if exists (select 1 from pg_tables where schemaname = 'public' and tablename = 'instructor_profiles') then
    drop policy if exists "Admins can select all instructor profiles" on public.instructor_profiles;
    create policy "Admins can select all instructor profiles"
      on public.instructor_profiles for select to authenticated
      using (public.is_admin());

    drop policy if exists "Admins can manage instructor profiles" on public.instructor_profiles;
    create policy "Admins can manage instructor profiles"
      on public.instructor_profiles for all to authenticated
      using (public.is_admin()) with check (public.is_admin());
  end if;
end $$;

-- 3. ADMIN POLICIES FOR PROFILES (LEARNERS DIRECTORY)
do $$ begin
  if exists (select 1 from pg_tables where schemaname = 'public' and tablename = 'profiles') then
    drop policy if exists "Admins can select all profiles" on public.profiles;
    create policy "Admins can select all profiles"
      on public.profiles for select to authenticated
      using (public.is_admin());

    drop policy if exists "Admins can update all profiles" on public.profiles;
    create policy "Admins can update all profiles"
      on public.profiles for update to authenticated
      using (public.is_admin()) with check (public.is_admin());
  end if;
end $$;

-- 4. ADMIN POLICIES FOR COURSE ENROLLMENTS & LESSON PROGRESS
do $$ begin
  if exists (select 1 from pg_tables where schemaname = 'public' and tablename = 'course_enrollments') then
    drop policy if exists "Admins can select all enrollments" on public.course_enrollments;
    create policy "Admins can select all enrollments"
      on public.course_enrollments for select to authenticated
      using (public.is_admin());
  end if;

  if exists (select 1 from pg_tables where schemaname = 'public' and tablename = 'lesson_progress') then
    drop policy if exists "Admins can select all lesson progress" on public.lesson_progress;
    create policy "Admins can select all lesson progress"
      on public.lesson_progress for select to authenticated
      using (public.is_admin());
  end if;
end $$;

