import Link from "next/link";
import { ArrowRight, Bookmark } from "lucide-react";

import { routes } from "@/lib/routes";
import type { LearnerSavedCourseSummary } from "@/lib/types";
import { formatDifficulty } from "@/lib/utils";

interface DashboardSavedCardProps {
  savedCourses: LearnerSavedCourseSummary[];
}

export function DashboardSavedCard({ savedCourses }: DashboardSavedCardProps) {
  if (savedCourses.length === 0) {
    return null;
  }

  return (
    <div className="flex h-full flex-col justify-between rounded-card border border-line bg-card p-5 sm:p-6 shadow-soft">
      <div className="flex flex-col gap-3">
        {/* Header */}
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-muted">
            <Bookmark className="size-3.5 text-primary" aria-hidden="true" />
            Saved for Later
          </span>

          <Link
            href={routes.learnSaved}
            className="group flex items-center gap-1 text-xs font-semibold text-primary hover:underline cursor-pointer"
          >
            <span>View all ({savedCourses.length})</span>
            <ArrowRight
              className="size-3 transition-transform group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </Link>
        </div>

        {/* Saved Courses Grid/List */}
        <div className="flex flex-col gap-2.5">
          {savedCourses.map((c) => {
            const courseHref = `/learn/courses/${c.slug}`;

            return (
              <div
                key={c.id}
                className="flex items-center justify-between gap-3 rounded-xl border border-line/60 bg-surface/50 p-3 text-xs transition-colors hover:bg-surface hover:border-line"
              >
                <div className="flex flex-col gap-0.5 min-w-0">
                  <Link
                    href={courseHref}
                    className="font-bold text-ink hover:text-primary transition-colors truncate"
                  >
                    {c.title}
                  </Link>

                  <div className="flex items-center gap-2 text-[11px] text-muted">
                    {c.categoryName && <span>{c.categoryName}</span>}
                    <span>•</span>
                    <span>{formatDifficulty(c.difficulty)}</span>
                    {c.lessonCount > 0 && (
                      <>
                        <span>•</span>
                        <span>{c.lessonCount} lessons</span>
                      </>
                    )}
                  </div>
                </div>

                <Link
                  href={courseHref}
                  className="shrink-0 rounded-lg border border-line bg-card px-2.5 py-1 text-[11px] font-semibold text-ink hover:border-primary/40 hover:text-primary transition-colors cursor-pointer"
                >
                  View course
                </Link>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer Link */}
      <div className="border-t border-line/60 pt-3 mt-4">
        <Link
          href={routes.learnSaved}
          className="group inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline cursor-pointer"
        >
          <span>Manage saved bookmarks</span>
          <ArrowRight
            className="size-3.5 transition-transform duration-200 group-hover:translate-x-0.5"
            aria-hidden="true"
          />
        </Link>
      </div>
    </div>
  );
}
