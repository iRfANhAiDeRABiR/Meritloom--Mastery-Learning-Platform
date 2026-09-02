import Link from "next/link";
import { ArrowRight, CheckCircle2, Clock, Code2, HelpCircle, History } from "lucide-react";

import type { LearnerActivityItem } from "@/lib/types";

interface RecentActivityCardProps {
  activity: LearnerActivityItem[];
}

function formatRelativeTime(isoString: string): string {
  try {
    const date = new Date(isoString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) {
      if (now.getDate() === date.getDate()) {
        return `Today, ${date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}`;
      }
      return "Yesterday";
    }
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;

    return date.toLocaleDateString([], { month: "short", day: "numeric" });
  } catch {
    return "Recently";
  }
}

export function RecentActivityCard({ activity }: RecentActivityCardProps) {
  return (
    <div
      id="recent-activity"
      className="flex h-full flex-col justify-between rounded-card border border-line bg-card p-5 sm:p-6 shadow-soft"
    >
      <div className="flex flex-col gap-3">
        {/* Header */}
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-muted">
            <History className="size-3.5 text-primary" aria-hidden="true" />
            Recent Activity
          </span>

          <span className="text-[10px] font-semibold text-muted/80">
            Latest 5 events
          </span>
        </div>

        {/* Activity List or Empty State */}
        {activity.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-line bg-surface/40 p-6 text-center">
            <Clock className="size-5 text-muted/60" aria-hidden="true" />
            <p className="text-xs text-muted">
              Your learning activity will appear here as you complete lessons and exercises.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-2.5">
            {activity.map((item) => {
              const isPractice = item.type === "practice_completed";
              const isQuiz = item.type === "quiz_submitted";
              const itemHref =
                item.courseSlug && item.lessonSlug
                  ? `/learn/courses/${item.courseSlug}/lessons/${item.lessonSlug}`
                  : item.courseSlug
                    ? `/learn/courses/${item.courseSlug}`
                    : `/learn/courses`;

              return (
                <div
                  key={item.id}
                  className="flex items-start justify-between gap-3 rounded-xl border border-line/60 bg-surface/50 p-3 text-xs transition-colors hover:bg-surface hover:border-line"
                >
                  <div className="flex items-start gap-2.5 min-w-0">
                    <span className="mt-0.5 shrink-0">
                      {isPractice ? (
                        <span className="flex size-5 items-center justify-center rounded-md bg-mint/15 text-mint">
                          <Code2 className="size-3" aria-hidden="true" />
                        </span>
                      ) : isQuiz ? (
                        <span className="flex size-5 items-center justify-center rounded-md bg-amber-500/15 text-amber-400">
                          <HelpCircle className="size-3" aria-hidden="true" />
                        </span>
                      ) : (
                        <span className="flex size-5 items-center justify-center rounded-md bg-primary/15 text-primary">
                          <CheckCircle2 className="size-3" aria-hidden="true" />
                        </span>
                      )}
                    </span>

                    <div className="flex flex-col gap-0.5 min-w-0">
                      <Link
                        href={itemHref}
                        className="font-semibold text-ink hover:text-primary transition-colors truncate"
                      >
                        {item.title}
                      </Link>
                      <span className="text-[11px] text-muted truncate">
                        {item.subtitle}
                        {item.scoreInfo && ` · ${item.scoreInfo}`}
                      </span>
                    </div>
                  </div>

                  <span className="shrink-0 text-[10px] font-medium text-muted">
                    {formatRelativeTime(item.timestamp)}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer Link */}
      <div className="border-t border-line/60 pt-3 mt-4">
        <Link
          href="/learn/courses"
          className="group inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline cursor-pointer"
        >
          <span>View all learning courses</span>
          <ArrowRight
            className="size-3.5 transition-transform duration-200 group-hover:translate-x-0.5"
            aria-hidden="true"
          />
        </Link>
      </div>
    </div>
  );
}

