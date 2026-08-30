"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";

export interface EnrollResult {
  success: boolean;
  error?: string;
  redirectUrl?: string;
}

/**
 * Server action to enroll an authenticated learner in a free course.
 * Idempotent: checks for existing enrollment to avoid duplicates.
 */
export async function enrollInCourseAction(
  courseId: string,
  courseSlug: string,
): Promise<EnrollResult> {
  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return {
      success: false,
      error: "Service is temporarily unavailable. Please try again later.",
    };
  }

  try {
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return {
        success: false,
        error: "Please sign in to start this course.",
        redirectUrl: `/auth/sign-in?next=/courses/${courseSlug}`,
      };
    }

    // Check if already enrolled
    const { data: existing } = await supabase
      .from("enrollments")
      .select("id, status")
      .eq("user_id", user.id)
      .eq("course_id", courseId)
      .maybeSingle();

    if (existing) {
      return {
        success: true,
        redirectUrl: `/courses/${courseSlug}`,
      };
    }

    // Create new enrollment record
    const { error: insertError } = await supabase
      .from("enrollments")
      .insert({
        user_id: user.id,
        course_id: courseId,
        status: "active",
        progress_percent: 0,
        enrolled_at: new Date().toISOString(),
        last_accessed_at: new Date().toISOString(),
      });

    if (insertError) {
      return {
        success: false,
        error: "We couldn't start this course. Please try again.",
      };
    }

    return {
      success: true,
      redirectUrl: `/courses/${courseSlug}`,
    };
  } catch {
    return {
      success: false,
      error: "We couldn't start this course. Please try again.",
    };
  }
}

