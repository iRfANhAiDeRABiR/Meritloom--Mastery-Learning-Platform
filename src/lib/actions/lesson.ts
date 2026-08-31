"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export interface ToggleLessonResult {
  success: boolean;
  completed?: boolean;
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
      if (courseSlug === "css-fundamentals" || courseSlug === "html-fundamentals") {
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
      if (courseSlug === "css-fundamentals" || courseSlug === "html-fundamentals") {
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

    // 5. Update course_enrollments last_accessed_at & check if course is completed
    try {
      // Check total required lessons vs completed required lessons
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
        .eq("course_id", course.id);

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

      let isAllCompleted = false;
      if (requiredLessonIds.length > 0) {
        const { count: completedRequiredCount } = await supabase
          .from("lesson_progress")
          .select("id", { count: "exact", head: true })
          .eq("user_id", user.id)
          .eq("course_id", course.id)
          .eq("completed", true)
          .in("lesson_id", requiredLessonIds);

        if (
          typeof completedRequiredCount === "number" &&
          completedRequiredCount >= requiredLessonIds.length
        ) {
          isAllCompleted = true;
        }
      }

      await supabase
        .from("course_enrollments")
        .update({
          status: isAllCompleted ? "completed" : "active",
          completed_at: isAllCompleted ? new Date().toISOString() : null,
          last_accessed_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", user.id)
        .eq("course_id", course.id);
    } catch {
      // Non-critical update
    }

    // 6. Revalidate all relevant paths
    revalidatePath(`/learn/courses/${courseSlug}/lessons/${lessonSlug}`);
    revalidatePath(`/learn/courses/${courseSlug}`);
    revalidatePath("/learn/courses");
    revalidatePath("/learn");

    return { success: true, completed };
  } catch (err: unknown) {
    const error = err as { message?: string };
    console.error("[toggleLessonProgressAction] Unexpected exception:", error?.message || err);
    return { success: false, error: "Failed to update lesson progress." };
  }
}

