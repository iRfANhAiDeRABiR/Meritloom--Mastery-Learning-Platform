import { notFound, redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { StaffPermission, UserRole } from "@/lib/types/staff";

export interface AuthenticatedUserSession {
  user: {
    id: string;
    email?: string | null;
  };
  profile: {
    id: string;
    name: string;
    avatarUrl: string | null;
    role: UserRole;
    accountStatus: "active" | "suspended";
    permissions?: StaffPermission[];
  };
}

/**
 * Ensures the currently authenticated user has an active, non-suspended account.
 * Redirects suspended users to /account-suspended.
 */
export async function requireActiveUser(): Promise<AuthenticatedUserSession> {
  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    redirect("/auth/sign-in");
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/sign-in");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, full_name, avatar_url, role, account_status")
    .eq("id", user.id)
    .maybeSingle();

  if (profile?.account_status === "suspended") {
    redirect("/account-suspended");
  }

  const metadata = user.user_metadata ?? {};
  const name =
    profile?.full_name ||
    (typeof metadata.full_name === "string" && metadata.full_name) ||
    user.email?.split("@")[0] ||
    "User";

  return {
    user: {
      id: user.id,
      email: user.email,
    },
    profile: {
      id: user.id,
      name,
      avatarUrl: profile?.avatar_url || (typeof metadata.avatar_url === "string" ? metadata.avatar_url : null),
      role: (profile?.role as UserRole) || "learner",
      accountStatus: profile?.account_status || "active",
    },
  };
}

/**
 * Requires either Root Admin or Sub-Admin role with an active account.
 */
export async function requireAdminSession(): Promise<AuthenticatedUserSession> {
  const session = await requireActiveUser();
  const role = session.profile.role;

  if (role !== "admin" && role !== "sub_admin") {
    notFound();
  }

  // If sub_admin, load permissions
  if (role === "sub_admin") {
    const supabase = await createSupabaseServerClient();
    if (supabase) {
      const { data: perms } = await supabase
        .from("staff_permissions")
        .select("permission")
        .eq("staff_user_id", session.user.id);

      session.profile.permissions = (perms || []).map((p) => p.permission as StaffPermission);
    }
  }

  return session;
}

/**
 * Requires Root Admin role specifically (not Sub-Admin).
 */
export async function requireRootAdmin(): Promise<AuthenticatedUserSession> {
  const session = await requireActiveUser();
  if (session.profile.role !== "admin") {
    notFound();
  }
  return session;
}

/**
 * Requires specific staff permission (Root Admin automatically bypasses all permission checks).
 */
export async function requireStaffPermission(permission: StaffPermission): Promise<AuthenticatedUserSession> {
  const session = await requireAdminSession();

  // Root Admin has all permissions
  if (session.profile.role === "admin") {
    return session;
  }

  // Sub-admin permission verification
  const permissions = session.profile.permissions || [];
  if (!permissions.includes(permission)) {
    throw new Error(`Forbidden: Missing required staff permission [${permission}]`);
  }

  return session;
}

/**
 * Requires instructor authorization for a specific course (Root Admin, authorized Sub-Admin, or Assigned Instructor).
 */
export async function requireCourseInstructor(courseId: string): Promise<AuthenticatedUserSession> {
  const session = await requireActiveUser();
  const { role } = session.profile;

  if (role === "admin") {
    return session;
  }

  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    notFound();
  }

  if (role === "sub_admin") {
    // Check if sub-admin has courses.edit permission
    const { data: perm } = await supabase
      .from("staff_permissions")
      .select("id")
      .eq("staff_user_id", session.user.id)
      .eq("permission", "courses.edit")
      .maybeSingle();

    if (perm) return session;
  }

  if (role === "instructor") {
    // Check assignment in course_instructors
    const { data: assignment } = await supabase
      .from("course_instructors")
      .select("id")
      .eq("course_id", courseId)
      .eq("user_id", session.user.id)
      .maybeSingle();

    if (assignment) return session;
  }

  notFound();
}

/**
 * Hierarchy & self-protection validator.
 */
export function assertCanManageUser(
  actor: { id: string; role: UserRole },
  target: { id: string; role: UserRole },
  action: "suspend" | "reactivate" | "change_role" | "edit_permissions",
): void {
  // 1. Self-protection: Admin/Staff cannot suspend or demote themselves
  if (actor.id === target.id) {
    if (action === "suspend") {
      throw new Error("You cannot suspend your own account.");
    }
    if (action === "change_role" && actor.role === "admin") {
      throw new Error("You cannot remove your own Root Admin privileges.");
    }
  }

  // 2. Root Admin can manage learners, instructors, and sub-admins
  if (actor.role === "admin") {
    if (target.role === "admin" && actor.id !== target.id) {
      throw new Error("Root Administrators cannot be modified by other users.");
    }
    return;
  }

  // 3. Sub-Admins cannot target Root Admins or other Sub-Admins
  if (actor.role === "sub_admin") {
    if (target.role === "admin") {
      throw new Error("Sub-Admins cannot modify Root Administrators.");
    }
    if (target.role === "sub_admin") {
      throw new Error("Sub-Admins cannot modify other Sub-Admins.");
    }
    if (action === "change_role" || action === "edit_permissions") {
      throw new Error("Sub-Admins cannot assign roles or permissions.");
    }
    return;
  }

  // 4. Instructors and Learners have zero management authority
  throw new Error("Unauthorized: You do not have permission to manage accounts.");
}
