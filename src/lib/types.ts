import type { LessonPracticeSessionData } from "@/lib/practice/queries";
import type { AvailableWorkspaces, UserRole } from "@/lib/types/staff";
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

export function isKnowledgeCheckLesson(lessonType: string | null | undefined): boolean {
  return lessonType === "knowledge_check" || lessonType === "quiz";
}

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
  iconName?: string;
  description?: string;
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
  isBonus?: boolean;
  youtubeVideoId?: string | null;
}

export interface CourseModule {
  id: string;
  title: string;
  description: string | null;
  position: number;
  estimatedMinutes: number;
  lessonCount: number;
  lessons: CourseLesson[];
  isBonus?: boolean;
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
  requiredLessonsCount?: number;
  bonusLessonsCount?: number;
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

export type LearningPathMilestoneStatus = "not_started" | "in_progress" | "completed";

export interface LearningPathCourseItem {
  id: string;
  itemType: "course";
  position: number;
  stepNumber: number;
  stepLabel: string;
  courseId: string;
  courseSlug: string;
  title: string;
  description: string;
  iconName: "Code2" | "Palette" | "Braces" | "Rocket";
  accentColor: "amber" | "cyan" | "gold" | "purple";
  difficulty: CourseDifficulty;
  lessonCount: number;
  estimatedMinutes: number;
  categoryName?: string | null;
  status?: LearningPathMilestoneStatus;
  completedLessons?: number;
  totalLessons?: number;
  progressPercent?: number;
  lastLessonSlug?: string | null;
  isCurrentStep?: boolean;
}

export interface LearningPathProjectItem {
  id: string;
  itemType: "project";
  position: number;
  stepNumber: number;
  stepLabel: string;
  title: string;
  description: string;
  iconName: "Rocket";
  accentColor: "purple";
  estimatedMinutes: number;
  outcomes: string[];
  projectUrl?: string | null;
  status?: LearningPathMilestoneStatus;
  isCurrentStep?: boolean;
}

export type LearningPathMilestone = LearningPathCourseItem | LearningPathProjectItem;

export interface LearningPathCapability {
  title: string;
  description: string;
  iconName: string;
}

export interface LearningPathLearnerProgress {
  completedCourses: number;
  totalCourses: number;
  inProgressCourses: number;
  overallPercent: number;
  currentStepNumber: number;
  pathStatus: LearningPathMilestoneStatus;
}

export interface LearningPathDetail {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  difficulty: CourseDifficulty;
  estimatedMinutes: number;
  courseCount: number;
  isPublished: boolean;
  coverImageUrl?: string | null;
  items: LearningPathMilestone[];
  skills: string[];
  capabilities: LearningPathCapability[];
  learnerProgress?: LearningPathLearnerProgress;
}

export interface LearnerProfile {
  id: string;
  name: string;
  avatarUrl: string | null;
  email?: string | null;
  onboardingCompleted?: boolean;
  role?: UserRole;
  workspaces?: AvailableWorkspaces;
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
  currentModuleName?: string | null;
  lastAccessedAt: string | null;
}

export interface WeeklyActivityMetrics {
  lessonsCompleted: number;
  practiceCount: number;
  knowledgeChecksCount: number;
}

export type LearnerActivityEventType =
  | "lesson_completed"
  | "practice_completed"
  | "quiz_submitted";

export interface LearnerActivityItem {
  id: string;
  type: LearnerActivityEventType;
  title: string;
  subtitle: string;
  courseSlug: string;
  lessonSlug?: string;
  timestamp: string;
  scoreInfo?: string | null;
}

export interface LearnerSavedCourseSummary {
  id: string;
  courseId: string;
  slug: string;
  title: string;
  summary: string | null;
  difficulty: CourseDifficulty;
  categoryName: string | null;
  lessonCount: number;
  coverImageUrl: string | null;
}

export interface LearnerRecentNoteSummary {
  id: string;
  lessonId: string;
  courseSlug: string;
  lessonSlug: string;
  lessonTitle: string;
  courseTitle: string;
  contentPreview: string;
  updatedAt: string;
}

export interface LearnerDashboardData {
  user: LearnerProfile;
  onboardingCompleted: boolean;
  continueCourse: ActiveEnrollmentDetail | null;
  activeCourses: ActiveEnrollmentDetail[];
  totalActiveCoursesCount: number;
  weeklyMetrics: WeeklyActivityMetrics;
  learningPath: LearningPathDetail | null;
  recentActivity: LearnerActivityItem[];
  savedCourses: LearnerSavedCourseSummary[];
  recentNotes: LearnerRecentNoteSummary[];
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

export type ExploreCourseEnrollmentStatus = "not_started" | "in_progress" | "completed";

export interface ExploreCourseItem {
  id: string;
  slug: string;
  title: string;
  summary: string;
  difficulty: CourseDifficulty;
  estimatedMinutes: number;
  totalLessons: number;
  completedLessons: number;
  progressPercent: number;
  categoryName: string | null;
  categorySlug: string | null;
  thumbnailUrl: string | null;
  isFree: boolean;
  enrollmentStatus: ExploreCourseEnrollmentStatus;
  isSaved: boolean;
  nextLessonTitle?: string | null;
  nextLessonSlug?: string | null;
  enrolledAt?: string | null;
  completedAt?: string | null;
  lastAccessedAt?: string | null;
}

export interface LearnerExploreSearchParams {
  q?: string;
  level?: string;
  category?: string;
  status?: string;
}

export interface LearnerExplorePageData {
  courses: ExploreCourseItem[];
  totalCoursesCount: number;
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
  isBonus?: boolean;
  youtubeVideoId?: string | null;
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
  isBonus?: boolean;
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
  requiredLessonsCount?: number;
  bonusLessonsCount?: number;
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
  isBonus?: boolean;
  youtubeVideoId?: string | null;
  videoProvider?: string | null;
  sourceChannel?: string | null;
  sourceUrl?: string | null;
  playlistId?: string | null;
  module: {
    id: string;
    title: string;
    position: number;
    totalLessons: number;
    isBonus?: boolean;
  };
}

export interface LessonNavigationItem {
  slug: string;
  title: string;
  modulePosition: number;
  lessonPosition: number;
  isBonus?: boolean;
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
  requiredLessonsCount?: number;
  bonusLessonsCount?: number;
  isBonusLesson?: boolean;
  initialNote?: string | null;
  isBookmarked?: boolean;
  practiceData?: LessonPracticeSessionData | null;
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

export type ProfileTabId = "profile" | "learning" | "appearance" | "account";

export interface ProfileSettingsData {
  profile: {
    id: string;
    fullName: string;
    avatarUrl: string | null;
    email: string;
    createdAt: string;
  };
  preferences: {
    learningGoal: PrimaryLearningGoal | null;
    levelPreference: CourseDifficulty | null;
    preferredMinutesPerDay: number | null;
    schedulePreference: StudyPace | null;
    contentPreferences: ContentPreference[];
    learningReminders: boolean;
  };
  selectedCategoryIds: string[];
  categories: Category[];
  provider: "email" | "google" | "unknown";
  hasPassword?: boolean;
  hasGoogle?: boolean;
  activeTab: ProfileTabId;
}

export interface SavedCourseItem {
  id: string;
  courseId: string;
  courseSlug: string;
  courseTitle: string;
  shortDescription: string | null;
  thumbnailUrl: string | null;
  categoryName: string | null;
  categorySlug: string | null;
  difficulty: CourseDifficulty;
  estimatedMinutes: number;
  lessonCount: number;
  savedAt: string;
  enrollmentStatus: "not_started" | "active" | "completed";
  completedLessonsCount: number;
  totalLessonsCount: number;
  progressPercent: number;
}

export interface SavedCoursesPageData {
  courses: SavedCourseItem[];
  totalSavedCount: number;
  categories: Category[];
  recommendations: CourseSummary[];
  query: string;
  selectedCategory: string;
  selectedDifficulty: string;
  selectedSort: string;
}





// =========================================================
// ADMIN CONTENT MANAGEMENT TYPES
// =========================================================

export interface AdminDashboardMetrics {
  publishedCoursesCount: number;
  draftCoursesCount: number;
  publishedLessonsCount: number;
  categoriesCount: number;
  learningPathsCount?: number;
  learnersCount?: number;
  enrollmentsCount?: number;
  unreadMessagesCount?: number;
  recentCourses: AdminCourseListItem[];
  systemHealth?: {
    status: "healthy" | "degraded" | "critical";
    latencyMs: number;
    p95Ms: number;
    errorRate: number;
  };
  userManagement?: {
    totalAccounts: number;
    activeAccounts: number;
    suspendedAccounts: number;
    instructorsCount: number;
    subAdminsCount: number;
  };
}

export type SupportMessageStatus = "new" | "reviewing" | "resolved" | "closed";
export type SupportMessageTopic =
  | "course"
  | "video"
  | "account"
  | "progress"
  | "learning_path"
  | "bug"
  | "content_feedback"
  | "general";

export interface AdminSupportMessage {
  id: string;
  userId: string | null;
  name: string;
  email: string;
  topic: SupportMessageTopic;
  message: string;
  pageUrl: string | null;
  status: SupportMessageStatus;
  createdAt: string;
  updatedAt: string;
}

export interface AdminLearnerListItem {
  id: string;
  fullName: string | null;
  avatarUrl: string | null;
  role: "learner" | "admin";
  createdAt: string;
  updatedAt: string;
  enrollmentCount: number;
  completedLessonsCount: number;
  quizAttemptsCount: number;
  enrolledCourseTitles: string[];
}

export interface AdminInstructorDetail {
  id: string;
  profileId: string | null;
  displayName: string;
  title: string | null;
  bio: string | null;
  avatarUrl: string | null;
  isPublished: boolean;
  courseCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface AdminCourseListItem {
  id: string;
  slug: string;
  title: string;
  summary: string | null;
  categoryName: string | null;
  categorySlug: string | null;
  instructorName?: string | null;
  instructorProfileId?: string | null;
  difficulty: CourseDifficulty;
  isPublished: boolean;
  isFree: boolean;
  publishedAt: string | null;
  updatedAt: string;
  createdAt: string;
  coverImageUrl: string | null;
  moduleCount: number;
  lessonCount: number;
  estimatedMinutes: number | null;
}

export interface AdminCourseDetail {
  id: string;
  slug: string;
  title: string;
  summary: string | null;
  description: string | null;
  categoryId: string | null;
  categoryName: string | null;
  categorySlug: string | null;
  instructorProfileId: string | null;
  instructor?: AdminInstructorDetail | null;
  difficulty: CourseDifficulty;
  language: string;
  estimatedMinutes: number | null;
  coverImageUrl: string | null;
  isFree: boolean;
  isPublished: boolean;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
  modules: AdminModuleDetail[];
  learningOutcomes: { id: string; outcomeText: string; position: number }[];
  prerequisites: { id: string; prerequisiteText: string; position: number }[];
  skills: { id: string; name: string; slug: string }[];
  learningPathName?: string | null;
  learningPathSlug?: string | null;
}

export interface AdminModuleDetail {
  id: string;
  courseId: string;
  slug: string | null;
  title: string;
  description: string | null;
  position: number;
  estimatedMinutes: number | null;
  isPublished: boolean;
  lessons: AdminLessonDetail[];
}

export interface AdminLessonDetail {
  id: string;
  moduleId: string;
  courseId: string;
  slug: string;
  title: string;
  summary: string | null;
  lessonType: LessonType;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  content: any;
  videoUrl: string | null;
  videoProvider: string | null;
  youtubeVideoId: string | null;
  sourceChannel: string | null;
  sourceUrl: string | null;
  playlistId: string | null;
  keyTakeaway: string | null;
  estimatedMinutes: number | null;
  position: number;
  isPreview: boolean;
  isBonus: boolean;
  isPublished: boolean;
  objectives: { id: string; text: string; position: number }[];
  resources: { id: string; label: string; resourceType: string; url: string | null; position: number }[];
  quiz?: AdminQuizDetail | null;
}

export interface AdminQuizDetail {
  id: string;
  lessonId: string;
  title: string;
  description: string | null;
  estimatedMinutes: number;
  isPublished: boolean;
  questions: AdminQuestionDetail[];
}

export interface AdminQuestionDetail {
  id: string;
  quizId: string;
  questionType: "single_choice" | "multiple_choice" | "true_false";
  questionText: string;
  topic: string | null;
  codeContent: string | null;
  codeLanguage: string | null;
  explanation: string | null;
  position: number;
  options: { id: string; text: string; position: number; isCorrect?: boolean }[];
}

export interface AdminKnowledgeCheckItem {
  id: string;
  lessonId: string;
  courseId: string;
  courseTitle: string;
  courseSlug: string;
  moduleId: string;
  moduleTitle: string;
  modulePosition: number;
  lessonTitle: string;
  lessonSlug: string;
  quizTitle: string;
  quizDescription: string | null;
  estimatedMinutes: number;
  isPublished: boolean;
  questionCount: number;
  questions: AdminQuestionDetail[];
}

export interface AdminKnowledgeChecksData {
  items: AdminKnowledgeCheckItem[];
  totalQuizzes: number;
  totalQuestions: number;
  singleChoiceCount: number;
  multipleChoiceCount: number;
  trueFalseCount: number;
  courseStats: {
    courseId: string;
    courseTitle: string;
    courseSlug: string;
    quizCount: number;
    questionCount: number;
  }[];
}

export interface YouTubePlaylistItemParsed {
  position: number;
  title: string;
  cleanTitle: string;
  slug: string;
  videoId: string;
  durationMinutes: number;
  channelTitle: string;
  videoUrl: string;
  playlistId: string;
  isBonus: boolean;
  isAlreadyImported?: boolean;
}

export interface AdminLearningPathListItem {
  id: string;
  slug: string;
  title: string;
  summary: string | null;
  difficulty: CourseDifficulty;
  isPublished: boolean;
  position: number;
  courseCount: number;
  stepCount: number;
  estimatedMinutes: number;
  createdAt: string;
  updatedAt: string;
}

export interface AdminLearningPathItemDetail {
  id: string;
  learningPathId: string;
  courseId: string | null;
  itemType: "course" | "project";
  title: string | null;
  description: string | null;
  stepLabel: string | null;
  position: number;
  isRequired: boolean;
  estimatedMinutes?: number | null;
  course?: {
    id: string;
    slug: string;
    title: string;
    summary: string | null;
    difficulty: CourseDifficulty;
    isPublished: boolean;
    lessonCount: number;
    estimatedMinutes: number | null;
    categoryName: string | null;
    coverImageUrl: string | null;
  } | null;
}

export interface AdminLearningPathDetail {
  id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  summary: string | null;
  description: string | null;
  difficulty: CourseDifficulty;
  estimatedMinutes: number;
  courseCount: number;
  coverImageUrl: string | null;
  isPublished: boolean;
  position: number;
  createdAt: string;
  updatedAt: string;
  items: AdminLearningPathItemDetail[];
}

export interface AvailableCourseForPath {
  id: string;
  slug: string;
  title: string;
  summary: string | null;
  difficulty: CourseDifficulty;
  isPublished: boolean;
  categoryName: string | null;
  lessonCount: number;
  estimatedMinutes: number | null;
  coverImageUrl: string | null;
}

export interface LearnerLessonNoteItem {
  id: string;
  lessonId: string;
  lessonSlug: string;
  lessonTitle: string;
  lessonType: LessonType;
  courseId: string;
  courseSlug: string;
  courseTitle: string;
  moduleTitle: string;
  content: string;
  updatedAt: string;
  isBookmarked: boolean;
}

export interface LearnerLessonBookmarkItem {
  id: string;
  lessonId: string;
  lessonSlug: string;
  lessonTitle: string;
  lessonType: LessonType;
  estimatedMinutes: number | null;
  courseId: string;
  courseSlug: string;
  courseTitle: string;
  moduleTitle: string;
  isCompleted: boolean;
  hasNote: boolean;
  bookmarkedAt: string;
}

export interface MyNotesPageData {
  notes: LearnerLessonNoteItem[];
  bookmarks: LearnerLessonBookmarkItem[];
  availableCourses: { slug: string; title: string }[];
}

export type { CourseCompletionData, LearningPathCompletionData } from "@/lib/completion/types";

