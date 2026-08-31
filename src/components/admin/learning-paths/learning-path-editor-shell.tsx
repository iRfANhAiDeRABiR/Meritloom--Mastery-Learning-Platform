"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Clock,
  Eye,
  FileEdit,
  Globe,
  Route,
  Settings,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { OverviewTab } from "@/components/admin/learning-paths/overview-tab";
import { PathBuilderTab } from "@/components/admin/learning-paths/path-builder-tab";
import { SettingsTab } from "@/components/admin/learning-paths/settings-tab";
import type { AdminLearningPathDetail, AvailableCourseForPath } from "@/lib/types";

interface LearningPathEditorShellProps {
  path: AdminLearningPathDetail;
  availableCourses: AvailableCourseForPath[];
}

export function LearningPathEditorShell({
  path,
  availableCourses,
}: LearningPathEditorShellProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = React.useState<"builder" | "overview" | "settings">("builder");

  const formatDuration = (mins: number) => {
    if (!mins) return "0 mins";
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    if (h === 0) return `${m}m`;
    if (m === 0) return `${h}h`;
    return `${h}h ${m}m`;
  };

  const handleRefresh = () => {
    router.refresh();
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      {/* Top Breadcrumbs & Status */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Button asChild variant="outline" size="sm" className="rounded-xl border-line text-xs font-semibold">
            <Link href="/admin/learning-paths">
              <ArrowLeft className="mr-1.5 h-3.5 w-3.5" />
              <span>All Learning Paths</span>
            </Link>
          </Button>

          <div className="h-4 w-[1px] bg-line" />

          {path.isPublished ? (
            <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 text-xs font-semibold">
              PUBLISHED
            </Badge>
          ) : (
            <Badge variant="outline" className="border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-semibold">
              DRAFT
            </Badge>
          )}
        </div>

        <div className="flex items-center gap-2">
          {path.isPublished && (
            <Button asChild variant="outline" size="sm" className="rounded-xl border-line text-xs font-semibold">
              <Link href={`/learning-paths/${path.slug}`} target="_blank">
                <Globe className="mr-1.5 h-3.5 w-3.5 text-ink-muted" />
                <span>View Public Page</span>
              </Link>
            </Button>
          )}

          <Button asChild variant="outline" size="sm" className="rounded-xl border-line text-xs font-semibold">
            <Link href={`/admin/learning-paths/${path.id}/preview`}>
              <Eye className="mr-1.5 h-3.5 w-3.5 text-ink-muted" />
              <span>Preview Path</span>
            </Link>
          </Button>
        </div>
      </div>

      {/* Path Title Header Card */}
      <div className="rounded-3xl border border-line bg-surface p-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-primary">LEARNING PATH</span>
              <span className="text-ink-muted">•</span>
              <span className="font-mono text-xs text-ink-muted">/{path.slug}</span>
            </div>
            <h1 className="mt-1 font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl">
              {path.title}
            </h1>
            <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-ink-muted">
              <span className="capitalize font-semibold text-ink">{path.difficulty}</span>
              <span>•</span>
              <span>{path.courseCount} courses</span>
              <span>•</span>
              <span>{path.items.length} total steps</span>
              <span>•</span>
              <span className="inline-flex items-center gap-1 font-semibold text-ink">
                <Clock className="h-3.5 w-3.5 text-primary" />
                {formatDuration(path.estimatedMinutes)}
              </span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mt-6 flex flex-wrap gap-1 border-t border-line pt-4">
          {[
            { id: "builder", label: "Path Builder", icon: Route },
            { id: "overview", label: "Overview & Metadata", icon: FileEdit },
            { id: "settings", label: "Health & Publishing", icon: Settings },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as "builder" | "overview" | "settings")}
                className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition ${
                  isActive
                    ? "bg-primary text-white shadow-sm shadow-primary/25"
                    : "text-ink-muted hover:bg-surface-elevated hover:text-ink"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab View */}
      <div>
        {activeTab === "builder" && (
          <PathBuilderTab
            path={path}
            availableCourses={availableCourses}
            onRefresh={handleRefresh}
          />
        )}
        {activeTab === "overview" && (
          <OverviewTab path={path} onRefresh={handleRefresh} />
        )}
        {activeTab === "settings" && (
          <SettingsTab path={path} onRefresh={handleRefresh} />
        )}
      </div>
    </div>
  );
}
