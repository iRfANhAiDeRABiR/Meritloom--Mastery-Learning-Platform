# Meritloom Course Seeding Guidelines & Database Schema Reference

Use this reference whenever adding a new course (e.g., JavaScript Fundamentals, Python, React, etc.) to ensure zero schema mismatch errors, seamless foreign key compatibility, and smooth execution in Supabase.

---

## 1. Schema & Conflict Specifications

| Table | Columns Allowed | Conflict Target (`ON CONFLICT`) | Notes |
| :--- | :--- | :--- | :--- |
| **`categories`** | `slug, name, description, icon_name, position, is_active` | `(slug)` | Upsert with `is_active = true`. |
| **`courses`** | `slug, title, summary, description, category_id, difficulty, language, estimated_minutes, is_free, is_published, published_at` | `(slug)` | Always set `is_free = true, is_published = true`. |
| **`course_learning_outcomes`** | `course_id, outcome, position` | *N/A* (Delete then insert) | Always `delete from course_learning_outcomes where course_id = v_course_id` first. |
| **`course_prerequisites`** | `course_id, prerequisite, position` | *N/A* (Delete then insert) | Always `delete from course_prerequisites where course_id = v_course_id` first. |
| **`skills`** | `name, slug, is_active` | `(slug)` | **Never use `category` column**. For shared skills like `Web Development`, always use existing slug `web-development`. |
| **`course_skills`** | `course_id, skill_id` | `(course_id, skill_id)` or `on conflict do nothing` | Always delete existing links first or use `on conflict do nothing`. |
| **`course_modules`** | `course_id, slug, title, description, position, estimated_minutes, is_published` | `(course_id, slug)` | Composite unique constraint on `(course_id, slug)`. |
| **`lessons`** | `module_id, slug, title, summary, key_takeaway, lesson_type, video_provider, video_url, youtube_video_id, source_channel, source_url, playlist_id, position, estimated_minutes, is_preview, is_published, is_bonus` | `(slug)` | **`slug` is globally unique on `lessons`. NEVER use `(module_id, slug)`. Do NOT use `source_title`. Valid `lesson_type` values: `'video'`, `'article'`, `'exercise'`, `'practice'`, `'knowledge_check'` (use `'knowledge_check'` for quizzes, never `'quiz'`). Note: `content` column is type `jsonb`, do NOT insert raw markdown text into `content` (omit column or use JSON).** |
| **`lesson_objectives`** | `lesson_id, objective, position` | *N/A* (Delete then insert) | Always `delete from lesson_objectives where lesson_id = v_lesson_id` first. |
| **`practice_quizzes`** | `lesson_id, title, description, estimated_minutes, is_published` | *N/A* (Delete then insert) | `delete from practice_quizzes where lesson_id = v_lesson_id`. No `passing_score` or `is_active` column. |
| **`practice_questions`** | `quiz_id, question_type, question_text, explanation, position` | *N/A* (Delete cascade) | `question_type` must be `'single_choice'`, `'multiple_choice'`, or `'true_false'`. |
| **`practice_question_options`** | `question_id, option_text, position` | *N/A* (Delete cascade) | Options table. No `is_correct` column directly here. |
| **`practice_question_correct_options`** | `question_id, option_id` | `(question_id, option_id)` | Junction table mapping correct answers. |

---

## 2. Standard Course Seed SQL Template

```sql
do $$
declare
  v_category_id uuid;
  v_course_id uuid;
  v_mod1_id uuid;
  v_lesson_id uuid;
  v_skill_id uuid;
begin

  -- 1. CATEGORY
  insert into public.categories (slug, name, description, icon_name, position, is_active)
  values ('web-development', 'Web Development', '...', 'Layers', 1, true)
  on conflict (slug) do update set name = excluded.name, is_active = true
  returning id into v_category_id;

  -- 2. COURSE
  insert into public.courses (
    slug, title, summary, description, category_id,
    difficulty, language, estimated_minutes, is_free, is_published, published_at
  ) values (
    'course-slug', 'Course Title', 'Summary text', 'Description text',
    v_category_id, 'beginner', 'English', 90, true, true, now()
  )
  on conflict (slug) do update set
    title = excluded.title, summary = excluded.summary,
    description = excluded.description, is_free = true, is_published = true,
    updated_at = now()
  returning id into v_course_id;

  -- 3. LEARNING OUTCOMES
  delete from public.course_learning_outcomes where course_id = v_course_id;
  insert into public.course_learning_outcomes (course_id, outcome, position) values
    (v_course_id, 'Outcome 1', 1),
    (v_course_id, 'Outcome 2', 2);

  -- 4. PREREQUISITES
  delete from public.course_prerequisites where course_id = v_course_id;
  insert into public.course_prerequisites (course_id, prerequisite, position) values
    (v_course_id, 'Prerequisite 1', 1);

  -- 5. SKILLS & COURSE_SKILLS
  insert into public.skills (name, slug, is_active) values ('Skill Name', 'skill-slug', true)
  on conflict (slug) do update set is_active = true
  returning id into v_skill_id;

  delete from public.course_skills where course_id = v_course_id;
  insert into public.course_skills (course_id, skill_id) values (v_course_id, v_skill_id)
  on conflict do nothing;

  -- 6. MODULES
  insert into public.course_modules (
    course_id, slug, title, description, position, estimated_minutes, is_published
  ) values (
    v_course_id, 'module-slug', 'Module Title', 'Description', 1, 30, true
  )
  on conflict (course_id, slug) do update set
    title = excluded.title, description = excluded.description, is_published = true
  returning id into v_mod1_id;

  -- 7. LESSONS (VIDEO)
  insert into public.lessons (
    module_id, slug, title, summary, key_takeaway, lesson_type,
    video_provider, video_url, youtube_video_id, source_channel,
    source_url, playlist_id, position, estimated_minutes, is_preview, is_published, is_bonus
  ) values (
    v_mod1_id,
    'lesson-slug',
    'Lesson Title',
    'Summary text...',
    'Key takeaway...',
    'video',
    'youtube',
    'https://www.youtube.com/watch?v=VIDEO_ID',
    'VIDEO_ID',
    'W3Schools.com',
    'https://www.youtube.com/watch?v=VIDEO_ID',
    'PLAYLIST_ID',
    1, 5, true, true, false
  )
  on conflict (slug) do update set
    title = excluded.title, summary = excluded.summary, key_takeaway = excluded.key_takeaway,
    youtube_video_id = excluded.youtube_video_id, is_published = true
  returning id into v_lesson_id;

  delete from public.lesson_objectives where lesson_id = v_lesson_id;
  insert into public.lesson_objectives (lesson_id, objective, position) values
    (v_lesson_id, 'Objective 1', 1);

  -- 8. LESSONS (PRACTICE / QUIZ)
  insert into public.lessons (
    module_id, slug, title, summary, key_takeaway, lesson_type,
    position, estimated_minutes, is_preview, is_published, is_bonus
  ) values (
    v_mod1_id,
    'practice-slug',
    'Practice Exercise Title',
    'Summary text...',
    'Key takeaway...',
    'practice',
    2, 10, false, true, false
  )
  on conflict (slug) do update set
    title = excluded.title, summary = excluded.summary, key_takeaway = excluded.key_takeaway,
    is_published = true
  returning id into v_lesson_id;

  delete from public.lesson_objectives where lesson_id = v_lesson_id;
  insert into public.lesson_objectives (lesson_id, objective, position) values
    (v_lesson_id, 'Practice Objective 1', 1);

end $$;

-- 9. VERIFICATION QUERY (Always include at the end of the file)
select 
  c.slug as course_slug,
  c.title as course_title,
  count(distinct m.id) as total_modules,
  count(distinct l.id) as total_lessons,
  'Seeded Successfully' as status
from public.courses c
left join public.course_modules m on m.course_id = c.id
left join public.lessons l on l.module_id = m.id
where c.slug = 'course-slug'
group by c.id, c.slug, c.title;
```

---

## 3. Checklist for Adding Next Courses

1. [ ] **Static Catalog Registration**: Add course metadata to `ALL_STATIC_COURSES`, `ALL_STATIC_SUMMARIES`, and `ALL_LESSON_DETAILS_MAP` in `src/lib/static-catalog-data.ts`.
2. [ ] **Cover Artwork**: Add cover artwork block in `src/components/courses/course-cover.tsx`.
3. [ ] **Sequence Track**: Update sequential prerequisites in `CourseMetaSections` and `CourseOverviewCard`.
4. [ ] **SQL Script Compliance**:
   - Ensure `public.skills` uses `is_active = true` (not `category`).
   - Use `on conflict (slug)` for `lessons` (not `module_id, slug`).
   - Do NOT add `source_title` column to `lessons`.
   - Add verification query at the bottom.
