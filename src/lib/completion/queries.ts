import { createSupabaseServerClient } from "@/lib/supabase/server";
import { ALL_STATIC_COURSES, ALL_LESSON_DETAILS_MAP } from "@/lib/data/static-courses";
import { ALL_STATIC_QUIZZES } from "@/lib/data/static-quizzes";
import {
  ALL_STATIC_LEARNING_PATHS,
  WEB_DEV_FOUNDATIONS_PATH,
} from "@/lib/data/static-learning-paths";
import type { CourseCompletionData, LearningPathCompletionData } from "./types";

/**
 * Check completion state for a course.
 */
export async function getCourseCompletionState(
  userId: string,
  courseIdOrSlug: string,
): Promise<{
  isComplete: boolean;
  completedRequired: number;
  totalRequired: number;
  completedAt: string | null;
}> {
  const supabase = await createSupabaseServerClient();

  const staticCourse = ALL_STATIC_COURSES.find(
    (c) => c.id === courseIdOrSlug || c.slug === courseIdOrSlug,
  );

  if (!supabase) {
    if (!staticCourse) {
      return { isComplete: false, completedRequired: 0, totalRequired: 0, completedAt: null };
    }
    const requiredLessons = staticCourse.modules.flatMap((m) =>
      m.lessons.filter((l) => !l.isBonus && l.isPublished !== false),
    );
    return {
      isComplete: false,
      completedRequired: 0,
      totalRequired: requiredLessons.length,
      completedAt: null,
    };
  }

  try {
    // 1. Resolve course
    let targetCourseId = staticCourse?.id;
    let targetCourseSlug = staticCourse?.slug;

    if (!targetCourseId) {
      const { data: dbCourse } = await supabase
        .from("courses")
        .select("id, slug")
        .or(`id.eq.${courseIdOrSlug},slug.eq.${courseIdOrSlug}`)
        .maybeSingle();

      if (dbCourse) {
        targetCourseId = dbCourse.id;
        targetCourseSlug = dbCourse.slug;
      }
    }

    if (!targetCourseId) {
      return { isComplete: false, completedRequired: 0, totalRequired: 0, completedAt: null };
    }

    // 2. Fetch enrollment status
    const { data: enrollment } = await supabase
      .from("course_enrollments")
      .select("status, completed_at")
      .eq("user_id", userId)
      .eq("course_id", targetCourseId)
      .maybeSingle();

    // 3. Fetch required lessons
    const { data: dbModules } = await supabase
      .from("course_modules")
      .select(`
        id,
        lessons (
          id,
          is_bonus,
          is_published
        )
      `)
      .eq("course_id", targetCourseId);

    const requiredIds: string[] = [];
    if (dbModules && dbModules.length > 0) {
      for (const m of dbModules) {
        if (Array.isArray(m.lessons)) {
          for (const l of m.lessons) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const les = l as any;
            if (!les.is_bonus && les.is_published !== false) {
              requiredIds.push(les.id);
            }
          }
        }
      }
    } else if (staticCourse) {
      for (const m of staticCourse.modules) {
        for (const l of m.lessons) {
          if (!l.isBonus && l.isPublished !== false) {
            requiredIds.push(l.id);
          }
        }
      }
    }

    const totalRequired = requiredIds.length;
    let completedRequired = 0;

    if (totalRequired > 0) {
      const { count } = await supabase
        .from("lesson_progress")
        .select("id", { count: "exact", head: true })
        .eq("user_id", userId)
        .eq("course_id", targetCourseId)
        .eq("completed", true)
        .in("lesson_id", requiredIds);

      completedRequired = count ?? 0;
    }

    const isComplete =
      enrollment?.status === "completed" ||
      (totalRequired > 0 && completedRequired >= totalRequired);

    return {
      isComplete,
      completedRequired,
      totalRequired,
      completedAt: isComplete ? enrollment?.completed_at || null : null,
    };
  } catch (e) {
    console.error("[getCourseCompletionState] Error:", e);
    return { isComplete: false, completedRequired: 0, totalRequired: 0, completedAt: null };
  }
}

/**
 * Fetch full Course Completion Summary data for a learner.
 */
export async function getCourseCompletionData(
  userId: string,
  courseSlug: string,
): Promise<CourseCompletionData | null> {
  const cleanSlug = courseSlug.trim().toLowerCase();
  const staticCourse = ALL_STATIC_COURSES.find((c) => c.slug === cleanSlug);

  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    if (!staticCourse) return null;
    return buildStaticCourseCompletionFallback(staticCourse);
  }

  try {
    // 1. Fetch Course details, modules, lessons, outcomes, and path relationship
    const { data: dbCourse } = await supabase
      .from("courses")
      .select(`
        id,
        slug,
        title,
        summary,
        description,
        difficulty,
        estimated_minutes,
        cover_image_url,
        category:categories (name),
        outcomes:course_learning_outcomes (outcome_text, position),
        modules:course_modules (
          id,
          title,
          description,
          position,
          lessons (
            id,
            slug,
            title,
            lesson_type,
            position,
            is_bonus,
            is_published,
            estimated_minutes
          )
        )
      `)
      .eq("slug", cleanSlug)
      .maybeSingle();

    const courseId = dbCourse?.id || staticCourse?.id;
    if (!courseId) return null;

    const courseTitle = dbCourse?.title || staticCourse?.title || "Course";
    const courseSummary = dbCourse?.summary || staticCourse?.summary || "";
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const difficulty = (dbCourse?.difficulty || staticCourse?.difficulty || "beginner") as any;
    const estimatedMinutes = dbCourse?.estimated_minutes || staticCourse?.estimatedMinutes || 60;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const coverImageUrl = dbCourse?.cover_image_url || (staticCourse as any)?.thumbnailUrl || (staticCourse as any)?.coverImageUrl;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const categoryName = (dbCourse?.category as any)?.name || staticCourse?.category?.name;

    // 2. Fetch Enrollment
    const { data: enrollment } = await supabase
      .from("course_enrollments")
      .select("status, completed_at")
      .eq("user_id", userId)
      .eq("course_id", courseId)
      .maybeSingle();

    // 3. Fetch all Lesson Progress for this user
    const { data: userProgress } = await supabase
      .from("lesson_progress")
      .select("lesson_id, completed, completed_at")
      .eq("user_id", userId)
      .eq("course_id", courseId);

    const progressMap = new Map<string, { completed: boolean; completedAt: string | null }>();
    if (userProgress) {
      for (const p of userProgress) {
        progressMap.set(p.lesson_id, { completed: Boolean(p.completed), completedAt: p.completed_at });
      }
    }

    // 4. Parse Modules & Lessons
    const rawModules = dbCourse?.modules && dbCourse.modules.length > 0
      ? dbCourse.modules
      : staticCourse?.modules || [];

    let totalRequiredLessons = 0;
    let completedRequiredLessons = 0;
    let totalPractices = 0;
    let completedPractices = 0;
    let totalKnowledgeChecks = 0;
    let completedKnowledgeChecks = 0;

    const bonusLessons: { id: string; title: string; slug: string; isCompleted: boolean }[] = [];

    const moduleSummaries: CourseCompletionData["moduleSummaries"] = [];
    const quizReviewList: {
      moduleId: string;
      moduleTitle: string;
      modulePosition: number;
      quizTitle: string;
      lessonId: string;
      lessonSlug: string;
      isCompleted: boolean;
    }[] = [];

    // Sort modules by position
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const sortedModules = [...rawModules].sort((a: any, b: any) => a.position - b.position);

    for (const m of sortedModules) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const mLessons = Array.isArray(m.lessons) ? [...m.lessons].sort((a: any, b: any) => a.position - b.position) : [];

      let mRequiredCount = 0;
      let mCompletedRequiredCount = 0;
      let mPracticeCount = 0;
      let mQuizCount = 0;

      for (const l of mLessons) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const isBonus = Boolean((l as any).is_bonus || (l as any).isBonus);
        const lProg = progressMap.get(l.id);
        const isCompleted = Boolean(lProg?.completed);

        if (isBonus) {
          bonusLessons.push({
            id: l.id,
            title: l.title,
            slug: l.slug,
            isCompleted,
          });
          continue;
        }

        totalRequiredLessons++;
        mRequiredCount++;
        if (isCompleted) {
          completedRequiredLessons++;
          mCompletedRequiredCount++;
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const lType = (l as any).lesson_type || (l as any).lessonType;
        if (lType === "practice") {
          totalPractices++;
          mPracticeCount++;
          if (isCompleted) completedPractices++;
        } else if (lType === "knowledge_check" || lType === "quiz") {
          totalKnowledgeChecks++;
          mQuizCount++;
          if (isCompleted) completedKnowledgeChecks++;

          quizReviewList.push({
            moduleId: m.id,
            moduleTitle: m.title,
            modulePosition: m.position,
            quizTitle: l.title,
            lessonId: l.id,
            lessonSlug: l.slug,
            isCompleted,
          });
        }
      }

      const isModuleCompleted = mRequiredCount > 0 && mCompletedRequiredCount >= mRequiredCount;

      moduleSummaries.push({
        id: m.id,
        position: m.position,
        title: m.title,
        description: m.description,
        lessonCount: mLessons.length,
        practiceCount: mPracticeCount,
        quizCount: mQuizCount,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        isBonus: Boolean((m as any).isBonus || (m as any).is_bonus),
        isCompleted: isModuleCompleted,
        firstLessonSlug: mLessons[0]?.slug,
      });
    }

    const completedModules = moduleSummaries.filter((m) => m.isCompleted && !m.isBonus).length;
    const isCompleted =
      enrollment?.status === "completed" ||
      (totalRequiredLessons > 0 && completedRequiredLessons >= totalRequiredLessons);

    const completedAt = isCompleted ? enrollment?.completed_at || new Date().toISOString() : null;

    // 5. Fetch Quiz Attempts & Missed Question Topics
    const quizReviews: CourseCompletionData["quizReviews"] = [];
    const missedTopicsMap = new Map<string, number>();

    for (const qr of quizReviewList) {
      let latestAttempt: CourseCompletionData["quizReviews"][0]["latestAttempt"] = null;

      try {
        // Query practice_quizzes for lesson
        const { data: dbQuiz } = await supabase
          .from("practice_quizzes")
          .select("id")
          .eq("lesson_id", qr.lessonId)
          .maybeSingle();

        const quizId = dbQuiz?.id;

        if (quizId) {
          const { data: attempt } = await supabase
            .from("practice_quiz_attempts")
            .select("id, correct_count, total_questions, completed_at")
            .eq("user_id", userId)
            .eq("quiz_id", quizId)
            .order("created_at", { ascending: false })
            .limit(1)
            .maybeSingle();

          if (attempt) {
            latestAttempt = {
              correctCount: attempt.correct_count ?? 0,
              totalQuestions: attempt.total_questions ?? 5,
              completedAt: attempt.completed_at,
            };

            // Query incorrect answers
            const { data: answers } = await supabase
              .from("practice_quiz_answers")
              .select("question_id, is_correct")
              .eq("attempt_id", attempt.id)
              .eq("is_correct", false);

            if (answers && answers.length > 0) {
              const qIds = answers.map((a) => a.question_id);
              const { data: questions } = await supabase
                .from("practice_questions")
                .select("id, topic")
                .in("id", qIds);

              if (questions) {
                for (const q of questions) {
                  if (q.topic) {
                    missedTopicsMap.set(q.topic, (missedTopicsMap.get(q.topic) || 0) + 1);
                  }
                }
              }
            }
          }
        }
      } catch {
        // Fallback below
      }

      // If no attempt record in DB but static quiz exists
      if (!latestAttempt) {
        const staticQuiz = ALL_STATIC_QUIZZES[qr.lessonSlug];
        if (staticQuiz && qr.isCompleted) {
          latestAttempt = {
            correctCount: staticQuiz.questions.length,
            totalQuestions: staticQuiz.questions.length,
            completedAt: completedAt,
          };
        }
      }

      quizReviews.push({
        moduleId: qr.moduleId,
        moduleTitle: qr.moduleTitle,
        modulePosition: qr.modulePosition,
        quizTitle: qr.quizTitle,
        lessonSlug: qr.lessonSlug,
        isCompleted: qr.isCompleted,
        latestAttempt,
      });
    }

    // Map missed topics to recommended lessons
    const topicsToReview: CourseCompletionData["topicsToReview"] = [];
    for (const [topic, missedCount] of missedTopicsMap.entries()) {
      // Find a lesson that matches this topic
      let recSlug: string | undefined;
      let recTitle: string | undefined;

      const staticDetailEntry = Object.entries(ALL_LESSON_DETAILS_MAP).find(([_, details]) =>
        details.summary.toLowerCase().includes(topic.toLowerCase()) ||
        details.keyTakeaway.toLowerCase().includes(topic.toLowerCase()),
      );

      if (staticDetailEntry) {
        recSlug = staticDetailEntry[0];
      }

      topicsToReview.push({
        topic,
        missedCount,
        recommendedLessonSlug: recSlug,
        recommendedLessonTitle: recTitle,
      });
    }

    // 6. Fetch Learner Notes & Bookmarks for this course
    let notesCount = 0;
    const recentNotes: CourseCompletionData["recentNotes"] = [];

    try {
      const { data: dbNotes, count: nTotal } = await supabase
        .from("lesson_notes")
        .select(
          `
          id,
          content,
          updated_at,
          lesson:lessons (slug, title)
        `,
          { count: "exact" },
        )
        .eq("user_id", userId)
        .eq("course_id", courseId)
        .order("updated_at", { ascending: false });

      notesCount = nTotal ?? 0;
      if (dbNotes) {
        for (const n of dbNotes.slice(0, 3)) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const les = (Array.isArray(n.lesson) ? n.lesson[0] : n.lesson) as any;
          if (les) {
            recentNotes.push({
              id: n.id,
              lessonTitle: les.title,
              lessonSlug: les.slug,
              content: n.content,
              updatedAt: n.updated_at,
            });
          }
        }
      }
    } catch {
      // Ignore
    }

    let bookmarksCount = 0;
    const recentBookmarks: CourseCompletionData["recentBookmarks"] = [];

    try {
      const { data: dbBookmarks, count: bTotal } = await supabase
        .from("lesson_bookmarks")
        .select(
          `
          id,
          lesson:lessons (
            slug,
            title,
            module:course_modules (title)
          )
        `,
          { count: "exact" },
        )
        .eq("user_id", userId)
        .eq("course_id", courseId)
        .order("created_at", { ascending: false });

      bookmarksCount = bTotal ?? 0;
      if (dbBookmarks) {
        for (const b of dbBookmarks.slice(0, 3)) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const les = (Array.isArray(b.lesson) ? b.lesson[0] : b.lesson) as any;
          if (les) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const mod = (Array.isArray(les.module) ? les.module[0] : les.module) as any;
            recentBookmarks.push({
              id: b.id,
              lessonTitle: les.title,
              lessonSlug: les.slug,
              moduleTitle: mod?.title,
            });
          }
        }
      }
    } catch {
      // Ignore
    }

    // 7. Learning Outcomes
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const learningOutcomes: string[] = (dbCourse?.outcomes || [])
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .sort((a: any, b: any) => a.position - b.position)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .map((o: any) => o.outcome_text);

    if (learningOutcomes.length === 0 && staticCourse) {
      learningOutcomes.push(...staticCourse.learningOutcomes);
    }

    // 8. Determine Where To Go Next from Learning Path relationships
    const nextStep = await resolveNextStepForCourse(userId, cleanSlug, courseId, supabase);

    return {
      courseId,
      courseSlug: cleanSlug,
      courseTitle,
      courseSummary,
      coverImageUrl,
      difficulty,
      estimatedMinutes,
      categoryName,

      isCompleted,
      completedAt,

      totalRequiredLessons,
      completedRequiredLessons,
      totalModules: moduleSummaries.filter((m) => !m.isBonus).length,
      completedModules,
      totalPractices,
      completedPractices,
      totalKnowledgeChecks,
      completedKnowledgeChecks,
      notesCount,
      bookmarksCount,

      learningOutcomes,
      moduleSummaries,
      quizReviews,
      topicsToReview,
      recentNotes,
      recentBookmarks,
      recentPractices: [],
      bonusLessons,
      nextStep,
    };
  } catch (error) {
    console.error("[getCourseCompletionData] Error fetching completion data:", error);
    if (!staticCourse) return null;
    return buildStaticCourseCompletionFallback(staticCourse);
  }
}

/**
 * Resolve the next logical step in learning path sequence or catalog.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function resolveNextStepForCourse(
  userId: string,
  courseSlug: string,
  courseId: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  supabase: any,
): Promise<CourseCompletionData["nextStep"]> {
  const path = WEB_DEV_FOUNDATIONS_PATH;

  // Check if course is in Web Dev Foundations path
  const currentItemIndex = path.items.findIndex(
    (i) => i.itemType === "course" && i.courseSlug === courseSlug,
  );

  if (currentItemIndex !== -1) {
    // Check remaining items in path
    const remainingItems = path.items.slice(currentItemIndex + 1);

    for (const nextItem of remainingItems) {
      if (nextItem.itemType === "course" && nextItem.courseSlug) {
        const nextCourseState = await getCourseCompletionState(userId, nextItem.courseSlug);
        if (!nextCourseState.isComplete) {
          const isStarted = nextCourseState.completedRequired > 0;
          return {
            type: "path_course",
            title: nextItem.title,
            description: nextItem.description,
            ctaText: isStarted ? `Continue ${nextItem.title}` : `Start ${nextItem.title}`,
            href: `/learn/courses/${nextItem.courseSlug}`,
            pathTitle: path.title,
            pathSlug: path.slug,
            status: isStarted ? "in_progress" : "not_started",
          };
        }
      } else if (nextItem.itemType === "project") {
        // Project milestone
        return {
          type: "path_project",
          title: nextItem.title,
          description: nextItem.description,
          ctaText: "Start Final Project",
          href: nextItem.projectUrl || `/courses/${courseSlug}`,
          pathTitle: path.title,
          pathSlug: path.slug,
          status: "not_started",
        };
      }
    }

    // All path items complete
    return {
      type: "path_summary",
      title: path.title,
      description: "You completed all courses and milestones in this learning path!",
      ctaText: "View Learning Path Summary",
      href: `/learn/learning-paths/${path.slug}/complete`,
      pathTitle: path.title,
      pathSlug: path.slug,
      status: "completed",
    };
  }

  // Fallback if course not in path
  return {
    type: "explore_catalog",
    title: "Explore More Courses",
    description: "Discover new topics and continue expanding your development skills.",
    ctaText: "Explore Courses",
    href: "/courses",
  };
}

/**
 * Fetch full Learning Path Completion Summary data for an authenticated learner.
 */
export async function getLearningPathCompletionData(
  userId: string,
  pathSlug: string,
): Promise<LearningPathCompletionData | null> {
  const cleanSlug = pathSlug.trim().toLowerCase();
  const path = ALL_STATIC_LEARNING_PATHS.find((p) => p.slug === cleanSlug) || WEB_DEV_FOUNDATIONS_PATH;
  if (!path) return null;

  const supabase = await createSupabaseServerClient();

  try {
    let completedRequiredCourses = 0;
    let completedRequiredProjects = 0;
    let totalModulesCompleted = 0;
    let totalPracticesCompleted = 0;
    let totalKnowledgeChecksCompleted = 0;

    const roadmapJourney: LearningPathCompletionData["roadmapJourney"] = [];
    const pathKnowledgeSummary: LearningPathCompletionData["pathKnowledgeSummary"] = [];
    let latestCompletionDate: string | null = null;

    const courseItems = path.items.filter((i) => i.itemType === "course");
    const projectItems = path.items.filter((i) => i.itemType === "project");

    for (const item of path.items) {
      if (item.itemType === "course" && item.courseSlug) {
        const completionState = await getCourseCompletionState(userId, item.courseSlug);
        const isCourseDone = completionState.isComplete;

        if (isCourseDone) {
          completedRequiredCourses++;
          if (completionState.completedAt) {
            if (!latestCompletionDate || new Date(completionState.completedAt) > new Date(latestCompletionDate)) {
              latestCompletionDate = completionState.completedAt;
            }
          }
        }

        // Fetch detailed course completion data for counts
        const courseData = await getCourseCompletionData(userId, item.courseSlug);
        if (courseData) {
          totalModulesCompleted += courseData.completedModules;
          totalPracticesCompleted += courseData.completedPractices;
          totalKnowledgeChecksCompleted += courseData.completedKnowledgeChecks;

          pathKnowledgeSummary.push({
            courseTitle: item.title,
            courseSlug: item.courseSlug,
            checksCompleted: courseData.completedKnowledgeChecks,
            totalChecks: courseData.totalKnowledgeChecks,
          });
        }

        roadmapJourney.push({
          id: item.id,
          itemType: "course",
          stepNumber: item.stepNumber,
          stepLabel: item.stepLabel,
          title: item.title,
          description: item.description,
          accentColor: item.accentColor,
          iconName: item.iconName,
          isCompleted: isCourseDone,
          href: `/learn/courses/${item.courseSlug}/complete`,
          courseSlug: item.courseSlug,
          lessonCount: item.lessonCount,
          difficulty: item.difficulty,
        });
      } else if (item.itemType === "project") {
        // Project milestone
        const allCoursesDone = completedRequiredCourses >= courseItems.length && courseItems.length > 0;
        // Project milestone is complete when capstone / all courses are complete
        const isProjectDone = allCoursesDone;
        if (isProjectDone) {
          completedRequiredProjects++;
        }

        roadmapJourney.push({
          id: item.id,
          itemType: "project",
          stepNumber: item.stepNumber,
          stepLabel: item.stepLabel,
          title: item.title,
          description: item.description,
          accentColor: item.accentColor,
          iconName: item.iconName,
          isCompleted: isProjectDone,
          href: item.projectUrl || `/courses/javascript-fundamentals`,
          milestoneCount: 6,
        });
      }
    }

    const isPathComplete =
      completedRequiredCourses >= courseItems.length &&
      (projectItems.length === 0 || completedRequiredProjects >= projectItems.length);

    // Deduplicate skills across path
    const skillsSet = new Set<string>();
    for (const s of path.skills) {
      skillsSet.add(s);
    }
    const skillsCovered = Array.from(skillsSet);

    // Final project summary
    const projectItem = projectItems[0];
    const projectSummary = projectItem ? {
      title: projectItem.title,
      description: projectItem.description,
      isCompleted: isPathComplete,
      milestonesCompleted: 6,
      totalMilestones: 6,
      href: projectItem.projectUrl || "/courses/javascript-fundamentals",
    } : null;

    return {
      pathId: path.id,
      pathSlug: path.slug,
      pathTitle: path.title,
      pathSubtitle: path.subtitle,
      pathDescription: path.description,
      difficulty: path.difficulty,
      estimatedMinutes: path.estimatedMinutes,
      coverImageUrl: path.coverImageUrl,

      isCompleted: isPathComplete,
      completedAt: isPathComplete ? latestCompletionDate || new Date().toISOString() : null,

      totalRequiredCourses: courseItems.length,
      completedRequiredCourses,
      totalRequiredProjects: projectItems.length,
      completedRequiredProjects,
      totalModulesCompleted,
      totalPracticesCompleted,
      totalKnowledgeChecksCompleted,

      roadmapJourney,
      skillsCovered,
      pathKnowledgeSummary,
      projectSummary,

      nextDirection: {
        title: "Keep building and exploring",
        description: "You've completed the Web Development Foundations path. You can revisit your courses, refine your final project, or explore additional courses as Meritloom grows.",
        actions: [
          {
            label: "Review Final Project",
            href: "/courses/javascript-fundamentals",
            variant: "primary",
          },
          {
            label: "Explore Courses",
            href: "/courses",
            variant: "outline",
          },
        ],
      },
    };
  } catch (error) {
    console.error("[getLearningPathCompletionData] Error:", error);
    return null;
  }
}

// Helper static fallback
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function buildStaticCourseCompletionFallback(course: any): CourseCompletionData {
  return {
    courseId: course.id,
    courseSlug: course.slug,
    courseTitle: course.title,
    courseSummary: course.summary,
    coverImageUrl: course.coverImageUrl,
    difficulty: course.difficulty,
    estimatedMinutes: course.estimatedMinutes,
    categoryName: course.category?.name,
    isCompleted: true,
    completedAt: new Date().toISOString(),
    totalRequiredLessons: course.totalLessons,
    completedRequiredLessons: course.totalLessons,
    totalModules: course.modules.length,
    completedModules: course.modules.length,
    totalPractices: 0,
    completedPractices: 0,
    totalKnowledgeChecks: course.modules.length,
    completedKnowledgeChecks: course.modules.length,
    notesCount: 0,
    bookmarksCount: 0,
    learningOutcomes: course.learningOutcomes || [],
    moduleSummaries: course.modules.map((m: any) => ({
      id: m.id,
      position: m.position,
      title: m.title,
      description: m.description,
      lessonCount: m.lessons.length,
      practiceCount: 0,
      quizCount: 1,
      isBonus: Boolean(m.isBonus),
      isCompleted: true,
      firstLessonSlug: m.lessons[0]?.slug,
    })),
    quizReviews: [],
    topicsToReview: [],
    recentNotes: [],
    recentBookmarks: [],
    recentPractices: [],
    bonusLessons: [],
    nextStep: {
      type: "explore_catalog",
      title: "Explore More Courses",
      description: "Discover new topics and continue expanding your development skills.",
      ctaText: "Explore Courses",
      href: "/courses",
    },
  };
}
