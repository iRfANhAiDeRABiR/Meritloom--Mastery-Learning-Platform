/**
 * Domain types for Meritloom's public content and learner data.
 *
 * These mirror the Supabase schema and only carry fields the application
 * actually renders — never fabricated values such as ratings or invented student counts.
 */

export type CourseDifficulty = "beginner" | "intermediate" | "advanced";

export type LessonType =
  | "video"
  | "article"
  | "exercise"
  | "practice"
  | "quiz"
  | "knowledge_check";

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
  categorySlug?: string | null;
  thumbnailUrl: string | null;
  isFree: boolean;
  instructorName?: string | null;
}

export interface CourseInstructor {
  id: string;
  name: string;
  title: string | null;
  avatarUrl: string | null;
  bio?: string | null;
}

export interface CourseLesson {
  id: string;
  slug: string;
  title: string;
  lessonType: LessonType;
  position: number;
  estimatedMinutes: number;
  isPreview: boolean;
  isPublished: boolean;
}

export interface CourseModule {
  id: string;
  title: string;
  description: string | null;
  position: number;
  estimatedMinutes: number;
  lessonCount: number;
  lessons: CourseLesson[];
}

export interface CourseDetail {
  id: string;
  slug: string;
  title: string;
  summary: string;
  description: string;
  difficulty: CourseDifficulty;
  language: string;
  estimatedMinutes: number;
  lessonCount: number;
  moduleCount: number;
  isFree: boolean;
  isPublished: boolean;
  thumbnailUrl: string | null;
  category: {
    id: string;
    name: string;
    slug: string;
  } | null;
  instructor: CourseInstructor | null;
  learningOutcomes: string[];
  prerequisites: string[];
  skills: string[];
  targetAudience: string[];
  modules: CourseModule[];
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

export interface CourseEnrollmentStatus {
  isEnrolled: boolean;
  status?: "active" | "completed" | "archived";
}

export type CatalogSortOption = "newest" | "title" | "duration" | "lessons";

export interface CatalogSearchParams {
  q?: string;
  category?: string;
  level?: string;
  sort?: string;
  page?: string;
}

export interface CatalogQueryResult {
  courses: CourseSummary[];
  totalCount: number;
  page: number;
  totalPages: number;
  pageSize: number;
  error?: string;
}

/** Lightweight result wrapper so pages can surface load failures cleanly. */
export type QueryResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: string };
