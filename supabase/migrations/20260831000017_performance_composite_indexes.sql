-- Migration 20260831000017: Composite Performance Indexes for High-Traffic Queries
-- Optimizes Dashboard, My Learning, Progress, and Lesson Player lookups.

-- 1. Composite index for lesson progress queries filtering by user + course + completed state
create index if not exists lesson_progress_user_course_completed_idx
  on public.lesson_progress (user_id, course_id, completed);

-- 2. Composite index for active/completed enrollment queries sorted by last accessed date
create index if not exists course_enrollments_user_status_accessed_idx
  on public.course_enrollments (user_id, status, last_accessed_at desc);

-- 3. Composite index for saved courses sorted by save date
create index if not exists saved_courses_user_created_idx
  on public.saved_courses (user_id, created_at desc);

-- 4. Composite index for fast note lookups per lesson
create index if not exists lesson_notes_user_lesson_idx
  on public.lesson_notes (user_id, lesson_id);

-- 5. Composite index for fast bookmark lookups per lesson
create index if not exists lesson_bookmarks_user_lesson_idx
  on public.lesson_bookmarks (user_id, lesson_id);
