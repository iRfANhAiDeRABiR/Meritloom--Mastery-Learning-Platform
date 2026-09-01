import type { CourseDifficulty } from "@/lib/types";

export interface CourseCompletionData {
  courseId: string;
  courseSlug: string;
  courseTitle: string;
  courseSummary: string;
  coverImageUrl?: string | null;
  difficulty: CourseDifficulty;
  estimatedMinutes: number;
  categoryName?: string | null;

  isCompleted: boolean;
  completedAt: string | null;

  // Real Learning Activity Metrics
  totalRequiredLessons: number;
  completedRequiredLessons: number;
  totalModules: number;
  completedModules: number;
  totalPractices: number;
  completedPractices: number;
  totalKnowledgeChecks: number;
  completedKnowledgeChecks: number;
  notesCount: number;
  bookmarksCount: number;

  // What you covered
  learningOutcomes: string[];

  // Course journey
  moduleSummaries: {
    id: string;
    position: number;
    title: string;
    description?: string | null;
    lessonCount: number;
    practiceCount: number;
    quizCount: number;
    isBonus: boolean;
    isCompleted: boolean;
    firstLessonSlug?: string;
  }[];

  // Knowledge Check review
  quizReviews: {
    moduleId: string;
    moduleTitle: string;
    modulePosition: number;
    quizTitle: string;
    lessonSlug: string;
    isCompleted: boolean;
    latestAttempt: {
      correctCount: number;
      totalQuestions: number;
      completedAt: string | null;
    } | null;
  }[];

  // Topics to revisit
  topicsToReview: {
    topic: string;
    missedCount: number;
    recommendedLessonSlug?: string;
    recommendedLessonTitle?: string;
  }[];

  // Learner Notes & Bookmarks
  recentNotes: {
    id: string;
    lessonTitle: string;
    lessonSlug: string;
    content: string;
    updatedAt: string;
  }[];

  recentBookmarks: {
    id: string;
    lessonTitle: string;
    lessonSlug: string;
    moduleTitle?: string;
  }[];

  // Optional Practice Work
  recentPractices: {
    lessonTitle: string;
    lessonSlug: string;
    isCompleted: boolean;
    hasDraft?: boolean;
    updatedAt?: string;
  }[];

  // Optional Bonus Content
  bonusLessons: {
    id: string;
    title: string;
    slug: string;
    isCompleted: boolean;
  }[];

  // Where to go next
  nextStep: {
    type: "path_course" | "path_project" | "path_summary" | "explore_catalog";
    title: string;
    description: string;
    ctaText: string;
    href: string;
    pathTitle?: string;
    pathSlug?: string;
    status?: "not_started" | "in_progress" | "completed";
  };
}

export interface LearningPathCompletionData {
  pathId: string;
  pathSlug: string;
  pathTitle: string;
  pathSubtitle: string;
  pathDescription: string;
  difficulty: CourseDifficulty;
  estimatedMinutes: number;
  coverImageUrl?: string | null;

  isCompleted: boolean;
  completedAt: string | null;

  // Real Path Metrics
  totalRequiredCourses: number;
  completedRequiredCourses: number;
  totalRequiredProjects: number;
  completedRequiredProjects: number;
  totalModulesCompleted: number;
  totalPracticesCompleted: number;
  totalKnowledgeChecksCompleted: number;

  // Journey Roadmap
  roadmapJourney: {
    id: string;
    itemType: "course" | "project";
    stepNumber: number;
    stepLabel: string;
    title: string;
    description: string;
    accentColor: string;
    iconName: string;
    isCompleted: boolean;
    href: string;
    courseSlug?: string;
    lessonCount?: number;
    difficulty?: string;
    milestoneCount?: number;
  }[];

  // Skills Covered
  skillsCovered: string[];

  // Knowledge Checks across Path
  pathKnowledgeSummary: {
    courseTitle: string;
    courseSlug: string;
    checksCompleted: number;
    totalChecks: number;
  }[];

  // Final Project summary
  projectSummary?: {
    title: string;
    description: string;
    isCompleted: boolean;
    milestonesCompleted: number;
    totalMilestones: number;
    href: string;
  } | null;

  // Next direction
  nextDirection: {
    title: string;
    description: string;
    actions: {
      label: string;
      href: string;
      variant?: "primary" | "outline";
    }[];
  };
}
