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

export type PrimaryLearningGoal = "explore" | "practical" | "deepen";

export type StudyPace =
  | "15_min"
  | "30_min"
  | "45_min"
  | "60_min"
  | "few_times_week"
  | "no_schedule";

export type ContentPreference =
  | "video"
  | "reading"
  | "exercises"
  | "projects"
  | "knowledge_checks";

export interface LearnerOnboardingState {
  goal: PrimaryLearningGoal | null;
  interests: string[];
  level: CourseDifficulty | null;
  notSureLevel: boolean;
  studyPace: StudyPace | null;
  contentPreferences: ContentPreference[];
  reminders: boolean;
}

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
  email?: string | null;
  onboardingCompleted?: boolean;
}

export interface ActiveEnrollmentDetail {
  id: string;
  courseId: string;
  courseSlug: string;
  courseTitle: string;
  categoryName: string | null;
  categorySlug?: string | null;
  thumbnailUrl: string | null;
  difficulty: CourseDifficulty;
  totalLessons: number;
  completedLessons: number;
  progressPercent: number;
  nextLessonTitle: string | null;
  nextLessonSlug: string | null;
  lastAccessedAt: string | null;
}

export interface LearnerDashboardData {
  user: LearnerProfile;
  onboardingCompleted: boolean;
  continueCourse: ActiveEnrollmentDetail | null;
  activeCourses: ActiveEnrollmentDetail[];
  recommendedCourses: CourseSummary[];
  recentCourses: CourseSummary[];
}

export type LearnerTabStatus = "active" | "completed" | "saved";

export interface LearnerCourseItem {
  id: string;
  courseId: string;
  courseSlug: string;
  courseTitle: string;
  categoryName: string | null;
  categorySlug: string | null;
  thumbnailUrl: string | null;
  difficulty: CourseDifficulty;
  estimatedMinutes: number;
  totalLessons: number;
  completedLessons: number;
  progressPercent: number;
  nextLessonTitle: string | null;
  nextLessonSlug: string | null;
  status: LearnerTabStatus;
  enrolledAt?: string | null;
  completedAt?: string | null;
  savedAt?: string | null;
  lastAccessedAt?: string | null;
  isRecentlyActive?: boolean;
}

export interface MyLearningCounts {
  activeCount: number;
  completedCount: number;
  savedCount: number;
}

export interface MyLearningPageData {
  status: LearnerTabStatus;
  courses: LearnerCourseItem[];
  counts: MyLearningCounts;
  categories: Category[];
}

export type ModuleState = "completed" | "in_progress" | "not_started";

export interface LearnerLessonDetail {
  id: string;
  slug: string;
  title: string;
  lessonType: LessonType;
  position: number;
  estimatedMinutes: number;
  isCompleted: boolean;
  isNext: boolean;
}

export interface LearnerModuleDetail {
  id: string;
  title: string;
  description: string | null;
  position: number;
  estimatedMinutes: number;
  lessonCount: number;
  completedLessonsCount: number;
  state: ModuleState;
  lessons: LearnerLessonDetail[];
  nextLesson: LearnerLessonDetail | null;
}

export interface CourseLearningOverviewData {
  course: CourseDetail;
  isEnrolled: boolean;
  enrollmentId: string | null;
  enrolledAt: string | null;
  completedAt: string | null;
  modules: LearnerModuleDetail[];
  totalLessons: number;
  completedLessons: number;
  progressPercent: number;
  nextLesson: {
    lesson: LearnerLessonDetail;
    moduleTitle: string;
    modulePosition: number;
  } | null;
  isCourseCompleted: boolean;
  studyPaceLabel?: string | null;
  estimatedWeeksRemaining?: number | null;
}

export type LessonResourceType =
  | "transcript"
  | "pdf"
  | "code"
  | "external"
  | "download";

export interface LessonResource {
  id: string;
  title: string;
  resourceType: LessonResourceType;
  url: string;
  size?: string | null;
}

export interface FullLessonDetail {
  id: string;
  slug: string;
  title: string;
  summary: string | null;
  lessonType: LessonType;
  position: number;
  estimatedMinutes: number;
  videoUrl: string | null;
  content: string | null;
  keyTakeaway: string | null;
  isCompleted: boolean;
  completedAt: string | null;
  objectives: string[];
  resources: LessonResource[];
  module: {
    id: string;
    title: string;
    position: number;
    totalLessons: number;
  };
}

export interface LessonNavigationItem {
  slug: string;
  title: string;
  modulePosition: number;
  lessonPosition: number;
}

export interface LessonPlayerData {
  course: {
    id: string;
    slug: string;
    title: string;
    difficulty: CourseDifficulty;
    isFree: boolean;
    category: { name: string; slug: string } | null;
  };
  isEnrolled: boolean;
  currentLesson: FullLessonDetail;
  modules: LearnerModuleDetail[];
  totalLessons: number;
  completedLessons: number;
  progressPercent: number;
  previousLesson: LessonNavigationItem | null;
  nextLesson: LessonNavigationItem | null;
  isLastLesson: boolean;
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
  recommended?: string;
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

export type QuestionType = "single_choice" | "multiple_choice" | "true_false";

export interface PracticeQuestionOption {
  id: string;
  questionId: string;
  optionText: string;
  position: number;
}

export interface PracticeQuestion {
  id: string;
  quizId: string;
  questionType: QuestionType;
  questionText: string;
  topic: string | null;
  codeContent: string | null;
  codeLanguage: string | null;
  imageUrl: string | null;
  position: number;
  options: PracticeQuestionOption[];
  explanation?: string | null;
}

export interface QuizAttemptAnswer {
  questionId: string;
  selectedOptionIds: string[];
  isCorrect: boolean;
  explanation?: string | null;
  correctOptionIds?: string[];
  answeredAt?: string | null;
}

export interface PracticeQuizData {
  id: string;
  lessonId: string;
  courseSlug: string;
  lessonSlug: string;
  title: string;
  description: string | null;
  estimatedMinutes: number;
  questions: PracticeQuestion[];
  course: {
    id: string;
    slug: string;
    title: string;
  };
  module: {
    id: string;
    title: string;
    position: number;
  };
  previousLesson: LessonNavigationItem | null;
  nextLesson: LessonNavigationItem | null;
  isLastLesson: boolean;
  currentAttempt: {
    id: string;
    completedAt: string | null;
    correctCount: number;
    totalQuestions: number;
    answers: Record<string, QuizAttemptAnswer>;
  } | null;
}

export type ConceptStatus = "strong" | "good_progress" | "review";

export interface ConceptPerformance {
  topic: string;
  correctCount: number;
  totalCount: number;
  percent: number;
  status: ConceptStatus;
}

export interface QuizReviewQuestion {
  id: string;
  questionText: string;
  questionType: QuestionType;
  topic: string | null;
  codeContent: string | null;
  codeLanguage: string | null;
  imageUrl: string | null;
  position: number;
  selectedOptionIds: string[];
  selectedOptionTexts: string[];
  correctOptionIds: string[];
  correctOptionTexts: string[];
  isCorrect: boolean;
  explanation: string | null;
}

export interface QuizRecommendation {
  id: string;
  title: string;
  description: string;
  type: "review" | "resource" | "practice";
  url: string;
  badge: string;
}

export interface QuizAttemptSummary {
  id: string;
  attemptNumber: number;
  correctCount: number;
  totalQuestions: number;
  percent: number;
  completedAt: string;
}

export interface QuizResultsPageData {
  attempt: {
    id: string;
    completedAt: string;
    correctCount: number;
    totalQuestions: number;
    percent: number;
    attemptNumber: number;
  };
  quiz: {
    id: string;
    title: string;
    description: string | null;
    estimatedMinutes: number;
  };
  course: {
    id: string;
    slug: string;
    title: string;
  };
  lesson: {
    id: string;
    slug: string;
    title: string;
    summary: string | null;
  };
  module: {
    id: string;
    title: string;
    position: number;
  };
  concepts: ConceptPerformance[];
  recommendations: QuizRecommendation[];
  reviewQuestions: QuizReviewQuestion[];
  previousAttempts: QuizAttemptSummary[];
  nextLesson: LessonNavigationItem | null;
}


