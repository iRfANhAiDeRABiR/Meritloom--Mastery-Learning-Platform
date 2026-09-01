"use client";

import { Activity, Database, KeyRound, Server } from "lucide-react";
import type {
  ApplicationHealth,
  AuthHealth,
  DatabaseHealth,
  PerformanceHealth,
  SystemStatus,
} from "@/lib/system-health/types";

interface PrimaryHealthCardsProps {
  application: ApplicationHealth;
  database: DatabaseHealth;
  auth: AuthHealth;
  performance: PerformanceHealth;
  onSelectTab?: (tab: string) => void;
}

function StatusDot({ status }: { status: SystemStatus }) {
  const dotColor =
    status === "healthy"
      ? "bg-emerald-500"
      : status === "degraded"
      ? "bg-amber-500"
      : "bg-rose-500";

  return <span className={`inline-block size-2 rounded-full ${dotColor}`} />;
}

export function PrimaryHealthCards({
  application,
  database,
  auth,
  performance,
  onSelectTab,
}: PrimaryHealthCardsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {/* 1. Application Health Card */}
      <div
        onClick={() => onSelectTab?.("overview")}
        className="group relative cursor-pointer rounded-2xl border border-line bg-surface p-5 shadow-xs transition hover:border-primary/40 hover:bg-surface-elevated/60"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex size-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Server className="size-4" />
            </div>
            <span className="text-xs font-semibold text-ink-muted">Application</span>
          </div>
          <div className="flex items-center gap-1.5 rounded-full bg-surface-elevated px-2 py-0.5 text-[11px] font-semibold text-ink capitalize">
            <StatusDot status={application.status} />
            {application.status}
          </div>
        </div>

        <div className="mt-4">
          <div className="font-display text-2xl font-bold text-ink">
            {application.environment === "production" ? "Production" : "Development"}
          </div>
          <div className="mt-1 flex items-center justify-between text-xs text-ink-muted">
            <span>Node {application.nodeVersion}</span>
            <span>{application.commit ? `Commit ${application.commit}` : application.domain}</span>
          </div>
        </div>
      </div>

      {/* 2. Database Health Card */}
      <div
        onClick={() => onSelectTab?.("database")}
        className="group relative cursor-pointer rounded-2xl border border-line bg-surface p-5 shadow-xs transition hover:border-emerald-500/40 hover:bg-surface-elevated/60"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex size-7 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-500">
              <Database className="size-4" />
            </div>
            <span className="text-xs font-semibold text-ink-muted">Database</span>
          </div>
          <div className="flex items-center gap-1.5 rounded-full bg-surface-elevated px-2 py-0.5 text-[11px] font-semibold text-ink capitalize">
            <StatusDot status={database.status} />
            {database.status}
          </div>
        </div>

        <div className="mt-4">
          <div className="font-display text-2xl font-bold text-ink">
            {database.latencyMs} <span className="text-sm font-normal text-ink-muted">ms</span>
          </div>
          <div className="mt-1 flex items-center justify-between text-xs text-ink-muted">
            <span>Read probe: {database.readTest}</span>
            <span>{database.tableCounts.courses} courses</span>
          </div>
        </div>
      </div>

      {/* 3. Authentication Health Card */}
      <div
        onClick={() => onSelectTab?.("security")}
        className="group relative cursor-pointer rounded-2xl border border-line bg-surface p-5 shadow-xs transition hover:border-purple-500/40 hover:bg-surface-elevated/60"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex size-7 items-center justify-center rounded-lg bg-purple-500/10 text-purple-500">
              <KeyRound className="size-4" />
            </div>
            <span className="text-xs font-semibold text-ink-muted">Authentication</span>
          </div>
          <div className="flex items-center gap-1.5 rounded-full bg-surface-elevated px-2 py-0.5 text-[11px] font-semibold text-ink capitalize">
            <StatusDot status={auth.status} />
            {auth.status}
          </div>
        </div>

        <div className="mt-4">
          <div className="font-display text-2xl font-bold text-ink">
            {auth.supabaseAuthReachable ? "Supabase Auth" : "Unreachable"}
          </div>
          <div className="mt-1 flex items-center justify-between text-xs text-ink-muted">
            <span>Google OAuth: {auth.googleProviderConfigured ? "Active" : "Not configured"}</span>
            <span>{auth.recentAuthErrorsCount} errors</span>
          </div>
        </div>
      </div>

      {/* 4. Performance Health Card */}
      <div
        onClick={() => onSelectTab?.("performance")}
        className="group relative cursor-pointer rounded-2xl border border-line bg-surface p-5 shadow-xs transition hover:border-amber-500/40 hover:bg-surface-elevated/60"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex size-7 items-center justify-center rounded-lg bg-amber-500/10 text-amber-500">
              <Activity className="size-4" />
            </div>
            <span className="text-xs font-semibold text-ink-muted">Performance (P95)</span>
          </div>
          <div className="flex items-center gap-1.5 rounded-full bg-surface-elevated px-2 py-0.5 text-[11px] font-semibold text-ink capitalize">
            <StatusDot status={performance.status} />
            {performance.status}
          </div>
        </div>

        <div className="mt-4">
          <div className="font-display text-2xl font-bold text-ink">
            {performance.sampleCount > 0 ? (
              <>
                {performance.p95Ms >= 1000 ? (
                  <>
                    {(performance.p95Ms / 1000).toFixed(2)}{" "}
                    <span className="text-sm font-normal text-ink-muted">s</span>
                  </>
                ) : (
                  <>
                    {performance.p95Ms}{" "}
                    <span className="text-sm font-normal text-ink-muted">ms</span>
                  </>
                )}
              </>
            ) : (
              <span className="text-base text-ink-muted">No samples</span>
            )}
          </div>
          <div className="mt-1 flex items-center justify-between text-xs text-ink-muted">
            <span>Avg {performance.avgDurationMs}ms</span>
            <span>{performance.errorRatePercent}% error rate</span>
          </div>
        </div>
      </div>
    </div>
  );
}
