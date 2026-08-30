"use client";

import { createBrowserClient } from "@supabase/ssr";

import { getSupabaseConfig } from "@/lib/env";

/**
 * Create a Supabase client for Client Components.
 *
 * Uses the public anon key only. Intended for interactive auth flows in later
 * pages (sign-in/sign-up); the landing page itself stays server-rendered.
 */
export function createSupabaseBrowserClient() {
  const { url, anonKey } = getSupabaseConfig();
  return createBrowserClient(url, anonKey);
}
