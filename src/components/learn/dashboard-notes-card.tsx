import Link from "next/link";
import { ArrowRight, StickyNote } from "lucide-react";

import { routes } from "@/lib/routes";
import type { LearnerRecentNoteSummary } from "@/lib/types";

interface DashboardNotesCardProps {
  recentNotes: LearnerRecentNoteSummary[];
}

export function DashboardNotesCard({ recentNotes }: DashboardNotesCardProps) {
  if (recentNotes.length === 0) {
    return null;
  }

  return (
    <div className="flex h-full flex-col justify-between rounded-card border border-line bg-card p-5 sm:p-6 shadow-soft">
      <div className="flex flex-col gap-3">
        {/* Header */}
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-muted">
            <StickyNote className="size-3.5 text-primary" aria-hidden="true" />
            Recent Notes
          </span>

          <Link
            href={routes.learnNotes}
            className="group flex items-center gap-1 text-xs font-semibold text-primary hover:underline cursor-pointer"
          >
            <span>View all ({recentNotes.length})</span>
            <ArrowRight
              className="size-3 transition-transform group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </Link>
        </div>

        {/* Notes List */}
        <div className="flex flex-col gap-2.5">
          {recentNotes.map((n) => {
            const lessonHref =
              n.courseSlug && n.lessonSlug
                ? `/learn/courses/${n.courseSlug}/lessons/${n.lessonSlug}`
                : routes.learnNotes;

            return (
              <div
                key={n.id}
                className="flex flex-col gap-1.5 rounded-xl border border-line/60 bg-surface/50 p-3 text-xs transition-colors hover:bg-surface hover:border-line"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-bold text-ink truncate">
                    {n.lessonTitle}
                  </span>
                  <span className="text-[10px] text-muted shrink-0 truncate max-w-[120px]">
                    {n.courseTitle}
                  </span>
                </div>

                <p className="text-[11px] text-muted/90 italic line-clamp-2 leading-relaxed bg-background/50 rounded-lg p-2 border border-line/40">
                  &ldquo;{n.contentPreview}&rdquo;
                </p>

                <div className="flex justify-end pt-0.5">
                  <Link
                    href={lessonHref}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-primary hover:underline cursor-pointer"
                  >
                    <span>Open lesson</span>
                    <ArrowRight className="size-3" aria-hidden="true" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer Link */}
      <div className="border-t border-line/60 pt-3 mt-4">
        <Link
          href={routes.learnNotes}
          className="group inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline cursor-pointer"
        >
          <span>View study notebook</span>
          <ArrowRight
            className="size-3.5 transition-transform duration-200 group-hover:translate-x-0.5"
            aria-hidden="true"
          />
        </Link>
      </div>
    </div>
  );
}
