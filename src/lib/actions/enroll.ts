"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export interface EnrollResult {
  success: boolean;
  error?: string;
  redirectUrl?: string;
}

/**
 * Server action to enroll an authenticated learner in a free course.
 * Idempotent: checks for existing enrollment and handles concurrent requests.
 */
export async function enrollInCourseAction(
  courseIdOrSlug: string,
  optionalSlug?: string,
): Promise<EnrollResult> {
  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return {
      success: false,
      error: "Service is temporarily unavailable. Please try again later.",
    };
  }

  try {
    // 1. Verify authenticated user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      const redirectSlug = optionalSlug || courseIdOrSlug;
      return {
        success: false,
        error: "Please sign in to start this course.",
        redirectUrl: `/auth/sign-in?next=/courses/${encodeURIComponent(redirectSlug)}`,
      };
    }

    // 2. Verify profile row exists (foreign key requirement for course_enrollments.user_id)
    try {
      const { data: profile } = await supabase
        .from("profiles")
        .select("id")
        .eq("id", user.id)
        .maybeSingle();

      if (!profile) {
        const fullName =
          user.user_metadata?.full_name ||
          user.user_metadata?.name ||
          user.email?.split("@")[0] ||
          "Learner";
        const avatarUrl = user.user_metadata?.avatar_url || null;

        await supabase.from("profiles").upsert(
          {
            id: user.id,
            full_name: fullName,
            avatar_url: avatarUrl,
          },
          { onConflict: "id" },
        );
      }
    } catch (profileErr) {
      console.warn("[enrollInCourseAction] Profile verification notice:", profileErr);
    }

    // 3. Find course in database by ID or Slug
    let targetCourseSlug = optionalSlug || courseIdOrSlug;

    // Check if courseIdOrSlug is a UUID
    const isUuid =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
        courseIdOrSlug,
      );

    let courseQuery = supabase
      .from("courses")
      .select("id, slug, is_free, is_published");

    if (isUuid) {
      courseQuery = courseQuery.eq("id", courseIdOrSlug);
    } else {
      courseQuery = courseQuery.eq("slug", courseIdOrSlug);
    }

    const { data: courseData } = await courseQuery.maybeSingle();

    let dbCourse = courseData || null;
    if (!dbCourse && optionalSlug && isUuid) {
      const { data: bySlug } = await supabase
        .from("courses")
        .select("id, slug, is_free, is_published")
        .eq("slug", optionalSlug)
        .maybeSingle();
      if (bySlug) dbCourse = bySlug;
    }

    // If course is not stored in DB, it is served statically
    if (!dbCourse) {
      revalidatePath(`/courses/${targetCourseSlug}`);
      revalidatePath("/learn");
      revalidatePath("/learn/courses");
      revalidatePath(`/learn/courses/${targetCourseSlug}`);

      return {
        success: true,
        redirectUrl: `/learn/courses/${targetCourseSlug}`,
      };
    }

    const targetCourseId = dbCourse.id;
    targetCourseSlug = dbCourse.slug;

    // 4. Check existing enrollment
    const { data: existing, error: existingError } = await supabase
      .from("course_enrollments")
      .select("id, status")
      .eq("user_id", user.id)
      .eq("course_id", targetCourseId)
      .maybeSingle();

    if (existingError && existingError.code !== "PGRST116") {
      console.warn("[enrollInCourseAction] Existing enrollment query notice:", existingError);
    }

    if (existing) {
      // Update last_accessed_at
      await supabase
        .from("course_enrollments")
        .update({ last_accessed_at: new Date().toISOString() })
        .eq("id", existing.id);

      revalidatePath(`/courses/${targetCourseSlug}`);
      revalidatePath("/learn");
      revalidatePath("/learn/courses");
      revalidatePath(`/learn/courses/${targetCourseSlug}`);

      return {
        success: true,
        redirectUrl: `/learn/courses/${targetCourseSlug}`,
      };
    }

    // 5. Insert new course enrollment record
    const { error: insertError } = await supabase
      .from("course_enrollments")
      .insert({
        user_id: user.id,
        course_id: targetCourseId,
        status: "active",
        last_accessed_at: new Date().toISOString(),
      });

    if (insertError) {
      // If code 23505 (unique violation), handle race condition gracefully
      // If code 23503 (foreign key not found), course is running in static fallback mode
      if (insertError.code === "23505" || insertError.code === "23503") {
        revalidatePath(`/courses/${targetCourseSlug}`);
        revalidatePath("/learn");
        revalidatePath("/learn/courses");
        revalidatePath(`/learn/courses/${targetCourseSlug}`);

        return {
          success: true,
          redirectUrl: `/learn/courses/${targetCourseSlug}`,
        };
      }

      console.error("[enrollInCourseAction] enrollment insert failed", {
        code: insertError.code,
        message: insertError.message,
        details: insertError.details,
        hint: insertError.hint,
        userId: user.id,
        courseId: targetCourseId,
        courseSlug: targetCourseSlug,
      });

      return {
        success: false,
        error: "We couldn't start this course. Please try again.",
      };
    }

    // 6. Revalidate routes and return success redirect
    revalidatePath(`/courses/${targetCourseSlug}`);
    revalidatePath("/learn");
    revalidatePath("/learn/courses");
    revalidatePath(`/learn/courses/${targetCourseSlug}`);

    return {
      success: true,
      redirectUrl: `/learn/courses/${targetCourseSlug}`,
    };
  } catch (err: unknown) {
    const error = err as { message?: string; code?: string };
    console.error("[enrollInCourseAction] Unexpected exception:", error?.message || err);
    return {
      success: false,
      error: "We couldn't start this course. Please try again.",
    };
  }
}

