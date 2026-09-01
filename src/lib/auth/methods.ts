import type { User } from "@supabase/supabase-js";

export interface UserAuthMethods {
  hasPassword: boolean;
  hasGoogle: boolean;
  primaryProvider: "email" | "google" | "unknown";
}

/**
 * Safely determine authentication providers and credentials configured for a user.
 * Inspects trusted user.app_metadata.providers, user.app_metadata.provider, and user.identities.
 */
export function getUserAuthMethods(user: User | null): UserAuthMethods {
  if (!user) {
    return {
      hasPassword: false,
      hasGoogle: false,
      primaryProvider: "unknown",
    };
  }

  const appProviders: string[] = Array.isArray(user.app_metadata?.providers)
    ? user.app_metadata.providers
    : typeof user.app_metadata?.provider === "string"
    ? [user.app_metadata.provider]
    : [];

  const identities = Array.isArray(user.identities) ? user.identities : [];
  const identityProviders = identities.map((i) => i.provider);

  const allProviders = new Set<string>([...appProviders, ...identityProviders]);

  const hasPassword = allProviders.has("email");
  const hasGoogle = allProviders.has("google");

  let primaryProvider: "email" | "google" | "unknown" = "email";
  if (hasGoogle && !hasPassword) {
    primaryProvider = "google";
  } else if (!hasGoogle && hasPassword) {
    primaryProvider = "email";
  } else if (hasGoogle && hasPassword) {
    primaryProvider = user.app_metadata?.provider === "google" ? "google" : "email";
  } else if (allProviders.size === 0) {
    // Default fallback for legacy email accounts
    primaryProvider = "email";
  }

  return {
    hasPassword: hasPassword || (!hasGoogle && allProviders.size === 0),
    hasGoogle,
    primaryProvider,
  };
}
