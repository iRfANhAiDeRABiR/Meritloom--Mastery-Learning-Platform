/**
 * Shared avatar resolution strategy for Meritloom.
 *
 * Precedence:
 * 1. Valid custom Meritloom profile avatar (`profiles.avatar_url`)
 * 2. Valid Google OAuth avatar (`user_metadata.avatar_url` or `user_metadata.picture`)
 * 3. `null` fallback (initiates letter initials in <Avatar /> component)
 */

export interface ResolvedAvatar {
  src: string | null;
  kind: "custom" | "google" | "fallback";
}

/**
 * Checks if a string is a valid non-empty URL or path.
 */
function isValidImageUrl(url: unknown): url is string {
  if (typeof url !== "string") return false;
  const trimmed = url.trim();
  if (!trimmed || trimmed === "" || trimmed === "null" || trimmed === "undefined") {
    return false;
  }

  // Allow relative paths
  if (trimmed.startsWith("/")) return true;

  // Allow http / https protocols
  try {
    const parsed = new URL(trimmed);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

/**
 * Resolves storage object paths or URLs into canonical avatar URLs.
 */
export function resolveUserAvatar(
  customAvatarUrl?: string | null,
  googleAvatarUrl?: string | null,
): ResolvedAvatar {
  // 1. Check custom avatar URL
  if (isValidImageUrl(customAvatarUrl)) {
    const trimmed = customAvatarUrl.trim();
    // If it's a relative storage path without domain, resolve against Supabase Storage
    if (!trimmed.startsWith("http://") && !trimmed.startsWith("https://") && !trimmed.startsWith("/")) {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      if (supabaseUrl) {
        return {
          src: `${supabaseUrl}/storage/v1/object/public/avatars/${trimmed}`,
          kind: "custom",
        };
      }
    }

    return {
      src: trimmed,
      kind: "custom",
    };
  }

  // 2. Check Google OAuth avatar
  if (isValidImageUrl(googleAvatarUrl)) {
    return {
      src: googleAvatarUrl.trim(),
      kind: "google",
    };
  }

  // 3. Fallback to initials
  return {
    src: null,
    kind: "fallback",
  };
}

