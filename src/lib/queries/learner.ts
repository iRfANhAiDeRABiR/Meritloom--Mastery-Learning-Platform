import { getCategories } from "@/lib/queries";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type {
  ActiveEnrollmentDetail,
  CourseDifficulty,
  CourseSummary,
  LearnerCourseItem,
  LearnerDashboardData,
  LearnerTabStatus,
  MyLearningPageData,
} from "@/lib/types";

/**
 * Fetch all personalized data required for the Learner Home / Dashboard.
 * Robust against missing tables/migrations with graceful fallbacks.
 */
export async function getLearnerDashboardData(
  userId: string,
): Promise<LearnerDashboardData> {
  const supabase = await createSupabaseServerClient();

  // Default empty state
  const defaultResult: LearnerDashboardData = {
    user: {
      id: userId,
      name: "Learner",
      avatarUrl: null,
      email: null,
      onboardingCompleted: true,
    },
    onboardingCompleted: true,
    continueCourse: null,
    activeCourses: [],
    recommendedCourses: [],
    recentCourses: [],
  };

  if (!supabase) return defaultResult;

  try {
    // 1. Fetch user auth & metadata
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return defaultResult;

    const metadata = user.user_metadata ?? {};
    const name =
      (typeof metadata.full_name === "string" && metadata.full_name) ||
      (typeof metadata.name === "string" && metadata.name) ||
      user.email?.split("@")[0] ||
      "Learner";

    const onboardingCompleted = Boolean(
      metadata.onboarding_completed ||
        metadata.onboarding_skipped ||
        metadata.learning_goal,
    );

    const userInterests: string[] = Array.isArray(metadata.interests)
      ? metadata.interests
      : [];
    const userLevel: string | null =
      typeof metadata.level_preference === "string"
        ? metadata.level_preference
        : null;

    defaultResult.user = {
      id: user.id,
      name,
      avatarUrl:
        typeof metadata.avatar_url === "string" ? metadata.avatar_url : null,
      email: user.email ?? null,
      onboardingCompleted,
    };
    defaultResult.onboardingCompleted = onboardingCompleted;

    // 2. Query active enrollments
    const enrolledCourseIds: string[] = [];
    const activeCourses: ActiveEnrollmentDetail[] = [];

    try {
      const { data: enrollments } = await supabase
        .from("course_enrollments")
        .select(
          `
          id,
          course_id,
          status,
          enrolled_at,
          last_accessed_at,
          course:courses (
            id,
            slug,
            title,
            difficulty,
            thumbnail_url,
            is_published,
            category:categories (
              name,
              slug
            )
          )
        `,
        )
        .eq("user_id", userId)
        .eq("status", "active")
        .order("last_accessed_at", { ascending: false })
        .limit(6);

      if (enrollments && enrollments.length > 0) {
        for (const row of enrollments) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const course = Array.isArray(row.course) ? row.course[0] : (row.course as any);
          if (!course || !course.is_published) continue;

          enrolledCourseIds.push(course.id);

          // Get total lessons count for this course
          const { count: totalLessons } = await supabase
            .from("lessons")
            .select("id", { count: "exact", head: true })
            .eq("course_id", course.id)
            .eq("is_published", true);

          // Get completed lessons count if lesson_progress table exists
          let completedLessons = 0;
          let nextLessonTitle: string | null = null;
          let nextLessonSlug: string | null = null;

          try {
            const { count: completedCount } = await supabase
              .from("lesson_progress")
              .select("id", { count: "exact", head: true })
              .eq("user_id", userId)
              .eq("course_id", course.id)
              .eq("completed", true);

            completedLessons = completedCount ?? 0;
          } catch {
            completedLessons = 0;
          }

          // Find the next lesson
          try {
            const { data: nextLesson } = await supabase
              .from("lessons")
              .select("title, slug")
              .eq("course_id", course.id)
              .eq("is_published", true)
              .order("position", { ascending: true })
              .limit(1)
              .maybeSingle();

            if (nextLesson) {
              nextLessonTitle = nextLesson.title;
              nextLessonSlug = nextLesson.slug;
            }
          } catch {
            // Ignore
          }

          const total = totalLessons ?? 0;
          const progressPercent =
            total > 0 ? Math.min(100, Math.round((completedLessons / total) * 100)) : 0;

          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const cat = Array.isArray(course.category) ? course.category[0] : (course.category as any);

          activeCourses.push({
            id: row.id,
            courseId: course.id,
            courseSlug: course.slug,
            courseTitle: course.title,
            categoryName: cat?.name ?? null,
            categorySlug: cat?.slug ?? null,
            thumbnailUrl: course.thumbnail_url ?? null,
            difficulty: (course.difficulty as CourseDifficulty) || "beginner",
            totalLessons: total,
            completedLessons,
            progressPercent,
            nextLessonTitle,
            nextLessonSlug,
            lastAccessedAt: row.last_accessed_at || row.enrolled_at || null,
          });
        }
      }
    } catch {
      // Ignore if course_enrollments does not exist yet
    }

    defaultResult.activeCourses = activeCourses;
    defaultResult.continueCourse = activeCourses[0] || null;

    // 3. Query Recommended published free courses
    try {
      let query = supabase
        .from("courses")
        .select(
          `
          id,
          slug,
          title,
          short_description,
          difficulty,
          estimated_minutes,
          lesson_count,
          thumbnail_url,
          is_free,
          category:categories (
            name,
            slug
          )
        `,
        )
        .eq("is_published", true)
        .eq("is_free", true);

      // Filter by preferred difficulty if specified
      if (userLevel && ["beginner", "intermediate", "advanced"].includes(userLevel)) {
        query = query.eq("difficulty", userLevel);
      }

      // Exclude already enrolled courses
      if (enrolledCourseIds.length > 0) {
        query = query.not("id", "in", `(${enrolledCourseIds.join(",")})`);
      }

      const { data: recCourses } = await query.limit(8);

      if (recCourses && recCourses.length > 0) {
        // Map and rank by category match if interests exist
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const mapped: CourseSummary[] = recCourses.map((c: any) => {
          const cat = Array.isArray(c.category) ? c.category[0] : c.category;
          return {
            id: c.id,
            slug: c.slug,
            title: c.title,
            shortDescription: c.short_description || "",
            difficulty: (c.difficulty as CourseDifficulty) || "beginner",
            estimatedMinutes: c.estimated_minutes || 0,
            lessonCount: c.lesson_count || 0,
            categoryName: cat?.name || null,
            categorySlug: cat?.slug || null,
            thumbnailUrl: c.thumbnail_url || null,
            isFree: c.is_free ?? true,
          };
        });

        // If user selected interests, sort matching category slugs to the top
        if (userInterests.length > 0) {
          mapped.sort((a, b) => {
            const aMatch = a.categorySlug && userInterests.includes(a.categorySlug) ? 1 : 0;
            const bMatch = b.categorySlug && userInterests.includes(b.categorySlug) ? 1 : 0;
            return bMatch - aMatch;
          });
        }

        defaultResult.recommendedCourses = mapped.slice(0, 4);
      } else {
        // Fallback: fetch any published free courses
        const { data: fallbackCourses } = await supabase
          .from("courses")
          .select(
            `
            id,
            slug,
            title,
            short_description,
            difficulty,
            estimated_minutes,
            lesson_count,
            thumbnail_url,
            is_free,
            category:categories (
              name,
              slug
            )
          `,
          )
          .eq("is_published", true)
          .eq("is_free", true)
          .limit(4);

        if (fallbackCourses) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          defaultResult.recommendedCourses = fallbackCourses.map((c: any) => {
            const cat = Array.isArray(c.category) ? c.category[0] : c.category;
            return {
              id: c.id,
              slug: c.slug,
              title: c.title,
              shortDescription: c.short_description || "",
              difficulty: (c.difficulty as CourseDifficulty) || "beginner",
              estimatedMinutes: c.estimated_minutes || 0,
              lessonCount: c.lesson_count || 0,
              categoryName: cat?.name || null,
              categorySlug: cat?.slug || null,
              thumbnailUrl: c.thumbnail_url || null,
              isFree: c.is_free ?? true,
            };
          });
        }
      }
    } catch {
      // Ignore
    }

    return defaultResult;
  } catch {
    return defaultResult;
  }
}

/**
 * Query courses for the /learn/courses page based on status tab (active, completed, saved)
 * and optional search/filter criteria.
 */
export async function getMyLearningCoursesData(
  userId: string,
  params: {
    status?: string;
    q?: string;
    level?: string;
    category?: string;
  } = {},
): Promise<MyLearningPageData> {
  const currentTab: LearnerTabStatus =
    params.status === "completed"
      ? "completed"
      : params.status === "saved"
      ? "saved"
      : "active";

  const cleanSearch = (params.q ?? "").trim().toLowerCase();
  const cleanLevel = (params.level ?? "").trim().toLowerCase();
  const cleanCategory = (params.category ?? "").trim().toLowerCase();

  const supabase = await createSupabaseServerClient();
  const allCategories = await getCategories();

  const result: MyLearningPageData = {
    status: currentTab,
    courses: [],
    counts: {
      activeCount: 0,
      completedCount: 0,
      savedCount: 0,
    },
    categories: allCategories,
  };

  if (!supabase) return result;

  try {
    // 1. Fetch user auth & metadata for saved courses
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const metadata = user?.user_metadata ?? {};
    const savedCourseIds: string[] = Array.isArray(metadata.saved_course_ids)
      ? metadata.saved_course_ids
      : [];

    // 2. Fetch real counts
    try {
      const { count: activeCnt } = await supabase
        .from("course_enrollments")
        .select("id", { count: "exact", head: true })
        .eq("user_id", userId)
        .eq("status", "active");

      const { count: completedCnt } = await supabase
        .from("course_enrollments")
        .select("id", { count: "exact", head: true })
        .eq("user_id", userId)
        .eq("status", "completed");

      // Check saved_courses table if exists
      let savedCnt = savedCourseIds.length;
      try {
        const { count: tableSavedCount } = await supabase
          .from("saved_courses")
          .select("id", { count: "exact", head: true })
          .eq("user_id", userId);

        if (typeof tableSavedCount === "number" && tableSavedCount > 0) {
          savedCnt = tableSavedCount;
        }
      } catch {
        // fallback to metadata
      }

      result.counts = {
        activeCount: activeCnt ?? 0,
        completedCount: completedCnt ?? 0,
        savedCount: savedCnt,
      };
    } catch {
      // Ignore count lookup errors
    }

    // 3. Query courses for the selected tab
    if (currentTab === "active" || currentTab === "completed") {
      try {
        const { data: enrollments } = await supabase
          .from("course_enrollments")
          .select(
            `
            id,
            course_id,
            status,
            enrolled_at,
            completed_at,
            last_accessed_at,
            course:courses (
              id,
              slug,
              title,
              difficulty,
              estimated_minutes,
              thumbnail_url,
              is_published,
              category:categories (
                name,
                slug
              )
            )
          `,
          )
          .eq("user_id", userId)
          .eq("status", currentTab)
          .order("last_accessed_at", { ascending: false });

        if (enrollments && enrollments.length > 0) {
          const items: LearnerCourseItem[] = [];

          for (let i = 0; i < enrollments.length; i++) {
            const row = enrollments[i];
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const course = Array.isArray(row.course) ? row.course[0] : (row.course as any);
            if (!course || !course.is_published) continue;

            // Get total lessons count
            const { count: totalLessons } = await supabase
              .from("lessons")
              .select("id", { count: "exact", head: true })
              .eq("course_id", course.id)
              .eq("is_published", true);

            // Get completed lessons count
            let completedLessons = 0;
            let nextLessonTitle: string | null = null;
            let nextLessonSlug: string | null = null;

            try {
              const { count: completedCount } = await supabase
                .from("lesson_progress")
                .select("id", { count: "exact", head: true })
                .eq("user_id", userId)
                .eq("course_id", course.id)
                .eq("completed", true);

              completedLessons = completedCount ?? 0;
            } catch {
              completedLessons = 0;
            }

            // Find next lesson
            try {
              const { data: nextLesson } = await supabase
                .from("lessons")
                .select("title, slug")
                .eq("course_id", course.id)
                .eq("is_published", true)
                .order("position", { ascending: true })
                .limit(1)
                .maybeSingle();

              if (nextLesson) {
                nextLessonTitle = nextLesson.title;
                nextLessonSlug = nextLesson.slug;
              }
            } catch {
              // Ignore
            }

            const total = totalLessons ?? 0;
            const progressPercent =
              total > 0
                ? Math.min(100, Math.round((completedLessons / total) * 100))
                : currentTab === "completed"
                ? 100
                : 0;

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const cat = Array.isArray(course.category) ? course.category[0] : (course.category as any);

            items.push({
              id: row.id,
              courseId: course.id,
              courseSlug: course.slug,
              courseTitle: course.title,
              categoryName: cat?.name ?? null,
              categorySlug: cat?.slug ?? null,
              thumbnailUrl: course.thumbnail_url ?? null,
              difficulty: (course.difficulty as CourseDifficulty) || "beginner",
              estimatedMinutes: course.estimated_minutes || 0,
              totalLessons: total,
              completedLessons,
              progressPercent,
              nextLessonTitle,
              nextLessonSlug,
              status: currentTab,
              enrolledAt: row.enrolled_at || null,
              completedAt: row.completed_at || null,
              lastAccessedAt: row.last_accessed_at || row.enrolled_at || null,
              isRecentlyActive: i === 0 && currentTab === "active",
            });
          }

          // Apply client-side filters
          let filtered = items;
          if (cleanSearch) {
            filtered = filtered.filter(
              (c) =>
                c.courseTitle.toLowerCase().includes(cleanSearch) ||
                (c.categoryName && c.categoryName.toLowerCase().includes(cleanSearch)),
            );
          }
          if (cleanLevel && cleanLevel !== "all") {
            filtered = filtered.filter((c) => c.difficulty === cleanLevel);
          }
          if (cleanCategory && cleanCategory !== "all") {
            filtered = filtered.filter((c) => c.categorySlug === cleanCategory);
          }

          result.courses = filtered;
        }
      } catch {
        // Ignore
      }
    } else if (currentTab === "saved") {
      try {
        // Try saved_courses table or fallback to user_metadata
        let savedIds = savedCourseIds;

        try {
          const { data: tableSaved } = await supabase
            .from("saved_courses")
            .select("course_id")
            .eq("user_id", userId);

          if (tableSaved && tableSaved.length > 0) {
            savedIds = tableSaved.map((s) => s.course_id);
          }
        } catch {
          // fallback to metadata
        }

        if (savedIds.length > 0) {
          const { data: savedList } = await supabase
            .from("courses")
            .select(
              `
              id,
              slug,
              title,
              difficulty,
              estimated_minutes,
              lesson_count,
              thumbnail_url,
              is_published,
              category:categories (
                name,
                slug
              )
            `,
            )
            .in("id", savedIds)
            .eq("is_published", true);

          if (savedList && savedList.length > 0) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const items: LearnerCourseItem[] = savedList.map((course: any) => {
              const cat = Array.isArray(course.category)
                ? course.category[0]
                : course.category;

              return {
                id: `saved-${course.id}`,
                courseId: course.id,
                courseSlug: course.slug,
                courseTitle: course.title,
                categoryName: cat?.name || null,
                categorySlug: cat?.slug || null,
                thumbnailUrl: course.thumbnail_url || null,
                difficulty: (course.difficulty as CourseDifficulty) || "beginner",
                estimatedMinutes: course.estimated_minutes || 0,
                totalLessons: course.lesson_count || 0,
                completedLessons: 0,
                progressPercent: 0,
                nextLessonTitle: null,
                nextLessonSlug: null,
                status: "saved" as const,
              };
            });

            // Apply filters
            let filtered = items;
            if (cleanSearch) {
              filtered = filtered.filter(
                (c) =>
                  c.courseTitle.toLowerCase().includes(cleanSearch) ||
                  (c.categoryName && c.categoryName.toLowerCase().includes(cleanSearch)),
              );
            }
            if (cleanLevel && cleanLevel !== "all") {
              filtered = filtered.filter((c) => c.difficulty === cleanLevel);
            }
            if (cleanCategory && cleanCategory !== "all") {
              filtered = filtered.filter((c) => c.categorySlug === cleanCategory);
            }

            result.courses = filtered;
          }
        }
      } catch {
        // Ignore
      }
    }

    return result;
  } catch {
    return result;
  }
}
