-- =========================================================
-- MERITLOOM CORE DATABASE
-- Next.js + Supabase
-- Free individual learning platform
-- =========================================================


-- =========================================================
-- 0. EXTENSIONS
-- =========================================================

create extension if not exists pgcrypto;


-- =========================================================
-- 1. UPDATED_AT HELPER
-- =========================================================

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;


-- =========================================================
-- 2. USER PROFILES
-- =========================================================

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,

  full_name text,
  avatar_url text,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);


drop trigger if exists profiles_set_updated_at on public.profiles;

create trigger profiles_set_updated_at
before update on public.profiles
for each row
execute function public.set_updated_at();


-- Automatically create profile after Supabase signup

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin

  insert into public.profiles (
    id,
    full_name,
    avatar_url
  )
  values (
    new.id,
    nullif(new.raw_user_meta_data ->> 'full_name', ''),
    nullif(new.raw_user_meta_data ->> 'avatar_url', '')
  )
  on conflict (id) do nothing;

  return new;

end;
$$;


drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
after insert on auth.users
for each row
execute function public.handle_new_user();



-- =========================================================
-- 3. PUBLIC INSTRUCTOR PROFILES
-- =========================================================
-- Keep public instructor information separate from
-- private learner profiles.

create table if not exists public.instructor_profiles (
  id uuid primary key default gen_random_uuid(),

  profile_id uuid unique
    references public.profiles(id)
    on delete cascade,

  display_name text not null,
  title text,
  bio text,
  avatar_url text,

  is_published boolean not null default false,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);


drop trigger if exists instructor_profiles_set_updated_at
on public.instructor_profiles;

create trigger instructor_profiles_set_updated_at
before update on public.instructor_profiles
for each row
execute function public.set_updated_at();



-- =========================================================
-- 4. COURSE CATEGORIES
-- =========================================================

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),

  name text not null,
  slug text not null unique,

  description text,
  icon_name text,

  position integer not null default 0,

  is_active boolean not null default true,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);


create index if not exists categories_position_idx
on public.categories(position);


drop trigger if exists categories_set_updated_at
on public.categories;

create trigger categories_set_updated_at
before update on public.categories
for each row
execute function public.set_updated_at();



-- =========================================================
-- 5. COURSES
-- =========================================================

create table if not exists public.courses (
  id uuid primary key default gen_random_uuid(),

  category_id uuid
    references public.categories(id)
    on delete set null,

  instructor_profile_id uuid
    references public.instructor_profiles(id)
    on delete set null,

  slug text not null unique,

  title text not null,

  summary text,

  description text,

  cover_image_url text,

  difficulty text
    check (
      difficulty is null
      or difficulty in (
        'beginner',
        'intermediate',
        'advanced'
      )
    ),

  language text not null default 'English',

  estimated_minutes integer
    check (
      estimated_minutes is null
      or estimated_minutes >= 0
    ),

  is_free boolean not null default true,

  is_published boolean not null default false,

  published_at timestamptz,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);


create index if not exists courses_category_id_idx
on public.courses(category_id);

create index if not exists courses_instructor_idx
on public.courses(instructor_profile_id);

create index if not exists courses_published_idx
on public.courses(is_published, is_free);

create index if not exists courses_difficulty_idx
on public.courses(difficulty);


drop trigger if exists courses_set_updated_at
on public.courses;

create trigger courses_set_updated_at
before update on public.courses
for each row
execute function public.set_updated_at();



-- =========================================================
-- 6. COURSE MODULES
-- =========================================================

create table if not exists public.course_modules (
  id uuid primary key default gen_random_uuid(),

  course_id uuid not null
    references public.courses(id)
    on delete cascade,

  slug text,

  title text not null,

  description text,

  position integer not null
    check (position >= 1),

  estimated_minutes integer
    check (
      estimated_minutes is null
      or estimated_minutes >= 0
    ),

  is_published boolean not null default false,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  unique(course_id, position),
  unique(course_id, slug)
);


create index if not exists course_modules_course_idx
on public.course_modules(course_id);

create index if not exists course_modules_order_idx
on public.course_modules(course_id, position);


drop trigger if exists course_modules_set_updated_at
on public.course_modules;

create trigger course_modules_set_updated_at
before update on public.course_modules
for each row
execute function public.set_updated_at();



-- =========================================================
-- 7. LESSONS
-- =========================================================

create table if not exists public.lessons (
  id uuid primary key default gen_random_uuid(),

  module_id uuid not null
    references public.course_modules(id)
    on delete cascade,

  slug text not null unique,

  title text not null,

  summary text,

  lesson_type text not null default 'article'
    check (
      lesson_type in (
        'video',
        'article',
        'exercise',
        'practice',
        'knowledge_check'
      )
    ),

  -- Prefer structured JSON content instead of unsafe raw HTML.
  content jsonb,

  video_url text,

  key_takeaway text,

  estimated_minutes integer
    check (
      estimated_minutes is null
      or estimated_minutes >= 0
    ),

  position integer not null
    check (position >= 1),

  is_preview boolean not null default false,

  is_published boolean not null default false,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  unique(module_id, position)
);


create index if not exists lessons_module_idx
on public.lessons(module_id);

create index if not exists lessons_order_idx
on public.lessons(module_id, position);

create index if not exists lessons_published_idx
on public.lessons(is_published);


drop trigger if exists lessons_set_updated_at
on public.lessons;

create trigger lessons_set_updated_at
before update on public.lessons
for each row
execute function public.set_updated_at();



-- =========================================================
-- 8. COURSE LEARNING OUTCOMES
-- =========================================================

create table if not exists public.course_learning_outcomes (
  id uuid primary key default gen_random_uuid(),

  course_id uuid not null
    references public.courses(id)
    on delete cascade,

  outcome text not null,

  position integer not null default 1,

  created_at timestamptz not null default now()
);


create index if not exists course_learning_outcomes_course_idx
on public.course_learning_outcomes(course_id, position);



-- =========================================================
-- 9. COURSE PREREQUISITES
-- =========================================================

create table if not exists public.course_prerequisites (
  id uuid primary key default gen_random_uuid(),

  course_id uuid not null
    references public.courses(id)
    on delete cascade,

  prerequisite text not null,

  position integer not null default 1,

  created_at timestamptz not null default now()
);


create index if not exists course_prerequisites_course_idx
on public.course_prerequisites(course_id, position);



-- =========================================================
-- 10. SKILLS
-- =========================================================

create table if not exists public.skills (
  id uuid primary key default gen_random_uuid(),

  name text not null unique,

  slug text not null unique,

  is_active boolean not null default true,

  created_at timestamptz not null default now()
);



-- =========================================================
-- 11. COURSE <-> SKILLS
-- =========================================================

create table if not exists public.course_skills (
  course_id uuid not null
    references public.courses(id)
    on delete cascade,

  skill_id uuid not null
    references public.skills(id)
    on delete cascade,

  primary key(course_id, skill_id)
);


create index if not exists course_skills_skill_idx
on public.course_skills(skill_id);



-- =========================================================
-- 12. LESSON OBJECTIVES
-- =========================================================

create table if not exists public.lesson_objectives (
  id uuid primary key default gen_random_uuid(),

  lesson_id uuid not null
    references public.lessons(id)
    on delete cascade,

  objective text not null,

  position integer not null default 1,

  created_at timestamptz not null default now()
);


create index if not exists lesson_objectives_lesson_idx
on public.lesson_objectives(lesson_id, position);



-- =========================================================
-- 13. LESSON RESOURCES
-- =========================================================

create table if not exists public.lesson_resources (
  id uuid primary key default gen_random_uuid(),

  lesson_id uuid not null
    references public.lessons(id)
    on delete cascade,

  title text not null,

  resource_type text not null
    check (
      resource_type in (
        'transcript',
        'pdf',
        'file',
        'code',
        'external_link',
        'worksheet'
      )
    ),

  external_url text,

  storage_path text,

  position integer not null default 1,

  created_at timestamptz not null default now(),

  check (
    external_url is not null
    or storage_path is not null
  )
);


create index if not exists lesson_resources_lesson_idx
on public.lesson_resources(lesson_id, position);



-- =========================================================
-- 14. LEARNER PREFERENCES / ONBOARDING
-- =========================================================

create table if not exists public.learner_preferences (
  user_id uuid primary key
    references public.profiles(id)
    on delete cascade,

  learning_goal text
    check (
      learning_goal is null
      or learning_goal in (
        'explore',
        'practical_skills',
        'strengthen_knowledge'
      )
    ),

  level_preference text
    check (
      level_preference is null
      or level_preference in (
        'beginner',
        'intermediate',
        'advanced'
      )
    ),

  preferred_minutes_per_day integer
    check (
      preferred_minutes_per_day is null
      or preferred_minutes_per_day > 0
    ),

  schedule_preference text,

  content_preferences text[] not null default '{}',

  learning_reminders boolean not null default false,

  onboarding_status text not null default 'pending'
    check (
      onboarding_status in (
        'pending',
        'completed',
        'skipped'
      )
    ),

  onboarding_completed_at timestamptz,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);


drop trigger if exists learner_preferences_set_updated_at
on public.learner_preferences;

create trigger learner_preferences_set_updated_at
before update on public.learner_preferences
for each row
execute function public.set_updated_at();



-- =========================================================
-- 15. LEARNER INTERESTS
-- =========================================================

create table if not exists public.learner_interests (
  user_id uuid not null
    references public.profiles(id)
    on delete cascade,

  category_id uuid not null
    references public.categories(id)
    on delete cascade,

  created_at timestamptz not null default now(),

  primary key(user_id, category_id)
);


create index if not exists learner_interests_category_idx
on public.learner_interests(category_id);



-- =========================================================
-- 16. COURSE ENROLLMENTS
-- =========================================================

create table if not exists public.course_enrollments (
  id uuid primary key default gen_random_uuid(),

  user_id uuid not null
    references public.profiles(id)
    on delete cascade,

  course_id uuid not null
    references public.courses(id)
    on delete cascade,

  status text not null default 'active'
    check (
      status in (
        'active',
        'completed',
        'archived'
      )
    ),

  enrolled_at timestamptz not null default now(),

  last_accessed_at timestamptz,

  completed_at timestamptz,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  unique(user_id, course_id)
);


create index if not exists course_enrollments_user_idx
on public.course_enrollments(user_id);

create index if not exists course_enrollments_course_idx
on public.course_enrollments(course_id);

create index if not exists course_enrollments_activity_idx
on public.course_enrollments(user_id, last_accessed_at desc);


drop trigger if exists course_enrollments_set_updated_at
on public.course_enrollments;

create trigger course_enrollments_set_updated_at
before update on public.course_enrollments
for each row
execute function public.set_updated_at();



-- =========================================================
-- 17. LESSON PROGRESS
-- =========================================================

create table if not exists public.lesson_progress (
  id uuid primary key default gen_random_uuid(),

  user_id uuid not null
    references public.profiles(id)
    on delete cascade,

  course_id uuid not null
    references public.courses(id)
    on delete cascade,

  lesson_id uuid not null
    references public.lessons(id)
    on delete cascade,

  completed boolean not null default false,

  completed_at timestamptz,

  last_viewed_at timestamptz not null default now(),

  -- Useful for optional video resume.
  last_video_position_seconds integer
    check (
      last_video_position_seconds is null
      or last_video_position_seconds >= 0
    ),

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  unique(user_id, lesson_id)
);


create index if not exists lesson_progress_user_idx
on public.lesson_progress(user_id);

create index if not exists lesson_progress_course_idx
on public.lesson_progress(user_id, course_id);

create index if not exists lesson_progress_recent_idx
on public.lesson_progress(user_id, last_viewed_at desc);


drop trigger if exists lesson_progress_set_updated_at
on public.lesson_progress;

create trigger lesson_progress_set_updated_at
before update on public.lesson_progress
for each row
execute function public.set_updated_at();



-- =========================================================
-- 18. SAVED COURSES
-- =========================================================

create table if not exists public.saved_courses (
  user_id uuid not null
    references public.profiles(id)
    on delete cascade,

  course_id uuid not null
    references public.courses(id)
    on delete cascade,

  created_at timestamptz not null default now(),

  primary key(user_id, course_id)
);


create index if not exists saved_courses_user_idx
on public.saved_courses(user_id, created_at desc);



-- =========================================================
-- 19. RECENTLY VIEWED
-- =========================================================

create table if not exists public.recent_views (
  id uuid primary key default gen_random_uuid(),

  user_id uuid not null
    references public.profiles(id)
    on delete cascade,

  course_id uuid not null
    references public.courses(id)
    on delete cascade,

  lesson_id uuid
    references public.lessons(id)
    on delete set null,

  viewed_at timestamptz not null default now()
);


create index if not exists recent_views_user_idx
on public.recent_views(user_id, viewed_at desc);

create index if not exists recent_views_course_idx
on public.recent_views(course_id);



-- =========================================================
-- 20. PRIVATE LESSON NOTES
-- =========================================================

create table if not exists public.lesson_notes (
  id uuid primary key default gen_random_uuid(),

  user_id uuid not null
    references public.profiles(id)
    on delete cascade,

  lesson_id uuid not null
    references public.lessons(id)
    on delete cascade,

  content text not null default '',

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  unique(user_id, lesson_id)
);


create index if not exists lesson_notes_user_idx
on public.lesson_notes(user_id);


drop trigger if exists lesson_notes_set_updated_at
on public.lesson_notes;

create trigger lesson_notes_set_updated_at
before update on public.lesson_notes
for each row
execute function public.set_updated_at();



-- =========================================================
-- 21. ENABLE ROW LEVEL SECURITY
-- =========================================================

alter table public.profiles enable row level security;
alter table public.instructor_profiles enable row level security;
alter table public.categories enable row level security;
alter table public.courses enable row level security;
alter table public.course_modules enable row level security;
alter table public.lessons enable row level security;
alter table public.course_learning_outcomes enable row level security;
alter table public.course_prerequisites enable row level security;
alter table public.skills enable row level security;
alter table public.course_skills enable row level security;
alter table public.lesson_objectives enable row level security;
alter table public.lesson_resources enable row level security;
alter table public.learner_preferences enable row level security;
alter table public.learner_interests enable row level security;
alter table public.course_enrollments enable row level security;
alter table public.lesson_progress enable row level security;
alter table public.saved_courses enable row level security;
alter table public.recent_views enable row level security;
alter table public.lesson_notes enable row level security;



-- =========================================================
-- 22. PROFILE RLS
-- =========================================================

drop policy if exists "Users can read own profile"
on public.profiles;

create policy "Users can read own profile"
on public.profiles
for select
to authenticated
using (
  auth.uid() = id
);


drop policy if exists "Users can update own profile"
on public.profiles;

create policy "Users can update own profile"
on public.profiles
for update
to authenticated
using (
  auth.uid() = id
)
with check (
  auth.uid() = id
);



-- =========================================================
-- 23. PUBLIC INSTRUCTOR RLS
-- =========================================================

drop policy if exists "Public can read published instructors"
on public.instructor_profiles;

create policy "Public can read published instructors"
on public.instructor_profiles
for select
to anon, authenticated
using (
  is_published = true
);



-- =========================================================
-- 24. CATEGORY RLS
-- =========================================================

drop policy if exists "Public can read active categories"
on public.categories;

create policy "Public can read active categories"
on public.categories
for select
to anon, authenticated
using (
  is_active = true
);



-- =========================================================
-- 25. COURSE RLS
-- =========================================================

drop policy if exists "Public can read published free courses"
on public.courses;

create policy "Public can read published free courses"
on public.courses
for select
to anon, authenticated
using (
  is_published = true
  and is_free = true
);



-- =========================================================
-- 26. MODULE RLS
-- =========================================================

drop policy if exists "Public can read published modules"
on public.course_modules;

create policy "Public can read published modules"
on public.course_modules
for select
to anon, authenticated
using (
  is_published = true
  and exists (
    select 1
    from public.courses c
    where c.id = course_modules.course_id
      and c.is_published = true
      and c.is_free = true
  )
);



-- =========================================================
-- 27. LESSON RLS
-- =========================================================

drop policy if exists "Public can read published lessons"
on public.lessons;

create policy "Public can read published lessons"
on public.lessons
for select
to anon, authenticated
using (
  is_published = true
  and exists (
    select 1
    from public.course_modules m
    join public.courses c
      on c.id = m.course_id
    where m.id = lessons.module_id
      and m.is_published = true
      and c.is_published = true
      and c.is_free = true
  )
);



-- =========================================================
-- 28. COURSE OUTCOME RLS
-- =========================================================

drop policy if exists "Public can read course outcomes"
on public.course_learning_outcomes;

create policy "Public can read course outcomes"
on public.course_learning_outcomes
for select
to anon, authenticated
using (
  exists (
    select 1
    from public.courses c
    where c.id = course_learning_outcomes.course_id
      and c.is_published = true
      and c.is_free = true
  )
);



-- =========================================================
-- 29. PREREQUISITE RLS
-- =========================================================

drop policy if exists "Public can read course prerequisites"
on public.course_prerequisites;

create policy "Public can read course prerequisites"
on public.course_prerequisites
for select
to anon, authenticated
using (
  exists (
    select 1
    from public.courses c
    where c.id = course_prerequisites.course_id
      and c.is_published = true
      and c.is_free = true
  )
);



-- =========================================================
-- 30. SKILLS RLS
-- =========================================================

drop policy if exists "Public can read active skills"
on public.skills;

create policy "Public can read active skills"
on public.skills
for select
to anon, authenticated
using (
  is_active = true
);


drop policy if exists "Public can read published course skills"
on public.course_skills;

create policy "Public can read published course skills"
on public.course_skills
for select
to anon, authenticated
using (
  exists (
    select 1
    from public.courses c
    where c.id = course_skills.course_id
      and c.is_published = true
      and c.is_free = true
  )
);



-- =========================================================
-- 31. LESSON OBJECTIVE RLS
-- =========================================================

drop policy if exists "Public can read lesson objectives"
on public.lesson_objectives;

create policy "Public can read lesson objectives"
on public.lesson_objectives
for select
to anon, authenticated
using (
  exists (
    select 1
    from public.lessons l
    join public.course_modules m
      on m.id = l.module_id
    join public.courses c
      on c.id = m.course_id
    where l.id = lesson_objectives.lesson_id
      and l.is_published = true
      and m.is_published = true
      and c.is_published = true
      and c.is_free = true
  )
);



-- =========================================================
-- 32. LESSON RESOURCE RLS
-- =========================================================

drop policy if exists "Public can read lesson resources"
on public.lesson_resources;

create policy "Public can read lesson resources"
on public.lesson_resources
for select
to anon, authenticated
using (
  exists (
    select 1
    from public.lessons l
    join public.course_modules m
      on m.id = l.module_id
    join public.courses c
      on c.id = m.course_id
    where l.id = lesson_resources.lesson_id
      and l.is_published = true
      and m.is_published = true
      and c.is_published = true
      and c.is_free = true
  )
);



-- =========================================================
-- 33. LEARNER PREFERENCES RLS
-- =========================================================

drop policy if exists "Users can read own preferences"
on public.learner_preferences;

create policy "Users can read own preferences"
on public.learner_preferences
for select
to authenticated
using (
  auth.uid() = user_id
);


drop policy if exists "Users can create own preferences"
on public.learner_preferences;

create policy "Users can create own preferences"
on public.learner_preferences
for insert
to authenticated
with check (
  auth.uid() = user_id
);


drop policy if exists "Users can update own preferences"
on public.learner_preferences;

create policy "Users can update own preferences"
on public.learner_preferences
for update
to authenticated
using (
  auth.uid() = user_id
)
with check (
  auth.uid() = user_id
);



-- =========================================================
-- 34. LEARNER INTEREST RLS
-- =========================================================

drop policy if exists "Users can read own interests"
on public.learner_interests;

create policy "Users can read own interests"
on public.learner_interests
for select
to authenticated
using (
  auth.uid() = user_id
);


drop policy if exists "Users can create own interests"
on public.learner_interests;

create policy "Users can create own interests"
on public.learner_interests
for insert
to authenticated
with check (
  auth.uid() = user_id
);


drop policy if exists "Users can delete own interests"
on public.learner_interests;

create policy "Users can delete own interests"
on public.learner_interests
for delete
to authenticated
using (
  auth.uid() = user_id
);



-- =========================================================
-- 35. ENROLLMENT RLS
-- =========================================================

drop policy if exists "Users can read own enrollments"
on public.course_enrollments;

create policy "Users can read own enrollments"
on public.course_enrollments
for select
to authenticated
using (
  auth.uid() = user_id
);


drop policy if exists "Users can enroll themselves"
on public.course_enrollments;

create policy "Users can enroll themselves"
on public.course_enrollments
for insert
to authenticated
with check (
  auth.uid() = user_id
  and exists (
    select 1
    from public.courses c
    where c.id = course_enrollments.course_id
      and c.is_published = true
      and c.is_free = true
  )
);


drop policy if exists "Users can update own enrollments"
on public.course_enrollments;

create policy "Users can update own enrollments"
on public.course_enrollments
for update
to authenticated
using (
  auth.uid() = user_id
)
with check (
  auth.uid() = user_id
);


drop policy if exists "Users can delete own enrollments"
on public.course_enrollments;

create policy "Users can delete own enrollments"
on public.course_enrollments
for delete
to authenticated
using (
  auth.uid() = user_id
);



-- =========================================================
-- 36. LESSON PROGRESS RLS
-- =========================================================

drop policy if exists "Users can read own lesson progress"
on public.lesson_progress;

create policy "Users can read own lesson progress"
on public.lesson_progress
for select
to authenticated
using (
  auth.uid() = user_id
);


drop policy if exists "Users can create own lesson progress"
on public.lesson_progress;

create policy "Users can create own lesson progress"
on public.lesson_progress
for insert
to authenticated
with check (
  auth.uid() = user_id

  and exists (
    select 1
    from public.course_enrollments e
    where e.user_id = auth.uid()
      and e.course_id = lesson_progress.course_id
      and e.status in ('active', 'completed')
  )

  and exists (
    select 1
    from public.lessons l
    join public.course_modules m
      on m.id = l.module_id
    where l.id = lesson_progress.lesson_id
      and m.course_id = lesson_progress.course_id
      and l.is_published = true
  )
);


drop policy if exists "Users can update own lesson progress"
on public.lesson_progress;

create policy "Users can update own lesson progress"
on public.lesson_progress
for update
to authenticated
using (
  auth.uid() = user_id
)
with check (
  auth.uid() = user_id
);



-- =========================================================
-- 37. SAVED COURSE RLS
-- =========================================================

drop policy if exists "Users can read own saved courses"
on public.saved_courses;

create policy "Users can read own saved courses"
on public.saved_courses
for select
to authenticated
using (
  auth.uid() = user_id
);


drop policy if exists "Users can save published courses"
on public.saved_courses;

create policy "Users can save published courses"
on public.saved_courses
for insert
to authenticated
with check (
  auth.uid() = user_id
  and exists (
    select 1
    from public.courses c
    where c.id = saved_courses.course_id
      and c.is_published = true
      and c.is_free = true
  )
);


drop policy if exists "Users can remove own saved courses"
on public.saved_courses;

create policy "Users can remove own saved courses"
on public.saved_courses
for delete
to authenticated
using (
  auth.uid() = user_id
);



-- =========================================================
-- 38. RECENT VIEW RLS
-- =========================================================

drop policy if exists "Users can read own recent views"
on public.recent_views;

create policy "Users can read own recent views"
on public.recent_views
for select
to authenticated
using (
  auth.uid() = user_id
);


drop policy if exists "Users can create own recent views"
on public.recent_views;

create policy "Users can create own recent views"
on public.recent_views
for insert
to authenticated
with check (
  auth.uid() = user_id
);


drop policy if exists "Users can delete own recent views"
on public.recent_views;

create policy "Users can delete own recent views"
on public.recent_views
for delete
to authenticated
using (
  auth.uid() = user_id
);



-- =========================================================
-- 39. LESSON NOTES RLS
-- =========================================================

drop policy if exists "Users can read own lesson notes"
on public.lesson_notes;

create policy "Users can read own lesson notes"
on public.lesson_notes
for select
to authenticated
using (
  auth.uid() = user_id
);


drop policy if exists "Users can create own lesson notes"
on public.lesson_notes;

create policy "Users can create own lesson notes"
on public.lesson_notes
for insert
to authenticated
with check (
  auth.uid() = user_id
);


drop policy if exists "Users can update own lesson notes"
on public.lesson_notes;

create policy "Users can update own lesson notes"
on public.lesson_notes
for update
to authenticated
using (
  auth.uid() = user_id
)
with check (
  auth.uid() = user_id
);


drop policy if exists "Users can delete own lesson notes"
on public.lesson_notes;

create policy "Users can delete own lesson notes"
on public.lesson_notes
for delete
to authenticated
using (
  auth.uid() = user_id
);



-- =========================================================
-- DONE
-- =========================================================

