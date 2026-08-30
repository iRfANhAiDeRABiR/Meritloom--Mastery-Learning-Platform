/**
 * Environment access helpers.
 *
 * Only the public Supabase URL and anon key are ever read here. The
 * service-role key is never referenced anywhere in this codebase. When the
 * project is not configured (e.g. a fresh checkout with no `.env.local`),
 * `isSupabaseConfigured` is false and the data layer degrades to polished
 * empty states instead of throwing during the build or at request time.
 */
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export function getSupabaseConfig() {
  return {
    url: url ?? "",
    anonKey: anonKey ?? "",
  };
}

export const isSupabaseConfigured = Boolean(
  url && anonKey && /^https?:\/\//.test(url),
);
