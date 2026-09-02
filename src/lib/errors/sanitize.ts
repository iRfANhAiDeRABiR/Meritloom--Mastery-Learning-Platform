import { ERROR_CATALOG } from "@/lib/errors/catalog";
import { formatErrorDigest } from "@/lib/errors/reference";
import type { ErrorCategory, PublicErrorCode, SafeErrorDetails } from "@/lib/errors/types";

/**
 * Sanitizes unknown runtime exceptions into safe, structured public error details.
 * Completely eliminates raw stack traces, SQL, sensitive database keys, tokens, and server paths.
 */
export function sanitizeRuntimeError(
  error: unknown,
  pathname?: string,
): SafeErrorDetails {
  const digest = error && typeof error === "object" && "digest" in error
    ? String((error as { digest: unknown }).digest)
    : null;

  const errorReference = formatErrorDigest(digest);
  const rawMessage = error instanceof Error ? error.message : typeof error === "string" ? error : "";
  const lower = rawMessage.toLowerCase();

  const rawCode = error && typeof error === "object" && "code" in error
    ? String((error as { code: unknown }).code)
    : "";

  let safeCode: PublicErrorCode = "REQUEST_FAILED";
  let category: ErrorCategory = "application";
  let statusCode = 500;
  let retryable = true;

  // 1. Network / connectivity failures
  if (
    lower.includes("failed to fetch") ||
    lower.includes("fetch failed") ||
    lower.includes("networkerror") ||
    lower.includes("network request failed") ||
    lower.includes("econnrefused") ||
    (typeof navigator !== "undefined" && typeof navigator.onLine === "boolean" && navigator.onLine === false)
  ) {
    safeCode = "SERVICE_UNAVAILABLE";
    category = "network";
    statusCode = 503;
  }
  // 2. Database timeouts / service outages
  else if (
    lower.includes("timeout") ||
    lower.includes("timed out") ||
    lower.includes("57014") ||
    rawCode === "57014" ||
    lower.includes("statement timeout")
  ) {
    safeCode = "DATABASE_UNAVAILABLE";
    category = "database";
    statusCode = 503;
  }
  // 3. Auth expired / session missing
  else if (
    lower.includes("jwt expired") ||
    lower.includes("session expired") ||
    lower.includes("not authenticated") ||
    lower.includes("auth session missing")
  ) {
    safeCode = "SESSION_EXPIRED";
    category = "auth";
    statusCode = 401;
    retryable = false;
  }
  // 4. Permissions / RLS restrictions
  else if (
    lower.includes("permission denied") ||
    lower.includes("row-level security") ||
    lower.includes("row level security") ||
    lower.includes("rls") ||
    lower.includes("not authorized") ||
    lower.includes("forbidden") ||
    lower.includes("42501") ||
    rawCode === "42501"
  ) {
    safeCode = "ACCESS_RESTRICTED";
    category = "permission";
    statusCode = 403;
    retryable = false;
  }
  // 5. Not found / missing resource
  else if (
    lower.includes("not found") ||
    lower.includes("no rows") ||
    lower.includes("pgrst116") ||
    rawCode === "PGRST116"
  ) {
    safeCode = "RESOURCE_UNAVAILABLE";
    category = "not_found";
    statusCode = 404;
    retryable = false;
  }

  const catalogEntry = Object.values(ERROR_CATALOG).find((e) => e.code === safeCode) || ERROR_CATALOG.request_failed;

  // Safe normalized route (strips query parameters)
  const cleanRoute = pathname ? pathname.split("?")[0].split("#")[0] : undefined;

  return {
    errorReference,
    safeCode,
    category,
    title: catalogEntry.title,
    description: catalogEntry.description,
    statusCode,
    timestamp: new Date().toISOString(),
    route: cleanRoute,
    retryable,
  };
}
