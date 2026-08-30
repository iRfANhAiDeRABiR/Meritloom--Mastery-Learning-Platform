/**
 * Environment access helpers.
 *
 * Reads public Supabase URL and Publishable / Anon key.
 * When the project is not configured, isSupabaseConfigured is false
 * and the data layer gracefully falls back.
 */
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export function getSupabaseConfig() {
  return {
    url: url ?? "",
    anonKey: anonKey ?? "",
  };
}

export const isSupabaseConfigured = Boolean(
  url && anonKey && /^https?:\/\//.test(url),
);
