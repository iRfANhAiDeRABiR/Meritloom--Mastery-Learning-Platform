"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export interface EnrollResult {
  success: boolean;
  error?: string;
  redirectUrl?: string;
}

/**
 * Enroll authenticated learner in a free course.
 */
export async function enrollInCourseAction(
  courseSlug: string,
): Promise<EnrollResult> {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return { success: false, error: "Service unavailable." };

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return {
        success: false,
        error: "Please sign in to start this course.",
        redirectUrl: `/auth/sign-in?next=/learn/courses/${courseSlug}`,
      };
    }

    // Fetch course ID
    const { data: course } = await supabase
      .from("courses")
      .select("id, is_published, is_free")
      .eq("slug", courseSlug)
      .maybeSingle();

    if (!course || !course.is_published) {
      return { success: false, error: "Course not found or unavailable." };
    }

    // Check existing enrollment
    const { data: existing } = await supabase
      .from("course_enrollments")
      .select("id")
      .eq("user_id", user.id)
      .eq("course_id", course.id)
      .maybeSingle();

    if (!existing) {
      const { error: insertError } = await supabase
        .from("course_enrollments")
        .insert({
          user_id: user.id,
          course_id: course.id,
          status: "active",
          enrolled_at: new Date().toISOString(),
          last_accessed_at: new Date().toISOString(),
        });

      if (insertError) {
        return { success: false, error: insertError.message };
      }
    }

    revalidatePath(`/learn/courses/${courseSlug}`);
    revalidatePath("/learn/courses");
    revalidatePath("/learn");

    return { success: true };
  } catch {
    return { success: false, error: "Unable to enroll in course." };
  }
}

