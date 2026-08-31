import { getCatalogCourses, getCategories } from "@/lib/queries";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type {
  CourseDifficulty,
  CourseSummary,
  SavedCourseItem,
  SavedCoursesPageData,
} from "@/lib/types";

export interface SavedCoursesFilterParams {
  q?: string;
  category?: string;
  difficulty?: string;
  sort?: string;
}

export async function getSavedCoursesPageData(
  userId: string,
  params: SavedCoursesFilterParams = {},
): Promise<SavedCoursesPageData | null> {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return null;

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user || user.id !== userId) return null;

    const categories = await getCategories();
    const categoryMap = new Map(categories.map((c) => [c.id, c]));

    // 1. Fetch saved courses from saved_courses table
    let savedRows: {
      id: string;
      course_id: string;
      created_at: string;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      course?: any;
    }[] = [];

    try {
      const { data: rows } = await supabase
        .from("saved_courses")
        .select(
          `
          id,
          course_id,
          created_at,
          course:courses (
            id,
            slug,
            title,
            summary,
            cover_image_url,
            difficulty,
            estimated_minutes,
            is_published,
            category_id,
            created_at,
            modules:course_modules (
              lessons (id)
            )
          )
        `,
        )
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (rows) {
        // Filter only published courses
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        savedRows = rows.filter((r: any) => r.course && r.course.is_published);
      }
    } catch {
      // Ignore
    }

    // 2. Fetch enrollments for this user
    const enrollmentMap = new Map<string, string>();
    try {
      const { data: enrollments } = await supabase
        .from("course_enrollments")
        .select("course_id, status")
        .eq("user_id", userId);

      if (enrollments) {
        for (const e of enrollments) {
          enrollmentMap.set(e.course_id, e.status);
        }
      }
    } catch {
      // Ignore
    }

    // 3. Fetch completed lesson progress counts
    const completedProgressMap = new Map<string, number>();
    try {
      const { data: progressRows } = await supabase
        .from("lesson_progress")
        .select("course_id, completed")
        .eq("user_id", userId)
        .eq("completed", true);

      if (progressRows) {
        for (const p of progressRows) {
          const current = completedProgressMap.get(p.course_id) || 0;
          completedProgressMap.set(p.course_id, current + 1);
        }
      }
    } catch {
      // Ignore
    }

    // 4. Build transformed SavedCourseItem array
    const allSavedItems: SavedCourseItem[] = savedRows.map((r) => {
      const c = r.course;
      const cat = c.category_id ? categoryMap.get(c.category_id) : null;

      // Count lessons
      let lessonCount = 0;
      if (c.modules && Array.isArray(c.modules)) {
        for (const m of c.modules) {
          if (m.lessons && Array.isArray(m.lessons)) {
            lessonCount += m.lessons.length;
          }
        }
      }

      const rawStatus = enrollmentMap.get(c.id);
      let enrollmentStatus: "not_started" | "active" | "completed" = "not_started";
      if (rawStatus === "completed") {
        enrollmentStatus = "completed";
      } else if (rawStatus === "active") {
        enrollmentStatus = "active";
      }

      const completedCount = completedProgressMap.get(c.id) || 0;
      const progressPercent =
        lessonCount > 0
          ? Math.min(100, Math.round((completedCount / lessonCount) * 100))
          : 0;

      return {
        id: r.id,
        courseId: c.id,
        courseSlug: c.slug,
        courseTitle: c.title,
        shortDescription: c.summary || null,
        thumbnailUrl: c.cover_image_url || null,
        categoryName: cat?.name || null,
        categorySlug: cat?.slug || null,
        difficulty: (c.difficulty as CourseDifficulty) || "beginner",
        estimatedMinutes: c.estimated_minutes || 0,
        lessonCount,
        savedAt: r.created_at,
        enrollmentStatus,
        completedLessonsCount: completedCount,
        totalLessonsCount: lessonCount,
        progressPercent,
      };
    });

    const totalSavedCount = allSavedItems.length;

    // 5. Apply Search & Filter & Sort
    const query = params.q?.trim().toLowerCase() || "";
    const selectedCategory = params.category?.trim().toLowerCase() || "";
    const selectedDifficulty = params.difficulty?.trim().toLowerCase() || "";
    const selectedSort = params.sort || "recently_saved";

    let filtered = allSavedItems;

    // Search query
    if (query) {
      filtered = filtered.filter(
        (item) =>
          item.courseTitle.toLowerCase().includes(query) ||
          (item.shortDescription &&
            item.shortDescription.toLowerCase().includes(query)) ||
          (item.categoryName && item.categoryName.toLowerCase().includes(query)) ||
          item.difficulty.toLowerCase().includes(query),
      );
    }

    // Category filter
    if (selectedCategory && selectedCategory !== "all") {
      filtered = filtered.filter(
        (item) =>
          item.categorySlug === selectedCategory ||
          item.categoryName?.toLowerCase() === selectedCategory,
      );
    }

    // Difficulty filter
    if (selectedDifficulty && selectedDifficulty !== "all") {
      filtered = filtered.filter(
        (item) => item.difficulty.toLowerCase() === selectedDifficulty,
      );
    }

    // Sorting
    filtered.sort((a, b) => {
      if (selectedSort === "course_name") {
        return a.courseTitle.localeCompare(b.courseTitle);
      }
      if (selectedSort === "newest") {
        return new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime();
      }
      // default: recently_saved
      return new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime();
    });

    // 6. Fetch Recommendations (up to 3 published courses not in saved list)
    const savedCourseIds = new Set(allSavedItems.map((s) => s.courseId));
    let recommendations: CourseSummary[] = [];

    try {
      const catalogResult = await getCatalogCourses({}, 6);
      recommendations = catalogResult.courses
        .filter((c: CourseSummary) => !savedCourseIds.has(c.id))
        .slice(0, 3);
    } catch {
      // Ignore
    }

    return {
      courses: filtered,
      totalSavedCount,
      categories,
      recommendations,
      query,
      selectedCategory,
      selectedDifficulty,
      selectedSort,
    };
  } catch {
    return null;
  }
}
