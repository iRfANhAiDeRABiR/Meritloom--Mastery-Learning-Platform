"use server";

import { enrollInCourseAction as baseEnrollAction, type EnrollResult } from "@/lib/actions/enroll";

export type { EnrollResult };

/**
 * Enroll authenticated learner in a free course.
 */
export async function enrollInCourseAction(
  courseSlug: string,
): Promise<EnrollResult> {
  return await baseEnrollAction(courseSlug);
}

