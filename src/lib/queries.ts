import { createSupabaseServerClient } from "@/lib/supabase/server";
import type {
  ActiveEnrollment,
  CatalogQueryResult,
  CatalogSearchParams,
  Category,
  CourseDetail,
  CourseDifficulty,
  CourseEnrollmentStatus,
  CourseInstructor,
  CourseLesson,
  CourseModule,
  CourseSummary,
  LearningPathSummary,
  LessonType,
} from "@/lib/types";

/**
 * Server-side Supabase queries for Meritloom.
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
  return await createSupabaseServerClient();
}

function difficulty(value: unknown): CourseDifficulty {
  if (value === "intermediate" || value === "advanced") return value;
  return "beginner";
}

function lessonType(value: unknown): LessonType {
  if (
    value === "article" ||
    value === "exercise" ||
    value === "practice" ||
    value === "quiz" ||
    value === "knowledge_check"
  ) {
    return value;
  }
  return "video";
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
      "id, slug, title, short_description, difficulty, estimated_minutes, lesson_count, thumbnail_url, is_free, category:categories(name, slug)",
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
      categorySlug:
        category && typeof category.slug === "string" ? category.slug : null,
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

export async function getCatalogCategories(): Promise<Category[]> {
  const categories = await getCategories();
  const filtered = categories.filter((c) => c.courseCount > 0);
  if (filtered.length > 0) return filtered;
  return categories;
}

export async function getCatalogCourses(
  params: CatalogSearchParams,
  pageSize = 9,
): Promise<CatalogQueryResult> {
  const page = Math.max(1, parseInt(params.page ?? "1", 10) || 1);
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const supabase = await getClient();
  if (!supabase) {
    return {
      courses: [],
      totalCount: 0,
      page,
      totalPages: 1,
      pageSize,
    };
  }

  try {
    let query = supabase
      .from("courses")
      .select(
        "id, slug, title, short_description, difficulty, estimated_minutes, lesson_count, thumbnail_url, is_free, category:categories(name, slug)",
        { count: "exact" },
      )
      .eq("is_published", true)
      .eq("is_free", true);

    const rawSearch = (params.q ?? "").trim().slice(0, 100);
    if (rawSearch.length > 0) {
      const cleanSearch = rawSearch.replace(/[%_]/g, "");
      query = query.or(
        `title.ilike.%${cleanSearch}%,short_description.ilike.%${cleanSearch}%`,
      );
    }

    const categorySlug = (params.category ?? "").trim().toLowerCase();
    if (categorySlug && categorySlug !== "all") {
      const { data: catData } = await supabase
        .from("categories")
        .select("id")
        .eq("slug", categorySlug)
        .maybeSingle();

      if (catData?.id) {
        query = query.eq("category_id", catData.id);
      }
    }

    const level = (params.level ?? "").trim().toLowerCase();
    if (level === "beginner" || level === "intermediate" || level === "advanced") {
      query = query.eq("difficulty", level);
    }

    const sort = (params.sort ?? "newest").trim().toLowerCase();
    if (sort === "title") {
      query = query.order("title", { ascending: true });
    } else if (sort === "duration") {
      query = query.order("estimated_minutes", { ascending: true });
    } else if (sort === "lessons") {
      query = query.order("lesson_count", { ascending: false });
    } else {
      query = query.order("sort_order", { ascending: true });
    }

    query = query.range(from, to);

    const { data, error, count } = await query;

    if (error || !data) {
      return {
        courses: [],
        totalCount: 0,
        page,
        totalPages: 1,
        pageSize,
        error: error?.message,
      };
    }

    const totalCount = count ?? 0;
    const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

    const courses = data.map((row) => {
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
        categorySlug:
          category && typeof category.slug === "string" ? category.slug : null,
        thumbnailUrl: (row.thumbnail_url as string) ?? null,
        isFree: row.is_free !== false,
      } satisfies CourseSummary;
    });

    return {
      courses,
      totalCount,
      page,
      totalPages,
      pageSize,
    };
  } catch {
    return {
      courses: [],
      totalCount: 0,
      page,
      totalPages: 1,
      pageSize,
    };
  }
}

/**
 * Fetch detailed information for a single published, free course by its slug.
 */
export async function getCourseDetailBySlug(
  slug: string,
): Promise<CourseDetail | null> {
  const supabase = await getClient();
  if (!supabase) return null;

  try {
    const cleanSlug = slug.trim().toLowerCase();
    const { data, error } = await supabase
      .from("courses")
      .select(
        `
        id,
        slug,
        title,
        short_description,
        description,
        difficulty,
        language,
        estimated_minutes,
        lesson_count,
        module_count,
        thumbnail_url,
        is_free,
        is_published,
        category:categories(id, name, slug),
        instructor:instructors(id, name, title, avatar_url, bio),
        modules:course_modules(
          id,
          title,
          description,
          position,
          estimated_minutes,
          lessons:course_lessons(
            id,
            slug,
            title,
            lesson_type,
            position,
            estimated_minutes,
            is_preview,
            is_published
          )
        ),
        outcomes:course_learning_outcomes(id, outcome, sort_order),
        prerequisites:course_prerequisites(id, prerequisite, sort_order),
        skills:course_skills(id, skill_name, sort_order),
        audience:course_audience(id, audience, sort_order)
      `,
      )
      .eq("slug", cleanSlug)
      .eq("is_published", true)
      .eq("is_free", true)
      .maybeSingle();

    if (error || !data) {
      // Try fallback simple select if relations table names differ
      const { data: fallbackData } = await supabase
        .from("courses")
        .select(
          "id, slug, title, short_description, description, difficulty, language, estimated_minutes, lesson_count, thumbnail_url, is_free, is_published, category:categories(id, name, slug)",
        )
        .eq("slug", cleanSlug)
        .eq("is_published", true)
        .eq("is_free", true)
        .maybeSingle();

      if (!fallbackData) return null;

      const category = Array.isArray(fallbackData.category)
        ? fallbackData.category[0]
        : fallbackData.category;

      return {
        id: fallbackData.id as string,
        slug: fallbackData.slug as string,
        title: fallbackData.title as string,
        summary: (fallbackData.short_description as string) ?? "",
        description:
          (fallbackData.description as string) ??
          (fallbackData.short_description as string) ??
          "",
        difficulty: difficulty(fallbackData.difficulty),
        language: (fallbackData.language as string) || "English",
        estimatedMinutes: toNumber(fallbackData.estimated_minutes),
        lessonCount: toNumber(fallbackData.lesson_count),
        moduleCount: 0,
        isFree: fallbackData.is_free !== false,
        isPublished: fallbackData.is_published === true,
        thumbnailUrl: (fallbackData.thumbnail_url as string) ?? null,
        category: category
          ? {
              id: category.id as string,
              name: category.name as string,
              slug: category.slug as string,
            }
          : null,
        instructor: null,
        learningOutcomes: [],
        prerequisites: [],
        skills: [],
        targetAudience: [],
        modules: [],
      };
    }

    const category = Array.isArray(data.category)
      ? data.category[0]
      : data.category;
    const instructor = Array.isArray(data.instructor)
      ? data.instructor[0]
      : data.instructor;

    // Process modules and lessons
    const rawModules = Array.isArray(data.modules) ? data.modules : [];
    const modules: CourseModule[] = rawModules
      .sort((a, b) => (a.position ?? 0) - (b.position ?? 0))
      .map((mod, idx) => {
        const rawLessons = Array.isArray(mod.lessons) ? mod.lessons : [];
        const lessons: CourseLesson[] = rawLessons
          .filter((l) => l.is_published !== false)
          .sort((a, b) => (a.position ?? 0) - (b.position ?? 0))
          .map((les, lIdx) => ({
            id: (les.id as string) ?? `${mod.id}-${lIdx}`,
            slug: (les.slug as string) ?? `lesson-${lIdx + 1}`,
            title: (les.title as string) ?? `Lesson ${lIdx + 1}`,
            lessonType: lessonType(les.lesson_type),
            position: toNumber(les.position, lIdx + 1),
            estimatedMinutes: toNumber(les.estimated_minutes),
            isPreview: Boolean(les.is_preview),
            isPublished: les.is_published !== false,
          }));

        return {
          id: (mod.id as string) ?? `module-${idx}`,
          title: (mod.title as string) ?? `Module ${idx + 1}`,
          description: (mod.description as string) ?? null,
          position: toNumber(mod.position, idx + 1),
          estimatedMinutes:
            toNumber(mod.estimated_minutes) ||
            lessons.reduce((acc, l) => acc + l.estimatedMinutes, 0),
          lessonCount: lessons.length,
          lessons,
        };
      });

    // Total lessons from modules or course field
    const calculatedLessonCount = modules.reduce(
      (acc, m) => acc + m.lessonCount,
      0,
    );
    const finalLessonCount = calculatedLessonCount || toNumber(data.lesson_count);

    // Learning outcomes
    const rawOutcomes = Array.isArray(data.outcomes) ? data.outcomes : [];
    const learningOutcomes = rawOutcomes
      .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
      .map((o) => (typeof o.outcome === "string" ? o.outcome : ""))
      .filter(Boolean);

    // Prerequisites
    const rawPrereqs = Array.isArray(data.prerequisites)
      ? data.prerequisites
      : [];
    const prerequisites = rawPrereqs
      .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
      .map((p) => (typeof p.prerequisite === "string" ? p.prerequisite : ""))
      .filter(Boolean);

    // Skills
    const rawSkills = Array.isArray(data.skills) ? data.skills : [];
    const skills = rawSkills
      .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
      .map((s) => (typeof s.skill_name === "string" ? s.skill_name : ""))
      .filter(Boolean);

    // Audience
    const rawAudience = Array.isArray(data.audience) ? data.audience : [];
    const targetAudience = rawAudience
      .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
      .map((a) => (typeof a.audience === "string" ? a.audience : ""))
      .filter(Boolean);

    return {
      id: data.id as string,
      slug: data.slug as string,
      title: data.title as string,
      summary: (data.short_description as string) ?? "",
      description:
        (data.description as string) ??
        (data.short_description as string) ??
        "",
      difficulty: difficulty(data.difficulty),
      language: (data.language as string) || "English",
      estimatedMinutes: toNumber(data.estimated_minutes),
      lessonCount: finalLessonCount,
      moduleCount: modules.length || toNumber(data.module_count),
      isFree: data.is_free !== false,
      isPublished: data.is_published === true,
      thumbnailUrl: (data.thumbnail_url as string) ?? null,
      category: category
        ? {
            id: category.id as string,
            name: category.name as string,
            slug: category.slug as string,
          }
        : null,
      instructor:
        instructor && instructor.name
          ? ({
              id: instructor.id as string,
              name: instructor.name as string,
              title: (instructor.title as string) ?? null,
              avatarUrl: (instructor.avatar_url as string) ?? null,
              bio: (instructor.bio as string) ?? null,
            } satisfies CourseInstructor)
          : null,
      learningOutcomes,
      prerequisites,
      skills,
      targetAudience,
      modules,
    };
  } catch {
    return null;
  }
}

/**
 * Fetch related free courses, preferably from the same category.
 */
export async function getRelatedCourses(
  currentCourseId: string,
  categorySlug?: string | null,
  limit = 3,
): Promise<CourseSummary[]> {
  const supabase = await getClient();
  if (!supabase) return [];

  try {
    let query = supabase
      .from("courses")
      .select(
        "id, slug, title, short_description, difficulty, estimated_minutes, lesson_count, thumbnail_url, is_free, category:categories(name, slug)",
      )
      .eq("is_published", true)
      .eq("is_free", true)
      .neq("id", currentCourseId);

    if (categorySlug) {
      const { data: catData } = await supabase
        .from("categories")
        .select("id")
        .eq("slug", categorySlug)
        .maybeSingle();

      if (catData?.id) {
        query = query.eq("category_id", catData.id);
      }
    }

    const { data, error } = await query
      .order("sort_order", { ascending: true })
      .limit(limit);

    if (error || !data || data.length === 0) {
      // Fallback: any other published courses
      const { data: fallback } = await supabase
        .from("courses")
        .select(
          "id, slug, title, short_description, difficulty, estimated_minutes, lesson_count, thumbnail_url, is_free, category:categories(name, slug)",
        )
        .eq("is_published", true)
        .eq("is_free", true)
        .neq("id", currentCourseId)
        .limit(limit);

      if (!fallback) return [];

      return fallback.map((row) => {
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
          categorySlug:
            category && typeof category.slug === "string" ? category.slug : null,
          thumbnailUrl: (row.thumbnail_url as string) ?? null,
          isFree: row.is_free !== false,
        };
      });
    }

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
        categorySlug:
          category && typeof category.slug === "string" ? category.slug : null,
        thumbnailUrl: (row.thumbnail_url as string) ?? null,
        isFree: row.is_free !== false,
      };
    });
  } catch {
    return [];
  }
}

/**
 * Check if the user is enrolled in this course.
 */
export async function checkCourseEnrollment(
  userId: string,
  courseId: string,
): Promise<CourseEnrollmentStatus> {
  const supabase = await getClient();
  if (!supabase || !userId || !courseId) {
    return { isEnrolled: false };
  }

  try {
    const { data, error } = await supabase
      .from("enrollments")
      .select("status")
      .eq("user_id", userId)
      .eq("course_id", courseId)
      .maybeSingle();

    if (error || !data) {
      return { isEnrolled: false };
    }

    return {
      isEnrolled: true,
      status: (data.status as "active" | "completed" | "archived") ?? "active",
    };
  } catch {
    return { isEnrolled: false };
  }
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
