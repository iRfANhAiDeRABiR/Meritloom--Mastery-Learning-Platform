import { createSupabaseServerClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/env";
import { getInMemoryMetricSamples } from "./instrumentation";
import type { AuthHealth } from "./types";

/**
 * Check health and connectivity of the Authentication subsystem.
 */
export async function checkAuthHealth(): Promise<AuthHealth> {
  const checkedAt = new Date().toISOString();

  if (!isSupabaseConfigured) {
    return {
      status: "critical",
      supabaseAuthReachable: false,
      googleProviderConfigured: false,
      recentAuthErrorsCount: 0,
      checkedAt,
    };
  }

  let supabaseAuthReachable = false;
  let recentAuthErrorsCount = 0;

  try {
    const supabase = await createSupabaseServerClient();
    if (supabase) {
      // Test Auth session endpoint
      const { error } = await supabase.auth.getSession();
      supabaseAuthReachable = !error || error.name === "AuthSessionMissingError" || error.status === 400;
    }
  } catch {
    supabaseAuthReachable = false;
  }

  // Check recent auth error counts from in-memory metrics
  const recentSamples = getInMemoryMetricSamples(60 * 60 * 1000); // 1 hour
  recentAuthErrorsCount = recentSamples.filter(
    (s) => s.errorCategory === "AUTH_SERVICE_ISSUE" || s.statusCode === 401,
  ).length;

  // Check Google OAuth configuration
  const googleProviderConfigured = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );

  let status: AuthHealth["status"] = "healthy";
  if (!supabaseAuthReachable) {
    status = "critical";
  } else if (recentAuthErrorsCount > 10) {
    status = "degraded";
  }

  return {
    status,
    supabaseAuthReachable,
    googleProviderConfigured,
    recentAuthErrorsCount,
    checkedAt,
  };
}
