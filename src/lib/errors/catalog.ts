import type { ErrorCatalogEntry } from "@/lib/errors/types";

/**
 * Authoritative public error catalog for Meritloom.
 * Maps safe internal codes to human-friendly, professional copy and status codes.
 */
export const ERROR_CATALOG: Record<string, ErrorCatalogEntry> = {
  service_unavailable: {
    status: 503,
    code: "SERVICE_UNAVAILABLE",
    category: "network",
    title: "Service temporarily unavailable",
    description:
      "Meritloom is having trouble reaching an upstream service. Your learning progress is safe. Please try again shortly.",
    recommendedAction: "retry",
  },

  database_unavailable: {
    status: 503,
    code: "DATABASE_UNAVAILABLE",
    category: "database",
    title: "Learning data temporarily unavailable",
    description:
      "We couldn't load this information right now. Please wait a moment and try again.",
    recommendedAction: "retry",
  },

  authentication_error: {
    status: 401,
    code: "SESSION_EXPIRED",
    category: "auth",
    title: "Sign-in required",
    description:
      "Your session has expired or authentication is required. Please sign in again to continue learning.",
    recommendedAction: "sign_in",
  },

  permission_denied: {
    status: 403,
    code: "ACCESS_RESTRICTED",
    category: "permission",
    title: "Access restricted",
    description:
      "Your account doesn't have permission to open this area. If you believe this is a mistake, contact your administrator.",
    recommendedAction: "go_home",
  },

  resource_unavailable: {
    status: 404,
    code: "RESOURCE_UNAVAILABLE",
    category: "not_found",
    title: "Content unavailable",
    description:
      "This course, lesson, or learning path may have been moved, removed, or is no longer published.",
    recommendedAction: "go_home",
  },

  page_not_found: {
    status: 404,
    code: "PAGE_NOT_FOUND",
    category: "not_found",
    title: "Page not found",
    description:
      "We couldn't find the page you're looking for. It may have moved, been removed, or the link may be incorrect.",
    recommendedAction: "go_home",
  },

  request_failed: {
    status: 500,
    code: "REQUEST_FAILED",
    category: "application",
    title: "Something went wrong",
    description:
      "Meritloom couldn't complete this request. Your learning data is safe. Try the action again, or return home.",
    recommendedAction: "retry",
  },
};

/**
 * Resolves an error code string into a safe catalog entry with fallback.
 */
export function getCatalogEntry(code?: string | null): ErrorCatalogEntry {
  if (code && typeof code === "string") {
    const normalized = code.toLowerCase().trim().replace(/-/g, "_");
    if (normalized in ERROR_CATALOG) {
      return ERROR_CATALOG[normalized];
    }
  }

  return ERROR_CATALOG.request_failed;
}
