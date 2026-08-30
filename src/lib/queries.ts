import { createSupabaseServerClient } from "@/lib/supabase/server";
import type {
  ActiveEnrollment,
  Category,
  CourseSummary,
  LearningPathSummary,
} from "@/lib/types";

/**
 * Server-side Supabase queries for the landing page.
 *
 * Every helper is resilient: when Supabase is unconfigured or a query fails,
 * it returns an empty result rather than throwing, so the page renders polished
 * empty states instead of crashing. Only published + free rows are ever read
 * here; RLS on the database enforces the same rules as a second line of
 * defence.
 */

type Client = NonNullable<
  Awaited<ReturnType<typeof createSupabaseServerClient>>
>;

async function getClient(): Promise<Client | null> {
  // createSupabaseServerClient() returns `null` when Supabase is unconfigured
  // and never throws for that case, so no try/catch is needed here.
  return await createSupabaseServerClient();
}

function difficulty(value: unknown): CourseSummary["difficulty"] {
  if (value === "intermediate" || value === "advanced") return value;
  return "beginner";
}

function toNumber(value: unknown, fallback = 0): number {
  const n = typeof value === "number" ? value : Number(value);
  return Number.isFinite(n) ? n : fallback;
}

export async function getFeaturedCourses(limit = 6): Promise<CourseSummary[]> {
  const supabase = await getClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("courses")
    .select(
      "id, slug, title, short_description, difficulty, estimated_minutes, lesson_count, thumbnail_url, is_free, category:categories(name)",
    )
    .eq("is_published", true)
    .eq("is_featured", true)
    .eq("is_free", true)
    .order("sort_order", { ascending: true })
    .limit(limit);

  if (error || !data) return [];

  return data.map((row) => {
    const category = Array.isArray(row.category)
      ? row.category[0]
      : row.category;
    return {
      id: row.id as string,
      slug: row.slug as string,
      title: row.title as string,
      shortDescription: (row.short_description as string) ?? "",
      difficulty: difficulty(row.difficulty),
      estimatedMinutes: toNumber(row.estimated_minutes),
      lessonCount: toNumber(row.lesson_count),
      categoryName:
        category && typeof category.name === "string" ? category.name : null,
      thumbnailUrl: (row.thumbnail_url as string) ?? null,
      isFree: row.is_free !== false,
    } satisfies CourseSummary;
  });
}

export async function getCategories(): Promise<Category[]> {
  const supabase = await getClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("categories")
    .select("id, slug, name, courses(count)")
    .order("sort_order", { ascending: true });

  if (error || !data) return [];

  return data.map((row) => {
    let count = 0;
    const nested = row.courses;
    if (Array.isArray(nested)) {
      const first = nested[0] as { count?: number } | undefined;
      count = toNumber(first?.count);
    } else if (nested && typeof nested === "object" && "count" in nested) {
      count = toNumber((nested as { count?: number }).count);
    } else if (typeof nested === "number") {
      count = nested;
    }

    return {
      id: row.id as string,
      slug: row.slug as string,
      name: row.name as string,
      courseCount: count,
    } satisfies Category;
  });
}

export async function getFeaturedLearningPaths(
  limit = 3,
): Promise<LearningPathSummary[]> {
  const supabase = await getClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("learning_paths")
    .select(
      "id, slug, title, outcome, difficulty, estimated_minutes, course_count, path_courses:learning_path_courses(course:courses(title), sort_order)",
    )
    .eq("is_published", true)
    .eq("is_featured", true)
    .order("sort_order", { ascending: true })
    .limit(limit);

  if (error || !data) return [];

  return data.map((row) => {
    const links = Array.isArray(row.path_courses) ? row.path_courses : [];
    // PostgREST's inferred row type models an embedded FK as an array; if a
    // future schema change makes it a single object, handle both shapes.
    type LinkCourse = { title?: string } | { title?: string }[] | null;
    type LinkRow = { course?: LinkCourse };
    const roadmapPreview = links
      .slice(0, 4)
      .map((l: LinkRow) => {
        const course = Array.isArray(l.course) ? l.course[0] : l.course;
        return course?.title;
      })
      .filter((t: string | undefined): t is string => Boolean(t));

    return {
      id: row.id as string,
      slug: row.slug as string,
      title: row.title as string,
      outcome: (row.outcome as string) ?? "",
      difficulty: difficulty(row.difficulty),
      estimatedMinutes: toNumber(row.estimated_minutes),
      courseCount: toNumber(row.course_count) || links.length,
      roadmapPreview: roadmapPreview.length
        ? roadmapPreview
        : links.slice(0, 4).map(() => "Course"),
    } satisfies LearningPathSummary;
  });
}

/**
 * The learner's most recently active enrollment, used to render the
 * "Continue learning" card for signed-in users. Returns `null` for guests or
 * learners without enrollments.
 */
export async function getActiveEnrollment(
  userId: string,
): Promise<ActiveEnrollment | null> {
  const supabase = await getClient();
  if (!supabase) return null;

  try {
    const { data, error } = await supabase
      .from("enrollments")
      .select(
        "progress_percent, current_module_title, last_lesson_title, course:courses(title, slug)",
      )
      .eq("user_id", userId)
      .eq("status", "active")
      .order("last_accessed_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error || !data) return null;

    const course = Array.isArray(data.course) ? data.course[0] : data.course;
    if (!course?.title || !course?.slug) return null;

    return {
      courseSlug: course.slug as string,
      courseTitle: course.title as string,
      currentModuleTitle: (data.current_module_title as string) ?? null,
      progressPercent: Math.min(
        100,
        Math.max(0, toNumber(data.progress_percent)),
      ),
      lastLessonTitle: (data.last_lesson_title as string) ?? null,
    } satisfies ActiveEnrollment;
  } catch {
    return null;
  }
}

