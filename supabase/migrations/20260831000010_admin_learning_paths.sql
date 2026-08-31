-- =========================================================
-- MERITLOOM LEARNING PATHS SCHEMA REFINEMENT & RLS POLICIES
-- Ensures learning_paths & learning_path_items support all admin operations.
-- =========================================================

-- Ensure estimated_minutes column exists on learning_path_items
alter table public.learning_path_items
  add column if not exists estimated_minutes integer;

-- Ensure indexes for fast path queries
create index if not exists learning_paths_slug_idx on public.learning_paths(slug);
create index if not exists learning_paths_position_idx on public.learning_paths(position);
create index if not exists learning_path_items_path_pos_idx on public.learning_path_items(learning_path_id, position);

-- Enable RLS
alter table public.learning_paths enable row level security;
alter table public.learning_path_items enable row level security;

-- Admin policies
drop policy if exists "Admins can manage learning paths" on public.learning_paths;
create policy "Admins can manage learning paths"
  on public.learning_paths
  for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "Admins can manage learning path items" on public.learning_path_items;
create policy "Admins can manage learning path items"
  on public.learning_path_items
  for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- Public read policies for published paths
drop policy if exists "Public can read published learning paths" on public.learning_paths;
create policy "Public can read published learning paths"
  on public.learning_paths
  for select
  to anon, authenticated
  using (is_published = true or public.is_admin());

drop policy if exists "Public can read published path items" on public.learning_path_items;
create policy "Public can read published path items"
  on public.learning_path_items
  for select
  to anon, authenticated
  using (
    exists (
      select 1 from public.learning_paths lp
      where lp.id = learning_path_items.learning_path_id
        and (lp.is_published = true or public.is_admin())
    )
  );
