import { cache } from "react";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { AvailableWorkspaces, UserRole } from "@/lib/types/staff";

/**
 * Resolves which workspaces a user is authorized to access.
 * Request-memoized via React cache().
 */
export const resolveAvailableWorkspaces = cache(async function resolveAvailableWorkspaces(
  userId: string,
  role: UserRole,
): Promise<AvailableWorkspaces> {
  const isLearner = true;
  const isAdmin = role === "admin" || role === "sub_admin";

  let isInstructor = role === "instructor" || role === "admin";

  // If sub_admin or learner, check if assigned in course_instructors
  if (!isInstructor) {
    const supabase = await createSupabaseServerClient();
    if (supabase) {
      const { data } = await supabase
        .from("course_instructors")
        .select("id")
        .eq("user_id", userId)
        .limit(1)
        .maybeSingle();

      if (data) {
        isInstructor = true;
      }
    }
  }

  return {
    learner: isLearner,
    instructor: isInstructor,
    admin: isAdmin,
  };
});

