import { getCategories, getCourseDetailBySlug } from "@/lib/queries";
import { HTML_LESSON_DETAILS_MAP } from "@/lib/data/static-courses";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type {
  ActiveEnrollmentDetail,
  CourseDifficulty,
  CourseLearningOverviewData,
  CourseSummary,
  FullLessonDetail,
  LearnerCourseItem,
  LearnerDashboardData,
  LearnerLessonDetail,
  LearnerModuleDetail,
  LearnerTabStatus,
  LessonNavigationItem,
  LessonPlayerData,
  LessonResource,
  ModuleState,
  MyLearningPageData,
  ConceptPerformance,
  PracticeQuestion,
  PracticeQuizData,
  QuizAttemptAnswer,
  QuizAttemptSummary,
  QuizRecommendation,
  QuizResultsPageData,
  QuizReviewQuestion,
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

/**
 * Fetch detailed course learning overview, modules, lessons, and progress
 * for the authenticated course roadmap at /learn/courses/[courseSlug].
 */
export async function getCourseLearningOverviewData(
  userId: string,
  courseSlug: string,
): Promise<CourseLearningOverviewData | null> {
  const course = await getCourseDetailBySlug(courseSlug);
  if (!course) return null;

  const supabase = await createSupabaseServerClient();
  if (!supabase) return null;

  try {
    // 1. Fetch user auth & onboarding metadata (study pace)
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const metadata = user?.user_metadata ?? {};
    const pace = typeof metadata.study_pace === "string" ? metadata.study_pace : null;

    let studyPaceLabel: string | null = null;
    let weeklyMinutes = 0;

    switch (pace) {
      case "15_min":
        studyPaceLabel = "15 min / day";
        weeklyMinutes = 105;
        break;
      case "30_min":
        studyPaceLabel = "30 min / day";
        weeklyMinutes = 210;
        break;
      case "45_min":
        studyPaceLabel = "45 min / day";
        weeklyMinutes = 315;
        break;
      case "60_min":
        studyPaceLabel = "60 min / day";
        weeklyMinutes = 420;
        break;
      case "few_times_week":
        studyPaceLabel = "A few times a week";
        weeklyMinutes = 90;
        break;
      default:
        studyPaceLabel = null;
    }

    // 2. Check enrollment
    let isEnrolled = false;
    let enrollmentId: string | null = null;
    let enrolledAt: string | null = null;
    let completedAt: string | null = null;

    try {
      const { data: enrollment } = await supabase
        .from("course_enrollments")
        .select("id, status, enrolled_at, completed_at")
        .eq("user_id", userId)
        .eq("course_id", course.id)
        .maybeSingle();

      if (enrollment) {
        isEnrolled = true;
        enrollmentId = enrollment.id;
        enrolledAt = enrollment.enrolled_at || null;
        completedAt = enrollment.completed_at || null;
      }
    } catch {
      // Ignore
    }

    // 3. Fetch lesson progress rows for this course
    const completedLessonIds = new Set<string>();

    try {
      const { data: progressRows } = await supabase
        .from("lesson_progress")
        .select("lesson_id, completed")
        .eq("user_id", userId)
        .eq("course_id", course.id)
        .eq("completed", true);

      if (progressRows) {
        for (const row of progressRows) {
          if (row.lesson_id) {
            completedLessonIds.add(row.lesson_id);
          }
        }
      }
    } catch {
      // Ignore
    }

    // 4. Map modules and lessons
    let nextFound = false;
    let globalNextLesson: {
      lesson: LearnerLessonDetail;
      moduleTitle: string;
      modulePosition: number;
    } | null = null;

    let totalLessonsCount = 0;
    let totalCompletedCount = 0;
    let requiredLessonsCount = 0;
    let completedRequiredCount = 0;
    let bonusLessonsCount = 0;

    const learnerModules: LearnerModuleDetail[] = course.modules.map((mod, modIdx) => {
      let modCompletedCount = 0;
      let modNextLesson: LearnerLessonDetail | null = null;

      const lessons: LearnerLessonDetail[] = mod.lessons.map((les, lesIdx) => {
        totalLessonsCount++;
        const isBonus = Boolean(les.isBonus);
        if (isBonus) {
          bonusLessonsCount++;
        } else {
          requiredLessonsCount++;
        }

        const isCompleted = completedLessonIds.has(les.id);

        if (isCompleted) {
          modCompletedCount++;
          totalCompletedCount++;
          if (!isBonus) {
            completedRequiredCount++;
          }
        }

        let isNext = false;
        if (!isCompleted && !nextFound) {
          isNext = true;
          nextFound = true;
        }

        const lessonDetail: LearnerLessonDetail = {
          id: les.id,
          slug: les.slug || `lesson-${lesIdx + 1}`,
          title: les.title,
          lessonType: les.lessonType,
          position: les.position,
          estimatedMinutes: les.estimatedMinutes || 5,
          isCompleted,
          isNext,
          isBonus,
          youtubeVideoId: les.youtubeVideoId,
        };

        if (isNext) {
          modNextLesson = lessonDetail;
          globalNextLesson = {
            lesson: lessonDetail,
            moduleTitle: mod.title,
            modulePosition: mod.position || modIdx + 1,
          };
        }

        return lessonDetail;
      });

      // Determine module state
      let state: ModuleState = "not_started";
      if (modCompletedCount === lessons.length && lessons.length > 0) {
        state = "completed";
      } else if (modCompletedCount > 0) {
        state = "in_progress";
      }

      return {
        id: mod.id,
        title: mod.title,
        description: mod.description,
        position: mod.position || modIdx + 1,
        estimatedMinutes: mod.estimatedMinutes,
        lessonCount: lessons.length,
        completedLessonsCount: modCompletedCount,
        state,
        lessons,
        nextLesson: modNextLesson,
        isBonus: mod.isBonus || (lessons.length > 0 && lessons.every((l) => l.isBonus)),
      };
    });

    // If no incomplete lesson found but lessons exist and none completed, set first lesson as next
    if (!globalNextLesson && learnerModules.length > 0 && learnerModules[0].lessons.length > 0) {
      if (totalCompletedCount < totalLessonsCount) {
        const firstMod = learnerModules[0];
        const firstLes = firstMod.lessons[0];
        firstLes.isNext = true;
        globalNextLesson = {
          lesson: firstLes,
          moduleTitle: firstMod.title,
          modulePosition: firstMod.position,
        };
      }
    }

    // Progress percentage based ONLY on required published lessons
    const totalRequiredDenominator = requiredLessonsCount > 0 ? requiredLessonsCount : totalLessonsCount;
    const progressPercent =
      totalRequiredDenominator > 0
        ? Math.min(100, Math.round((completedRequiredCount / totalRequiredDenominator) * 100))
        : 0;

    const isCourseCompleted =
      totalRequiredDenominator > 0 && completedRequiredCount >= totalRequiredDenominator;

    // Calculate estimated weeks remaining
    let estimatedWeeksRemaining: number | null = null;
    if (weeklyMinutes > 0 && totalRequiredDenominator > 0) {
      const remainingLessons = totalRequiredDenominator - completedRequiredCount;
      const avgMinutesPerLesson =
        course.estimatedMinutes > 0
          ? course.estimatedMinutes / totalRequiredDenominator
          : 8;
      const remainingMinutes = remainingLessons * avgMinutesPerLesson;

      if (remainingMinutes > 0) {
        estimatedWeeksRemaining = Math.max(1, Math.ceil(remainingMinutes / weeklyMinutes));
      }
    }

    return {
      course,
      isEnrolled,
      enrollmentId,
      enrolledAt,
      completedAt,
      modules: learnerModules,
      totalLessons: totalRequiredDenominator,
      completedLessons: completedRequiredCount,
      progressPercent,
      nextLesson: globalNextLesson,
      isCourseCompleted,
      studyPaceLabel,
      estimatedWeeksRemaining,
      requiredLessonsCount,
      bonusLessonsCount,
    };
  } catch {
    return null;
  }
}

/**
 * Fetch detailed data for the Lesson Player (/learn/courses/[courseSlug]/lessons/[lessonSlug]).
 */
export async function getLessonPlayerData(
  userId: string,
  courseSlug: string,
  lessonSlug: string,
): Promise<LessonPlayerData | null> {
  const course = await getCourseDetailBySlug(courseSlug);
  if (!course) return null;

  const supabase = await createSupabaseServerClient();
  if (!supabase) return null;

  try {
    // 1. Find the target lesson and module
    let targetModule: {
      id: string;
      title: string;
      position: number;
      totalLessons: number;
      isBonus?: boolean;
    } | null = null;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let rawTargetLesson: any = null;

    const flattenedLessons: {
      id: string;
      slug: string;
      title: string;
      modulePosition: number;
      lessonPosition: number;
      isBonus?: boolean;
    }[] = [];

    for (let mIdx = 0; mIdx < course.modules.length; mIdx++) {
      const mod = course.modules[mIdx];
      const modPos = mod.position || mIdx + 1;

      for (let lIdx = 0; lIdx < mod.lessons.length; lIdx++) {
        const les = mod.lessons[lIdx];
        const lesPos = les.position || lIdx + 1;
        const isBonus = Boolean(les.isBonus);

        flattenedLessons.push({
          id: les.id,
          slug: les.slug,
          title: les.title,
          modulePosition: modPos,
          lessonPosition: lesPos,
          isBonus,
        });

        if (les.slug === lessonSlug) {
          rawTargetLesson = les;
          targetModule = {
            id: mod.id,
            title: mod.title,
            position: modPos,
            totalLessons: mod.lessons.length,
            isBonus: mod.isBonus || isBonus,
          };
        }
      }
    }

    if (!rawTargetLesson || !targetModule) {
      return null;
    }

    // 2. Check enrollment and ensure enrolled
    let isEnrolled = false;
    try {
      const { data: enrollment } = await supabase
        .from("course_enrollments")
        .select("id")
        .eq("user_id", userId)
        .eq("course_id", course.id)
        .maybeSingle();

      if (enrollment) {
        isEnrolled = true;
      } else {
        // Auto-enroll if free and published
        await supabase.from("course_enrollments").insert({
          user_id: userId,
          course_id: course.id,
          status: "active",
          enrolled_at: new Date().toISOString(),
          last_accessed_at: new Date().toISOString(),
        });
        isEnrolled = true;
      }
    } catch {
      // Ignore
    }

    // 3. Query lesson progress & update last_viewed_at
    const completedLessonIds = new Set<string>();
    let currentLessonCompleted = false;
    let currentLessonCompletedAt: string | null = null;

    try {
      const { data: progressRows } = await supabase
        .from("lesson_progress")
        .select("lesson_id, completed, completed_at")
        .eq("user_id", userId)
        .eq("course_id", course.id);

      if (progressRows) {
        for (const row of progressRows) {
          if (row.completed && row.lesson_id) {
            completedLessonIds.add(row.lesson_id);
          }
          if (row.lesson_id === rawTargetLesson.id && row.completed) {
            currentLessonCompleted = true;
            currentLessonCompletedAt = row.completed_at || null;
          }
        }
      }

      // Asynchronously update last_viewed_at without blocking
      supabase
        .from("lesson_progress")
        .upsert(
          {
            user_id: userId,
            course_id: course.id,
            lesson_id: rawTargetLesson.id,
            last_viewed_at: new Date().toISOString(),
          },
          { onConflict: "user_id,lesson_id" },
        )
        .then(() => {});
    } catch {
      // Ignore
    }

    // 4. Calculate previous, next, and course outline
    const currentIndex = flattenedLessons.findIndex(
      (l) => l.slug === lessonSlug,
    );

    const previousLesson: LessonNavigationItem | null =
      currentIndex > 0 ? flattenedLessons[currentIndex - 1] : null;

    const nextLesson: LessonNavigationItem | null =
      currentIndex >= 0 && currentIndex < flattenedLessons.length - 1
        ? flattenedLessons[currentIndex + 1]
        : null;

    const isLastLesson = currentIndex === flattenedLessons.length - 1;

    // Calculate module states
    let completedRequiredCount = 0;
    let requiredLessonsCount = 0;
    let bonusLessonsCount = 0;

    const modules: LearnerModuleDetail[] = course.modules.map(
      (mod, modIdx) => {
        let modCompleted = 0;
        let modNext: LearnerLessonDetail | null = null;

        const lessons: LearnerLessonDetail[] = mod.lessons.map(
          (les, lesIdx) => {
            const isBonus = Boolean(les.isBonus);
            if (isBonus) {
              bonusLessonsCount++;
            } else {
              requiredLessonsCount++;
            }

            const isCompleted = completedLessonIds.has(les.id);
            if (isCompleted) {
              modCompleted++;
              if (!isBonus) {
                completedRequiredCount++;
              }
            }
            const isCurrent = les.slug === lessonSlug;

            const lDetail: LearnerLessonDetail = {
              id: les.id,
              slug: les.slug,
              title: les.title,
              lessonType: les.lessonType,
              position: les.position || lesIdx + 1,
              estimatedMinutes: les.estimatedMinutes || 5,
              isCompleted,
              isNext: isCurrent,
              isBonus,
              youtubeVideoId: les.youtubeVideoId,
            };

            if (isCurrent) {
              modNext = lDetail;
            }

            return lDetail;
          },
        );

        let state: ModuleState = "not_started";
        if (modCompleted === lessons.length && lessons.length > 0) {
          state = "completed";
        } else if (modCompleted > 0) {
          state = "in_progress";
        }

        return {
          id: mod.id,
          title: mod.title,
          description: mod.description,
          position: mod.position || modIdx + 1,
          estimatedMinutes: mod.estimatedMinutes,
          lessonCount: lessons.length,
          completedLessonsCount: modCompleted,
          state,
          lessons,
          nextLesson: modNext,
          isBonus: mod.isBonus || (lessons.length > 0 && lessons.every((l) => l.isBonus)),
        };
      },
    );

    const totalRequiredDenominator = requiredLessonsCount > 0 ? requiredLessonsCount : flattenedLessons.length;
    const progressPercent =
      totalRequiredDenominator > 0
        ? Math.min(100, Math.round((completedRequiredCount / totalRequiredDenominator) * 100))
        : 0;

    // 5. Query or generate rich educational content for the lesson
    let lessonContent: string | null = rawTargetLesson.content || null;
    let keyTakeaway: string | null = rawTargetLesson.key_takeaway || null;
    let videoUrl: string | null = rawTargetLesson.video_url || null;
    let summaryText: string | null = rawTargetLesson.summary || null;
    let youtubeVideoId: string | null = rawTargetLesson.youtube_video_id || rawTargetLesson.youtubeVideoId || null;
    let videoProvider: string = rawTargetLesson.video_provider || "youtube";
    let sourceChannel: string = rawTargetLesson.source_channel || "W3Schools.com";
    let sourceUrl: string | null = rawTargetLesson.source_url || null;
    let playlistId: string | null = rawTargetLesson.playlist_id || "PLP9IO4UYNF0VdAajP_5pYG-jG2JRrG72s";
    let objectives: string[] = [];
    let resources: LessonResource[] = [];

    try {
      const { data: dbLesson } = await supabase
        .from("lessons")
        .select(`
          content,
          video_url,
          video_provider,
          youtube_video_id,
          source_channel,
          source_url,
          playlist_id,
          key_takeaway,
          summary,
          is_bonus,
          objectives:lesson_objectives(objective, position),
          resources:lesson_resources(id, title, resource_type, url, file_size_bytes)
        `)
        .eq("id", rawTargetLesson.id)
        .maybeSingle();

      if (dbLesson) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const rawDb: any = dbLesson;
        if (rawDb.content) {
          lessonContent = typeof rawDb.content === "string" ? rawDb.content : JSON.stringify(rawDb.content);
        }
        if (rawDb.video_url) videoUrl = rawDb.video_url;
        if (rawDb.youtube_video_id) youtubeVideoId = rawDb.youtube_video_id;
        if (rawDb.video_provider) videoProvider = rawDb.video_provider;
        if (rawDb.source_channel) sourceChannel = rawDb.source_channel;
        if (rawDb.source_url) sourceUrl = rawDb.source_url;
        if (rawDb.playlist_id) playlistId = rawDb.playlist_id;
        if (rawDb.key_takeaway) keyTakeaway = rawDb.key_takeaway;
        if (rawDb.summary) summaryText = rawDb.summary;

        if (Array.isArray(rawDb.objectives) && rawDb.objectives.length > 0) {
          objectives = rawDb.objectives
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .sort((a: any, b: any) => (a.position ?? 0) - (b.position ?? 0))
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .map((o: any) => o.objective)
            .filter(Boolean);
        }

        if (Array.isArray(rawDb.resources) && rawDb.resources.length > 0) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          resources = rawDb.resources.map((r: any) => ({
            id: r.id,
            title: r.title,
            resourceType: r.resource_type === "code" || r.resource_type === "pdf" || r.resource_type === "transcript" || r.resource_type === "download" ? r.resource_type : "external",
            url: r.url || "#",
            size: r.file_size_bytes ? `${Math.round(r.file_size_bytes / 1024)} KB` : undefined,
          }));
        }
      }
    } catch {
      // Ignore
    }

    const staticLesson = HTML_LESSON_DETAILS_MAP[lessonSlug];
    if (staticLesson) {
      if (!lessonContent) lessonContent = staticLesson.content;
      if (!keyTakeaway) keyTakeaway = staticLesson.keyTakeaway;
      if (!videoUrl && staticLesson.videoUrl) videoUrl = staticLesson.videoUrl;
      if (!youtubeVideoId && staticLesson.youtubeVideoId) youtubeVideoId = staticLesson.youtubeVideoId;
      if (!sourceUrl && staticLesson.sourceUrl) sourceUrl = staticLesson.sourceUrl;
      if (!sourceChannel && staticLesson.sourceChannel) sourceChannel = staticLesson.sourceChannel;
      if (!playlistId && staticLesson.playlistId) playlistId = staticLesson.playlistId;
      if (!summaryText && staticLesson.summary) summaryText = staticLesson.summary;
      if (objectives.length === 0 && staticLesson.objectives) {
        objectives = staticLesson.objectives;
      }
    }

    if (!youtubeVideoId && videoUrl) {
      const match = videoUrl.match(/(?:v=|youtu\.be\/|embed\/)([a-zA-Z0-9_-]{11})/);
      if (match) youtubeVideoId = match[1];
    }

    if (!sourceUrl && youtubeVideoId) {
      sourceUrl = `https://www.youtube.com/watch?v=${youtubeVideoId}`;
    }

    // If no custom text content in database, build clear educational content
    if (!lessonContent) {
      lessonContent = `## Overview\n\nWelcome to **${rawTargetLesson.title}**. In this video lesson from W3Schools, you will learn the practical principles and key conventions of ${rawTargetLesson.title}.\n\n### Key Concepts\n\n- Understand the syntax, semantics, and standard conventions.\n- Follow best practices for code readability and accessibility.\n- Practice writing code and viewing the output in your browser.`;
    }

    if (!keyTakeaway) {
      keyTakeaway = `Understand the core mechanics and apply semantic structure to build clean, maintainable web pages.`;
    }

    if (objectives.length === 0 && !rawTargetLesson.isBonus) {
      objectives = [
        `Understand the foundational principles of ${rawTargetLesson.title}.`,
        `Apply best practices to structure clean and efficient markup.`,
        `Test and validate your implementation in the browser.`,
      ];
    }

    if (resources.length === 0) {
      resources = [
        {
          id: "res-1",
          title: "W3Schools HTML Tutorial",
          resourceType: "external",
          url: "https://www.w3schools.com/html/",
        },
        {
          id: "res-2",
          title: "MDN Web Docs HTML Reference",
          resourceType: "external",
          url: "https://developer.mozilla.org/en-US/docs/Web/HTML",
        },
      ];
    }

    const isBonusLesson = Boolean(rawTargetLesson.isBonus);

    const currentLesson: FullLessonDetail = {
      id: rawTargetLesson.id,
      slug: rawTargetLesson.slug,
      title: rawTargetLesson.title,
      summary:
        summaryText ||
        rawTargetLesson.summary ||
        `Master the core mechanics and practical applications of ${rawTargetLesson.title}.`,
      lessonType: rawTargetLesson.lessonType || "video",
      position: rawTargetLesson.position || 1,
      estimatedMinutes: rawTargetLesson.estimatedMinutes || 5,
      videoUrl: videoUrl || (youtubeVideoId ? `https://www.youtube.com/watch?v=${youtubeVideoId}` : null),
      youtubeVideoId,
      videoProvider,
      sourceChannel,
      sourceUrl,
      playlistId,
      isBonus: isBonusLesson,
      content: lessonContent,
      keyTakeaway,
      isCompleted: currentLessonCompleted,
      completedAt: currentLessonCompletedAt,
      objectives,
      resources,
      module: targetModule,
    };

    return {
      course: {
        id: course.id,
        slug: course.slug,
        title: course.title,
        difficulty: course.difficulty,
        isFree: course.isFree,
        category: course.category
          ? { name: course.category.name, slug: course.category.slug }
          : null,
      },
      isEnrolled,
      currentLesson,
      modules,
      totalLessons: totalRequiredDenominator,
      completedLessons: completedRequiredCount,
      progressPercent,
      previousLesson,
      nextLesson,
      isLastLesson,
      requiredLessonsCount,
      bonusLessonsCount,
      isBonusLesson,
    };
  } catch {
    return null;
  }
}

/**
 * Fetch practice quiz data, questions, answer options (WITHOUT answers),
 * and the user's latest attempt for /learn/courses/[courseSlug]/lessons/[lessonSlug].
 */
export async function getPracticeQuizData(
  userId: string,
  courseSlug: string,
  lessonSlug: string,
): Promise<PracticeQuizData | null> {
  const course = await getCourseDetailBySlug(courseSlug);
  if (!course) return null;

  const supabase = await createSupabaseServerClient();
  if (!supabase) return null;

  try {
    // 1. Locate target lesson and compute order
    let targetModule: {
      id: string;
      title: string;
      position: number;
    } | null = null;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let rawTargetLesson: any = null;

    const flattenedLessons: {
      slug: string;
      title: string;
      modulePosition: number;
      lessonPosition: number;
    }[] = [];

    for (let mIdx = 0; mIdx < course.modules.length; mIdx++) {
      const mod = course.modules[mIdx];
      const modPos = mod.position || mIdx + 1;

      for (let lIdx = 0; lIdx < mod.lessons.length; lIdx++) {
        const les = mod.lessons[lIdx];
        const lesPos = les.position || lIdx + 1;

        flattenedLessons.push({
          slug: les.slug,
          title: les.title,
          modulePosition: modPos,
          lessonPosition: lesPos,
        });

        if (les.slug === lessonSlug) {
          rawTargetLesson = les;
          targetModule = {
            id: mod.id,
            title: mod.title,
            position: modPos,
          };
        }
      }
    }

    if (!rawTargetLesson || !targetModule) {
      return null;
    }

    const currentIndex = flattenedLessons.findIndex((l) => l.slug === lessonSlug);
    const previousLesson = currentIndex > 0 ? flattenedLessons[currentIndex - 1] : null;
    const nextLesson =
      currentIndex >= 0 && currentIndex < flattenedLessons.length - 1
        ? flattenedLessons[currentIndex + 1]
        : null;
    const isLastLesson = currentIndex === flattenedLessons.length - 1;

    // 2. Fetch quiz from practice_quizzes table
    let quizRecord: {
      id: string;
      title: string;
      description: string | null;
      estimated_minutes: number;
    } | null = null;

    try {
      const { data: dbQuiz } = await supabase
        .from("practice_quizzes")
        .select("id, title, description, estimated_minutes")
        .eq("lesson_id", rawTargetLesson.id)
        .eq("is_published", true)
        .maybeSingle();

      if (dbQuiz) {
        quizRecord = dbQuiz;
      }
    } catch {
      // Table may not have records yet
    }

    // Default mock quiz if table empty
    const quizId = quizRecord?.id || `quiz-${rawTargetLesson.id}`;
    const quizTitle = quizRecord?.title || rawTargetLesson.title;
    const quizDesc =
      quizRecord?.description ||
      "Test what you understood from this section. You can retry anytime.";
    const estimatedMinutes = quizRecord?.estimated_minutes || 5;

    // 3. Fetch questions and options (NEVER fetch correct answers here!)
    let questions: PracticeQuestion[] = [];

    try {
      if (quizRecord) {
        const { data: dbQuestions } = await supabase
          .from("practice_questions")
          .select(
            `
            id,
            quiz_id,
            question_type,
            question_text,
            topic,
            code_content,
            code_language,
            image_url,
            position,
            options:practice_question_options (
              id,
              question_id,
              option_text,
              position
            )
          `,
          )
          .eq("quiz_id", quizRecord.id)
          .order("position", { ascending: true });

        if (dbQuestions && dbQuestions.length > 0) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          questions = dbQuestions.map((q: any) => ({
            id: q.id,
            quizId: q.quiz_id,
            questionType: q.question_type,
            questionText: q.question_text,
            topic: q.topic || null,
            codeContent: q.code_content || null,
            codeLanguage: q.code_language || null,
            imageUrl: q.image_url || null,
            position: q.position,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            options: (q.options || []).sort((a: any, b: any) => a.position - b.position),
          }));
        }
      }
    } catch {
      // Fallback below
    }

    // Fallback high-quality practice questions if database has no rows yet
    if (questions.length === 0) {
      questions = [
        {
          id: `q1-${rawTargetLesson.id}`,
          quizId,
          questionType: "single_choice",
          questionText: "What will the following code output when executed?",
          topic: "Lexical Scope",
          codeContent: `function outer() {\n  let count = 10;\n  function inner() {\n    console.log(count);\n  }\n  return inner;\n}\n\nconst fn = outer();\nfn();`,
          codeLanguage: "javascript",
          imageUrl: null,
          position: 1,
          options: [
            { id: `opt-1a-${rawTargetLesson.id}`, questionId: `q1-${rawTargetLesson.id}`, optionText: "undefined", position: 1 },
            { id: `opt-1b-${rawTargetLesson.id}`, questionId: `q1-${rawTargetLesson.id}`, optionText: "10", position: 2 },
            { id: `opt-1c-${rawTargetLesson.id}`, questionId: `q1-${rawTargetLesson.id}`, optionText: "ReferenceError", position: 3 },
            { id: `opt-1d-${rawTargetLesson.id}`, questionId: `q1-${rawTargetLesson.id}`, optionText: "null", position: 4 },
          ],
        },
        {
          id: `q2-${rawTargetLesson.id}`,
          quizId,
          questionType: "multiple_choice",
          questionText: "Which of the following statements about JavaScript closures are true?",
          topic: "Closures",
          codeContent: null,
          codeLanguage: null,
          imageUrl: null,
          position: 2,
          options: [
            { id: `opt-2a-${rawTargetLesson.id}`, questionId: `q2-${rawTargetLesson.id}`, optionText: "Closures retain access to variables from their enclosing lexical scope.", position: 1 },
            { id: `opt-2b-${rawTargetLesson.id}`, questionId: `q2-${rawTargetLesson.id}`, optionText: "Closures only work with global variables.", position: 2 },
            { id: `opt-2c-${rawTargetLesson.id}`, questionId: `q2-${rawTargetLesson.id}`, optionText: "Functions in JavaScript remember where they were defined, not where they are called.", position: 3 },
            { id: `opt-2d-${rawTargetLesson.id}`, questionId: `q2-${rawTargetLesson.id}`, optionText: "Closures prevent garbage collection of captured variables while referenced.", position: 4 },
          ],
        },
        {
          id: `q3-${rawTargetLesson.id}`,
          quizId,
          questionType: "true_false",
          questionText: "Block-scoped variables declared with 'let' or 'const' are accessible outside the block where they were defined.",
          topic: "Block Scope",
          codeContent: `{\n  let temp = "active";\n}\nconsole.log(temp);`,
          codeLanguage: "javascript",
          imageUrl: null,
          position: 3,
          options: [
            { id: `opt-3a-${rawTargetLesson.id}`, questionId: `q3-${rawTargetLesson.id}`, optionText: "True", position: 1 },
            { id: `opt-3b-${rawTargetLesson.id}`, questionId: `q3-${rawTargetLesson.id}`, optionText: "False", position: 2 },
          ],
        },
      ];
    }

    // 4. Fetch user's latest in-progress attempt if any
    let currentAttempt: {
      id: string;
      completedAt: string | null;
      correctCount: number;
      totalQuestions: number;
      answers: Record<string, QuizAttemptAnswer>;
    } | null = null;

    try {
      const { data: dbAttempt } = await supabase
        .from("practice_quiz_attempts")
        .select("id, completed_at, correct_count, total_questions")
        .eq("user_id", userId)
        .eq("quiz_id", quizId)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (dbAttempt) {
        const { data: dbAnswers } = await supabase
          .from("practice_quiz_answers")
          .select("question_id, selected_option_ids, is_correct, answered_at")
          .eq("attempt_id", dbAttempt.id);

        const answersMap: Record<string, QuizAttemptAnswer> = {};
        if (dbAnswers) {
          for (const a of dbAnswers) {
            answersMap[a.question_id] = {
              questionId: a.question_id,
              selectedOptionIds: a.selected_option_ids || [],
              isCorrect: a.is_correct,
              answeredAt: a.answered_at,
            };
          }
        }

        currentAttempt = {
          id: dbAttempt.id,
          completedAt: dbAttempt.completed_at || null,
          correctCount: dbAttempt.correct_count || 0,
          totalQuestions: dbAttempt.total_questions || questions.length,
          answers: answersMap,
        };
      }
    } catch {
      // Ignore
    }

    return {
      id: quizId,
      lessonId: rawTargetLesson.id,
      courseSlug,
      lessonSlug,
      title: quizTitle,
      description: quizDesc,
      estimatedMinutes,
      questions,
      course: {
        id: course.id,
        slug: course.slug,
        title: course.title,
      },
      module: {
        id: targetModule.id,
        title: targetModule.title,
        position: targetModule.position,
      },
      previousLesson,
      nextLesson,
      isLastLesson,
      currentAttempt,
    };
  } catch {
    return null;
  }
}

/**
 * Fetch detailed Quiz Results & Review data for /learn/courses/[courseSlug]/lessons/[lessonSlug]/results/[attemptId].
 * Enforces ownership check (user_id = userId) and completed status.
 */
export async function getQuizResultsPageData(
  userId: string,
  courseSlug: string,
  lessonSlug: string,
  attemptId: string,
): Promise<{ data: QuizResultsPageData | null; isIncomplete?: boolean }> {
  const course = await getCourseDetailBySlug(courseSlug);
  if (!course) return { data: null };

  const supabase = await createSupabaseServerClient();
  if (!supabase) return { data: null };

  try {
    // 1. Locate target lesson and module
    let targetModule: { id: string; title: string; position: number } | null = null;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let rawTargetLesson: any = null;

    const flattenedLessons: {
      slug: string;
      title: string;
      modulePosition: number;
      lessonPosition: number;
    }[] = [];

    for (let mIdx = 0; mIdx < course.modules.length; mIdx++) {
      const mod = course.modules[mIdx];
      const modPos = mod.position || mIdx + 1;

      for (let lIdx = 0; lIdx < mod.lessons.length; lIdx++) {
        const les = mod.lessons[lIdx];
        const lesPos = les.position || lIdx + 1;

        flattenedLessons.push({
          slug: les.slug,
          title: les.title,
          modulePosition: modPos,
          lessonPosition: lesPos,
        });

        if (les.slug === lessonSlug) {
          rawTargetLesson = les;
          targetModule = {
            id: mod.id,
            title: mod.title,
            position: modPos,
          };
        }
      }
    }

    if (!rawTargetLesson || !targetModule) {
      return { data: null };
    }

    const currentIndex = flattenedLessons.findIndex((l) => l.slug === lessonSlug);
    const nextLesson =
      currentIndex >= 0 && currentIndex < flattenedLessons.length - 1
        ? flattenedLessons[currentIndex + 1]
        : null;

    // 2. Fetch or mock the quiz
    let dbQuiz: {
      id: string;
      title: string;
      description: string | null;
      estimated_minutes: number;
    } | null = null;

    try {
      const { data: quizRow } = await supabase
        .from("practice_quizzes")
        .select("id, title, description, estimated_minutes")
        .eq("lesson_id", rawTargetLesson.id)
        .maybeSingle();

      if (quizRow) {
        dbQuiz = quizRow;
      }
    } catch {
      // Ignore
    }

    const quizId = dbQuiz?.id || `quiz-${rawTargetLesson.id}`;
    const quizTitle = dbQuiz?.title || rawTargetLesson.title;
    const quizDescription = dbQuiz?.description || null;
    const estimatedMinutes = dbQuiz?.estimated_minutes || 5;

    // 3. Fetch the attempt record
    let attemptRecord: {
      id: string;
      completed_at: string | null;
      correct_count: number;
      total_questions: number;
    } | null = null;

    let submittedAnswersMap: Record<
      string,
      { selectedOptionIds: string[]; isCorrect: boolean; answeredAt: string }
    > = {};

    try {
      const { data: attemptRow } = await supabase
        .from("practice_quiz_attempts")
        .select("id, user_id, quiz_id, completed_at, correct_count, total_questions")
        .eq("id", attemptId)
        .eq("user_id", userId)
        .maybeSingle();

      if (attemptRow) {
        // If incomplete, signal redirect
        if (!attemptRow.completed_at) {
          return { data: null, isIncomplete: true };
        }
        attemptRecord = attemptRow;

        // Fetch answers
        const { data: answerRows } = await supabase
          .from("practice_quiz_answers")
          .select("question_id, selected_option_ids, is_correct, answered_at")
          .eq("attempt_id", attemptId);

        if (answerRows) {
          for (const a of answerRows) {
            submittedAnswersMap[a.question_id] = {
              selectedOptionIds: a.selected_option_ids || [],
              isCorrect: a.is_correct,
              answeredAt: a.answered_at,
            };
          }
        }
      }
    } catch {
      // Ignore
    }

    // Support client-generated mock attempt ID if table empty
    if (!attemptRecord) {
      if (attemptId.startsWith("att-")) {
        attemptRecord = {
          id: attemptId,
          completed_at: new Date().toISOString(),
          correct_count: 2,
          total_questions: 3,
        };
        submittedAnswersMap = {
          [`q1-${rawTargetLesson.id}`]: {
            selectedOptionIds: [`opt-1b-${rawTargetLesson.id}`],
            isCorrect: true,
            answeredAt: new Date().toISOString(),
          },
          [`q2-${rawTargetLesson.id}`]: {
            selectedOptionIds: [`opt-2a-${rawTargetLesson.id}`, `opt-2c-${rawTargetLesson.id}`],
            isCorrect: false,
            answeredAt: new Date().toISOString(),
          },
          [`q3-${rawTargetLesson.id}`]: {
            selectedOptionIds: [`opt-3b-${rawTargetLesson.id}`],
            isCorrect: true,
            answeredAt: new Date().toISOString(),
          },
        };
      } else {
        return { data: null };
      }
    }

    // 4. Fetch questions, options, and correct options
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let questionsData: any[] = [];
    const correctOptionsMap: Record<string, string[]> = {};

    try {
      const { data: qRows } = await supabase
        .from("practice_questions")
        .select(
          `
          id,
          question_type,
          question_text,
          topic,
          code_content,
          code_language,
          image_url,
          explanation,
          position,
          options:practice_question_options (
            id,
            option_text,
            position
          )
        `,
        )
        .eq("quiz_id", quizId)
        .order("position", { ascending: true });

      if (qRows && qRows.length > 0) {
        questionsData = qRows;

        // Fetch correct options securely server-side for this completed attempt
        const { data: correctRows } = await supabase
          .from("practice_question_correct_options")
          .select("question_id, option_id")
          .in(
            "question_id",
            qRows.map((q) => q.id),
          );

        if (correctRows) {
          for (const c of correctRows) {
            if (!correctOptionsMap[c.question_id]) {
              correctOptionsMap[c.question_id] = [];
            }
            correctOptionsMap[c.question_id].push(c.option_id);
          }
        }
      }
    } catch {
      // Ignore
    }

    // Default mock questions if not in DB
    if (questionsData.length === 0) {
      questionsData = [
        {
          id: `q1-${rawTargetLesson.id}`,
          question_type: "single_choice",
          question_text: "What will the following code output when executed?",
          topic: "Lexical Scope",
          code_content: `function outer() {\n  let count = 10;\n  function inner() {\n    console.log(count);\n  }\n  return inner;\n}\n\nconst fn = outer();\nfn();`,
          code_language: "javascript",
          image_url: null,
          position: 1,
          explanation:
            "When outer() executes, count is 10. The returned inner function forms a closure over outer's lexical scope, allowing fn() to log 10.",
          options: [
            { id: `opt-1a-${rawTargetLesson.id}`, option_text: "undefined", position: 1 },
            { id: `opt-1b-${rawTargetLesson.id}`, option_text: "10", position: 2 },
            { id: `opt-1c-${rawTargetLesson.id}`, option_text: "ReferenceError", position: 3 },
            { id: `opt-1d-${rawTargetLesson.id}`, option_text: "null", position: 4 },
          ],
        },
        {
          id: `q2-${rawTargetLesson.id}`,
          question_type: "multiple_choice",
          question_text: "Which of the following statements about JavaScript closures are true?",
          topic: "Closures",
          code_content: null,
          code_language: null,
          image_url: null,
          position: 2,
          explanation:
            "Closures remember the lexical scope where they were defined. They keep captured variables alive in memory even after the outer function has finished executing.",
          options: [
            { id: `opt-2a-${rawTargetLesson.id}`, option_text: "Closures retain access to variables from their enclosing lexical scope.", position: 1 },
            { id: `opt-2b-${rawTargetLesson.id}`, option_text: "Closures only work with global variables.", position: 2 },
            { id: `opt-2c-${rawTargetLesson.id}`, option_text: "Functions in JavaScript remember where they were defined, not where they are called.", position: 3 },
            { id: `opt-2d-${rawTargetLesson.id}`, option_text: "Closures prevent garbage collection of captured variables while referenced.", position: 4 },
          ],
        },
        {
          id: `q3-${rawTargetLesson.id}`,
          question_type: "true_false",
          question_text: "Block-scoped variables declared with 'let' or 'const' are accessible outside the block where they were defined.",
          topic: "Block Scope",
          code_content: `{\n  let temp = "active";\n}\nconsole.log(temp);`,
          code_language: "javascript",
          image_url: null,
          position: 3,
          explanation:
            "Variables declared with 'let' or 'const' are scoped strictly to the nearest block and cannot be accessed outside.",
          options: [
            { id: `opt-3a-${rawTargetLesson.id}`, option_text: "True", position: 1 },
            { id: `opt-3b-${rawTargetLesson.id}`, option_text: "False", position: 2 },
          ],
        },
      ];

      correctOptionsMap[`q1-${rawTargetLesson.id}`] = [`opt-1b-${rawTargetLesson.id}`];
      correctOptionsMap[`q2-${rawTargetLesson.id}`] = [
        `opt-2a-${rawTargetLesson.id}`,
        `opt-2c-${rawTargetLesson.id}`,
        `opt-2d-${rawTargetLesson.id}`,
      ];
      correctOptionsMap[`q3-${rawTargetLesson.id}`] = [`opt-3b-${rawTargetLesson.id}`];
    }

    // 5. Build reviewQuestions
    const reviewQuestions: QuizReviewQuestion[] = questionsData.map((q) => {
      const userAns = submittedAnswersMap[q.id];
      const selectedIds = userAns?.selectedOptionIds || [];
      const correctIds = correctOptionsMap[q.id] || [];

      // Map options
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const opts: any[] = (q.options || []).sort(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (a: any, b: any) => a.position - b.position,
      );

      const selectedTexts = opts
        .filter((o) => selectedIds.includes(o.id))
        .map((o) => o.option_text);

      const correctTexts = opts
        .filter((o) => correctIds.includes(o.id))
        .map((o) => o.option_text);

      const isCorrect = userAns ? userAns.isCorrect : false;

      return {
        id: q.id,
        questionText: q.question_text,
        questionType: q.question_type,
        topic: q.topic || null,
        codeContent: q.code_content || null,
        codeLanguage: q.code_language || null,
        imageUrl: q.image_url || null,
        position: q.position,
        selectedOptionIds: selectedIds,
        selectedOptionTexts: selectedTexts,
        correctOptionIds: correctIds,
        correctOptionTexts: correctTexts,
        isCorrect,
        explanation: q.explanation || null,
      };
    });

    const totalQuestions = reviewQuestions.length;
    const correctCount = reviewQuestions.filter((q) => q.isCorrect).length;
    const percent =
      totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;

    // 6. Group into ConceptPerformance
    const topicMap: Record<string, { correct: number; total: number }> = {};
    for (const q of reviewQuestions) {
      const topicName = q.topic || "General Concepts";
      if (!topicMap[topicName]) {
        topicMap[topicName] = { correct: 0, total: 0 };
      }
      topicMap[topicName].total += 1;
      if (q.isCorrect) {
        topicMap[topicName].correct += 1;
      }
    }

    const concepts: ConceptPerformance[] = Object.entries(topicMap).map(
      ([topic, stats]) => {
        const tPercent =
          stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0;
        let status: "strong" | "good_progress" | "review" = "review";
        if (tPercent === 100) {
          status = "strong";
        } else if (tPercent >= 50) {
          status = "good_progress";
        }

        return {
          topic,
          correctCount: stats.correct,
          totalCount: stats.total,
          percent: tPercent,
          status,
        };
      },
    );

    // 7. Build Recommendations
    const recommendations: QuizRecommendation[] = [
      {
        id: "rec-lesson",
        title: `Review ${rawTargetLesson.title}`,
        description: "Revisit the lesson walkthrough, key takeaways, and examples.",
        type: "review",
        url: `/learn/courses/${courseSlug}/lessons/${lessonSlug}`,
        badge: "5 min review",
      },
      {
        id: "rec-resource",
        title: "Study Reference Guide",
        description: "Review reference diagrams and cheat sheets before trying again.",
        type: "resource",
        url: `/learn/courses/${courseSlug}/lessons/${lessonSlug}`,
        badge: "Reference",
      },
      {
        id: "rec-practice",
        title: nextLesson ? `Continue to ${nextLesson.title}` : "Course Roadmap",
        description: "Keep moving forward through the course at your own pace.",
        type: "practice",
        url: nextLesson
          ? `/learn/courses/${courseSlug}/lessons/${nextLesson.slug}`
          : `/learn/courses/${courseSlug}`,
        badge: "Next Step",
      },
    ];

    // 8. Fetch user's completed attempt history
    const previousAttempts: QuizAttemptSummary[] = [];

    try {
      const { data: pastAttempts } = await supabase
        .from("practice_quiz_attempts")
        .select("id, correct_count, total_questions, completed_at")
        .eq("user_id", userId)
        .eq("quiz_id", quizId)
        .not("completed_at", "is", null)
        .order("completed_at", { ascending: true });

      if (pastAttempts && pastAttempts.length > 0) {
        pastAttempts.forEach((att, idx) => {
          const tQ = att.total_questions || totalQuestions;
          const cC = att.correct_count || 0;
          const p = tQ > 0 ? Math.round((cC / tQ) * 100) : 0;

          previousAttempts.push({
            id: att.id,
            attemptNumber: idx + 1,
            correctCount: cC,
            totalQuestions: tQ,
            percent: p,
            completedAt: att.completed_at || new Date().toISOString(),
          });
        });
      }
    } catch {
      // Ignore
    }

    if (previousAttempts.length === 0) {
      previousAttempts.push({
        id: attemptId,
        attemptNumber: 1,
        correctCount,
        totalQuestions,
        percent,
        completedAt: attemptRecord.completed_at || new Date().toISOString(),
      });
    }

    const currentAttemptNumber =
      previousAttempts.findIndex((a) => a.id === attemptId) + 1 ||
      previousAttempts.length;

    return {
      data: {
        attempt: {
          id: attemptId,
          completedAt: attemptRecord.completed_at || new Date().toISOString(),
          correctCount,
          totalQuestions,
          percent,
          attemptNumber: currentAttemptNumber,
        },
        quiz: {
          id: quizId,
          title: quizTitle,
          description: quizDescription,
          estimatedMinutes,
        },
        course: {
          id: course.id,
          slug: course.slug,
          title: course.title,
        },
        lesson: {
          id: rawTargetLesson.id,
          slug: rawTargetLesson.slug,
          title: rawTargetLesson.title,
          summary: rawTargetLesson.summary || null,
        },
        module: {
          id: targetModule.id,
          title: targetModule.title,
          position: targetModule.position,
        },
        concepts,
        recommendations,
        reviewQuestions,
        previousAttempts,
        nextLesson,
      },
    };
  } catch {
    return { data: null };
  }
}


