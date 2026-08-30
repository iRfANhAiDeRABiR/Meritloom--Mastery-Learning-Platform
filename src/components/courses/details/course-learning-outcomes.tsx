import * as React from "react";
import { CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface CourseLearningOutcomesProps {
  outcomes: string[];
  className?: string;
}

export function CourseLearningOutcomes({
  outcomes,
  className,
}: CourseLearningOutcomesProps) {
  if (!outcomes || outcomes.length === 0) return null;

  return (
    <section
      aria-labelledby="course-outcomes-heading"
      className={cn(
        "flex flex-col gap-5 rounded-container border border-line bg-card p-6 sm:p-8 shadow-soft",
        className,
      )}
    >
      <h2
        id="course-outcomes-heading"
        className="text-xl font-bold tracking-tight text-ink sm:text-2xl"
      >
        What you’ll learn
      </h2>

      <div className="grid gap-3 sm:grid-cols-2 sm:gap-4">
        {outcomes.map((outcome, idx) => (
          <div key={idx} className="flex items-start gap-3">
            <span className="grid size-6 shrink-0 place-items-center rounded-full bg-lavender text-primary mt-0.5">
              <CheckCircle2 className="size-4" aria-hidden="true" />
            </span>
            <span className="text-sm font-medium leading-snug text-ink/85">
              {outcome}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

