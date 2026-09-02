import { ALL_STATIC_SUMMARIES } from "@/lib/data/static-courses";
import { getCategories } from "@/lib/queries";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type {
  CourseDifficulty,
  ExploreCourseEnrollmentStatus,
  ExploreCourseItem,
  LearnerExplorePageData,
  LearnerExploreSearchParams,
} from "@/lib/types";

/**
 * Fetch all published free courses enriched with authenticated learner state
 * (enrollment status, real lesson progress, and saved/bookmark status).
 *
 * Performance-optimized:
 * - Concurrent top-level fetching for courses, enrollments, saved items, categories.
 * - Single batch query for all lesson progress across enrolled courses (0 N+1).
 * - URL-driven search & filtering.
 */
export async function getLearnerExploreData(
  userId: string,
  params: LearnerExploreSearchParams = {},
): Promise<LearnerExplorePageData> {
  const cleanSearch = (params.q ?? "").trim().toLowerCase();
  const cleanLevel = (params.level ?? "").trim().toLowerCase();
  const cleanCategory = (params.category ?? "").trim().toLowerCase();
  const cleanStatus = (params.status ?? "").trim().toLowerCase();

  const supabase = await createSupabaseServerClient();
  const allCategories = await getCategories();

  const defaultResult: LearnerExplorePageData = {
    courses: [],
    totalCoursesCount: 0,
    categories: allCategories,
  };

  if (!supabase) return defaultResult;

  try {
    // 1. Fetch user auth & metadata concurrently with main data queries
    const [userRes, coursesRes, enrollmentsRes, savedRes] = await Promise.all([
      supabase.auth.getUser(),
      supabase
        .from("courses")
        .select(
          `
          id,
          slug,
          title,
          summary,
          difficulty,
          estimated_minutes,
          cover_image_url,
          is_free,
          created_at,
          category:categories (
            id,
            name,
            slug
          ),
          modules:course_modules (
            id,
            position,
            lessons (
              id,
              title,
              slug,
              position,
              is_bonus,
              is_published
            )
          )
        `,
        )
        .eq("is_published", true)
        .eq("is_free", true)
        .order("created_at", { ascending: false }),
      supabase
        .from("course_enrollments")
        .select("id, course_id, status, enrolled_at, completed_at, last_accessed_at")
        .eq("user_id", userId),
      supabase
        .from("saved_courses")
        .select("course_id")
        .eq("user_id", userId),
    ]);

    const metadata = userRes.data?.user?.user_metadata ?? {};
    const metadataSavedIds: string[] = Array.isArray(metadata.saved_course_ids)
      ? metadata.saved_course_ids
      : [];

    const rawCourses = coursesRes.data || [];
    const rawEnrollments = enrollmentsRes.data || [];
    const rawSaved = savedRes.data || [];

    // 2. Build fast lookup sets and maps
    const savedCourseIdSet = new Set<string>([
      ...metadataSavedIds,
      ...rawSaved.map((s) => s.course_id).filter(Boolean),
    ]);

    const enrollmentByCourseId = new Map<
      string,
      {
        id: string;
        status: string;
        enrolled_at: string | null;
        completed_at: string | null;
        last_accessed_at: string | null;
      }
    >();

    const enrolledCourseIds: string[] = [];
    for (const enr of rawEnrollments) {
      if (enr.course_id) {
        enrollmentByCourseId.set(enr.course_id, {
          id: enr.id,
          status: enr.status,
          enrolled_at: enr.enrolled_at,
          completed_at: enr.completed_at,
          last_accessed_at: enr.last_accessed_at,
        });
        enrolledCourseIds.push(enr.course_id);
      }
    }

    // 3. Batch query lesson progress for all enrolled courses in ONE single query
    const { data: progressRows } =
      enrolledCourseIds.length > 0
        ? await supabase
            .from("lesson_progress")
            .select("course_id, lesson_id, completed")
            .eq("user_id", userId)
            .in("course_id", enrolledCourseIds)
            .eq("completed", true)
        : { data: [] };

    const progressByCourse = new Map<string, Set<string>>();
    for (const p of progressRows || []) {
      if (p.course_id && p.lesson_id) {
        if (!progressByCourse.has(p.course_id)) {
          progressByCourse.set(p.course_id, new Set());
        }
        progressByCourse.get(p.course_id)!.add(p.lesson_id);
      }
    }

    // 4. Enrich every published course with learner state
    const enrichedCourses: ExploreCourseItem[] = [];

    for (const rawCourse of rawCourses) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const c = rawCourse as any;
      const cat = Array.isArray(c.category) ? c.category[0] : c.category;

      const enrollment = enrollmentByCourseId.get(c.id);
      const isSaved = savedCourseIdSet.has(c.id);

      const completedLessonSet = progressByCourse.get(c.id) || new Set<string>();

      let totalLessons = 0;
      let completedLessons = 0;
      let nextLessonTitle: string | null = null;
      let nextLessonSlug: string | null = null;

      const rawModules = Array.isArray(c.modules) ? c.modules : [];
      const sortedModules = [...rawModules].sort(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (a: any, b: any) => (a.position || 0) - (b.position || 0),
      );

      for (const mod of sortedModules) {
        const rawLessons = Array.isArray(mod.lessons) ? mod.lessons : [];
        const sortedLessons = [...rawLessons]
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .filter((l: any) => l.is_published !== false)
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .sort((a: any, b: any) => (a.position || 0) - (b.position || 0));

        for (const les of sortedLessons) {
          if (!les.is_bonus) {
            totalLessons++;
            if (completedLessonSet.has(les.id)) {
              completedLessons++;
            } else if (!nextLessonTitle) {
              nextLessonTitle = les.title;
              nextLessonSlug = les.slug;
            }
          }
        }
      }

      // Fallback lesson counts for known baseline courses
      if (totalLessons === 0) {
        if (c.slug === "html-fundamentals") {
          totalLessons = 23;
          if (!nextLessonTitle) {
            nextLessonTitle = "HTML - Introduction";
            nextLessonSlug = "html-introduction";
          }
        } else if (c.slug === "css-fundamentals") {
          totalLessons = 18;
          if (!nextLessonTitle) {
            nextLessonTitle = "CSS - Introduction";
            nextLessonSlug = "css-introduction";
          }
        } else if (c.slug === "javascript-fundamentals") {
          totalLessons = 17;
          if (!nextLessonTitle) {
            nextLessonTitle = "JS - Introduction";
            nextLessonSlug = "js-introduction";
          }
        }
      }

      const progressPercent =
        totalLessons > 0
          ? Math.min(100, Math.round((completedLessons / totalLessons) * 100))
          : 0;

      let enrollmentStatus: ExploreCourseEnrollmentStatus = "not_started";
      if (enrollment) {
        if (
          enrollment.status === "completed" ||
          (totalLessons > 0 && completedLessons >= totalLessons)
        ) {
          enrollmentStatus = "completed";
        } else {
          enrollmentStatus = "in_progress";
        }
      }

      enrichedCourses.push({
        id: c.id,
        slug: c.slug,
        title: c.title,
        summary: c.summary || "",
        difficulty: (c.difficulty as CourseDifficulty) || "beginner",
        estimatedMinutes: c.estimated_minutes || 0,
        totalLessons,
        completedLessons,
        progressPercent,
        categoryName: cat?.name || null,
        categorySlug: cat?.slug || null,
        thumbnailUrl: c.cover_image_url || null,
        isFree: c.is_free ?? true,
        enrollmentStatus,
        isSaved,
        nextLessonTitle,
        nextLessonSlug,
        enrolledAt: enrollment?.enrolled_at || null,
        completedAt: enrollment?.completed_at || null,
        lastAccessedAt: enrollment?.last_accessed_at || null,
      });
    }

    // Merge any static catalog courses not present in DB
    const existingSlugs = new Set(enrichedCourses.map((c) => c.slug));
    for (const staticCourse of ALL_STATIC_SUMMARIES) {
      if (!existingSlugs.has(staticCourse.slug)) {
        const enrollment = enrollmentByCourseId.get(staticCourse.id);
        const isSaved = savedCourseIdSet.has(staticCourse.id);
        const completedLessonSet = progressByCourse.get(staticCourse.id) || new Set<string>();
        const completedLessons = completedLessonSet.size;
        const totalLessons = staticCourse.lessonCount || 20;
        const progressPercent =
          totalLessons > 0
            ? Math.min(100, Math.round((completedLessons / totalLessons) * 100))
            : 0;

        let enrollmentStatus: ExploreCourseEnrollmentStatus = "not_started";
        if (enrollment) {
          if (
            enrollment.status === "completed" ||
            (totalLessons > 0 && completedLessons >= totalLessons)
          ) {
            enrollmentStatus = "completed";
          } else {
            enrollmentStatus = "in_progress";
          }
        }

        enrichedCourses.push({
          id: staticCourse.id,
          slug: staticCourse.slug,
          title: staticCourse.title,
          summary: staticCourse.shortDescription || "",
          difficulty: staticCourse.difficulty || "beginner",
          estimatedMinutes: staticCourse.estimatedMinutes || 0,
          totalLessons,
          completedLessons,
          progressPercent,
          categoryName: staticCourse.categoryName || null,
          categorySlug: staticCourse.categorySlug || null,
          thumbnailUrl: staticCourse.thumbnailUrl || null,
          isFree: staticCourse.isFree ?? true,
          enrollmentStatus,
          isSaved,
        });
      }
    }

    // 5. Apply filters
    let filtered = enrichedCourses;

    if (cleanSearch) {
      filtered = filtered.filter((c) => {
        const titleMatch = c.title.toLowerCase().includes(cleanSearch);
        const summaryMatch = c.summary.toLowerCase().includes(cleanSearch);
        const categoryMatch = c.categoryName
          ? c.categoryName.toLowerCase().includes(cleanSearch)
          : false;
        return titleMatch || summaryMatch || categoryMatch;
      });
    }

    if (cleanLevel && cleanLevel !== "all") {
      filtered = filtered.filter((c) => c.difficulty === cleanLevel);
    }

    if (cleanCategory && cleanCategory !== "all") {
      filtered = filtered.filter((c) => c.categorySlug === cleanCategory);
    }

    if (cleanStatus && cleanStatus !== "all") {
      if (cleanStatus === "in_progress") {
        filtered = filtered.filter((c) => c.enrollmentStatus === "in_progress");
      } else if (cleanStatus === "completed") {
        filtered = filtered.filter((c) => c.enrollmentStatus === "completed");
      } else if (cleanStatus === "not_started") {
        filtered = filtered.filter((c) => c.enrollmentStatus === "not_started");
      } else if (cleanStatus === "saved") {
        filtered = filtered.filter((c) => c.isSaved);
      }
    }

    return {
      courses: filtered,
      totalCoursesCount: rawCourses.length,
      categories: allCategories,
    };
  } catch {
    return defaultResult;
  }
}
