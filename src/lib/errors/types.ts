/**
 * Core type definitions for Meritloom's secure, user-facing error handling system.
 */

export type PublicErrorCode =
  | "PAGE_NOT_FOUND"
  | "ACCESS_RESTRICTED"
  | "SESSION_EXPIRED"
  | "SERVICE_UNAVAILABLE"
  | "DATABASE_UNAVAILABLE"
  | "RESOURCE_UNAVAILABLE"
  | "REQUEST_FAILED";

export type ErrorCategory =
  | "application"
  | "database"
  | "auth"
  | "permission"
  | "network"
  | "not_found";

export interface SafeErrorDetails {
  errorReference: string;
  safeCode: PublicErrorCode;
  category: ErrorCategory;
  title: string;
  description: string;
  statusCode: number;
  timestamp: string;
  route?: string;
  retryable: boolean;
}

export interface ErrorCatalogEntry {
  status: number;
  code: PublicErrorCode;
  category: ErrorCategory;
  title: string;
  description: string;
  recommendedAction?: "retry" | "sign_in" | "go_home" | "contact_support";
}

