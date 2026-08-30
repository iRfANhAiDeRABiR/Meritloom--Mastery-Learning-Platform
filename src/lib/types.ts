/**
 * Domain types for Meritloom's public content and learner data.
 *
 * These mirror the Supabase schema in `supabase/migrations/` and only carry
 * fields the landing page actually renders — never fabricated values such as
 * ratings or invented student counts.
 */

export type CourseDifficulty = "beginner" | "intermediate" | "advanced";

export interface Category {
  id: string;
  slug: string;
  name: string;
  /** Count of published courses in this category (may be 0). */
  courseCount: number;
}

export interface CourseSummary {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  difficulty: CourseDifficulty;
  estimatedMinutes: number;
  lessonCount: number;
  categoryName: string | null;
  thumbnailUrl: string | null;
  isFree: boolean;
}

export interface LearningPathSummary {
  id: string;
  slug: string;
  title: string;
  outcome: string;
  difficulty: CourseDifficulty;
  estimatedMinutes: number;
  courseCount: number;
  /** Titles of the first few courses, used for the mini roadmap visual. */
  roadmapPreview: string[];
}

export interface LearnerProfile {
  id: string;
  name: string;
  avatarUrl: string | null;
}

export interface ActiveEnrollment {
  courseSlug: string;
  courseTitle: string;
  currentModuleTitle: string | null;
  /** 0–100 */
  progressPercent: number;
  lastLessonTitle: string | null;
}

/** Lightweight result wrapper so pages can surface load failures cleanly. */
export type QueryResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: string };
