-- =========================================================================
-- Meritloom Migration: Learning Paths & Learning Path Items
-- Supports guided vertical roadmap paths referencing existing courses
-- =========================================================================

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

create index if not exists learning_paths_slug_idx on public.learning_paths(slug);
create index if not exists learning_paths_published_idx on public.learning_paths(is_published, position);

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

create index if not exists learning_path_items_path_idx on public.learning_path_items(learning_path_id, position);

-- Enable RLS
alter table public.learning_paths enable row level security;
alter table public.learning_path_items enable row level security;

-- Public read policies
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

-- =========================================================================
-- Seed: Web Development Foundations Learning Path
-- =========================================================================
do $$
declare
  v_path_id uuid;
  v_html_id uuid;
  v_css_id uuid;
  v_js_id uuid;
begin

  -- Get course IDs
  select id into v_html_id from public.courses where slug = 'html-fundamentals';
  select id into v_css_id from public.courses where slug = 'css-fundamentals';
  select id into v_js_id from public.courses where slug = 'javascript-fundamentals';

  -- Upsert Learning Path
  insert into public.learning_paths (
    slug,
    title,
    subtitle,
    summary,
    description,
    difficulty,
    estimated_minutes,
    course_count,
    is_published,
    is_featured,
    position
  ) values (
    'web-development-foundations',
    'Web Development Foundations',
    'Build the core skills you need to create modern interactive websites.',
    'Master the foundations of frontend development through a clear sequence of free courses and hands-on practice.',
    'Follow a guided sequence through HTML, CSS, and JavaScript. Learn each foundation in order, practice what you learn, and move through the path at your own pace.',
    'beginner',
    305,
    3,
    true,
    true,
    1
  )
  on conflict (slug) do update set
    title = excluded.title,
    subtitle = excluded.subtitle,
    summary = excluded.summary,
    description = excluded.description,
    difficulty = excluded.difficulty,
    estimated_minutes = excluded.estimated_minutes,
    course_count = excluded.course_count,
    is_published = true,
    is_featured = true,
    updated_at = now()
  returning id into v_path_id;

  -- Clear existing items
  delete from public.learning_path_items where learning_path_id = v_path_id;

  -- 1. HTML Fundamentals
  if v_html_id is not null then
    insert into public.learning_path_items (
      learning_path_id, course_id, item_type, title, description, step_label, position, is_required
    ) values (
      v_path_id,
      v_html_id,
      'course',
      'HTML Fundamentals',
      'Learn how websites are structured using headings, text, links, images, forms, tables, and semantic HTML.',
      'STEP 1',
      1,
      true
    );
  end if;

  -- 2. CSS Fundamentals
  if v_css_id is not null then
    insert into public.learning_path_items (
      learning_path_id, course_id, item_type, title, description, step_label, position, is_required
    ) values (
      v_path_id,
      v_css_id,
      'course',
      'CSS Fundamentals',
      'Transform plain HTML into polished layouts using colors, selectors, backgrounds, spacing, and visual styling.',
      'STEP 2',
      2,
      true
    );
  end if;

  -- 3. JavaScript Fundamentals
  if v_js_id is not null then
    insert into public.learning_path_items (
      learning_path_id, course_id, item_type, title, description, step_label, position, is_required
    ) values (
      v_path_id,
      v_js_id,
      'course',
      'JavaScript Fundamentals',
      'Add behavior and interaction to your webpages using variables, functions, conditions, arrays, objects, loops, and browser events.',
      'STEP 3',
      3,
      true
    );
  end if;

  -- 4. Final Practice Project
  insert into public.learning_path_items (
    learning_path_id, course_id, item_type, title, description, step_label, position, is_required
  ) values (
    v_path_id,
    null,
    'project',
    'Build an Interactive Personal Website',
    'Combine HTML structure, CSS styling, and JavaScript behavior into one complete frontend project.',
    'FINAL PROJECT',
    4,
    false
  );

end $$;
