"use client";

import * as React from "react";
import Link from "next/link";
import { CheckCircle2, Database, ExternalLink, RefreshCw, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { runDatabaseIntegrityCheckAction } from "@/lib/actions/system-health";
import type { DatabaseHealth, DataIntegrityResult } from "@/lib/system-health/types";

interface DatabaseHealthPanelProps {
  database: DatabaseHealth;
  integrity: DataIntegrityResult;
}

export function DatabaseHealthPanel({ database, integrity: initialIntegrity }: DatabaseHealthPanelProps) {
  const [integrity, setIntegrity] = React.useState<DataIntegrityResult>(initialIntegrity);
  const [isRunningCheck, setIsRunningCheck] = React.useState(false);

  const handleRunIntegrityCheck = async () => {
    setIsRunningCheck(true);
    toast("Checking database integrity...", { id: "db-check" });
    try {
      const res = await runDatabaseIntegrityCheckAction();
      if (res.success && res.result) {
        setIntegrity(res.result);
        if (res.result.warningsCount === 0) {
          toast.success("Database integrity check complete — all relationships valid.", { id: "db-check" });
        } else {
          toast.warning(
            `Database integrity check complete — ${res.result.warningsCount} item(s) flagged.`,
            { id: "db-check" },
          );
        }
      } else {
        toast.error(res.error || "Integrity check failed", { id: "db-check" });
      }
    } catch {
      toast.error("Failed to run database integrity check", { id: "db-check" });
    } finally {
      setIsRunningCheck(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Database Latency & Primary Metrics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-line bg-surface p-5 shadow-xs">
          <div className="flex items-center gap-2 text-xs font-semibold text-ink-muted">
            <Database className="size-4 text-emerald-500" />
            <span>Connection Latency</span>
          </div>
          <div className="mt-2 font-display text-3xl font-bold text-ink">
            {database.latencyMs} <span className="text-sm font-normal text-ink-muted">ms</span>
          </div>
          <p className="mt-1 text-xs text-ink-muted">
            Threshold: &le;250ms (Healthy), &gt;250ms (Degraded)
          </p>
        </div>

        <div className="rounded-2xl border border-line bg-surface p-5 shadow-xs">
          <div className="flex items-center gap-2 text-xs font-semibold text-ink-muted">
            <CheckCircle2 className="size-4 text-emerald-500" />
            <span>Read Operations</span>
          </div>
          <div className="mt-2 font-display text-3xl font-bold text-ink capitalize">
            {database.readTest}
          </div>
          <p className="mt-1 text-xs text-ink-muted">
            Live query probe passed
          </p>
        </div>

        <div className="rounded-2xl border border-line bg-surface p-5 shadow-xs">
          <div className="flex items-center gap-2 text-xs font-semibold text-ink-muted">
            <ShieldCheck className="size-4 text-purple-500" />
            <span>Data Integrity</span>
          </div>
          <div className="mt-2 font-display text-3xl font-bold text-ink capitalize">
            {integrity.status}
          </div>
          <p className="mt-1 text-xs text-ink-muted">
            {integrity.warningsCount === 0
              ? "Zero orphan relationships"
              : `${integrity.warningsCount} item(s) flagged`}
          </p>
        </div>
      </div>

      {/* Table Row Counts */}
      <div className="rounded-2xl border border-line bg-surface p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
          <div>
            <h2 className="font-display text-base font-bold text-ink">
              Core Database Tables
            </h2>
            <p className="text-xs text-ink-muted mt-0.5">
              Live record counts across essential application entities.
            </p>
          </div>

          <Button
            onClick={handleRunIntegrityCheck}
            disabled={isRunningCheck}
            variant="outline"
            className="rounded-xl border-line text-xs font-semibold self-start sm:self-auto"
          >
            <RefreshCw className={`mr-1.5 size-3.5 ${isRunningCheck ? "animate-spin text-primary" : "text-ink-muted"}`} />
            <span>{isRunningCheck ? "Auditing..." : "Run Integrity Audit"}</span>
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          <div className="rounded-xl border border-line/60 bg-surface-elevated/40 p-3">
            <span className="text-[11px] font-medium text-ink-muted">courses</span>
            <div className="text-xl font-bold text-ink mt-0.5">{database.tableCounts.courses}</div>
          </div>
          <div className="rounded-xl border border-line/60 bg-surface-elevated/40 p-3">
            <span className="text-[11px] font-medium text-ink-muted">course_modules</span>
            <div className="text-xl font-bold text-ink mt-0.5">{database.tableCounts.modules}</div>
          </div>
          <div className="rounded-xl border border-line/60 bg-surface-elevated/40 p-3">
            <span className="text-[11px] font-medium text-ink-muted">lessons</span>
            <div className="text-xl font-bold text-ink mt-0.5">{database.tableCounts.lessons}</div>
          </div>
          <div className="rounded-xl border border-line/60 bg-surface-elevated/40 p-3">
            <span className="text-[11px] font-medium text-ink-muted">practice_quizzes</span>
            <div className="text-xl font-bold text-ink mt-0.5">{database.tableCounts.quizzes}</div>
          </div>
          <div className="rounded-xl border border-line/60 bg-surface-elevated/40 p-3">
            <span className="text-[11px] font-medium text-ink-muted">learning_paths</span>
            <div className="text-xl font-bold text-ink mt-0.5">{database.tableCounts.learningPaths}</div>
          </div>
          <div className="rounded-xl border border-line/60 bg-surface-elevated/40 p-3">
            <span className="text-[11px] font-medium text-ink-muted">course_enrollments</span>
            <div className="text-xl font-bold text-ink mt-0.5">{database.tableCounts.enrollments}</div>
          </div>
          <div className="rounded-xl border border-line/60 bg-surface-elevated/40 p-3">
            <span className="text-[11px] font-medium text-ink-muted">lesson_progress</span>
            <div className="text-xl font-bold text-ink mt-0.5">{database.tableCounts.progress}</div>
          </div>
          <div className="rounded-xl border border-line/60 bg-surface-elevated/40 p-3">
            <span className="text-[11px] font-medium text-ink-muted">lesson_notes</span>
            <div className="text-xl font-bold text-ink mt-0.5">{database.tableCounts.notes}</div>
          </div>
          <div className="rounded-xl border border-line/60 bg-surface-elevated/40 p-3">
            <span className="text-[11px] font-medium text-ink-muted">lesson_bookmarks</span>
            <div className="text-xl font-bold text-ink mt-0.5">{database.tableCounts.bookmarks}</div>
          </div>
        </div>

        {/* Integrity Details */}
        {integrity.issues.length > 0 ? (
          <div className="mt-4 rounded-xl border border-amber-500/30 bg-amber-500/5 p-4 text-xs">
            <span className="font-semibold text-amber-900 dark:text-amber-200">
              Integrity Warnings:
            </span>
            <ul className="mt-2 space-y-1.5 pl-4 list-disc text-ink-muted">
              {integrity.issues.map((issue, idx) => (
                <li key={idx}>
                  <strong className="text-ink">{issue.title}:</strong> {issue.description}
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="mt-4 flex items-center justify-between rounded-xl bg-emerald-500/10 p-3 text-xs text-emerald-700 dark:text-emerald-300">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="size-4 text-emerald-500" />
              <span>All module, lesson, quiz, and learning path entity relationships are valid.</span>
            </div>
            <Button asChild variant="ghost" className="text-xs h-7 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-500/20">
              <Link href="/admin/content-tools">
                <span>Content Quality</span>
                <ExternalLink className="ml-1 size-3" />
              </Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

