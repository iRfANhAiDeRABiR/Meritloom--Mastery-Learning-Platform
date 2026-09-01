/**
 * Sanitization & Normalization utilities for operational telemetry.
 * Strips all query parameters, tokens, codes, emails, and sensitive dynamic values.
 */

export function normalizeRoute(rawPath: string): string {
  if (!rawPath || typeof rawPath !== "string") return "/";

  // 1. Strip query strings completely (?code=..., ?next=..., ?email=...)
  const withoutQuery = rawPath.split("?")[0].split("#")[0].trim();
  if (!withoutQuery) return "/";

  // Strip trailing slashes except for root
  const path = withoutQuery.length > 1 && withoutQuery.endsWith("/") ? withoutQuery.slice(0, -1) : withoutQuery;

  // 2. Exact anchored normalization
  if (/^\/learn\/courses\/[^/]+\/lessons\/[^/]+\/results\/[^/]+$/.test(path)) {
    return "/learn/courses/[courseSlug]/lessons/[lessonSlug]/results/[attemptId]";
  }
  if (/^\/learn\/courses\/[^/]+\/lessons\/[^/]+$/.test(path)) {
    return "/learn/courses/[courseSlug]/lessons/[lessonSlug]";
  }
  if (/^\/learn\/courses\/[^/]+\/complete$/.test(path)) {
    return "/learn/courses/[courseSlug]/complete";
  }
  if (/^\/learn\/courses\/[^/]+$/.test(path)) {
    return "/learn/courses/[courseSlug]";
  }
  if (/^\/courses\/[^/]+$/.test(path)) {
    return "/courses/[slug]";
  }
  if (/^\/learn\/learning-paths\/[^/]+\/complete$/.test(path)) {
    return "/learn/learning-paths/[slug]/complete";
  }
  if (/^\/learning-paths\/[^/]+$/.test(path)) {
    return "/learning-paths/[slug]";
  }
  if (/^\/admin\/courses\/[^/]+\/preview\/lessons\/[^/]+$/.test(path)) {
    return "/admin/courses/[courseId]/preview/lessons/[lessonSlug]";
  }
  if (/^\/admin\/courses\/[^/]+\/preview$/.test(path)) {
    return "/admin/courses/[courseId]/preview";
  }
  if (/^\/admin\/courses\/[^/]+$/.test(path)) {
    return "/admin/courses/[courseId]";
  }
  if (/^\/admin\/learning-paths\/[^/]+\/preview$/.test(path)) {
    return "/admin/learning-paths/[pathId]/preview";
  }
  if (/^\/admin\/learning-paths\/[^/]+$/.test(path)) {
    return "/admin/learning-paths/[pathId]";
  }

  return path;
}

export function sanitizeOperationalError(err: unknown): {
  category: string;
  summary: string;
} {
  if (!err) {
    return {
      category: "UNKNOWN_ERROR",
      summary: "An unspecified application error occurred.",
    };
  }

  const message = (err instanceof Error ? err.message : String(err)).toLowerCase();

  if (message.includes("timeout") || message.includes("timed out") || message.includes("57014")) {
    return {
      category: "DATABASE_TIMEOUT",
      summary: "Database query exceeded execution timeout limit.",
    };
  }

  if (message.includes("network") || message.includes("fetch failed") || message.includes("econnrefused")) {
    return {
      category: "NETWORK_UNAVAILABLE",
      summary: "Remote connection or upstream service unreachable.",
    };
  }

  if (message.includes("jwt") || message.includes("auth") || message.includes("unauthorized") || message.includes("401")) {
    return {
      category: "AUTH_SERVICE_ISSUE",
      summary: "Authentication session verification failure.",
    };
  }

  if (message.includes("rate limit") || message.includes("429")) {
    return {
      category: "RATE_LIMITED",
      summary: "Request rate limit exceeded.",
    };
  }

  if (message.includes("not found") || message.includes("404")) {
    return {
      category: "RESOURCE_NOT_FOUND",
      summary: "Requested route or entity not found.",
    };
  }

  if (message.includes("rls") || message.includes("permission denied") || message.includes("42501")) {
    return {
      category: "PERMISSION_DENIED",
      summary: "Database permission or RLS security gate rejected operation.",
    };
  }

  return {
    category: "SERVER_ERROR",
    summary: "Internal server execution exception.",
  };
}
