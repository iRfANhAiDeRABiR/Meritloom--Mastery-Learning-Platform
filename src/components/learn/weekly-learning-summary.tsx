import Link from "next/link";
import { ArrowRight, BookCheck, CalendarDays, Code2, HelpCircle } from "lucide-react";

import type { WeeklyActivityMetrics } from "@/lib/types";

interface WeeklyLearningSummaryProps {
  metrics: WeeklyActivityMetrics;
}

export function WeeklyLearningSummary({ metrics }: WeeklyLearningSummaryProps) {
  const { lessonsCompleted, practiceCount, knowledgeChecksCount } = metrics;

  return (
    <div className="flex flex-col justify-between rounded-card border border-line bg-card p-5 sm:p-6 shadow-soft">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-muted">
            <CalendarDays className="size-3.5 text-primary" aria-hidden="true" />
            This Week
          </span>
          <span className="text-[10px] font-semibold text-muted/80">
            Mon – Sun
          </span>
        </div>
        <p className="text-xs text-muted">
          Your recorded learning activities this calendar week.
        </p>
      </div>

      {/* 3 Metric Tiles */}
      <div className="grid grid-cols-3 gap-2.5 py-4">
        {/* Lessons Completed */}
        <div className="flex flex-col items-center justify-center rounded-xl border border-line bg-surface/60 p-3 text-center transition-colors hover:border-line/80">
          <span className="flex size-7 items-center justify-center rounded-lg bg-primary/10 text-primary mb-1.5">
            <BookCheck className="size-4" aria-hidden="true" />
          </span>
          <span className="text-xl sm:text-2xl font-bold tracking-tight text-ink">
            {lessonsCompleted}
          </span>
          <span className="text-[10px] sm:text-[11px] font-medium text-muted mt-0.5 line-clamp-1">
            Lessons
          </span>
        </div>

        {/* Practice Sessions */}
        <div className="flex flex-col items-center justify-center rounded-xl border border-line bg-surface/60 p-3 text-center transition-colors hover:border-line/80">
          <span className="flex size-7 items-center justify-center rounded-lg bg-mint/10 text-mint mb-1.5">
            <Code2 className="size-4" aria-hidden="true" />
          </span>
          <span className="text-xl sm:text-2xl font-bold tracking-tight text-ink">
            {practiceCount}
          </span>
          <span className="text-[10px] sm:text-[11px] font-medium text-muted mt-0.5 line-clamp-1">
            Practice
          </span>
        </div>

        {/* Knowledge Checks */}
        <div className="flex flex-col items-center justify-center rounded-xl border border-line bg-surface/60 p-3 text-center transition-colors hover:border-line/80">
          <span className="flex size-7 items-center justify-center rounded-lg bg-amber-500/10 text-amber-400 mb-1.5">
            <HelpCircle className="size-4" aria-hidden="true" />
          </span>
          <span className="text-xl sm:text-2xl font-bold tracking-tight text-ink">
            {knowledgeChecksCount}
          </span>
          <span className="text-[10px] sm:text-[11px] font-medium text-muted mt-0.5 line-clamp-1">
            Checks
          </span>
        </div>
      </div>

      {/* Footer Link */}
      <div className="border-t border-line/60 pt-3">
        <Link
          href="#recent-activity"
          className="group inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
        >
          <span>View activity details</span>
          <ArrowRight
            className="size-3.5 transition-transform duration-200 group-hover:translate-x-0.5"
            aria-hidden="true"
          />
        </Link>
      </div>
    </div>
  );
}

