"use client";

import * as React from "react";
import type { PerformanceTrendPoint } from "@/lib/system-health/types";

interface ResponseTimeChartProps {
  trend: PerformanceTrendPoint[];
}

export function ResponseTimeChart({ trend }: ResponseTimeChartProps) {
  const [hoveredPoint, setHoveredPoint] = React.useState<PerformanceTrendPoint | null>(null);

  if (!trend || trend.length === 0) {
    return (
      <div className="flex h-56 w-full flex-col items-center justify-center rounded-2xl border border-line bg-surface p-6 text-center text-xs text-ink-muted">
        <p>No response time trend data captured yet in this time window.</p>
        <p className="mt-1">Metrics will populate as application traffic is served.</p>
      </div>
    );
  }

  // Calculate scales
  const maxP95 = Math.max(...trend.map((t) => t.p95DurationMs), 300);
  const chartHeight = 160;
  const chartWidth = 500;
  const paddingX = 20;
  const paddingY = 20;

  const points = trend.map((t, idx) => {
    const x = paddingX + (idx / Math.max(1, trend.length - 1)) * (chartWidth - paddingX * 2);
    const yP95 = chartHeight - paddingY - (t.p95DurationMs / maxP95) * (chartHeight - paddingY * 2);
    const yAvg = chartHeight - paddingY - (t.avgDurationMs / maxP95) * (chartHeight - paddingY * 2);
    return { x, yP95, yAvg, data: t };
  });

  const p95Path = points.map((p, idx) => `${idx === 0 ? "M" : "L"} ${p.x} ${p.yP95}`).join(" ");
  const avgPath = points.map((p, idx) => `${idx === 0 ? "M" : "L"} ${p.x} ${p.yAvg}`).join(" ");

  // Average summary calculation
  const overallAvg = Math.round(
    trend.reduce((sum, t) => sum + t.avgDurationMs, 0) / (trend.length || 1),
  );
  const overallP95 = Math.round(
    trend.reduce((sum, t) => sum + t.p95DurationMs, 0) / (trend.length || 1),
  );

  return (
    <div className="rounded-2xl border border-line bg-surface p-5 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
        <div>
          <h2 className="font-display text-base font-bold text-ink">
            Response Time Trend
          </h2>
          <p className="text-xs text-ink-muted mt-0.5">
            Average ({overallAvg}ms) vs P95 latency ({overallP95}ms) over time.
          </p>
        </div>

        <div className="flex items-center gap-4 text-xs font-semibold">
          <div className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-full bg-purple-500" />
            <span className="text-ink">P95 Latency</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-full bg-cyan-500" />
            <span className="text-ink">Average</span>
          </div>
        </div>
      </div>

      {/* Accessible Text Summary for Screen Readers */}
      <div className="sr-only">
        Response time chart showing P95 average of {overallP95} milliseconds and overall average of {overallAvg} milliseconds across {trend.length} time intervals.
      </div>

      {/* Responsive SVG Container */}
      <div className="relative w-full overflow-hidden">
        <svg
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          className="w-full h-44 overflow-visible"
          preserveAspectRatio="none"
        >
          {/* Subtle horizontal grid lines */}
          <line
            x1={paddingX}
            y1={paddingY}
            x2={chartWidth - paddingX}
            y2={paddingY}
            stroke="currentColor"
            className="text-line"
            strokeDasharray="3 3"
          />
          <line
            x1={paddingX}
            y1={chartHeight / 2}
            x2={chartWidth - paddingX}
            y2={chartHeight / 2}
            stroke="currentColor"
            className="text-line"
            strokeDasharray="3 3"
          />
          <line
            x1={paddingX}
            y1={chartHeight - paddingY}
            x2={chartWidth - paddingX}
            y2={chartHeight - paddingY}
            stroke="currentColor"
            className="text-line"
          />

          {/* Line paths */}
          <path
            d={p95Path}
            fill="none"
            stroke="#A855F7"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d={avgPath}
            fill="none"
            stroke="#06B6D4"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Interactive touch points */}
          {points.map((p, idx) => (
            <g
              key={idx}
              className="cursor-pointer"
              onMouseEnter={() => setHoveredPoint(p.data)}
              onMouseLeave={() => setHoveredPoint(null)}
            >
              <circle cx={p.x} cy={p.yP95} r="4" fill="#A855F7" className="transition hover:r-6" />
              <circle cx={p.x} cy={p.yAvg} r="3" fill="#06B6D4" className="transition hover:r-5" />
            </g>
          ))}
        </svg>

        {/* Hover Tooltip Overlay */}
        {hoveredPoint && (
          <div className="absolute top-2 right-2 rounded-xl border border-line bg-surface-elevated/95 p-2 text-xs shadow-md backdrop-blur-xs pointer-events-none animate-in fade-in zoom-in-95 duration-150">
            <div className="font-semibold text-ink">{hoveredPoint.label}</div>
            <div className="mt-1 flex flex-col gap-0.5 text-[11px] text-ink-muted">
              <span className="text-purple-500 font-medium">P95: {hoveredPoint.p95DurationMs}ms</span>
              <span className="text-cyan-500 font-medium">Avg: {hoveredPoint.avgDurationMs}ms</span>
              <span>Requests: {hoveredPoint.requestsCount}</span>
            </div>
          </div>
        )}
      </div>

      {/* X-axis labels */}
      <div className="mt-2 flex justify-between text-[11px] text-ink-muted px-2">
        <span>{trend[0]?.label}</span>
        <span>{trend[Math.floor(trend.length / 2)]?.label}</span>
        <span>{trend[trend.length - 1]?.label}</span>
      </div>
    </div>
  );
}
