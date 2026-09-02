import Link from "next/link";
import { ArrowRight, CheckCircle2, Circle, Compass, Milestone, Sparkles } from "lucide-react";

import { routes } from "@/lib/routes";
import type { LearningPathDetail } from "@/lib/types";

interface LearnerPathCardProps {
  path: LearningPathDetail | null;
}

export function LearnerPathCard({ path }: LearnerPathCardProps) {
  if (!path) {
    return (
      <div className="flex h-full flex-col justify-between rounded-card border border-line bg-card p-5 sm:p-6 shadow-soft">
        <div className="flex flex-col gap-2">
          <span className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-muted">
            <Milestone className="size-3.5 text-primary" aria-hidden="true" />
            Learning Path
          </span>

          <h3 className="text-base sm:text-lg font-bold text-ink">
            Follow a structured roadmap
          </h3>

          <p className="text-xs text-muted leading-relaxed">
            Learning Paths organize courses and hands-on projects into a step-by-step curriculum to help you reach your goals faster.
          </p>
        </div>

        <div className="pt-4">
          <Link
            href={routes.learningPaths.index}
            className="inline-flex h-9 items-center gap-2 rounded-xl bg-surface border border-line px-4 text-xs font-bold text-ink shadow-xs transition-all duration-200 hover:bg-primary hover:text-white hover:border-primary cursor-pointer"
          >
            <Compass className="size-3.5" aria-hidden="true" />
            <span>Explore Learning Paths</span>
          </Link>
        </div>
      </div>
    );
  }

  const pathHref = routes.learningPaths.detail(path.slug);
  const items = path.items.slice(0, 4);

  return (
    <div className="flex h-full flex-col justify-between rounded-card border border-line bg-card p-5 sm:p-6 shadow-soft">
      <div className="flex flex-col gap-3">
        {/* Header */}
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-primary">
            <Milestone className="size-3.5 text-primary" aria-hidden="true" />
            Your Learning Path
          </span>

          {path.learnerProgress?.overallPercent != null && path.learnerProgress.overallPercent > 0 && (
            <span className="rounded-md bg-mint/10 border border-mint/25 px-2 py-0.5 text-[10px] font-bold text-mint">
              {path.learnerProgress.overallPercent}% complete
            </span>
          )}
        </div>

        {/* Path Title & Summary */}
        <div className="flex flex-col gap-0.5">
          <h3 className="text-base sm:text-lg font-bold text-ink">
            <Link href={pathHref} className="hover:text-primary transition-colors">
              {path.title}
            </Link>
          </h3>
          <p className="text-xs text-muted line-clamp-1">
            {path.subtitle || path.description || "Step-by-step curriculum for web foundations."}
          </p>
        </div>

        {/* Milestone Steps */}
        <div className="flex flex-col gap-2 pt-1">
          {items.map((item, idx) => {
            const isCompleted = item.status === "completed";
            const isCurrent = item.isCurrentStep;

            return (
              <div
                key={item.id || idx}
                className="flex items-center justify-between gap-3 rounded-xl border border-line/60 bg-surface/50 px-3 py-2 text-xs transition-colors hover:bg-surface"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  {isCompleted ? (
                    <CheckCircle2 className="size-4 text-mint shrink-0" aria-hidden="true" />
                  ) : isCurrent ? (
                    <Sparkles className="size-4 text-primary shrink-0 animate-pulse" aria-hidden="true" />
                  ) : (
                    <Circle className="size-4 text-muted/50 shrink-0" aria-hidden="true" />
                  )}

                  <span className="font-medium text-ink truncate">
                    {item.title}
                  </span>
                </div>

                <div className="shrink-0 flex items-center gap-2">
                  {item.itemType === "course" && item.progressPercent != null && item.progressPercent > 0 ? (
                    <span className="text-[11px] font-bold text-ink">
                      {item.progressPercent}%
                    </span>
                  ) : isCompleted ? (
                    <span className="text-[10px] font-semibold text-mint">
                      Done
                    </span>
                  ) : isCurrent ? (
                    <span className="rounded-md bg-primary/10 px-1.5 py-0.5 text-[10px] font-bold text-primary">
                      Next up
                    </span>
                  ) : (
                    <span className="text-[10px] text-muted">
                      {idx + 1} of {items.length}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer Link */}
      <div className="border-t border-line/60 pt-3 mt-4">
        <Link
          href={pathHref}
          className="group inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline cursor-pointer"
        >
          <span>Open learning path</span>
          <ArrowRight
            className="size-3.5 transition-transform duration-200 group-hover:translate-x-0.5"
            aria-hidden="true"
          />
        </Link>
      </div>
    </div>
  );
}
