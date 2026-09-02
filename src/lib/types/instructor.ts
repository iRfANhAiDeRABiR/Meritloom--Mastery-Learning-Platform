import type { CourseDifficulty } from "@/lib/types";
import type { StaffPermission, UserRole } from "@/lib/types/staff";

export interface InstructorCourseSummary {
  id: string;
  slug: string;
  title: string;
  summary: string | null;
  difficulty: CourseDifficulty;
  isPublished: boolean;
  coverImageUrl: string | null;
  categoryName: string | null;
  moduleCount: number;
  totalLessons: number;
  publishedLessons: number;
  draftLessons: number;
  quizCount: number;
  qualityWarningCount: number;
  enrolledCount?: number;
  completionCount?: number;
  updatedAt: string;
}

export interface InstructorQualityWarning {
  id: string;
  courseId: string;
  courseTitle: string;
  courseSlug: string;
  category: "quiz" | "objectives" | "video" | "structure" | "metadata";
  severity: "critical" | "warning" | "suggestion";
  message: string;
  lessonId?: string;
  lessonTitle?: string;
}

export interface InstructorRecentActivity {
  id: string;
  action: string;
  targetType: string;
  targetTitle: string;
  courseSlug?: string;
  createdAt: string;
}

export interface InstructorDashboardData {
  user: {
    id: string;
    name: string;
    email: string | null;
    avatarUrl: string | null;
    role: UserRole;
    professionalTitle?: string | null;
    bio?: string | null;
  };
  metrics: {
    assignedCoursesCount: number;
    publishedCoursesCount: number;
    draftLessonsCount: number;
    qualityIssuesCount: number;
  };
  assignedCourses: InstructorCourseSummary[];
  needsAttention: InstructorQualityWarning[];
  recentActivity: InstructorRecentActivity[];
}

export interface InstructorProfileData {
  id: string;
  userId: string;
  name: string;
  email: string | null;
  avatarUrl: string | null;
  professionalTitle: string | null;
  bio: string | null;
  websiteUrl: string | null;
  githubUrl: string | null;
  twitterUrl: string | null;
  linkedinUrl: string | null;
}

export interface SubAdminDashboardData {
  user: {
    id: string;
    name: string;
    email: string | null;
    avatarUrl: string | null;
    role: "sub_admin";
    permissions: StaffPermission[];
  };
  metrics: {
    totalUsers?: number;
    activeUsers?: number;
    suspendedUsers?: number;
    publishedCourses?: number;
    draftCourses?: number;
    totalLearningPaths?: number;
    draftLearningPaths?: number;
    qualityWarnings?: number;
    openMessages?: number;
    systemHealthy?: boolean;
    dbLatencyMs?: number;
    p95LatencyMs?: number;
  };
  needsAttention: Array<{
    id: string;
    type: "user" | "course" | "quality" | "system" | "message";
    severity: "critical" | "warning" | "info";
    title: string;
    description: string;
    actionHref: string;
    actionLabel: string;
  }>;
  recentActivity: Array<{
    id: string;
    action: string;
    targetType: string;
    targetTitle: string;
    createdAt: string;
  }>;
}

