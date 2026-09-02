import { sanitizeOperationalError } from "@/lib/system-health/sanitization";
import { formatErrorDigest } from "@/lib/errors/reference";
import type { ErrorCategory, PublicErrorCode } from "@/lib/errors/types";

interface ServerErrorLogPayload {
  errorReference: string;
  category: ErrorCategory | string;
  safeCode: PublicErrorCode | string;
  route?: string;
  operation?: string;
  statusCode?: number;
  message?: string;
}

/**
 * Safely logs unexpected server exceptions without leaking passwords, tokens, or private learner data.
 */
export function logServerError(
  error: unknown,
  context: {
    route?: string;
    operation?: string;
    statusCode?: number;
  } = {},
): ServerErrorLogPayload {
  const digest = error && typeof error === "object" && "digest" in error
    ? String((error as { digest: unknown }).digest)
    : null;

  const errorReference = formatErrorDigest(digest);
  const operational = sanitizeOperationalError(error);

  const cleanRoute = context.route ? context.route.split("?")[0].split("#")[0] : undefined;

  const payload: ServerErrorLogPayload = {
    errorReference,
    category: operational.category,
    safeCode: operational.summary,
    route: cleanRoute,
    operation: context.operation,
    statusCode: context.statusCode || 500,
  };

  // Structured console log on server
  if (process.env.NODE_ENV !== "production") {
    console.error("[Meritloom Server Error]", payload);
  } else {
    // In production, emit compact structured log
    console.error(JSON.stringify({
      level: "error",
      ...payload,
      timestamp: new Date().toISOString(),
    }));
  }

  return payload;
}

