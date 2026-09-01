import { createSupabaseServerClient } from "@/lib/supabase/server";
import type {
  AdminAuditLogEntry,
  AdminUserDetail,
  AdminUserSummary,
  StaffMemberListItem,
  StaffPermission,
  UserRole,
} from "@/lib/types/staff";

/**
 * Fetch paginated list of users with search, role, and account status filters.
 */
export async function getAdminUsersList(params: {
  q?: string;
  role?: string;
  status?: string;
  page?: number;
  limit?: number;
}): Promise<{
  users: AdminUserSummary[];
  totalCount: number;
  page: number;
  totalPages: number;
}> {
  const supabase = await createSupabaseServerClient();
  const page = Math.max(1, params.page || 1);
  const limit = Math.max(1, Math.min(100, params.limit || 25));
  const offset = (page - 1) * limit;

  if (!supabase) {
    return { users: [], totalCount: 0, page: 1, totalPages: 1 };
  }

  try {
    let query = supabase
      .from("profiles")
      .select("id, full_name, avatar_url, role, account_status, created_at", { count: "exact" });

    // Filter by search query
    if (params.q && params.q.trim()) {
      const cleanQ = params.q.trim();
      query = query.ilike("full_name", `%${cleanQ}%`);
    }

    // Filter by role
    if (params.role && params.role !== "all") {
      query = query.eq("role", params.role);
    }

    // Filter by status
    if (params.status && params.status !== "all") {
      query = query.eq("account_status", params.status);
    }

    const { data: profiles, count, error } = await query
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (error || !profiles) {
      return { users: [], totalCount: 0, page: 1, totalPages: 1 };
    }

    const userIds = profiles.map((p) => p.id);

    // Batch query counts for enrollments and assigned courses
    const enrollmentsMap = new Map<string, { total: number; completed: number }>();
    const assignmentsMap = new Map<string, number>();

    if (userIds.length > 0) {
      const [enrollRes, assignRes] = await Promise.all([
        supabase
          .from("course_enrollments")
          .select("user_id, status")
          .in("user_id", userIds),
        supabase
          .from("course_instructors")
          .select("user_id")
          .in("user_id", userIds),
      ]);

      if (enrollRes.data) {
        for (const e of enrollRes.data) {
          const curr = enrollmentsMap.get(e.user_id) || { total: 0, completed: 0 };
          curr.total++;
          if (e.status === "completed") curr.completed++;
          enrollmentsMap.set(e.user_id, curr);
        }
      }

      if (assignRes.data) {
        for (const a of assignRes.data) {
          const curr = assignmentsMap.get(a.user_id) || 0;
          assignmentsMap.set(a.user_id, curr + 1);
        }
      }
    }

    const users: AdminUserSummary[] = profiles.map((p) => {
      const enroll = enrollmentsMap.get(p.id) || { total: 0, completed: 0 };
      const assigned = assignmentsMap.get(p.id) || 0;

      return {
        id: p.id,
        fullName: p.full_name || "Learner",
        email: null, // Private, resolved on details screen
        avatarUrl: p.avatar_url,
        role: (p.role as UserRole) || "learner",
        accountStatus: p.account_status || "active",
        createdAt: p.created_at,
        enrolledCoursesCount: enroll.total,
        completedCoursesCount: enroll.completed,
        assignedCoursesCount: assigned,
      };
    });

    const totalCount = count || users.length;
    const totalPages = Math.ceil(totalCount / limit);

    return {
      users,
      totalCount,
      page,
      totalPages,
    };
  } catch {
    return { users: [], totalCount: 0, page: 1, totalPages: 1 };
  }
}

/**
 * Fetch detailed user record including learning history, assigned courses, and permissions.
 */
export async function getAdminUserDetail(userId: string): Promise<AdminUserDetail | null> {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return null;

  try {
    const [
      profileRes,
      enrollRes,
      assignRes,
      permsRes,
      notesRes,
      bookmarksRes,
      savedRes,
    ] = await Promise.all([
      supabase
        .from("profiles")
        .select("id, full_name, avatar_url, role, account_status, suspended_at, suspended_by, suspension_reason, created_at")
        .eq("id", userId)
        .maybeSingle(),
      supabase
        .from("course_enrollments")
        .select("course_id, status, enrolled_at, course:courses(id, title, slug)")
        .eq("user_id", userId),
      supabase
        .from("course_instructors")
        .select("course_id, created_at, course:courses(id, title, slug)")
        .eq("user_id", userId),
      supabase
        .from("staff_permissions")
        .select("permission")
        .eq("staff_user_id", userId),
      supabase
        .from("lesson_notes")
        .select("id", { count: "exact", head: true })
        .eq("user_id", userId),
      supabase
        .from("lesson_bookmarks")
        .select("id", { count: "exact", head: true })
        .eq("user_id", userId),
      supabase
        .from("saved_courses")
        .select("id", { count: "exact", head: true })
        .eq("user_id", userId),
    ]);

    const profile = profileRes.data;
    if (!profile) return null;

    // Resolve suspendedBy profile name if present
    let suspendedByInfo: { id: string; name: string } | null = null;
    if (profile.suspended_by) {
      const { data: suspender } = await supabase
        .from("profiles")
        .select("id, full_name")
        .eq("id", profile.suspended_by)
        .maybeSingle();

      if (suspender) {
        suspendedByInfo = { id: suspender.id, name: suspender.full_name || "Admin" };
      }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const enrollments = (enrollRes.data || []).map((e: any) => {
      const c = Array.isArray(e.course) ? e.course[0] : e.course;
      return {
        courseId: e.course_id,
        courseTitle: c?.title || "Course",
        courseSlug: c?.slug || "",
        progressPercent: e.status === "completed" ? 100 : 0,
        status: (e.status as "active" | "completed") || "active",
        enrolledAt: e.enrolled_at || new Date().toISOString(),
      };
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const assignedCourses = (assignRes.data || []).map((a: any) => {
      const c = Array.isArray(a.course) ? a.course[0] : a.course;
      return {
        courseId: a.course_id,
        courseTitle: c?.title || "Course",
        courseSlug: c?.slug || "",
        assignedAt: a.created_at || new Date().toISOString(),
      };
    });

    const permissions = (permsRes.data || []).map((p) => p.permission as StaffPermission);

    const completedCount = enrollments.filter((e) => e.status === "completed").length;

    return {
      id: profile.id,
      fullName: profile.full_name || "Learner",
      email: null,
      avatarUrl: profile.avatar_url,
      role: (profile.role as UserRole) || "learner",
      accountStatus: profile.account_status || "active",
      suspendedAt: profile.suspended_at,
      suspendedBy: suspendedByInfo,
      suspensionReason: profile.suspension_reason,
      createdAt: profile.created_at,
      stats: {
        enrolledCount: enrollments.length,
        completedCount,
        savedCount: savedRes.count ?? 0,
        notesCount: notesRes.count ?? 0,
        bookmarksCount: bookmarksRes.count ?? 0,
      },
      enrollments,
      assignedCourses,
      permissions,
    };
  } catch {
    return null;
  }
}

/**
 * Fetch staff members list (instructors, sub-admins, and root admins).
 */
export async function getAdminStaffList(params?: {
  tab?: "all" | "sub_admins" | "instructors";
}): Promise<StaffMemberListItem[]> {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return [];

  try {
    let query = supabase
      .from("profiles")
      .select("id, full_name, avatar_url, role, account_status, created_at")
      .in("role", ["instructor", "sub_admin", "admin"]);

    if (params?.tab === "sub_admins") {
      query = query.in("role", ["sub_admin", "admin"]);
    } else if (params?.tab === "instructors") {
      query = query.eq("role", "instructor");
    }

    const { data: profiles } = await query.order("created_at", { ascending: false });

    if (!profiles || profiles.length === 0) return [];

    const staffIds = profiles.map((p) => p.id);

    const [assignRes, permsRes] = await Promise.all([
      supabase
        .from("course_instructors")
        .select("user_id, course:courses(id, title, slug)")
        .in("user_id", staffIds),
      supabase
        .from("staff_permissions")
        .select("staff_user_id, permission")
        .in("staff_user_id", staffIds),
    ]);

    const assignmentsMap = new Map<string, { id: string; title: string; slug: string }[]>();
    if (assignRes.data) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      for (const a of assignRes.data as any[]) {
        const c = Array.isArray(a.course) ? a.course[0] : a.course;
        if (c) {
          const list = assignmentsMap.get(a.user_id) || [];
          list.push({ id: c.id, title: c.title, slug: c.slug });
          assignmentsMap.set(a.user_id, list);
        }
      }
    }

    const permsMap = new Map<string, StaffPermission[]>();
    if (permsRes.data) {
      for (const p of permsRes.data) {
        const list = permsMap.get(p.staff_user_id) || [];
        list.push(p.permission as StaffPermission);
        permsMap.set(p.staff_user_id, list);
      }
    }

    return profiles.map((p) => ({
      id: p.id,
      fullName: p.full_name || "Staff Member",
      email: null,
      avatarUrl: p.avatar_url,
      role: (p.role as "instructor" | "sub_admin" | "admin") || "instructor",
      accountStatus: p.account_status || "active",
      createdAt: p.created_at,
      assignedCourses: assignmentsMap.get(p.id) || [],
      permissions: permsMap.get(p.id) || [],
    }));
  } catch {
    return [];
  }
}

/**
 * Fetch paginated administrative audit logs.
 */
export async function getAdminAuditLogs(params?: {
  action?: string;
  targetType?: string;
  page?: number;
  limit?: number;
}): Promise<{
  logs: AdminAuditLogEntry[];
  totalCount: number;
  page: number;
  totalPages: number;
}> {
  const supabase = await createSupabaseServerClient();
  const page = Math.max(1, params?.page || 1);
  const limit = Math.max(1, Math.min(100, params?.limit || 30));
  const offset = (page - 1) * limit;

  if (!supabase) {
    return { logs: [], totalCount: 0, page: 1, totalPages: 1 };
  }

  try {
    let query = supabase
      .from("admin_audit_log")
      .select("id, actor_user_id, action, target_type, target_id, metadata, created_at, actor:profiles!admin_audit_log_actor_user_id_fkey(id, full_name)", { count: "exact" });

    if (params?.action && params.action !== "all") {
      query = query.eq("action", params.action);
    }

    if (params?.targetType && params.targetType !== "all") {
      query = query.eq("target_type", params.targetType);
    }

    const { data, count, error } = await query
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (error || !data) {
      return { logs: [], totalCount: 0, page: 1, totalPages: 1 };
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const logs: AdminAuditLogEntry[] = data.map((row: any) => {
      const act = Array.isArray(row.actor) ? row.actor[0] : row.actor;
      return {
        id: row.id,
        actor: act ? { id: act.id, name: act.full_name || "Admin", email: null } : null,
        action: row.action,
        targetType: row.target_type,
        targetId: row.target_id,
        metadata: row.metadata || {},
        createdAt: row.created_at,
      };
    });

    const totalCount = count || logs.length;
    const totalPages = Math.ceil(totalCount / limit);

    return {
      logs,
      totalCount,
      page,
      totalPages,
    };
  } catch {
    return { logs: [], totalCount: 0, page: 1, totalPages: 1 };
  }
}

/**
 * Fetch all platform courses for instructor assignment picker.
 */
export async function getAvailableCoursesForAssignment(): Promise<{
  id: string;
  title: string;
  slug: string;
  isPublished: boolean;
}[]> {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return [];

  try {
    const { data } = await supabase
      .from("courses")
      .select("id, title, slug, is_published")
      .order("title", { ascending: true });

    return (data || []).map((c) => ({
      id: c.id,
      title: c.title,
      slug: c.slug,
      isPublished: Boolean(c.is_published),
    }));
  } catch {
    return [];
  }
}
