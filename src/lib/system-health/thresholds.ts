import type { SystemStatus } from "./types";

export const SYSTEM_THRESHOLDS = {
  // Server Response Time (Average)
  responseAvgHealthyMax: 500, // < 500ms
  responseAvgDegradedMax: 1000, // 500 - 1000ms

  // Server Response Time (P95)
  responseP95HealthyMax: 800, // < 800ms
  responseP95DegradedMax: 1500, // 800 - 1500ms

  // Database Latency
  dbLatencyHealthyMax: 250, // <= 250ms (Healthy)
  dbLatencyDegradedMax: 600, // > 250ms (Degraded)

  // Error Rate (5xx)
  serverErrorRateDegradedMin: 1.0, // > 1% errors is degraded
  serverErrorRateCriticalMin: 5.0, // > 5% errors is critical
} as const;

export function evaluateDbStatus(latencyMs: number, readPassed: boolean): SystemStatus {
  if (!readPassed || latencyMs > 2000) return "critical";
  if (latencyMs > SYSTEM_THRESHOLDS.dbLatencyHealthyMax) return "degraded";
  return "healthy";
}

export function evaluatePerformanceStatus(avgMs: number, p95Ms: number, errorRate: number): SystemStatus {
  if (errorRate >= SYSTEM_THRESHOLDS.serverErrorRateCriticalMin) return "critical";
  if (p95Ms > SYSTEM_THRESHOLDS.responseP95DegradedMax) return "degraded";
  if (avgMs > SYSTEM_THRESHOLDS.responseAvgDegradedMax) return "degraded";
  if (errorRate >= SYSTEM_THRESHOLDS.serverErrorRateDegradedMin) return "degraded";
  return "healthy";
}

export function evaluateRouteStatus(avgMs: number, p95Ms: number): "fast" | "good" | "degraded" | "slow" {
  if (p95Ms > 1500 || avgMs > 1000) return "slow";
  if (p95Ms > 800 || avgMs > 500) return "degraded";
  if (avgMs <= 200) return "fast";
  return "good";
}

export function calculateOverallStatus(statuses: SystemStatus[]): SystemStatus {
  if (statuses.includes("critical")) return "critical";
  if (statuses.includes("degraded")) return "degraded";
  if (statuses.includes("healthy")) return "healthy";
  return "unknown";
}

