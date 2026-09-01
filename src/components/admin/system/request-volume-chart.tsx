"use client";

import type { PerformanceTrendPoint } from "@/lib/system-health/types";

interface RequestVolumeChartProps {
  trend: PerformanceTrendPoint[];
}

export function RequestVolumeChart({ trend }: RequestVolumeChartProps) {
  if (!trend || trend.length === 0) {
    return null;
  }

  const maxRequests = Math.max(...trend.map((t) => t.requestsCount), 10);
  const totalRequests = trend.reduce((sum, t) => sum + t.requestsCount, 0);
  const totalErrors = trend.reduce((sum, t) => sum + t.errorsCount, 0);

  return (
    <div className="rounded-2xl border border-line bg-surface p-5 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
        <div>
          <h2 className="font-display text-base font-bold text-ink">
            Application Request Load
          </h2>
          <p className="text-xs text-ink-muted mt-0.5">
            {totalRequests} total requests served ({totalErrors} non-200 responses) in this window.
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs font-semibold">
          <div className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-sm bg-primary" />
            <span className="text-ink">Successful</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-sm bg-rose-500" />
            <span className="text-ink">Errors</span>
          </div>
        </div>
      </div>

      {/* Bar visual representation */}
      <div className="flex h-32 items-end gap-1.5 pt-4">
        {trend.map((point, idx) => {
          const successCount = Math.max(0, point.requestsCount - point.errorsCount);
          const successHeight = Math.round((successCount / maxRequests) * 100);
          const errorHeight = Math.round((point.errorsCount / maxRequests) * 100);

          return (
            <div
              key={idx}
              className="group relative flex h-full flex-1 flex-col justify-end items-center"
            >
              {/* Tooltip */}
              <div className="absolute -top-12 z-20 hidden rounded-lg border border-line bg-surface-elevated p-1.5 text-[11px] shadow-sm group-hover:block whitespace-nowrap">
                <span className="font-semibold text-ink">{point.label}</span>: {point.requestsCount} reqs ({point.errorsCount} err)
              </div>

              {/* Stacked bar */}
              <div className="w-full flex flex-col justify-end overflow-hidden rounded-t-sm">
                {point.errorsCount > 0 && (
                  <div
                    style={{ height: `${Math.max(4, errorHeight)}%` }}
                    className="w-full bg-rose-500"
                  />
                )}
                <div
                  style={{ height: `${Math.max(point.requestsCount > 0 ? 4 : 0, successHeight)}%` }}
                  className="w-full bg-primary/70 group-hover:bg-primary transition"
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* X-axis labels */}
      <div className="mt-2 flex justify-between text-[11px] text-ink-muted px-1">
        <span>{trend[0]?.label}</span>
        <span>{trend[Math.floor(trend.length / 2)]?.label}</span>
        <span>{trend[trend.length - 1]?.label}</span>
      </div>
    </div>
  );
}

