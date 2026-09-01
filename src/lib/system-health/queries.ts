import { measureDatabaseHealth, runDatabaseIntegrityAudit } from "./database";
import { checkAuthHealth } from "./auth-health";
import { runSecurityAuditChecks } from "./security";
import { getSystemPerformanceData } from "./performance";
import { calculateOverallStatus } from "./thresholds";
import type { ApplicationHealth, SystemHealthDashboardData, TimeRange } from "./types";

const SERVER_START_TIME = Date.now();

/**
 * Gather full system health diagnostics and operational telemetry.
 */
export async function getFullSystemHealthDashboard(
  range: TimeRange = "24h",
): Promise<SystemHealthDashboardData> {
  const lastCheckedAt = new Date().toISOString();

  // 1. Gather all subsystem diagnostics concurrently
  const [
    databaseHealth,
    authHealth,
    performanceResult,
    securityResult,
    integrityResult,
  ] = await Promise.all([
    measureDatabaseHealth(),
    checkAuthHealth(),
    getSystemPerformanceData(range),
    runSecurityAuditChecks(),
    runDatabaseIntegrityAudit(),
  ]);

  // 2. Application runtime diagnostics
  const envName =
    process.env.NODE_ENV === "production"
      ? (process.env.VERCEL_ENV as "production" | "preview" | "development") || "production"
      : "development";

  const domain =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/^https?:\/\//, "") ||
    "meritloom.iabir.me";

  const commit = process.env.VERCEL_GIT_COMMIT_SHA
    ? process.env.VERCEL_GIT_COMMIT_SHA.slice(0, 7)
    : null;

  const appStatus = databaseHealth.status === "critical" || authHealth.status === "critical"
    ? "degraded"
    : "healthy";

  const application: ApplicationHealth = {
    status: appStatus,
    environment: envName,
    domain,
    commit,
    nodeVersion: process.version,
    uptimeSeconds: Math.round((Date.now() - SERVER_START_TIME) / 1000),
    serverTimestamp: lastCheckedAt,
  };

  // 3. Compile current issues / items needing attention
  const currentIssues: string[] = [];

  if (databaseHealth.status === "critical") {
    currentIssues.push("Database connection is currently failing or unreachable.");
  } else if (databaseHealth.latencyMs > 500) {
    currentIssues.push(`Database query latency is elevated (${databaseHealth.latencyMs}ms).`);
  }

  if (authHealth.status === "critical") {
    currentIssues.push("Supabase Authentication service is currently unreachable.");
  } else if (authHealth.recentAuthErrorsCount > 10) {
    currentIssues.push(`${authHealth.recentAuthErrorsCount} authentication errors occurred recently.`);
  }

  if (performanceResult.performance.p95Ms > 1500 && performanceResult.performance.sampleCount > 5) {
    currentIssues.push(`P95 server response time is elevated (${(performanceResult.performance.p95Ms / 1000).toFixed(2)}s).`);
  }

  if (performanceResult.performance.errorRatePercent > 5.0) {
    currentIssues.push(`High error rate detected (${performanceResult.performance.errorRatePercent}% non-200 responses).`);
  }

  if (integrityResult.warningsCount > 0) {
    currentIssues.push(`${integrityResult.warningsCount} database integrity item(s) need attention.`);
  }

  if (securityResult.criticalCount > 0) {
    currentIssues.push(`${securityResult.criticalCount} critical security check(s) flagged.`);
  }

  // 4. Calculate overall system status
  const overallStatus = calculateOverallStatus([
    application.status,
    databaseHealth.status,
    authHealth.status,
    performanceResult.performance.status,
    securityResult.status,
  ]);

  return {
    overallStatus,
    lastCheckedAt,
    selectedRange: range,
    currentIssues,
    application,
    database: databaseHealth,
    auth: authHealth,
    performance: performanceResult.performance,
    slowRoutes: performanceResult.slowRoutes,
    recentErrors: performanceResult.recentErrors,
    trend: performanceResult.trend,
    security: securityResult,
    integrity: integrityResult,
  };
}
