import type { CourseDifficulty, LessonType } from "@/lib/types";

export interface MeritloomContentPackage {
  format: "meritloom-content";
  schemaVersion: 1;
  exportedAt: string;
  application: "Meritloom";
  scope: {
    type: "all" | "courses" | "learning_paths";
    courseSlugs?: string[];
    learningPathSlugs?: string[];
    includeReferencedCourses?: boolean;
  };
  categories: {
    slug: string;
    name: string;
    description: string | null;
    iconName: string | null;
    position: number;
    isActive: boolean;
  }[];
  skills: {
    slug: string;
    name: string;
    isActive: boolean;
  }[];
  courses: {
    slug: string;
    title: string;
    summary: string | null;
    description: string | null;
    coverImageUrl: string | null;
    difficulty: CourseDifficulty | null;
    language: string;
    estimatedMinutes: number | null;
    isFree: boolean;
    isPublished: boolean;
    categorySlug: string | null;
    outcomes: string[];
    prerequisites: string[];
    skillSlugs: string[];
    modules: {
      slug: string;
      title: string;
      description: string | null;
      position: number;
      estimatedMinutes: number | null;
      isPublished: boolean;
      lessons: {
        slug: string;
        title: string;
        summary: string | null;
        lessonType: LessonType;
        content: unknown;
        videoUrl: string | null;
        keyTakeaway: string | null;
        estimatedMinutes: number | null;
        position: number;
        isPreview: boolean;
        isPublished: boolean;
        objectives: string[];
        resources: {
          title: string;
          resourceType: string;
          externalUrl: string | null;
          storagePath: string | null;
          position: number;
        }[];
        quiz?: {
          title: string;
          description: string | null;
          estimatedMinutes: number;
          isPublished: boolean;
          questions: {
            questionType: "single_choice" | "multiple_choice" | "true_false";
            questionText: string;
            topic: string | null;
            codeContent: string | null;
            codeLanguage: string | null;
            explanation: string | null;
            position: number;
            options: {
              optionText: string;
              position: number;
              isCorrect: boolean;
            }[];
          }[];
        } | null;
      }[];
    }[];
  }[];
  learningPaths: {
    slug: string;
    title: string;
    subtitle: string | null;
    summary: string | null;
    description: string | null;
    difficulty: CourseDifficulty;
    coverImageUrl: string | null;
    isPublished: boolean;
    position: number;
    items: {
      itemType: "course" | "project";
      courseSlug?: string | null;
      title?: string | null;
      description?: string | null;
      stepLabel?: string | null;
      position: number;
      isRequired: boolean;
      estimatedMinutes?: number | null;
    }[];
  }[];
}

export type EntityChangeType = "new" | "update" | "unchanged" | "conflict" | "skipped";

export interface ItemDiff {
  type: EntityChangeType;
  slug: string;
  title: string;
  detail?: string;
}

export interface CourseDiff extends ItemDiff {
  modules: {
    type: EntityChangeType;
    slug: string;
    title: string;
    lessons: {
      type: EntityChangeType;
      slug: string;
      title: string;
      lessonType: string;
      hasQuiz: boolean;
    }[];
  }[];
}

export interface LearningPathDiff extends ItemDiff {
  stepsCount: number;
  itemTypes: string[];
}

export interface ImportPreviewSummary {
  counts: {
    newCourses: number;
    updatedCourses: number;
    unchangedCourses: number;
    newPaths: number;
    updatedPaths: number;
    unchangedPaths: number;
    newModules: number;
    updatedModules: number;
    newLessons: number;
    updatedLessons: number;
    totalCategories: number;
    totalSkills: number;
    warningsCount: number;
  };
  courses: CourseDiff[];
  learningPaths: LearningPathDiff[];
  warnings: string[];
}

export interface ImportResultSummary {
  createdCourses: number;
  updatedCourses: number;
  createdModules: number;
  updatedModules: number;
  createdLessons: number;
  updatedLessons: number;
  createdPaths: number;
  updatedPaths: number;
  createdSkills: number;
  createdCategories: number;
  skippedCount: number;
  errorsCount: number;
}

export interface ImportExecutionOptions {
  strategy: "safe_merge" | "create_only";
  newEntitiesDraft?: boolean;
  preservePublication?: boolean;
}
