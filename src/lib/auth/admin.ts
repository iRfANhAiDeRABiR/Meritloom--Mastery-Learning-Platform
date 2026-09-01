import { notFound, redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export interface AdminUserSession {
  user: {
    id: string;
    email?: string | null;
  };
  profile: {
    id: string;
    name: string;
    avatarUrl: string | null;
    role: "admin";
  };
}

/**
 * Server-only admin authorization guard.
 *
 * Verifies that the user is authenticated and has an 'admin' role in Supabase.
 * - If unauthenticated: redirects to /auth/sign-in?next=/admin
 * - If authenticated learner (not admin): triggers notFound() so private admin routes are not disclosed
 * - If authorized: returns the verified admin session
 */
export async function requireAdmin(): Promise<AdminUserSession> {
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
    .select("id, full_name, avatar_url, role")
    .eq("id", user.id)
    .maybeSingle();

  const isDbAdmin = profile?.role === "admin";
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

  return {
    user: {
      id: user.id,
      email: user.email,
    },
    profile: {
      id: user.id,
      name,
      avatarUrl: profile?.avatar_url || (typeof metadata.avatar_url === "string" ? metadata.avatar_url : null),
      role: "admin",
    },
  };
}

/**
 * Non-throwing check if current user has admin privileges.
 */
export async function checkIsAdmin(): Promise<boolean> {
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
}
