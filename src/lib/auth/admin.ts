import { cache } from "react";
import { notFound, redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

import type { AvailableWorkspaces, StaffPermission } from "@/lib/types/staff";
import { resolveAvailableWorkspaces } from "@/lib/auth/workspaces";
import { resolveUserAvatar } from "@/lib/profile/avatar";

export interface AdminUserSession {
  user: {
    id: string;
    email?: string | null;
  };
  profile: {
    id: string;
    name: string;
    avatarUrl: string | null;
    role: "admin" | "sub_admin";
    accountStatus?: string;
    permissions?: StaffPermission[];
  };
  workspaces: AvailableWorkspaces;
}

/**
 * Server-only admin authorization guard.
 *
 * Verifies that the user is authenticated, active, and has an 'admin' or 'sub_admin' role in Supabase.
 * - If unauthenticated: redirects to /auth/sign-in?next=/admin
 * - If suspended: redirects to /account-suspended
 * - If authenticated learner (not admin/sub_admin): triggers notFound() so private admin routes are not disclosed
 * - If authorized: returns the verified admin session
 *
 * Request-memoized via React `cache()` so calling it across layout, page, and components
 * executes at most once per HTTP request.
 */
export const requireAdmin = cache(async function requireAdmin(): Promise<AdminUserSession> {
  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    redirect("/auth/sign-in?next=/admin");
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/sign-in?next=/admin");
  }

  // 1. Query profiles role from database
  const { data: profile } = await supabase
    .from("profiles")
    .select("id, full_name, avatar_url, role, account_status")
    .eq("id", user.id)
    .maybeSingle();

  if (profile?.account_status === "suspended") {
    redirect("/account-suspended");
  }

  const isDbAdmin = profile?.role === "admin" || profile?.role === "sub_admin";
  const isMetaAdmin = user.user_metadata?.role === "admin";

  if (!isDbAdmin && !isMetaAdmin) {
    // Hide existence of admin panel from regular learners
    notFound();
  }

  const metadata = user.user_metadata ?? {};
  const name =
    profile?.full_name ||
    (typeof metadata.full_name === "string" && metadata.full_name) ||
    user.email?.split("@")[0] ||
    "Admin";

  const resolvedRole = (profile?.role === "sub_admin" ? "sub_admin" : "admin") as "admin" | "sub_admin";
  let permissions: StaffPermission[] | undefined = undefined;

  if (resolvedRole === "sub_admin") {
    const { data: perms } = await supabase
      .from("staff_permissions")
      .select("permission")
      .eq("staff_user_id", user.id);

    permissions = (perms || []).map((p) => p.permission as StaffPermission);
  }

  const workspaces = await resolveAvailableWorkspaces(user.id, resolvedRole);

  const resolvedAvatar = resolveUserAvatar(
    profile?.avatar_url,
    (typeof metadata.avatar_url === "string" && metadata.avatar_url) ||
      (typeof metadata.picture === "string" && metadata.picture) ||
      null,
  );

  return {
    user: {
      id: user.id,
      email: user.email,
    },
    profile: {
      id: user.id,
      name,
      avatarUrl: resolvedAvatar.src,
      role: resolvedRole,
      accountStatus: profile?.account_status || "active",
      permissions,
    },
    workspaces,
  };
});

/**
 * Non-throwing check if current user has admin privileges.
 * Request-memoized via React `cache()`.
 */
export const checkIsAdmin = cache(async function checkIsAdmin(): Promise<boolean> {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return false;

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return false;

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();

    return profile?.role === "admin" || user.user_metadata?.role === "admin";
  } catch {
    return false;
  }
});
