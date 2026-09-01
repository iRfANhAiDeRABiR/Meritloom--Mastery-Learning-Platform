"use client";

import { AlertTriangle, CheckCircle2, ShieldAlert, Sparkles } from "lucide-react";
import type { SystemStatus } from "@/lib/system-health/types";

interface OverallHealthBannerProps {
  status: SystemStatus;
  currentIssues: string[];
}

export function OverallHealthBanner({ status, currentIssues }: OverallHealthBannerProps) {
  const getStatusConfig = () => {
    switch (status) {
      case "healthy":
        return {
          label: "All Systems Operational",
          bg: "bg-emerald-500/10 border-emerald-500/20 text-emerald-700 dark:text-emerald-300",
          dot: "bg-emerald-500",
          icon: CheckCircle2,
          iconColor: "text-emerald-500",
        };
      case "degraded":
        return {
          label: "Performance Degraded",
          bg: "bg-amber-500/10 border-amber-500/20 text-amber-700 dark:text-amber-300",
          dot: "bg-amber-500",
          icon: AlertTriangle,
          iconColor: "text-amber-500",
        };
      case "critical":
        return {
          label: "Critical System Issues",
          bg: "bg-rose-500/10 border-rose-500/20 text-rose-700 dark:text-rose-300",
          dot: "bg-rose-500",
          icon: ShieldAlert,
          iconColor: "text-rose-500",
        };
      default:
        return {
          label: "System Status Unknown",
          bg: "bg-slate-500/10 border-slate-500/20 text-slate-700 dark:text-slate-300",
          dot: "bg-slate-500",
          icon: Sparkles,
          iconColor: "text-slate-500",
        };
    }
  };

  const config = getStatusConfig();
  const Icon = config.icon;

  return (
    <div className="space-y-3">
      {/* Top Banner Status Bar */}
      <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border p-4 shadow-xs ${config.bg}`}>
        <div className="flex items-center gap-3">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-surface shadow-xs">
            <Icon className={`size-5 ${config.iconColor}`} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className={`size-2.5 rounded-full ${config.dot} animate-pulse`} />
              <span className="font-display font-bold tracking-tight text-ink sm:text-base">
                {config.label}
              </span>
            </div>
            <p className="text-xs text-ink-muted mt-0.5">
              {status === "healthy"
                ? "Core services, database connection, authentication, and response thresholds are normal."
                : `${currentIssues.length} item(s) require operational attention.`}
            </p>
          </div>
        </div>

        {currentIssues.length > 0 && (
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <span className="rounded-full bg-rose-500/10 px-2.5 py-1 text-xs font-bold text-rose-600 dark:text-rose-400">
              {currentIssues.length} {currentIssues.length === 1 ? "Issue" : "Issues"}
            </span>
          </div>
        )}
      </div>

      {/* Needs Attention Panel */}
      {currentIssues.length > 0 && (
        <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-4 text-xs">
          <div className="flex items-center gap-2 font-semibold text-amber-900 dark:text-amber-200 mb-2">
            <AlertTriangle className="size-4 text-amber-500" />
            <span>Items Needing Attention</span>
          </div>
          <ul className="space-y-1.5 pl-6 list-disc text-ink-muted">
            {currentIssues.map((issue, idx) => (
              <li key={idx} className="leading-relaxed">
                {issue}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
