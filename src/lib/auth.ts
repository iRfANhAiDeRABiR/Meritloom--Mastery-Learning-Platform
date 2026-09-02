import { cache } from "react";
import { resolveAvailableWorkspaces } from "@/lib/auth/workspaces";
import { resolveUserAvatar } from "@/lib/profile/avatar";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { LearnerProfile } from "@/lib/types";
import type { UserRole } from "@/lib/types/staff";

/**
 * Resolve the signed-in learner from the request cookies, if any.
 *
 * Request-memoized using React `cache()` so multiple layout, page, and component
 * calls within the same request lifecycle execute at most once.
 */
export const getCurrentUser = cache(async function getCurrentUser(): Promise<LearnerProfile | null> {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return null;

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return null;

    const { data: profile } = await supabase
      .from("profiles")
      .select("role, full_name, avatar_url, account_status")
      .eq("id", user.id)
      .maybeSingle();

    if (profile?.account_status === "suspended") {
      return null;
    }

    const metadata = user.user_metadata ?? {};
    const name =
      (typeof profile?.full_name === "string" && profile.full_name.trim()) ||
      (typeof metadata.full_name === "string" && metadata.full_name.trim()) ||
      (typeof metadata.name === "string" && metadata.name.trim()) ||
      user.email?.split("@")[0] ||
      "Learner";

    const resolvedAvatar = resolveUserAvatar(
      profile?.avatar_url,
      (typeof metadata.avatar_url === "string" && metadata.avatar_url) ||
        (typeof metadata.picture === "string" && metadata.picture) ||
        null,
    );

    const role = ((profile?.role as UserRole) ||
      (metadata.role as UserRole) ||
      "learner") as UserRole;

    const workspaces = await resolveAvailableWorkspaces(user.id, role);

    return {
      id: user.id,
      name,
      avatarUrl: resolvedAvatar.src,
      email: user.email,
      role,
      workspaces,
    };
  } catch {
    return null;
  }
});
