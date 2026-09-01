export type SystemStatus = "healthy" | "degraded" | "critical" | "unknown";

export type TimeRange = "1h" | "6h" | "24h" | "7d";

export interface ApplicationHealth {
  status: SystemStatus;
  environment: "development" | "preview" | "production";
  domain: string;
  commit: string | null;
  nodeVersion: string;
  uptimeSeconds: number;
  serverTimestamp: string;
}

export interface DatabaseHealth {
  status: SystemStatus;
  latencyMs: number;
  readTest: "passed" | "failed";
  checkedAt: string;
  tableCounts: {
    courses: number;
    modules: number;
    lessons: number;
    enrollments: number;
    progress: number;
    quizzes: number;
    learningPaths: number;
    notes: number;
    bookmarks: number;
  };
}

export interface AuthHealth {
  status: SystemStatus;
  supabaseAuthReachable: boolean;
  googleProviderConfigured: boolean;
  recentAuthErrorsCount: number;
  checkedAt: string;
}

export interface PerformanceHealth {
  status: SystemStatus;
  avgDurationMs: number;
  p50Ms: number;
  p95Ms: number;
  p99Ms: number;
  sampleCount: number;
  errorRatePercent: number;
  requestsLast5Min: number;
  requestsLastHour: number;
  requests24h: number;
  requestsPerMinute: number;
}

export interface SlowRouteItem {
  route: string;
  requestsCount: number;
  avgDurationMs: number;
  p95DurationMs: number;
  errorRatePercent: number;
  status: "fast" | "good" | "degraded" | "slow";
}

export interface RecentErrorItem {
  id: string;
  route: string;
  errorCategory: string;
  statusCode: number;
  occurrences: number;
  lastSeenAt: string;
}

export interface PerformanceTrendPoint {
  timestamp: string;
  label: string;
  avgDurationMs: number;
  p95DurationMs: number;
  requestsCount: number;
  errorsCount: number;
}

export interface SecurityAuditResult {
  status: SystemStatus;
  totalChecks: number;
  passedChecks: number;
  warningCount: number;
  criticalCount: number;
  checks: {
    name: string;
    description: string;
    passed: boolean;
    severity: "info" | "warning" | "critical";
    detail?: string;
  }[];
  checkedAt: string;
}

export interface DataIntegrityResult {
  status: SystemStatus;
  totalChecks: number;
  passedChecks: number;
  warningsCount: number;
  issues: {
    title: string;
    severity: "warning" | "critical";
    description: string;
  }[];
  checkedAt: string;
}

export interface SystemHealthDashboardData {
  overallStatus: SystemStatus;
  lastCheckedAt: string;
  selectedRange: TimeRange;
  currentIssues: string[];
  application: ApplicationHealth;
  database: DatabaseHealth;
  auth: AuthHealth;
  performance: PerformanceHealth;
  slowRoutes: SlowRouteItem[];
  recentErrors: RecentErrorItem[];
  trend: PerformanceTrendPoint[];
  security: SecurityAuditResult;
  integrity: DataIntegrityResult;
}
