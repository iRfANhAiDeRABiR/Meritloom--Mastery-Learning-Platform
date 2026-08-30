import { createServerClient } from "@supabase/ssr";
import type { NextRequest, NextResponse } from "next/server";

import { getSupabaseConfig, isSupabaseConfigured } from "@/lib/env";

/**
 * Refresh the Supabase session on every request and persist any rotated auth
 * tokens onto the outgoing response. Used from `src/proxy.ts`.
 *
 * When Supabase is not configured the request passes straight through so the
 * app never crashes without env vars present.
 */
export async function updateSession(
  request: NextRequest,
  response: NextResponse,
) {
  if (!isSupabaseConfigured) return response;

  const { url, anonKey } = getSupabaseConfig();

  const supabase = createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        for (const { name, value } of cookiesToSet) {
          request.cookies.set(name, value);
        }
        for (const { name, value, options } of cookiesToSet) {
          response.cookies.set(name, value, options);
        }
      },
    },
  });

  // IMPORTANT: do not remove — this refreshes the auth token when it expires.
  await supabase.auth.getUser();

  return response;
}
