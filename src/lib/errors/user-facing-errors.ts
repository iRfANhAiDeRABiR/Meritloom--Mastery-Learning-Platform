/**
 * Centralized mapping of technical / Supabase / network errors
 * to user-friendly, non-technical toast copy.
 *
 * Components should NOT interpret raw Supabase exceptions.
 * Use getUserFacingError() instead.
 */

export type ErrorCode =
  | "auth.invalid_credentials"
  | "auth.email_not_confirmed"
  | "auth.rate_limit"
  | "auth.session_expired"
  | "auth.permission_denied"
  | "duplicate.slug"
  | "duplicate.bookmark"
  | "duplicate.enrollment"
  | "network.offline"
  | "network.timeout"
  | "database.generic"
  | "validation.generic";

export interface UserFacingError {
  title: string;
  description?: string;
  code?: ErrorCode;
}

/**
 * Map a raw error (Supabase PostgrestError, AuthError, generic Error or string)
 * to a friendly title + description pair suitable for a toast.
 */
export function getUserFacingError(
  error: unknown,
  fallbackTitle = "Something went wrong",
  fallbackDescription = "Please try again.",
): UserFacingError {
  const raw =
    typeof error === "string"
      ? error
      : error && typeof error === "object" && "message" in error
        ? String((error as { message: unknown }).message)
        : "";

  const code =
    error && typeof error === "object" && "code" in error
      ? String((error as { code: unknown }).code)
      : undefined;

  const lower = raw.toLowerCase();

  // Network / fetch failures
  if (
    lower.includes("failed to fetch") ||
    lower.includes("networkerror") ||
    lower.includes("network request failed") ||
    lower.includes("fetch failed") ||
    (typeof navigator !== "undefined" && !navigator.onLine)
  ) {
    return {
      title: "Connection problem",
      description: "Check your internet connection and try again.",
      code: "network.offline",
    };
  }

  // Auth expired / session
  if (
    lower.includes("jwt expired") ||
    lower.includes("session expired") ||
    lower.includes("not authenticated") ||
    lower.includes("auth session missing") ||
    lower.includes("please sign in")
  ) {
    return {
      title: "Session expired",
      description: "Sign in again to continue.",
      code: "auth.session_expired",
    };
  }

  if (lower.includes("permission") || lower.includes("not allowed") || lower.includes("unauthorized") || code === "42501") {
    return {
      title: "You don't have permission to do that",
      code: "auth.permission_denied",
    };
  }

  // Duplicate / unique violations
  if (code === "23505" || lower.includes("duplicate key") || lower.includes("already exists") || lower.includes("already in use")) {
    if (lower.includes("slug")) {
      return {
        title: "That slug is already in use",
        description: "Please choose a different URL slug.",
        code: "duplicate.slug",
      };
    }
    if (lower.includes("bookmark")) {
      return {
        title: "Already bookmarked",
        code: "duplicate.bookmark",
      };
    }
    if (lower.includes("enrollment") || lower.includes("already enrolled")) {
      return {
        title: "You're already enrolled",
        description: "Continue where you left off.",
        code: "duplicate.enrollment",
      };
    }
    return {
      title: "Already exists",
      description: "This item already exists.",
      code: "duplicate.slug",
    };
  }

  // Generic Postgres / RLS
  if (code === "42501" || lower.includes("row level security") || lower.includes("rls")) {
    return {
      title: "You don't have permission to do that",
      code: "auth.permission_denied",
    };
  }

  // Auth helpers already map most auth cases; fallback here
  if (raw.trim().length > 0 && raw.length < 120 && !lower.includes("supabase") && !lower.includes("postgres")) {
    return {
      title: raw,
      code: "validation.generic",
    };
  }

  return {
    title: fallbackTitle,
    description: fallbackDescription,
    code: "database.generic",
  };
}

/**
 * Convenience: extract a short title string from any error.
 */
export function getErrorTitle(error: unknown, fallback = "Something went wrong"): string {
  return getUserFacingError(error, fallback).title;
}

/**
 * Convenience: extract description from any error.
 */
export function getErrorDescription(error: unknown): string | undefined {
  return getUserFacingError(error).description;
}
