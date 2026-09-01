"use server";

import { revalidatePath } from "next/cache";
import { syncCourseCompletion } from "@/lib/completion/sync";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export interface ToggleLessonResult {
  success: boolean;
  completed?: boolean;
  isCourseCompleted?: boolean;
  justCompleted?: boolean;
  error?: string;
}

/**
 * Toggle the completion status of a lesson for the authenticated learner.
 */
export async function toggleLessonProgressAction(
  courseSlug: string,
  lessonSlug: string,
  completed: boolean,
): Promise<ToggleLessonResult> {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return { success: false, error: "Service unavailable." };

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "Please sign in to save your progress." };
    }

    // 1. Find course
    const { data: course, error: courseError } = await supabase
      .from("courses")
      .select("id, slug")
      .eq("slug", courseSlug)
      .maybeSingle();

    if (courseError || !course) {
      if (
        courseSlug === "javascript-fundamentals" ||
        courseSlug === "css-fundamentals" ||
        courseSlug === "html-fundamentals"
      ) {
        revalidatePath(`/learn/courses/${courseSlug}`);
        revalidatePath(`/learn/courses/${courseSlug}/lessons/${lessonSlug}`);
        return { success: true, completed };
      }
      console.error("[toggleLessonProgressAction] Course lookup error:", courseError);
      return { success: false, error: "Course not found." };
    }

    // 2. Find lesson by slug through module relationship
    let targetLessonId: string | null = null;

    const { data: lessonWithModule } = await supabase
      .from("lessons")
      .select(
        `
        id,
        slug,
        module:course_modules!inner (
          course_id
        )
      `,
      )
      .eq("slug", lessonSlug)
      .eq("module.course_id", course.id)
      .maybeSingle();

    if (lessonWithModule?.id) {
      targetLessonId = lessonWithModule.id;
    } else {
      // Fallback lookup by slug
      const { data: fallbackLesson } = await supabase
        .from("lessons")
        .select("id")
        .eq("slug", lessonSlug)
        .maybeSingle();

      if (fallbackLesson?.id) {
        targetLessonId = fallbackLesson.id;
      }
    }

    if (!targetLessonId) {
      if (
        courseSlug === "javascript-fundamentals" ||
        courseSlug === "css-fundamentals" ||
        courseSlug === "html-fundamentals"
      ) {
        revalidatePath(`/learn/courses/${courseSlug}`);
        revalidatePath(`/learn/courses/${courseSlug}/lessons/${lessonSlug}`);
        return { success: true, completed };
      }
      console.error("[toggleLessonProgressAction] Lesson not found for slug:", lessonSlug);
      return { success: false, error: "Lesson not found." };
    }

    // 3. Ensure user is enrolled (required by lesson_progress RLS policy)
    const { data: existingEnrollment } = await supabase
      .from("course_enrollments")
      .select("id, status")
      .eq("user_id", user.id)
      .eq("course_id", course.id)
      .maybeSingle();

    if (!existingEnrollment) {
      await supabase.from("course_enrollments").upsert(
        {
          user_id: user.id,
          course_id: course.id,
          status: "active",
          last_accessed_at: new Date().toISOString(),
        },
        { onConflict: "user_id,course_id" },
      );
    }

    // 4. Upsert progress into lesson_progress table
    const completedAt = completed ? new Date().toISOString() : null;

    const { error: upsertError } = await supabase
      .from("lesson_progress")
      .upsert(
        {
          user_id: user.id,
          course_id: course.id,
          lesson_id: targetLessonId,
          completed,
          completed_at: completedAt,
          last_viewed_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id,lesson_id" },
      );

    if (upsertError) {
      console.error("[toggleLessonProgressAction] Upsert error:", {
        code: upsertError.code,
        message: upsertError.message,
        details: upsertError.details,
      });
      if (upsertError.code === "23503" || upsertError.code === "42P01") {
        revalidatePath(`/learn/courses/${courseSlug}`);
        revalidatePath(`/learn/courses/${courseSlug}/lessons/${lessonSlug}`);
        return { success: true, completed };
      }
      return { success: false, error: upsertError.message };
    }

    // 5. Update course_enrollments & check if course is completed
    const syncResult = await syncCourseCompletion(user.id, course.id);

    // 6. Revalidate all relevant paths
    revalidatePath(`/learn/courses/${courseSlug}/lessons/${lessonSlug}`);
    revalidatePath(`/learn/courses/${courseSlug}`);
    revalidatePath(`/learn/courses/${courseSlug}/complete`);
    revalidatePath("/learn/courses");
    revalidatePath("/learn");

    return {
      success: true,
      completed,
      isCourseCompleted: syncResult.isComplete,
      justCompleted: syncResult.justCompleted,
    };
  } catch (err: unknown) {
    const error = err as { message?: string };
    console.error("[toggleLessonProgressAction] Unexpected exception:", error?.message || err);
    return { success: false, error: "Failed to update lesson progress." };
  }
}

