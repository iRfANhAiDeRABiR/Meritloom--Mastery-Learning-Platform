import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

import { getSupabaseConfig, isSupabaseConfigured } from "@/lib/env";

/**
 * Create a per-request Supabase server client.
 *
 * Reads the session from request cookies and, when possible, writes refreshed
 * auth cookies back. Returns `null` when Supabase is not configured so callers
 * can degrade to empty states instead of crashing.
 */
export async function createSupabaseServerClient() {
  if (!isSupabaseConfigured) return null;

  const { url, anonKey } = getSupabaseConfig();
  let cookieStore: Awaited<ReturnType<typeof cookies>> | null = null;
  try {
    cookieStore = await cookies();
  } catch {
    // Called outside Next.js request context (e.g. static generation, background tasks, or scripts)
  }

  return createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return cookieStore?.getAll?.() ?? [];
      },
      setAll(cookiesToSet) {
        if (!cookieStore) return;
        try {
          for (const { name, value, options } of cookiesToSet) {
            cookieStore.set(name, value, options);
          }
        } catch {
          // Called from a Server Component where cookie writes are a no-op.
          // The middleware handles refreshing sessions in that case.
        }
      },
    },
  });
}
