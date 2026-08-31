import {
  ALL_STATIC_LEARNING_PATHS,
  WEB_DEV_FOUNDATIONS_PATH,
} from "@/lib/data/static-learning-paths";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type {
  CourseDifficulty,
  LearningPathCourseItem,
  LearningPathDetail,
  LearningPathMilestone,
  LearningPathMilestoneStatus,
  LearningPathProjectItem,
} from "@/lib/types";

/**
 * Helper to enrich a LearningPathDetail with authenticated learner enrollment and progress data.
 */
async function enrichPathWithLearnerProgress(
  pathDetail: LearningPathDetail,
  userId: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  supabase: any,
): Promise<LearningPathDetail> {
  try {
    const courseItems = pathDetail.items.filter(
      (i): i is LearningPathCourseItem => i.itemType === "course",
    );

    let completedCourseCount = 0;
    let inProgressCourseCount = 0;
    let totalPercentSum = 0;
    let foundCurrentStep = false;
    let currentCourseTitle: string | null = null;

    for (let idx = 0; idx < pathDetail.items.length; idx++) {
      const item = pathDetail.items[idx];

      if (item.itemType === "course") {
        let status: LearningPathMilestoneStatus = "not_started";
        let completedLessons = 0;
        const totalLessons = item.lessonCount || 20;

        // Check course enrollment
        const { data: enrollment } = await supabase
          .from("course_enrollments")
          .select("id, status")
          .eq("user_id", userId)
          .eq("course_id", item.courseId)
          .maybeSingle();

        // Query completed lessons for this course
        const { count: completedCount } = await supabase
          .from("lesson_progress")
          .select("id", { count: "exact", head: true })
          .eq("user_id", userId)
          .eq("is_completed", true)
          .in(
            "lesson_id",
            (
              await supabase
                .from("lessons")
                .select("id")
                .in(
                  "module_id",
                  (
                    await supabase
                      .from("course_modules")
                      .select("id")
                      .eq("course_id", item.courseId)
                  ).data?.map((m: { id: string }) => m.id) ?? [],
                )
            ).data?.map((l: { id: string }) => l.id) ?? [],
          );

        completedLessons = completedCount ?? 0;

        if (
          enrollment?.status === "completed" ||
          (completedLessons > 0 && completedLessons >= totalLessons)
        ) {
          status = "completed";
          completedCourseCount++;
          totalPercentSum += 100;
        } else if (enrollment || completedLessons > 0) {
          status = "in_progress";
          inProgressCourseCount++;
          const pct = Math.round((completedLessons / totalLessons) * 100);
          totalPercentSum += pct;
          if (!currentCourseTitle) {
            currentCourseTitle = item.title;
          }
        } else {
          status = "not_started";
          if (!currentCourseTitle && inProgressCourseCount === 0) {
            currentCourseTitle = item.title;
          }
        }

        const progressPercent =
          status === "completed"
            ? 100
            : Math.round((completedLessons / totalLessons) * 100);

        let isCurrentStep = false;
        if (!foundCurrentStep && status !== "completed") {
          isCurrentStep = true;
          foundCurrentStep = true;
        }

        (item as LearningPathCourseItem).status = status;
        (item as LearningPathCourseItem).completedLessons = completedLessons;
        (item as LearningPathCourseItem).totalLessons = totalLessons;
        (item as LearningPathCourseItem).progressPercent = progressPercent;
        (item as LearningPathCourseItem).isCurrentStep = isCurrentStep;
      } else if (item.itemType === "project") {
        const allCoursesDone =
          courseItems.length > 0 &&
          completedCourseCount === courseItems.length;

        const isCurrentStep = !foundCurrentStep && allCoursesDone;
        (item as LearningPathProjectItem).status = allCoursesDone
          ? "in_progress"
          : "not_started";
        (item as LearningPathProjectItem).isCurrentStep = isCurrentStep;
      }
    }

    // Calculate path overall progress
    const totalCourses = courseItems.length;
    const overallPercent =
      totalCourses > 0
        ? Math.round(totalPercentSum / totalCourses)
        : 0;

    let pathStatus: LearningPathMilestoneStatus = "not_started";
    if (completedCourseCount === totalCourses && totalCourses > 0) {
      pathStatus = "completed";
    } else if (inProgressCourseCount > 0 || completedCourseCount > 0) {
      pathStatus = "in_progress";
    }

    const currentItem = pathDetail.items.find((i) => i.isCurrentStep);
    const currentStepNumber = currentItem ? currentItem.stepNumber : 1;

    pathDetail.learnerProgress = {
      completedCourses: completedCourseCount,
      totalCourses,
      inProgressCourses: inProgressCourseCount,
      overallPercent,
      currentStepNumber,
      pathStatus,
    };
  } catch (e) {
    console.warn("Error enriching path with learner progress:", e);
  }

  return pathDetail;
}

/**
 * Fetch detailed learning path by its slug, merging dynamic Supabase data,
 * course relationships, and individual learner progress when authenticated.
 */
export async function getLearningPathBySlug(
  slug: string,
  userId?: string | null,
): Promise<LearningPathDetail | null> {
  const cleanSlug = slug.trim().toLowerCase();
  const staticPath = ALL_STATIC_LEARNING_PATHS.find(
    (p) => p.slug === cleanSlug,
  );

  const supabase = await createSupabaseServerClient();

  let pathDetail: LearningPathDetail | null = null;

  if (supabase) {
    try {
      const { data: pathData, error: pathError } = await supabase
        .from("learning_paths")
        .select(
          `
          id,
          slug,
          title,
          subtitle,
          summary,
          description,
          difficulty,
          estimated_minutes,
          course_count,
          cover_image_url,
          is_published,
          items:learning_path_items(
            id,
            course_id,
            item_type,
            title,
            description,
            step_label,
            position,
            is_required,
            course:courses(
              id,
              slug,
              title,
              summary,
              difficulty,
              estimated_minutes,
              category:categories(name)
            )
          )
        `,
        )
        .eq("slug", cleanSlug)
        .eq("is_published", true)
        .single();

      if (pathData && !pathError) {
        const rawItems = Array.isArray(pathData.items) ? pathData.items : [];
        const sortedItems = [...rawItems].sort(
          (a, b) => (a.position ?? 0) - (b.position ?? 0),
        );

        let totalEstimatedMinutes = 0;

        const items: LearningPathMilestone[] = sortedItems.map(
          (rawItem, index) => {
            const isCourse = rawItem.item_type === "course" && rawItem.course;
            const courseObj = Array.isArray(rawItem.course)
              ? rawItem.course[0]
              : rawItem.course;

            if (isCourse && courseObj) {
              let lessonCount = 20;
              let iconName: "Code2" | "Palette" | "Braces" | "Rocket" = "Code2";
              let accentColor: "amber" | "cyan" | "gold" | "purple" = "amber";
              const estMins = Number(courseObj.estimated_minutes) || 90;
              totalEstimatedMinutes += estMins;

              if (courseObj.slug === "html-fundamentals") {
                lessonCount = 23;
                iconName = "Code2";
                accentColor = "amber";
              } else if (courseObj.slug === "css-fundamentals") {
                lessonCount = 18;
                iconName = "Palette";
                accentColor = "cyan";
              } else if (courseObj.slug === "javascript-fundamentals") {
                lessonCount = 17;
                iconName = "Braces";
                accentColor = "gold";
              }

              const categoryName =
                courseObj.category &&
                typeof courseObj.category === "object" &&
                "name" in courseObj.category
                  ? (courseObj.category.name as string)
                  : "Web Development";

              const courseItem: LearningPathCourseItem = {
                id: rawItem.id as string,
                itemType: "course",
                position: rawItem.position ?? index + 1,
                stepNumber: index + 1,
                stepLabel: rawItem.step_label || `STEP ${index + 1}`,
                courseId: courseObj.id as string,
                courseSlug: courseObj.slug as string,
                title: courseObj.title as string,
                description:
                  (rawItem.description as string) ||
                  (courseObj.summary as string) ||
                  "",
                iconName,
                accentColor,
                difficulty:
                  (courseObj.difficulty as CourseDifficulty) || "beginner",
                lessonCount,
                estimatedMinutes: estMins,
                categoryName,
              };
              return courseItem;
            } else {
              totalEstimatedMinutes += 30; // 30 min final project estimate
              const projectItem: LearningPathProjectItem = {
                id: rawItem.id as string,
                itemType: "project",
                position: rawItem.position ?? index + 1,
                stepNumber: index + 1,
                stepLabel: rawItem.step_label || "FINAL PROJECT",
                title:
                  (rawItem.title as string) ||
                  "Build an Interactive Personal Website",
                description:
                  (rawItem.description as string) ||
                  "Combine HTML structure, CSS styling, and JavaScript behavior into one complete frontend project.",
                iconName: "Rocket",
                accentColor: "purple",
                estimatedMinutes: 30,
                outcomes: [
                  "Semantic webpage structure with clean HTML5 markup",
                  "Responsive styling and reusable CSS layout classes",
                  "Interactive buttons and real-time DOM updates",
                  "Dynamic calculations and calculated output displays",
                  "Complete, shareable frontend portfolio project",
                ],
                projectUrl: "/courses/javascript-fundamentals",
              };
              return projectItem;
            }
          },
        );

        pathDetail = {
          id: pathData.id as string,
          slug: pathData.slug as string,
          title: pathData.title as string,
          subtitle:
            (pathData.subtitle as string) ||
            staticPath?.subtitle ||
            "Build the core skills you need to create modern interactive websites.",
          description:
            (pathData.description as string) ||
            staticPath?.description ||
            "",
          difficulty: (pathData.difficulty as CourseDifficulty) || "beginner",
          estimatedMinutes:
            totalEstimatedMinutes > 0
              ? totalEstimatedMinutes
              : Number(pathData.estimated_minutes) ||
                staticPath?.estimatedMinutes ||
                335,
          courseCount:
            items.filter((i) => i.itemType === "course").length ||
            Number(pathData.course_count) ||
            3,
          isPublished: pathData.is_published !== false,
          coverImageUrl: (pathData.cover_image_url as string) ?? null,
          items: items.length > 0 ? items : (staticPath?.items ?? []),
          skills: staticPath?.skills ?? [
            "HTML",
            "CSS",
            "JavaScript",
            "Semantic HTML",
            "Web Styling",
            "Responsive Design",
            "DOM Manipulation",
            "Frontend Development",
          ],
          capabilities: staticPath?.capabilities ?? [
            {
              title: "Structured Websites",
              description:
                "Build accessible page structures with semantic HTML5 elements.",
              iconName: "LayoutTemplate",
            },
            {
              title: "Responsive Interfaces",
              description:
                "Style polished layouts that work across all screen sizes.",
              iconName: "PanelsTopLeft",
            },
            {
              title: "Interactive Experiences",
              description:
                "Add dynamic behavior and browser event handling with JavaScript.",
              iconName: "MousePointerClick",
            },
            {
              title: "Complete Frontend Project",
              description:
                "Combine all three technologies in one final portfolio project.",
              iconName: "Rocket",
            },
          ],
        };
      }
    } catch (e) {
      console.warn("Could not query learning_paths from Supabase, using fallback:", e);
    }
  }

  // Fallback to static definition if not retrieved from DB
  if (!pathDetail) {
    if (cleanSlug === "web-development-foundations") {
      pathDetail = JSON.parse(JSON.stringify(WEB_DEV_FOUNDATIONS_PATH));
    } else if (staticPath) {
      pathDetail = JSON.parse(JSON.stringify(staticPath));
    }
  }

  if (!pathDetail) return null;

  if (userId && supabase) {
    pathDetail = await enrichPathWithLearnerProgress(pathDetail, userId, supabase);
  }

  return pathDetail;
}

/**
 * Fetch all published learning paths for the explorer page.
 */
export async function getAllPublishedLearningPaths(
  userId?: string | null,
): Promise<LearningPathDetail[]> {
  const supabase = await createSupabaseServerClient();
  const results: LearningPathDetail[] = [];

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("learning_paths")
        .select("slug")
        .eq("is_published", true)
        .order("position", { ascending: true });

      if (data && !error && data.length > 0) {
        for (const row of data) {
          const detail = await getLearningPathBySlug(row.slug, userId);
          if (detail && detail.isPublished) {
            results.push(detail);
          }
        }
      }
    } catch (e) {
      console.warn("Could not query published learning paths from Supabase:", e);
    }
  }

  // Fallback to static paths if no database results
  if (results.length === 0) {
    for (const staticPath of ALL_STATIC_LEARNING_PATHS) {
      const pathCopy = JSON.parse(JSON.stringify(staticPath));
      if (userId && supabase) {
        results.push(await enrichPathWithLearnerProgress(pathCopy, userId, supabase));
      } else {
        results.push(pathCopy);
      }
    }
  }

  return results;
}
