"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export interface ActionResult {
  success: boolean;
  error?: string;
  redirectUrl?: string;
}

/**
 * Archive an active enrollment so it does not clutter the in-progress list.
 */
export async function archiveCourseAction(
  enrollmentId: string,
): Promise<ActionResult> {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return { success: false, error: "Service unavailable." };

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "Please sign in to manage courses." };
    }

    const { error } = await supabase
      .from("course_enrollments")
      .update({
        status: "archived",
        updated_at: new Date().toISOString(),
      })
      .eq("id", enrollmentId)
      .eq("user_id", user.id);

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath("/learn/courses");
    revalidatePath("/learn");
    return { success: true };
  } catch {
    return { success: false, error: "Unable to archive course." };
  }
}

/**
 * Toggle saving/bookmarking a course.
 */
export async function toggleSaveCourseAction(
  courseId: string,
): Promise<ActionResult> {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return { success: false, error: "Service unavailable." };

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "Please sign in to save courses." };
    }

    // Try saved_courses table
    try {
      const { data: existing } = await supabase
        .from("saved_courses")
        .select("id")
        .eq("user_id", user.id)
        .eq("course_id", courseId)
        .maybeSingle();

      if (existing) {
        await supabase
          .from("saved_courses")
          .delete()
          .eq("id", existing.id);
      } else {
        await supabase.from("saved_courses").insert({
          user_id: user.id,
          course_id: courseId,
        });
      }
    } catch {
      // Fallback: save into user_metadata
      const metadata = user.user_metadata ?? {};
      const savedIds: string[] = Array.isArray(metadata.saved_course_ids)
        ? metadata.saved_course_ids
        : [];

      const newSaved = savedIds.includes(courseId)
        ? savedIds.filter((id) => id !== courseId)
        : [...savedIds, courseId];

      await supabase.auth.updateUser({
        data: { saved_course_ids: newSaved },
      });
    }

    revalidatePath("/learn/courses");
    revalidatePath("/learn");
    return { success: true };
  } catch {
    return { success: false, error: "Unable to update saved courses." };
  }
}

/**
 * Start a saved course by creating an active enrollment.
 */
export async function startSavedCourseAction(
  courseId: string,
): Promise<ActionResult> {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return { success: false, error: "Service unavailable." };

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return {
        success: false,
        error: "Please sign in to start learning.",
        redirectUrl: "/auth/sign-in",
      };
    }

    // Fetch course slug
    const { data: course } = await supabase
      .from("courses")
      .select("slug")
      .eq("id", courseId)
      .maybeSingle();

    if (!course) {
      return { success: false, error: "Course not found." };
    }

    // Check if already enrolled
    const { data: existingEnrollment } = await supabase
      .from("course_enrollments")
      .select("id")
      .eq("user_id", user.id)
      .eq("course_id", courseId)
      .maybeSingle();

    if (!existingEnrollment) {
      await supabase.from("course_enrollments").insert({
        user_id: user.id,
        course_id: courseId,
        status: "active",
        enrolled_at: new Date().toISOString(),
        last_accessed_at: new Date().toISOString(),
      });
    }

    // Optionally remove from saved_courses table
    try {
      await supabase
        .from("saved_courses")
        .delete()
        .eq("user_id", user.id)
        .eq("course_id", courseId);
    } catch {
      // Ignore
    }

    revalidatePath("/learn/courses");
    revalidatePath("/learn");

    return {
      success: true,
      redirectUrl: `/courses/${course.slug}`,
    };
  } catch {
    return { success: false, error: "Unable to start course." };
  }
}

