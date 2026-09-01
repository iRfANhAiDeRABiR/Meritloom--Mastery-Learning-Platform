"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import {
  Activity,
  AlertCircle,
  Database,
  Layers,
  Lock,
  Sparkles,
} from "lucide-react";
import { SystemHealthHeader } from "./system-health-header";
import { OverallHealthBanner } from "./overall-health-banner";
import { PrimaryHealthCards } from "./primary-health-cards";
import { ResponseTimeChart } from "./response-time-chart";
import { RequestVolumeChart } from "./request-volume-chart";
import { SlowRoutesTable } from "./slow-routes-table";
import { DatabaseHealthPanel } from "./database-health-panel";
import { AuthHealthPanel } from "./auth-health-panel";
import { RecentErrorsPanel } from "./recent-errors-panel";
import { SecurityAuditPanel } from "./security-audit-panel";
import { refreshSystemHealthAction } from "@/lib/actions/system-health";
import type {
  SystemHealthDashboardData,
  TimeRange,
} from "@/lib/system-health/types";

interface SystemHealthViewProps {
  initialData: SystemHealthDashboardData;
}

const TABS = [
  { id: "overview", label: "Overview", icon: Layers },
  { id: "performance", label: "Performance", icon: Activity },
  { id: "database", label: "Database", icon: Database },
  { id: "errors", label: "Errors", icon: AlertCircle },
  { id: "security", label: "Security & RLS", icon: Lock },
];

export function SystemHealthView({ initialData }: SystemHealthViewProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [data, setData] = React.useState<SystemHealthDashboardData>(initialData);
  const [selectedRange, setSelectedRange] = React.useState<TimeRange>(initialData.selectedRange || "24h");
  const [autoRefreshInterval, setAutoRefreshInterval] = React.useState<number>(60); // 60s default
  const [isRefreshing, setIsRefreshing] = React.useState(false);

  const currentTab = searchParams.get("tab") || "overview";

  const handleTabChange = (tabId: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", tabId);
    router.replace(`/admin/system?${params.toString()}`, { scroll: false });
  };

  const handleRangeChange = async (range: TimeRange) => {
    setSelectedRange(range);
    setIsRefreshing(true);
    try {
      const res = await refreshSystemHealthAction(range);
      if (res.success && res.data) {
        setData(res.data);
      }
    } catch {
      // Keep existing data on error
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    try {
      const res = await refreshSystemHealthAction(selectedRange);
      if (res.success && res.data) {
        setData(res.data);
        if (res.data.overallStatus === "healthy") {
          toast.success("System status refreshed — all systems healthy.", { id: "health-refresh" });
        } else {
          toast.warning(
            `System status refreshed — ${res.data.currentIssues.length} item(s) need attention.`,
            { id: "health-refresh" },
          );
        }
      } else {
        toast.error("System status couldn't be refreshed", { id: "health-refresh" });
      }
    } catch {
      toast.error("System status couldn't be refreshed", { id: "health-refresh" });
    } finally {
      setIsRefreshing(false);
    }
  };

  // Background auto-refresh polling (pauses when browser tab is hidden)
  React.useEffect(() => {
    if (autoRefreshInterval <= 0) return;

    const intervalId = setInterval(async () => {
      // Pause if document is hidden to save resources
      if (typeof document !== "undefined" && document.hidden) return;

      try {
        const res = await refreshSystemHealthAction(selectedRange);
        if (res.success && res.data) {
          setData(res.data);
        }
      } catch {
        // Silently swallow auto-refresh network hiccups without toast spam
      }
    }, autoRefreshInterval * 1000);

    return () => clearInterval(intervalId);
  }, [autoRefreshInterval, selectedRange]);

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      {/* 1. Header & Controls */}
      <SystemHealthHeader
        lastCheckedAt={data.lastCheckedAt}
        selectedRange={selectedRange}
        onRangeChange={handleRangeChange}
        autoRefreshInterval={autoRefreshInterval}
        onAutoRefreshChange={setAutoRefreshInterval}
        isRefreshing={isRefreshing}
        onRefresh={handleManualRefresh}
      />

      {/* 2. Top-Level Overall Status Banner */}
      <OverallHealthBanner
        status={data.overallStatus}
        currentIssues={data.currentIssues}
      />

      {/* 3. Primary 4 Health Cards */}
      <PrimaryHealthCards
        application={data.application}
        database={data.database}
        auth={data.auth}
        performance={data.performance}
        onSelectTab={handleTabChange}
      />

      {/* 4. Tab Navigation Bar */}
      <div className="flex items-center gap-1 border-b border-line overflow-x-auto pb-1">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => handleTabChange(tab.id)}
              className={`flex items-center gap-2 border-b-2 px-3.5 py-2.5 text-xs font-semibold whitespace-nowrap transition ${
                isActive
                  ? "border-primary text-primary"
                  : "border-transparent text-ink-muted hover:text-ink hover:border-line"
              }`}
            >
              <Icon className="size-3.5" />
              <span>{tab.label}</span>
              {tab.id === "errors" && data.recentErrors.length > 0 && (
                <span className="rounded-full bg-rose-500/10 px-1.5 py-0.2 text-[10px] font-bold text-rose-500">
                  {data.recentErrors.length}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* 5. Tab Content Sections */}
      {currentTab === "overview" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <ResponseTimeChart trend={data.trend} />
            <RequestVolumeChart trend={data.trend} />
          </div>

          <SlowRoutesTable routes={data.slowRoutes} />

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <DatabaseHealthPanel database={data.database} integrity={data.integrity} />
            <AuthHealthPanel auth={data.auth} />
          </div>

          <SecurityAuditPanel security={data.security} />
        </div>
      )}

      {currentTab === "performance" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <ResponseTimeChart trend={data.trend} />
            <RequestVolumeChart trend={data.trend} />
          </div>
          <SlowRoutesTable routes={data.slowRoutes} />
        </div>
      )}

      {currentTab === "database" && (
        <DatabaseHealthPanel database={data.database} integrity={data.integrity} />
      )}

      {currentTab === "errors" && (
        <RecentErrorsPanel errors={data.recentErrors} />
      )}

      {currentTab === "security" && (
        <div className="space-y-6">
          <AuthHealthPanel auth={data.auth} />
          <SecurityAuditPanel security={data.security} />
        </div>
      )}

      {/* Footer Info */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-4 border-t border-line text-[11px] text-ink-muted">
        <div className="flex items-center gap-1.5">
          <Sparkles className="size-3 text-primary" />
          <span>Meritloom Operational Health Engine</span>
        </div>
        <span>Data aggregated in-memory and via PostgreSQL telemetry RPCs</span>
      </div>
    </div>
  );
}

