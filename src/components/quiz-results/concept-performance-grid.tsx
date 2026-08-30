import { Layers } from "lucide-react";
import type { ConceptPerformance } from "@/lib/types";
import { cn } from "@/lib/utils";

interface ConceptPerformanceGridProps {
  concepts: ConceptPerformance[];
}

export function ConceptPerformanceGrid({
  concepts,
}: ConceptPerformanceGridProps) {
  if (concepts.length === 0) return null;

  return (
    <section aria-label="Concept performance breakdown" className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <span className="text-[11px] font-extrabold uppercase tracking-wider text-muted">
          Topic Breakdown
        </span>
        <h3 className="text-xl font-bold text-ink">
          How you did by concept
        </h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {concepts.map((concept, idx) => {
          let badgeStyle = "bg-surface text-muted border-line";
          let badgeText = "Review";
          let progressBg = "bg-primary";

          if (concept.status === "strong") {
            badgeStyle = "bg-mint/40 text-[#14895A] dark:text-[#74E0B8] border-[#19B99A]/30";
            badgeText = "Strong";
            progressBg = "bg-[#19B99A]";
          } else if (concept.status === "good_progress") {
            badgeStyle = "bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-300/40";
            badgeText = "Good progress";
            progressBg = "bg-amber-500";
          }

          return (
            <div
              key={idx}
              className="flex flex-col justify-between gap-4 rounded-[18px] border border-line bg-card p-5 shadow-soft hover:border-primary/30 transition-all"
            >
              {/* Header: Topic + Status Badge */}
              <div className="flex items-start justify-between gap-2.5">
                <div className="flex flex-col gap-1 min-w-0">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-muted flex items-center gap-1">
                    <Layers className="size-3 text-primary" aria-hidden="true" />
                    <span>Concept</span>
                  </span>
                  <h4 className="truncate text-sm font-bold text-ink" title={concept.topic}>
                    {concept.topic}
                  </h4>
                </div>

                <span
                  className={cn(
                    "rounded-md px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider border shrink-0",
                    badgeStyle,
                  )}
                >
                  {badgeText}
                </span>
              </div>

              {/* Score & Mini Progress Bar */}
              <div className="flex flex-col gap-2 pt-2 border-t border-line/60">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-muted">
                    {concept.correctCount} of {concept.totalCount} correct
                  </span>
                  <span className="font-bold text-ink">{concept.percent}%</span>
                </div>

                <div
                  className="h-1.5 w-full overflow-hidden rounded-full bg-line"
                  role="progressbar"
                  aria-valuenow={concept.percent}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label={`${concept.topic} score`}
                >
                  <div
                    className={cn("h-full rounded-full transition-all duration-300", progressBg)}
                    style={{ width: `${concept.percent}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
