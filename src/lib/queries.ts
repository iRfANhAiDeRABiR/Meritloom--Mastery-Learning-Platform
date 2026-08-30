import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  HTML_FUNDAMENTALS_CATEGORY,
  HTML_FUNDAMENTALS_COURSE,
  HTML_FUNDAMENTALS_SUMMARY,
} from "@/lib/data/static-courses";
import type {
  ActiveEnrollment,
  CatalogQueryResult,
  CatalogSearchParams,
  Category,
  CourseDetail,
  CourseDifficulty,
  CourseEnrollmentStatus,
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
  if (!supabase) return [HTML_FUNDAMENTALS_SUMMARY];

  try {
    const { data, error } = await supabase
      .from("courses")
      .select(
        "id, slug, title, summary, short_description, difficulty, estimated_minutes, lesson_count, cover_image_url, thumbnail_url, is_free, category:categories(name, slug)",
      )
      .eq("is_published", true)
      .eq("is_free", true)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error || !data || data.length === 0) return [HTML_FUNDAMENTALS_SUMMARY];

    return data.map((row) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const raw: any = row;
      const category = Array.isArray(raw.category)
        ? raw.category[0]
        : raw.category;
      return {
        id: raw.id as string,
        slug: raw.slug as string,
        title: raw.title as string,
        shortDescription: (raw.summary as string) ?? (raw.short_description as string) ?? "",
        difficulty: difficulty(raw.difficulty),
        estimatedMinutes: toNumber(raw.estimated_minutes),
        lessonCount: toNumber(raw.lesson_count),
        categoryName:
          category && typeof category.name === "string" ? category.name : null,
        categorySlug:
          category && typeof category.slug === "string" ? category.slug : null,
        thumbnailUrl: (raw.cover_image_url as string) ?? (raw.thumbnail_url as string) ?? null,
        isFree: raw.is_free !== false,
      } satisfies CourseSummary;
    });
  } catch {
    return [HTML_FUNDAMENTALS_SUMMARY];
  }
}

export async function getCategories(): Promise<Category[]> {
  const supabase = await getClient();
  if (!supabase) return [HTML_FUNDAMENTALS_CATEGORY];

  try {
    const { data, error } = await supabase
      .from("categories")
      .select("id, slug, name, position")
      .order("position", { ascending: true });

    if (error || !data || data.length === 0) return [HTML_FUNDAMENTALS_CATEGORY];

    const cats = data.map((row) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const r: any = row;
      return {
        id: r.id as string,
        slug: r.slug as string,
        name: r.name as string,
        courseCount: 0,
      } satisfies Category;
    });

    if (!cats.some((c) => c.slug === "web-development")) {
      cats.unshift(HTML_FUNDAMENTALS_CATEGORY);
    }

    return cats;
  } catch {
    return [HTML_FUNDAMENTALS_CATEGORY];
  }
}

export async function getCatalogCategories(): Promise<Category[]> {
  return await getCategories();
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
        "id, slug, title, summary, short_description, difficulty, estimated_minutes, lesson_count, cover_image_url, thumbnail_url, is_free, created_at, category:categories(name, slug)",
        { count: "exact" },
      )
      .eq("is_published", true)
      .eq("is_free", true);

    const rawSearch = (params.q ?? "").trim().slice(0, 100);
    if (rawSearch.length > 0) {
      const cleanSearch = rawSearch.replace(/[%_]/g, "");
      query = query.or(
        `title.ilike.%${cleanSearch}%,summary.ilike.%${cleanSearch}%,short_description.ilike.%${cleanSearch}%`,
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
      query = query.order("created_at", { ascending: false });
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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const raw: any = row;
      const category = Array.isArray(raw.category)
        ? raw.category[0]
        : raw.category;
      return {
        id: raw.id as string,
        slug: raw.slug as string,
        title: raw.title as string,
        shortDescription: (raw.summary as string) ?? (raw.short_description as string) ?? "",
        difficulty: difficulty(raw.difficulty),
        estimatedMinutes: toNumber(raw.estimated_minutes),
        lessonCount: toNumber(raw.lesson_count),
        categoryName:
          category && typeof category.name === "string" ? category.name : null,
        categorySlug:
          category && typeof category.slug === "string" ? category.slug : null,
        thumbnailUrl: (raw.cover_image_url as string) ?? (raw.thumbnail_url as string) ?? null,
        isFree: raw.is_free !== false,
      } satisfies CourseSummary;
    });

    if (courses.length === 0) {
      const q = (params.q ?? "").toLowerCase();
      const cat = (params.category ?? "all").toLowerCase();
      const lev = (params.level ?? "all").toLowerCase();

      const matchesQ = !q || "html fundamentals web development".includes(q);
      const matchesCat = cat === "all" || cat === "web-development";
      const matchesLev = lev === "all" || lev === "beginner";

      if (matchesQ && matchesCat && matchesLev) {
        return {
          courses: [HTML_FUNDAMENTALS_SUMMARY],
          totalCount: 1,
          page: 1,
          totalPages: 1,
          pageSize,
        };
      }
    }

    return {
      courses,
      totalCount,
      page,
      totalPages,
      pageSize,
    };
  } catch {
    return {
      courses: [HTML_FUNDAMENTALS_SUMMARY],
      totalCount: 1,
      page: 1,
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
        summary,
        description,
        difficulty,
        language,
        estimated_minutes,
        cover_image_url,
        is_free,
        is_published,
        category:categories(id, name, slug),
        modules:course_modules(
          id,
          slug,
          title,
          description,
          position,
          estimated_minutes,
          lessons:lessons(
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
        outcomes:course_learning_outcomes(id, outcome, position),
        prerequisites:course_prerequisites(id, prerequisite, position),
        course_skills:course_skills(
          skill:skills(id, name, slug)
        )
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
          "id, slug, title, summary, description, difficulty, language, estimated_minutes, cover_image_url, is_free, is_published, category:categories(id, name, slug)",
        )
        .eq("slug", cleanSlug)
        .eq("is_published", true)
        .eq("is_free", true)
        .maybeSingle();

      if (!fallbackData) {
        if (cleanSlug === "html-fundamentals") return HTML_FUNDAMENTALS_COURSE;
        return null;
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const fbRaw: any = fallbackData;
      const category = Array.isArray(fbRaw.category)
        ? fbRaw.category[0]
        : fbRaw.category;

      // Fetch modules and lessons separately for robustness
      let modules: CourseModule[] = [];
      try {
        const { data: modRows } = await supabase
          .from("course_modules")
          .select("id, slug, title, description, position, estimated_minutes")
          .eq("course_id", fbRaw.id)
          .order("position", { ascending: true });

        if (modRows && modRows.length > 0) {
          const modIds = modRows.map((m) => m.id);
          const { data: lessonRows } = await supabase
            .from("lessons")
            .select("id, module_id, slug, title, lesson_type, position, estimated_minutes, is_preview, is_published")
            .in("module_id", modIds)
            .order("position", { ascending: true });

          modules = modRows.map((m) => {
            const mLessons = (lessonRows || [])
              .filter((l) => l.module_id === m.id)
              .map((l) => ({
                id: l.id,
                slug: l.slug,
                title: l.title,
                lessonType: lessonType(l.lesson_type),
                position: l.position,
                estimatedMinutes: l.estimated_minutes || 0,
                isPreview: Boolean(l.is_preview),
                isPublished: l.is_published !== false,
              }));

            return {
              id: m.id,
              title: m.title,
              description: m.description || null,
              position: m.position,
              estimatedMinutes:
                m.estimated_minutes ||
                mLessons.reduce((acc, l) => acc + l.estimatedMinutes, 0),
              lessonCount: mLessons.length,
              lessons: mLessons,
            };
          });
        }
      } catch {
        // Ignore
      }

      const lessonCount = modules.reduce((acc, m) => acc + m.lessonCount, 0);

      return {
        id: fbRaw.id as string,
        slug: fbRaw.slug as string,
        title: fbRaw.title as string,
        summary: (fbRaw.summary as string) ?? (fbRaw.short_description as string) ?? "",
        description:
          (fbRaw.description as string) ??
          (fbRaw.summary as string) ??
          "",
        difficulty: difficulty(fbRaw.difficulty),
        language: (fbRaw.language as string) || "English",
        estimatedMinutes: toNumber(fbRaw.estimated_minutes),
        lessonCount: lessonCount || toNumber(fbRaw.lesson_count),
        moduleCount: modules.length,
        isFree: fbRaw.is_free !== false,
        isPublished: fbRaw.is_published === true,
        thumbnailUrl: (fbRaw.cover_image_url as string) ?? (fbRaw.thumbnail_url as string) ?? null,
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
        modules,
      };
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const rawData: any = data;
    const category = Array.isArray(rawData.category)
      ? rawData.category[0]
      : rawData.category;
    const instructor = Array.isArray(rawData.instructor)
      ? rawData.instructor[0]
      : rawData.instructor;

    // Process modules and lessons
    const rawModules = Array.isArray(rawData.modules) ? rawData.modules : [];
    const modules: CourseModule[] = rawModules
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .sort((a: any, b: any) => (a.position ?? 0) - (b.position ?? 0))
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .map((mod: any, idx: number) => {
        const rawLessons = Array.isArray(mod.lessons) ? mod.lessons : [];
        const lessons: CourseLesson[] = rawLessons
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .filter((l: any) => l.is_published !== false)
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .sort((a: any, b: any) => (a.position ?? 0) - (b.position ?? 0))
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .map((les: any, lIdx: number) => ({
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
    const finalLessonCount = calculatedLessonCount || toNumber(rawData.lesson_count);

    // Learning outcomes
    const rawOutcomes = Array.isArray(rawData.outcomes) ? rawData.outcomes : [];
    const learningOutcomes = rawOutcomes
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .sort((a: any, b: any) => (a.position ?? a.sort_order ?? 0) - (b.position ?? b.sort_order ?? 0))
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .map((o: any) => (typeof o.outcome === "string" ? o.outcome : ""))
      .filter(Boolean);

    // Prerequisites
    const rawPrereqs = Array.isArray(rawData.prerequisites)
      ? rawData.prerequisites
      : [];
    const prerequisites = rawPrereqs
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .sort((a: any, b: any) => (a.position ?? a.sort_order ?? 0) - (b.position ?? b.sort_order ?? 0))
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .map((p: any) => (typeof p.prerequisite === "string" ? p.prerequisite : ""))
      .filter(Boolean);

    // Skills
    const rawSkills = Array.isArray(rawData.course_skills)
      ? rawData.course_skills
      : Array.isArray(rawData.skills)
      ? rawData.skills
      : [];
    const skills = rawSkills
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .map((s: any) => {
        if (s.skill && typeof s.skill.name === "string") return s.skill.name;
        if (typeof s.skill_name === "string") return s.skill_name;
        if (typeof s.name === "string") return s.name;
        return "";
      })
      .filter(Boolean);

    // Audience
    const rawAudience = Array.isArray(rawData.audience) ? rawData.audience : [];
    const targetAudience = rawAudience
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .sort((a: any, b: any) => (a.position ?? a.sort_order ?? 0) - (b.position ?? b.sort_order ?? 0))
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .map((a: any) => (typeof a.audience === "string" ? a.audience : ""))
      .filter(Boolean);

    return {
      id: rawData.id as string,
      slug: rawData.slug as string,
      title: rawData.title as string,
      summary: (rawData.summary as string) ?? (rawData.short_description as string) ?? "",
      description:
        (rawData.description as string) ??
        (rawData.summary as string) ??
        "",
      difficulty: difficulty(rawData.difficulty),
      language: (rawData.language as string) || "English",
      estimatedMinutes: toNumber(rawData.estimated_minutes),
      lessonCount: finalLessonCount,
      moduleCount: modules.length,
      isFree: rawData.is_free !== false,
      isPublished: rawData.is_published === true,
      thumbnailUrl: (rawData.cover_image_url as string) ?? (rawData.thumbnail_url as string) ?? null,
      category: category
        ? {
            id: category.id as string,
            name: category.name as string,
            slug: category.slug as string,
          }
        : null,
      instructor: instructor
        ? {
            id: instructor.id as string,
            name: instructor.name as string,
            title: (instructor.title as string) ?? null,
            avatarUrl: (instructor.avatar_url as string) ?? null,
            bio: (instructor.bio as string) ?? null,
          }
        : null,
      learningOutcomes:
        learningOutcomes.length > 0
          ? learningOutcomes
          : cleanSlug === "html-fundamentals"
          ? HTML_FUNDAMENTALS_COURSE.learningOutcomes
          : [],
      prerequisites:
        prerequisites.length > 0
          ? prerequisites
          : cleanSlug === "html-fundamentals"
          ? HTML_FUNDAMENTALS_COURSE.prerequisites
          : [],
      skills:
        skills.length > 0
          ? skills
          : cleanSlug === "html-fundamentals"
          ? HTML_FUNDAMENTALS_COURSE.skills
          : [],
      targetAudience:
        targetAudience.length > 0
          ? targetAudience
          : cleanSlug === "html-fundamentals"
          ? HTML_FUNDAMENTALS_COURSE.targetAudience
          : [],
      modules:
        modules.length > 0
          ? modules
          : cleanSlug === "html-fundamentals"
          ? HTML_FUNDAMENTALS_COURSE.modules
          : [],
    };
  } catch {
    if (slug.trim().toLowerCase() === "html-fundamentals") {
      return HTML_FUNDAMENTALS_COURSE;
    }
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
