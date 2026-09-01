export type UserRole = "learner" | "instructor" | "sub_admin" | "admin";

export type AccountStatus = "active" | "suspended";

export type StaffPermission =
  | "users.view"
  | "users.suspend"
  | "users.reactivate"
  | "courses.view"
  | "courses.create"
  | "courses.edit"
  | "courses.publish"
  | "courses.delete"
  | "learning_paths.view"
  | "learning_paths.edit"
  | "categories.manage"
  | "skills.manage"
  | "quality.view"
  | "quality.run"
  | "content_tools.export"
  | "content_tools.import"
  | "system.view"
  | "staff.view";

export interface PermissionDefinition {
  id: StaffPermission;
  label: string;
  description: string;
  category: "users" | "courses" | "learning_paths" | "content" | "quality" | "system" | "staff";
  isSensitive?: boolean;
}

export const ALL_STAFF_PERMISSIONS: PermissionDefinition[] = [
  // Users
  { id: "users.view", label: "View Users", description: "Inspect learner and user profiles and enrollment summaries", category: "users" },
  { id: "users.suspend", label: "Suspend Accounts", description: "Suspend learner accounts for policy violations", category: "users", isSensitive: true },
  { id: "users.reactivate", label: "Reactivate Accounts", description: "Restore access to suspended learner accounts", category: "users" },

  // Courses
  { id: "courses.view", label: "View All Courses", description: "View all draft and published course records", category: "courses" },
  { id: "courses.create", label: "Create Courses", description: "Draft new courses and modules", category: "courses" },
  { id: "courses.edit", label: "Edit Courses", description: "Modify curriculum, lessons, and practice materials", category: "courses" },
  { id: "courses.publish", label: "Publish & Unpublish Courses", description: "Change public availability of courses", category: "courses", isSensitive: true },
  { id: "courses.delete", label: "Delete Courses", description: "Permanently delete draft courses", category: "courses", isSensitive: true },

  // Learning Paths
  { id: "learning_paths.view", label: "View Learning Paths", description: "Inspect all learning path structures", category: "learning_paths" },
  { id: "learning_paths.edit", label: "Manage Learning Paths", description: "Create, edit, and reorder path sequences", category: "learning_paths" },

  // Content
  { id: "categories.manage", label: "Manage Categories", description: "Create and order course categories", category: "content" },
  { id: "skills.manage", label: "Manage Skills", description: "Create and tag platform skills", category: "content" },
  { id: "content_tools.export", label: "Export Content Packages", description: "Download syllabus backups and JSON dumps", category: "content" },
  { id: "content_tools.import", label: "Import Content Packages", description: "Import bulk course bundles", category: "content", isSensitive: true },

  // Quality & System
  { id: "quality.view", label: "View Content Quality", description: "Inspect quality check health reports", category: "quality" },
  { id: "quality.run", label: "Execute Quality Checks", description: "Trigger deep content validation engine", category: "quality" },
  { id: "system.view", label: "View System Health", description: "Access server latency, telemetry, and diagnostics", category: "system" },
  { id: "staff.view", label: "View Staff Members", description: "Inspect instructor and sub-admin team members", category: "staff" },
];

export const PERMISSION_PRESETS: Record<string, { label: string; description: string; permissions: StaffPermission[] }> = {
  content_manager: {
    label: "Content Manager",
    description: "Full content authoring and learning path management without user suspension powers.",
    permissions: [
      "courses.view",
      "courses.create",
      "courses.edit",
      "learning_paths.view",
      "learning_paths.edit",
      "categories.manage",
      "skills.manage",
      "quality.view",
      "quality.run",
      "content_tools.export",
    ],
  },
  user_support: {
    label: "User Support",
    description: "Learner account inspection and policy enforcement.",
    permissions: [
      "users.view",
      "users.suspend",
      "users.reactivate",
      "courses.view",
    ],
  },
  content_and_users: {
    label: "Content + Users",
    description: "Curriculum management combined with user support authority.",
    permissions: [
      "users.view",
      "users.suspend",
      "users.reactivate",
      "courses.view",
      "courses.create",
      "courses.edit",
      "learning_paths.view",
      "learning_paths.edit",
      "quality.view",
      "quality.run",
    ],
  },
  full_sub_admin: {
    label: "Full Sub-Admin",
    description: "Broad operational capabilities across content, users, and quality (excludes root admin management).",
    permissions: [
      "users.view",
      "users.suspend",
      "users.reactivate",
      "courses.view",
      "courses.create",
      "courses.edit",
      "courses.publish",
      "learning_paths.view",
      "learning_paths.edit",
      "categories.manage",
      "skills.manage",
      "quality.view",
      "quality.run",
      "content_tools.export",
      "system.view",
      "staff.view",
    ],
  },
};

export interface AdminUserSummary {
  id: string;
  fullName: string;
  email: string | null;
  avatarUrl: string | null;
  role: UserRole;
  accountStatus: AccountStatus;
  createdAt: string;
  enrolledCoursesCount: number;
  completedCoursesCount: number;
  assignedCoursesCount: number;
}

export interface AdminUserDetail {
  id: string;
  fullName: string;
  email: string | null;
  avatarUrl: string | null;
  role: UserRole;
  accountStatus: AccountStatus;
  suspendedAt: string | null;
  suspendedBy: { id: string; name: string } | null;
  suspensionReason: string | null;
  createdAt: string;
  stats: {
    enrolledCount: number;
    completedCount: number;
    savedCount: number;
    notesCount: number;
    bookmarksCount: number;
  };
  enrollments: {
    courseId: string;
    courseTitle: string;
    courseSlug: string;
    progressPercent: number;
    status: "active" | "completed";
    enrolledAt: string;
  }[];
  assignedCourses: {
    courseId: string;
    courseTitle: string;
    courseSlug: string;
    assignedAt: string;
  }[];
  permissions: StaffPermission[];
}

export interface StaffMemberListItem {
  id: string;
  fullName: string;
  email: string | null;
  avatarUrl: string | null;
  role: "instructor" | "sub_admin" | "admin";
  accountStatus: AccountStatus;
  createdAt: string;
  assignedCourses: {
    id: string;
    title: string;
    slug: string;
  }[];
  permissions: StaffPermission[];
}

export interface StaffInvitation {
  id: string;
  email: string;
  role: "instructor" | "sub_admin";
  displayName: string | null;
  permissions: StaffPermission[];
  assignedCourseIds: string[];
  token: string;
  status: "pending" | "accepted" | "expired" | "canceled";
  createdBy: string | null;
  createdAt: string;
  expiresAt: string;
  acceptedAt: string | null;
}

export interface AdminAuditLogEntry {
  id: string;
  actor: {
    id: string;
    name: string;
    email: string | null;
  } | null;
  action: string;
  targetType: "user" | "staff" | "course" | "system" | "learning_path" | "category" | "quiz";
  targetId: string | null;
  metadata: Record<string, unknown>;
  createdAt: string;
}
