"use client";

import type { SlowRouteItem } from "@/lib/system-health/types";

interface SlowRoutesTableProps {
  routes: SlowRouteItem[];
}

function StatusBadge({ status }: { status: SlowRouteItem["status"] }) {
  switch (status) {
    case "fast":
      return (
        <span className="inline-flex items-center rounded-md bg-emerald-500/10 px-2 py-0.5 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
          Fast
        </span>
      );
    case "good":
      return (
        <span className="inline-flex items-center rounded-md bg-cyan-500/10 px-2 py-0.5 text-[11px] font-semibold text-cyan-600 dark:text-cyan-400">
          Good
        </span>
      );
    case "degraded":
      return (
        <span className="inline-flex items-center rounded-md bg-amber-500/10 px-2 py-0.5 text-[11px] font-semibold text-amber-600 dark:text-amber-400">
          Degraded
        </span>
      );
    case "slow":
      return (
        <span className="inline-flex items-center rounded-md bg-rose-500/10 px-2 py-0.5 text-[11px] font-semibold text-rose-600 dark:text-rose-400">
          Slow
        </span>
      );
  }
}

export function SlowRoutesTable({ routes }: SlowRoutesTableProps) {
  if (!routes || routes.length === 0) {
    return (
      <div className="rounded-2xl border border-line bg-surface p-6 text-center text-xs text-ink-muted">
        <p>No route metrics collected yet in this time window.</p>
        <p className="mt-1">Routes will be cataloged and latency evaluated automatically.</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-line bg-surface p-5 shadow-xs">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="font-display text-base font-bold text-ink">
            Route Latency & Performance Breakdown
          </h2>
          <p className="text-xs text-ink-muted mt-0.5">
            Normalized route metrics ordered by P95 response latency.
          </p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-line text-ink-muted font-semibold">
              <th className="pb-2.5 font-medium">Route</th>
              <th className="pb-2.5 font-medium text-right">Requests</th>
              <th className="pb-2.5 font-medium text-right">Avg Latency</th>
              <th className="pb-2.5 font-medium text-right">P95 Latency</th>
              <th className="pb-2.5 font-medium text-right">Error Rate</th>
              <th className="pb-2.5 font-medium text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {routes.map((r, idx) => (
              <tr key={idx} className="hover:bg-surface-elevated/40 transition">
                <td className="py-3 font-mono text-ink font-medium pr-4">
                  {r.route}
                </td>
                <td className="py-3 text-right text-ink-muted">
                  {r.requestsCount}
                </td>
                <td className="py-3 text-right text-ink font-semibold">
                  {r.avgDurationMs}ms
                </td>
                <td className="py-3 text-right text-ink font-bold">
                  {r.p95DurationMs >= 1000
                    ? `${(r.p95DurationMs / 1000).toFixed(2)}s`
                    : `${r.p95DurationMs}ms`}
                </td>
                <td className="py-3 text-right">
                  <span
                    className={
                      r.errorRatePercent > 0
                        ? "text-rose-500 font-semibold"
                        : "text-ink-muted"
                    }
                  >
                    {r.errorRatePercent}%
                  </span>
                </td>
                <td className="py-3 text-right">
                  <StatusBadge status={r.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
