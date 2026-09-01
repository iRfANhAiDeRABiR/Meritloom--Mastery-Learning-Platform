/**
 * Authentication and Safe Redirect Helpers.
 */

/**
 * Validates and sanitizes a `next` redirect parameter to prevent open redirect vulnerabilities.
 * Only allows relative paths starting with `/` (and not `//`).
 */
export function getSafeNextUrl(
  nextParam?: string | null,
  fallback = "/learn",
): string {
  if (!nextParam || typeof nextParam !== "string") {
    return fallback;
  }

  const trimmed = nextParam.trim();

  // Must start with '/' and not '//' or '/\' or contain '\\'
  if (
    !trimmed.startsWith("/") ||
    trimmed.startsWith("//") ||
    trimmed.startsWith("/\\") ||
    trimmed.includes("\\")
  ) {
    return fallback;
  }

  // Reject protocol strings (e.g. javascript:, https:, etc.)
  if (/^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(trimmed)) {
    return fallback;
  }

  return trimmed;
}

/** Alias for getSafeNextUrl */
export const getSafeNextPath = getSafeNextUrl;

/**
 * Resolves the request origin cleanly, accounting for reverse proxies
 * (such as Vercel, Cloudflare, etc.) using x-forwarded-host and x-forwarded-proto.
 */
export function getRequestOrigin(request: Request): string {
  try {
    const forwardedHost = request.headers.get("x-forwarded-host");
    const forwardedProto = request.headers.get("x-forwarded-proto") || "https";
    if (forwardedHost) {
      return `${forwardedProto}://${forwardedHost}`;
    }

    const url = new URL(request.url);
    if (url.origin && url.origin !== "null") {
      return url.origin;
    }
  } catch {
    // fallback
  }

  return process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
}

/**
 * Maps Supabase authentication errors to friendly, learner-focused error copy.
 * Avoids exposing raw database exceptions, stack traces, or technical jargon.
 */
export function formatAuthError(error: unknown): string {
  if (!error) return "An unexpected error occurred. Please try again.";

  const msg =
    typeof error === "string"
      ? error
      : typeof error === "object" && error !== null && "message" in error
      ? String((error as { message: unknown }).message)
      : "";

  const lower = msg.toLowerCase();

  if (
    lower.includes("unsupported provider") ||
    lower.includes("provider is not enabled") ||
    lower.includes("provider is disabled")
  ) {
    return "Google sign-in isn't available right now. Please continue with email or try again later.";
  }

  if (
    lower.includes("already registered") ||
    lower.includes("already exists") ||
    lower.includes("user already")
  ) {
    return "An account with this email already exists. Try signing in instead.";
  }

  if (
    lower.includes("invalid login") ||
    lower.includes("invalid credentials") ||
    lower.includes("email not confirmed")
  ) {
    return "Email or password is incorrect.";
  }

  if (lower.includes("password should be at least") || lower.includes("weak password")) {
    return "Please choose a stronger password (at least 8 characters).";
  }

  if (lower.includes("rate limit") || lower.includes("too many requests")) {
    return "Too many attempts. Please wait a minute and try again.";
  }

  if (lower.includes("network") || lower.includes("fetch failed")) {
    return "Unable to connect right now. Please check your internet connection.";
  }

  if (lower.includes("oauth") || lower.includes("google")) {
    return "Google sign-in could not be completed. Please try again.";
  }

  return "Something went wrong. Please check your details and try again.";
}

/**
 * Maps OAuth URL error query parameters (e.g. ?error=oauth_callback_failed)
 * to friendly user-facing messages.
 */
export function getSafeAuthErrorFromCode(code?: string | null): {
  title: string;
  description?: string;
} | null {
  if (!code) return null;

  switch (code) {
    case "oauth_cancelled":
      return {
        title: "Google sign-in was cancelled",
        description: "You can try again or sign in with your email address.",
      };
    case "oauth_disabled":
      return {
        title: "Google sign-in isn't available right now",
        description: "Please continue with email or try again later.",
      };
    case "oauth_callback_failed":
    case "oauth_error":
      return {
        title: "Google sign-in didn't work",
        description: "Please try again or continue with email.",
      };
    default:
      return {
        title: "Authentication failed",
        description: "Please try signing in again.",
      };
  }
}

