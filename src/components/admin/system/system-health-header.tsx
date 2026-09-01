"use client";

import { Activity, Clock, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { TimeRange } from "@/lib/system-health/types";

interface SystemHealthHeaderProps {
  lastCheckedAt: string;
  selectedRange: TimeRange;
  onRangeChange: (range: TimeRange) => void;
  autoRefreshInterval: number; // 0 = off, 30 = 30s, 60 = 60s
  onAutoRefreshChange: (interval: number) => void;
  isRefreshing: boolean;
  onRefresh: () => void;
}

export function SystemHealthHeader({
  lastCheckedAt,
  selectedRange,
  onRangeChange,
  autoRefreshInterval,
  onAutoRefreshChange,
  isRefreshing,
  onRefresh,
}: SystemHealthHeaderProps) {
  const formattedTime = new Date(lastCheckedAt).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <div className="flex items-center gap-2.5">
          <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Activity className="size-4.5" />
          </div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl">
            System Health & Performance
          </h1>
        </div>
        <p className="mt-1 text-sm text-ink-muted">
          Operational visibility into application runtime, database latency, authentication health, and response performance.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        {/* Time Range Selector */}
        <div className="flex items-center rounded-xl border border-line bg-surface p-1 shadow-xs">
          {(["1h", "6h", "24h", "7d"] as TimeRange[]).map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => onRangeChange(r)}
              className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
                selectedRange === r
                  ? "bg-primary text-white shadow-xs"
                  : "text-ink-muted hover:text-ink hover:bg-surface-elevated"
              }`}
            >
              {r}
            </button>
          ))}
        </div>

        {/* Auto Refresh Toggle */}
        <div className="flex items-center gap-1.5 rounded-xl border border-line bg-surface px-2.5 py-1.5 text-xs text-ink-muted shadow-xs">
          <Clock className="size-3.5" />
          <span className="hidden sm:inline">Auto:</span>
          <select
            value={autoRefreshInterval}
            onChange={(e) => onAutoRefreshChange(Number(e.target.value))}
            className="bg-transparent font-semibold text-ink outline-none cursor-pointer"
            aria-label="Auto-refresh interval"
          >
            <option value={0}>Off</option>
            <option value={30}>30s</option>
            <option value={60}>60s</option>
          </select>
        </div>

        {/* Last Checked & Refresh Button */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-ink-muted hidden md:inline">
            Checked {formattedTime}
          </span>
          <Button
            onClick={onRefresh}
            disabled={isRefreshing}
            variant="outline"
            className="rounded-xl border-line text-xs font-semibold shadow-xs"
          >
            <RefreshCw className={`mr-1.5 size-3.5 ${isRefreshing ? "animate-spin text-primary" : "text-ink-muted"}`} />
            <span>{isRefreshing ? "Checking..." : "Refresh"}</span>
          </Button>
        </div>
      </div>
    </div>
  );
}

