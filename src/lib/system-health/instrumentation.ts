import { normalizeRoute } from "./sanitization";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export interface RecordedMetricSample {
  route: string;
  operation?: string | null;
  durationMs: number;
  statusCode: number;
  success: boolean;
  errorCategory?: string | null;
  timestamp: number;
}

// In-memory sliding telemetry buffer for ultra-fast, zero-overhead operational metrics
const MAX_RING_BUFFER_SIZE = 500;
const ringBuffer: RecordedMetricSample[] = [];

/**
 * Record a route or server operation performance sample in non-blocking fashion.
 * Does NOT block HTTP response completion.
 */
export function recordServerMetric(params: {
  route: string;
  durationMs: number;
  statusCode?: number;
  success?: boolean;
  operation?: string | null;
  errorCategory?: string | null;
}): void {
  const normalized = normalizeRoute(params.route);
  const duration = Math.max(0, Math.round(params.durationMs));
  const statusCode = params.statusCode ?? 200;
  const success = params.success ?? (statusCode < 400);

  // Exclude internal health polling and static assets from metrics to prevent recursion
  if (
    normalized.startsWith("/api/admin/system") ||
    normalized.startsWith("/_next") ||
    normalized.startsWith("/api/health")
  ) {
    return;
  }

  const sample: RecordedMetricSample = {
    route: normalized,
    operation: params.operation || null,
    durationMs: duration,
    statusCode,
    success,
    errorCategory: params.errorCategory || null,
    timestamp: Date.now(),
  };

  // Push to memory buffer
  ringBuffer.push(sample);
  if (ringBuffer.length > MAX_RING_BUFFER_SIZE) {
    ringBuffer.shift();
  }

  // Non-blocking asynchronous persistence to Supabase (fire-and-forget)
  // Only records occasionally / on error to keep DB writes minimal
  if (!success || Math.random() < 0.2) {
    persistMetricAsync(sample).catch(() => {});
  }
}

async function persistMetricAsync(sample: RecordedMetricSample) {
  try {
    const supabase = await createSupabaseServerClient();
    if (!supabase) return;

    await supabase.from("system_performance_metrics").insert({
      route: sample.route,
      duration_ms: sample.durationMs,
      status_code: sample.statusCode,
      success: sample.success,
      operation: sample.operation,
      error_category: sample.errorCategory,
      recorded_at: new Date(sample.timestamp).toISOString(),
    });
  } catch {
    // Ignore persistence failures so application traffic is never impacted
  }
}

/**
 * Retrieve recent metric samples within the given time window.
 */
export function getInMemoryMetricSamples(windowMs = 24 * 60 * 60 * 1000): RecordedMetricSample[] {
  const cutoff = Date.now() - windowMs;
  return ringBuffer.filter((s) => s.timestamp >= cutoff);
}
