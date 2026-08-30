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

    // 1. Get course and lesson IDs
    const { data: course } = await supabase
      .from("courses")
      .select("id")
      .eq("slug", courseSlug)
      .maybeSingle();

    if (!course) {
      return { success: false, error: "Course not found." };
    }

    const { data: lesson } = await supabase
      .from("lessons")
      .select("id")
      .eq("course_id", course.id)
      .eq("slug", lessonSlug)
      .maybeSingle();

    if (!lesson) {
      return { success: false, error: "Lesson not found." };
    }

    // 2. Upsert progress into lesson_progress table
    const completedAt = completed ? new Date().toISOString() : null;

    const { error: upsertError } = await supabase
      .from("lesson_progress")
      .upsert(
        {
          user_id: user.id,
          course_id: course.id,
          lesson_id: lesson.id,
          completed,
          completed_at: completedAt,
          last_viewed_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id,lesson_id" },
      );

    if (upsertError) {
      return { success: false, error: upsertError.message };
    }

    // 3. Update course_enrollments last_accessed_at
    await supabase
      .from("course_enrollments")
      .update({
        last_accessed_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", user.id)
      .eq("course_id", course.id);

    // 4. Revalidate all relevant paths
    revalidatePath(`/learn/courses/${courseSlug}/lessons/${lessonSlug}`);
    revalidatePath(`/learn/courses/${courseSlug}`);
    revalidatePath("/learn/courses");
    revalidatePath("/learn");

    return { success: true, completed };
  } catch {
    return { success: false, error: "Failed to update lesson progress." };
  }
}

