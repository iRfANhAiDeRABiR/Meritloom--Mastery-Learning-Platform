import { getInMemoryMetricSamples, type RecordedMetricSample } from "./instrumentation";
import { evaluatePerformanceStatus, evaluateRouteStatus } from "./thresholds";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type {
  PerformanceHealth,
  PerformanceTrendPoint,
  RecentErrorItem,
  SlowRouteItem,
  TimeRange,
} from "./types";

function getTimeWindowMs(range: TimeRange): number {
  switch (range) {
    case "1h":
      return 60 * 60 * 1000;
    case "6h":
      return 6 * 60 * 60 * 1000;
    case "24h":
      return 24 * 60 * 60 * 1000;
    case "7d":
      return 7 * 24 * 60 * 60 * 1000;
    default:
      return 24 * 60 * 60 * 1000;
  }
}

function calculatePercentile(values: number[], percentile: number): number {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const index = Math.min(
    sorted.length - 1,
    Math.max(0, Math.ceil((percentile / 100) * sorted.length) - 1),
  );
  return sorted[index];
}

/**
 * Fetch and aggregate performance telemetry across the selected time range.
 */
export async function getSystemPerformanceData(range: TimeRange = "24h"): Promise<{
  performance: PerformanceHealth;
  slowRoutes: SlowRouteItem[];
  recentErrors: RecentErrorItem[];
  trend: PerformanceTrendPoint[];
}> {
  const windowMs = getTimeWindowMs(range);
  const now = Date.now();
  const cutoff = now - windowMs;

  // 1. Gather samples from in-memory ring buffer
  const memorySamples = getInMemoryMetricSamples(windowMs);

  // 2. Fetch persisted samples from Supabase if available
  let dbSamples: RecordedMetricSample[] = [];
  try {
    const supabase = await createSupabaseServerClient();
    if (supabase) {
      const { data } = await supabase
        .from("system_performance_metrics")
        .select("route, duration_ms, status_code, success, error_category, recorded_at")
        .gte("recorded_at", new Date(cutoff).toISOString())
        .order("recorded_at", { ascending: false })
        .limit(200);

      if (data) {
        dbSamples = data.map((row) => ({
          route: row.route,
          durationMs: row.duration_ms,
          statusCode: row.status_code || 200,
          success: row.success ?? true,
          errorCategory: row.error_category || null,
          timestamp: new Date(row.recorded_at).getTime(),
        }));
      }
    }
  } catch {
    // Rely on memory samples if DB is unreachable
  }

  // Combine and deduplicate samples
  const allSamples = [...memorySamples, ...dbSamples];

  // Default baseline data when zero samples recorded yet
  if (allSamples.length === 0) {
    const defaultPerf: PerformanceHealth = {
      status: "healthy",
      avgDurationMs: 0,
      p50Ms: 0,
      p95Ms: 0,
      p99Ms: 0,
      sampleCount: 0,
      errorRatePercent: 0,
      requestsLast5Min: 0,
      requestsLastHour: 0,
      requests24h: 0,
      requestsPerMinute: 0,
    };

    return {
      performance: defaultPerf,
      slowRoutes: [],
      recentErrors: [],
      trend: [],
    };
  }

  // 3. Compute overall performance metrics
  const durations = allSamples.map((s) => s.durationMs);
  const totalDuration = durations.reduce((sum, d) => sum + d, 0);
  const avgDurationMs = Math.round(totalDuration / (durations.length || 1));
  const p50Ms = calculatePercentile(durations, 50);
  const p95Ms = calculatePercentile(durations, 95);
  const p99Ms = calculatePercentile(durations, 99);

  const errors = allSamples.filter((s) => !s.success || s.statusCode >= 400);
  const errorRatePercent = Number(
    ((errors.length / (allSamples.length || 1)) * 100).toFixed(1),
  );

  const fiveMinCutoff = now - 5 * 60 * 1000;
  const oneHourCutoff = now - 60 * 60 * 1000;
  const requestsLast5Min = allSamples.filter((s) => s.timestamp >= fiveMinCutoff).length;
  const requestsLastHour = allSamples.filter((s) => s.timestamp >= oneHourCutoff).length;
  const requests24h = allSamples.length;
  const requestsPerMinute = Number((requestsLast5Min / 5).toFixed(1));

  const status = evaluatePerformanceStatus(avgDurationMs, p95Ms, errorRatePercent);

  const performance: PerformanceHealth = {
    status,
    avgDurationMs,
    p50Ms,
    p95Ms,
    p99Ms,
    sampleCount: allSamples.length,
    errorRatePercent,
    requestsLast5Min,
    requestsLastHour,
    requests24h,
    requestsPerMinute,
  };

  // 4. Aggregate route performance
  const routeGroups = new Map<string, RecordedMetricSample[]>();
  for (const s of allSamples) {
    if (!routeGroups.has(s.route)) {
      routeGroups.set(s.route, []);
    }
    routeGroups.get(s.route)!.push(s);
  }

  const slowRoutes: SlowRouteItem[] = [];
  for (const [route, samples] of routeGroups.entries()) {
    const routeDurations = samples.map((s) => s.durationMs);
    const rTotal = routeDurations.reduce((sum, d) => sum + d, 0);
    const rAvg = Math.round(rTotal / (routeDurations.length || 1));
    const rP95 = calculatePercentile(routeDurations, 95);
    const rErrors = samples.filter((s) => !s.success || s.statusCode >= 400);
    const rErrorRate = Number(((rErrors.length / (samples.length || 1)) * 100).toFixed(1));
    const rStatus = evaluateRouteStatus(rAvg, rP95);

    slowRoutes.push({
      route,
      requestsCount: samples.length,
      avgDurationMs: rAvg,
      p95DurationMs: rP95,
      errorRatePercent: rErrorRate,
      status: rStatus,
    });
  }

  // Sort slow routes by P95 descending
  slowRoutes.sort((a, b) => b.p95DurationMs - a.p95DurationMs);

  // 5. Group recent errors
  const errorGroups = new Map<string, { count: number; lastSeen: number; statusCode: number; route: string }>();
  for (const err of errors) {
    const key = `${err.errorCategory || "SERVER_ERROR"}_${err.statusCode}_${err.route}`;
    if (!errorGroups.has(key)) {
      errorGroups.set(key, {
        count: 1,
        lastSeen: err.timestamp,
        statusCode: err.statusCode,
        route: err.route,
      });
    } else {
      const g = errorGroups.get(key)!;
      g.count++;
      if (err.timestamp > g.lastSeen) g.lastSeen = err.timestamp;
    }
  }

  const recentErrors: RecentErrorItem[] = [];
  let errIdCounter = 1;
  for (const [key, g] of errorGroups.entries()) {
    const category = key.split("_")[0] || "SERVER_ERROR";
    recentErrors.push({
      id: `err-${errIdCounter++}`,
      route: g.route,
      errorCategory: category,
      statusCode: g.statusCode,
      occurrences: g.count,
      lastSeenAt: new Date(g.lastSeen).toISOString(),
    });
  }

  recentErrors.sort((a, b) => new Date(b.lastSeenAt).getTime() - new Date(a.lastSeenAt).getTime());

  // 6. Generate time-bucketed trend points for charts
  const numBuckets = 12;
  const bucketDuration = windowMs / numBuckets;
  const trend: PerformanceTrendPoint[] = [];

  for (let i = 0; i < numBuckets; i++) {
    const bStart = cutoff + i * bucketDuration;
    const bEnd = bStart + bucketDuration;
    const bSamples = allSamples.filter((s) => s.timestamp >= bStart && s.timestamp < bEnd);

    const bDurations = bSamples.map((s) => s.durationMs);
    const bAvg = bDurations.length > 0 ? Math.round(bDurations.reduce((a, b) => a + b, 0) / bDurations.length) : 0;
    const bP95 = calculatePercentile(bDurations, 95);
    const bErrors = bSamples.filter((s) => !s.success || s.statusCode >= 400).length;

    const date = new Date(bEnd);
    const label = range === "1h" || range === "6h"
      ? date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      : date.toLocaleDateString([], { month: "short", day: "numeric", hour: "2-digit" });

    trend.push({
      timestamp: date.toISOString(),
      label,
      avgDurationMs: bAvg,
      p95DurationMs: bP95,
      requestsCount: bSamples.length,
      errorsCount: bErrors,
    });
  }

  return {
    performance,
    slowRoutes: slowRoutes.slice(0, 10),
    recentErrors: recentErrors.slice(0, 8),
    trend,
  };
}
