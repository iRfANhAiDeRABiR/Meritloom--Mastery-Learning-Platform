"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  assertCanManageUser,
  requireAdminSession,
  requireRootAdmin,
  requireStaffPermission,
} from "@/lib/auth/rbac";
import type { StaffPermission, UserRole } from "@/lib/types/staff";

/**
 * Suspend a user account with an internal reason.
 */
export async function suspendUserAction(userId: string, reason?: string) {
  try {
    const session = await requireStaffPermission("users.suspend");
    const supabase = await createSupabaseServerClient();
    if (!supabase) throw new Error("Database connection unavailable");

    // Fetch target user profile
    const { data: targetProfile, error: targetError } = await supabase
      .from("profiles")
      .select("id, role, account_status")
      .eq("id", userId)
      .maybeSingle();

    if (targetError || !targetProfile) {
      throw new Error("Target user account not found");
    }

    // Enforce hierarchy rules
    assertCanManageUser(
      { id: session.user.id, role: session.profile.role },
      { id: targetProfile.id, role: targetProfile.role as UserRole },
      "suspend",
    );

    const suspendedAt = new Date().toISOString();
    const cleanReason = reason?.trim() || "Administrative policy violation";

    const { error: updateError } = await supabase
      .from("profiles")
      .update({
        account_status: "suspended",
        suspended_at: suspendedAt,
        suspended_by: session.user.id,
        suspension_reason: cleanReason,
      })
      .eq("id", userId);

    if (updateError) {
      throw new Error(`Failed to suspend account: ${updateError.message}`);
    }

    // Record immutable audit event
    await supabase.rpc("record_admin_audit_event", {
      p_actor_id: session.user.id,
      p_action: "user_suspended",
      p_target_type: "user",
      p_target_id: userId,
      p_metadata: {
        reason: cleanReason,
        targetRole: targetProfile.role,
      },
    });

    revalidatePath("/admin/users");
    revalidatePath(`/admin/users/${userId}`);
    revalidatePath("/admin/staff");

    return { success: true };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to suspend account",
    };
  }
}

/**
 * Reactivate a suspended user account.
 */
export async function reactivateUserAction(userId: string) {
  try {
    const session = await requireStaffPermission("users.reactivate");
    const supabase = await createSupabaseServerClient();
    if (!supabase) throw new Error("Database connection unavailable");

    const { data: targetProfile, error: targetError } = await supabase
      .from("profiles")
      .select("id, role, account_status")
      .eq("id", userId)
      .maybeSingle();

    if (targetError || !targetProfile) {
      throw new Error("Target user account not found");
    }

    assertCanManageUser(
      { id: session.user.id, role: session.profile.role },
      { id: targetProfile.id, role: targetProfile.role as UserRole },
      "reactivate",
    );

    const { error: updateError } = await supabase
      .from("profiles")
      .update({
        account_status: "active",
        suspended_at: null,
        suspended_by: null,
        suspension_reason: null,
      })
      .eq("id", userId);

    if (updateError) {
      throw new Error(`Failed to reactivate account: ${updateError.message}`);
    }

    await supabase.rpc("record_admin_audit_event", {
      p_actor_id: session.user.id,
      p_action: "user_reactivated",
      p_target_type: "user",
      p_target_id: userId,
      p_metadata: {
        targetRole: targetProfile.role,
      },
    });

    revalidatePath("/admin/users");
    revalidatePath(`/admin/users/${userId}`);
    revalidatePath("/admin/staff");

    return { success: true };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to reactivate account",
    };
  }
}

/**
 * Change user role (Root Admin only).
 */
export async function changeUserRoleAction(userId: string, newRole: UserRole) {
  try {
    const session = await requireRootAdmin();
    const supabase = await createSupabaseServerClient();
    if (!supabase) throw new Error("Database connection unavailable");

    if (!["learner", "instructor", "sub_admin"].includes(newRole)) {
      throw new Error("Invalid role selection");
    }

    const { data: targetProfile, error: targetError } = await supabase
      .from("profiles")
      .select("id, role")
      .eq("id", userId)
      .maybeSingle();

    if (targetError || !targetProfile) {
      throw new Error("Target user not found");
    }

    assertCanManageUser(
      { id: session.user.id, role: session.profile.role },
      { id: targetProfile.id, role: targetProfile.role as UserRole },
      "change_role",
    );

    const previousRole = targetProfile.role;

    const { error: updateError } = await supabase
      .from("profiles")
      .update({ role: newRole })
      .eq("id", userId);

    if (updateError) {
      throw new Error(`Failed to update role: ${updateError.message}`);
    }

    await supabase.rpc("record_admin_audit_event", {
      p_actor_id: session.user.id,
      p_action: "role_changed",
      p_target_type: "user",
      p_target_id: userId,
      p_metadata: {
        previousRole,
        newRole,
      },
    });

    revalidatePath("/admin/users");
    revalidatePath(`/admin/users/${userId}`);
    revalidatePath("/admin/staff");
    revalidatePath(`/admin/staff/${userId}`);

    return { success: true };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to change user role",
    };
  }
}

/**
 * Update sub-admin staff permissions (Root Admin only).
 */
export async function updateStaffPermissionsAction(
  staffUserId: string,
  permissions: StaffPermission[],
) {
  try {
    const session = await requireRootAdmin();
    const supabase = await createSupabaseServerClient();
    if (!supabase) throw new Error("Database connection unavailable");

    // 1. Delete current permissions
    await supabase
      .from("staff_permissions")
      .delete()
      .eq("staff_user_id", staffUserId);

    // 2. Insert new permissions
    if (permissions.length > 0) {
      const rows = permissions.map((p) => ({
        staff_user_id: staffUserId,
        permission: p,
        created_by: session.user.id,
      }));

      const { error: insertError } = await supabase
        .from("staff_permissions")
        .insert(rows);

      if (insertError) {
        throw new Error(`Failed to save permissions: ${insertError.message}`);
      }
    }

    await supabase.rpc("record_admin_audit_event", {
      p_actor_id: session.user.id,
      p_action: "permissions_updated",
      p_target_type: "staff",
      p_target_id: staffUserId,
      p_metadata: {
        permissionsCount: permissions.length,
        permissions,
      },
    });

    revalidatePath(`/admin/staff/${staffUserId}`);
    revalidatePath(`/admin/users/${staffUserId}`);

    return { success: true };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to update permissions",
    };
  }
}

/**
 * Assign or update course assignments for an instructor.
 */
export async function assignInstructorCoursesAction(
  instructorUserId: string,
  courseIds: string[],
) {
  try {
    const session = await requireAdminSession();
    const supabase = await createSupabaseServerClient();
    if (!supabase) throw new Error("Database connection unavailable");

    // 1. Delete current assignments
    await supabase
      .from("course_instructors")
      .delete()
      .eq("user_id", instructorUserId);

    // 2. Insert new assignments
    if (courseIds.length > 0) {
      const rows = courseIds.map((cId) => ({
        course_id: cId,
        user_id: instructorUserId,
        role: "instructor",
        assigned_by: session.user.id,
      }));

      const { error: insertError } = await supabase
        .from("course_instructors")
        .insert(rows);

      if (insertError) {
        throw new Error(`Failed to assign courses: ${insertError.message}`);
      }
    }

    await supabase.rpc("record_admin_audit_event", {
      p_actor_id: session.user.id,
      p_action: "instructor_courses_assigned",
      p_target_type: "staff",
      p_target_id: instructorUserId,
      p_metadata: {
        assignedCount: courseIds.length,
        courseIds,
      },
    });

    revalidatePath(`/admin/staff/${instructorUserId}`);
    revalidatePath(`/admin/users/${instructorUserId}`);
    revalidatePath("/admin/courses");

    return { success: true };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to assign instructor courses",
    };
  }
}

/**
 * Send staff invitation (Root Admin only).
 */
export async function inviteStaffMemberAction(params: {
  email: string;
  role: "instructor" | "sub_admin";
  displayName?: string;
  permissions?: StaffPermission[];
  assignedCourseIds?: string[];
}) {
  try {
    const session = await requireRootAdmin();
    const supabase = await createSupabaseServerClient();
    if (!supabase) throw new Error("Database connection unavailable");

    const cleanEmail = params.email.trim().toLowerCase();
    if (!cleanEmail.includes("@")) {
      throw new Error("Invalid email address");
    }

    const token = crypto.randomUUID();

    const { error: insertError } = await supabase
      .from("staff_invitations")
      .insert({
        email: cleanEmail,
        role: params.role,
        display_name: params.displayName?.trim() || null,
        permissions: params.permissions || [],
        assigned_course_ids: params.assignedCourseIds || [],
        token,
        status: "pending",
        created_by: session.user.id,
      });

    if (insertError) {
      throw new Error(`Failed to create invitation: ${insertError.message}`);
    }

    await supabase.rpc("record_admin_audit_event", {
      p_actor_id: session.user.id,
      p_action: "staff_invited",
      p_target_type: "staff",
      p_metadata: {
        email: cleanEmail,
        role: params.role,
      },
    });

    revalidatePath("/admin/staff");

    return { success: true };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to send staff invitation",
    };
  }
}
