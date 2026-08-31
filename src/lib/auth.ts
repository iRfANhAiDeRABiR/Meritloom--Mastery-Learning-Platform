import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { LearnerProfile } from "@/lib/types";

/**
 * Resolve the signed-in learner from the request cookies, if any.
 *
 * Returns `null` when Supabase is not configured, when there is no session, or
 * when the lookup fails — the landing page must never break because of auth.
 */
export async function getCurrentUser(): Promise<LearnerProfile | null> {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return null;

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return null;

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();

    const metadata = user.user_metadata ?? {};
    const name =
      (typeof metadata.full_name === "string" && metadata.full_name) ||
      (typeof metadata.name === "string" && metadata.name) ||
      user.email?.split("@")[0] ||
      "Learner";

    const role = (profile?.role === "admin" || metadata.role === "admin"
      ? "admin"
      : "learner") as "learner" | "admin";

    return {
      id: user.id,
      name,
      avatarUrl:
        typeof metadata.avatar_url === "string" ? metadata.avatar_url : null,
      email: user.email,
      role,
    };
  } catch {
    return null;
  }
}
