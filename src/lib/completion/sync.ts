import { createSupabaseServerClient } from "@/lib/supabase/server";

export interface SyncCourseCompletionResult {
  isComplete: boolean;
  justCompleted: boolean;
  completedAt: string | null;
  totalRequired: number;
  completedRequired: number;
}

/**
 * Centralized server helper to verify and sync course completion in course_enrollments.
 *
 * Rules:
 * - A course is complete when EVERY published, non-bonus lesson/activity is completed.
 * - Knowledge Checks count as complete after ANY submitted attempt regardless of score.
 * - Bonus lessons (is_bonus = true) are NEVER required for completion.
 * - Sets completed_at only on first completion (never overwrites historical completed_at).
 * - If a learner unmarks a required lesson, status returns to 'active'.
 */
export async function syncCourseCompletion(
  userId: string,
  courseId: string,
): Promise<SyncCourseCompletionResult> {
  const supabase = await createSupabaseServerClient();
  if (!supabase || !userId || !courseId) {
    return {
      isComplete: false,
      justCompleted: false,
      completedAt: null,
      totalRequired: 0,
      completedRequired: 0,
    };
  }

  try {
    // 1. Fetch all required (published, non-bonus) lessons for this course
    const { data: modules } = await supabase
      .from("course_modules")
      .select(
        `
        id,
        lessons (
          id,
          is_bonus,
          is_published
        )
      `,
      )
      .eq("course_id", courseId);

    const requiredLessonIds: string[] = [];
    if (modules) {
      for (const m of modules) {
        if (Array.isArray(m.lessons)) {
          for (const l of m.lessons) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const les = l as any;
            if (!les.is_bonus && les.is_published !== false) {
              requiredLessonIds.push(les.id);
            }
          }
        }
      }
    }

    const totalRequired = requiredLessonIds.length;
    let completedRequired = 0;

    if (totalRequired > 0) {
      const { count } = await supabase
        .from("lesson_progress")
        .select("id", { count: "exact", head: true })
        .eq("user_id", userId)
        .eq("course_id", courseId)
        .eq("completed", true)
        .in("lesson_id", requiredLessonIds);

      completedRequired = count ?? 0;
    }

    const isComplete = totalRequired > 0 && completedRequired >= totalRequired;

    // 2. Fetch current enrollment
    const { data: existingEnrollment } = await supabase
      .from("course_enrollments")
      .select("id, status, completed_at")
      .eq("user_id", userId)
      .eq("course_id", courseId)
      .maybeSingle();

    const wasAlreadyCompleted = existingEnrollment?.status === "completed";
    const justCompleted = isComplete && !wasAlreadyCompleted;
    let completedAt = existingEnrollment?.completed_at || null;

    if (isComplete) {
      if (!completedAt) {
        completedAt = new Date().toISOString();
      }

      await supabase.from("course_enrollments").upsert(
        {
          user_id: userId,
          course_id: courseId,
          status: "completed",
          completed_at: completedAt,
          last_accessed_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id,course_id" },
      );
    } else if (existingEnrollment) {
      // Revert to active if previously marked completed but now incomplete
      if (existingEnrollment.status === "completed") {
        await supabase
          .from("course_enrollments")
          .update({
            status: "active",
            last_accessed_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
          .eq("user_id", userId)
          .eq("course_id", courseId);
      }
    }

    return {
      isComplete,
      justCompleted,
      completedAt: isComplete ? completedAt : null,
      totalRequired,
      completedRequired,
    };
  } catch (error) {
    console.error("[syncCourseCompletion] Error syncing completion:", error);
    return {
      isComplete: false,
      justCompleted: false,
      completedAt: null,
      totalRequired: 0,
      completedRequired: 0,
    };
  }
}
