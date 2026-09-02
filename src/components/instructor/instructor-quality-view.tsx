import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  ExternalLink,
  FileQuestion,
  Layers,
  Video,
} from "lucide-react";

import type { InstructorQualityWarning } from "@/lib/types/instructor";

interface InstructorQualityViewProps {
  issues: InstructorQualityWarning[];
}

export function InstructorQualityView({
  issues,
}: InstructorQualityViewProps) {
  const criticalCount = issues.filter((i) => i.severity === "critical").length;
  const warningCount = issues.filter((i) => i.severity === "warning").length;
  const suggestionCount = issues.filter((i) => i.severity === "suggestion").length;

  return (
    <div className="flex flex-col gap-8 pb-12">
      {/* Top Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-line/60 pb-6">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <Link
              href="/instructor"
              className="grid size-8 place-items-center rounded-lg border border-line bg-card text-muted hover:text-ink hover:border-primary/40 transition-colors"
              title="Return to Instructor Overview"
            >
              <ArrowLeft className="size-4" />
            </Link>
            <h1 className="text-2xl font-bold tracking-tight text-ink sm:text-3xl">
              Course Quality Health
            </h1>
          </div>
          <p className="text-sm text-muted">
            Automated quality diagnostics and recommendations for your assigned courses.
          </p>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="flex flex-col justify-between rounded-card border border-line bg-card p-5 shadow-soft">
          <span className="text-xs font-bold uppercase tracking-wider text-rose-500">
            Critical
          </span>
          <span className="text-2xl sm:text-3xl font-bold text-ink mt-2">
            {criticalCount}
          </span>
        </div>

        <div className="flex flex-col justify-between rounded-card border border-line bg-card p-5 shadow-soft">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-500">
            Warnings
          </span>
          <span className="text-2xl sm:text-3xl font-bold text-ink mt-2">
            {warningCount}
          </span>
        </div>

        <div className="flex flex-col justify-between rounded-card border border-line bg-card p-5 shadow-soft">
          <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
            Suggestions
          </span>
          <span className="text-2xl sm:text-3xl font-bold text-ink mt-2">
            {suggestionCount}
          </span>
        </div>
      </div>

      {/* Diagnostics List */}
      <div className="flex flex-col gap-4">
        <h2 className="text-lg font-bold text-ink">
          Diagnostic Findings ({issues.length})
        </h2>

        {issues.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 rounded-card border border-dashed border-line bg-card/60 p-10 text-center">
            <CheckCircle2 className="size-8 text-emerald-500" />
            <h3 className="text-base font-bold text-ink">All courses in great shape!</h3>
            <p className="text-xs text-muted max-w-sm">
              No quality warnings or missing assessment checks detected in your assigned curriculum.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {issues.map((issue) => (
              <div
                key={issue.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-line bg-card p-4 shadow-soft hover:border-primary/40 transition-colors"
              >
                <div className="flex items-start gap-3 min-w-0">
                  <span className="mt-0.5 shrink-0">
                    {issue.category === "quiz" ? (
                      <span className="flex size-7 items-center justify-center rounded-lg bg-amber-500/15 text-amber-400">
                        <FileQuestion className="size-4" />
                      </span>
                    ) : issue.category === "video" ? (
                      <span className="flex size-7 items-center justify-center rounded-lg bg-rose-500/15 text-rose-500">
                        <Video className="size-4" />
                      </span>
                    ) : (
                      <span className="flex size-7 items-center justify-center rounded-lg bg-cyan-500/15 text-cyan-400">
                        <Layers className="size-4" />
                      </span>
                    )}
                  </span>

                  <div className="flex flex-col gap-0.5 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-ink text-sm">
                        {issue.courseTitle}
                      </span>
                      <span className="rounded bg-surface px-1.5 py-0.5 text-[10px] font-semibold text-muted uppercase tracking-wider border border-line">
                        {issue.category}
                      </span>
                    </div>
                    <p className="text-xs text-muted leading-relaxed">
                      {issue.message}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Link
                    href={`/instructor/courses/${issue.courseId}`}
                    className="flex items-center gap-1.5 rounded-xl bg-primary px-3 py-1.5 text-xs font-bold text-white hover:bg-primary-hover shadow-xs transition-colors"
                  >
                    <span>Fix issue</span>
                  </Link>
                  <Link
                    href={`/courses/${issue.courseSlug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="grid size-8 place-items-center rounded-xl border border-line bg-surface text-muted hover:text-primary transition-colors"
                    title="Preview course"
                  >
                    <ExternalLink className="size-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

