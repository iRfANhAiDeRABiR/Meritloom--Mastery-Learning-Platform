import Link from "next/link";
import { ArrowRight, History } from "lucide-react";
import type { QuizAttemptSummary } from "@/lib/types";
import { cn } from "@/lib/utils";

interface AttemptHistoryProps {
  courseSlug: string;
  lessonSlug: string;
  currentAttemptId: string;
  attempts: QuizAttemptSummary[];
}

export function AttemptHistory({
  courseSlug,
  lessonSlug,
  currentAttemptId,
  attempts,
}: AttemptHistoryProps) {
  if (attempts.length <= 1) return null;

  return (
    <section aria-label="Attempt history" className="flex flex-col gap-3 pt-4 border-t border-line">
      <div className="flex items-center gap-2">
        <History className="size-4 text-muted" aria-hidden="true" />
        <h4 className="text-xs font-bold uppercase tracking-wider text-muted">
          Previous attempts ({attempts.length})
        </h4>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {attempts.map((att) => {
          const isCurrent = att.id === currentAttemptId;
          const formattedDate = new Date(att.completedAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          });

          return (
            <Link
              key={att.id}
              href={`/learn/courses/${courseSlug}/lessons/${lessonSlug}/results/${att.id}`}
              className={cn(
                "flex items-center justify-between gap-3 rounded-xl border p-3.5 text-xs font-semibold transition-all shadow-2xs",
                isCurrent
                  ? "border-primary/40 bg-lavender/40 text-primary font-bold pointer-events-none"
                  : "border-line bg-card text-ink hover:border-primary/40 hover:bg-surface",
              )}
            >
              <div className="flex flex-col gap-0.5 min-w-0">
                <span className="truncate">Attempt {att.attemptNumber}</span>
                <span className="text-[11px] text-muted font-normal">
                  {formattedDate}
                </span>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="font-bold">
                  {att.correctCount} / {att.totalQuestions} ({att.percent}%)
                </span>
                {!isCurrent && <ArrowRight className="size-3 text-muted" aria-hidden="true" />}
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

