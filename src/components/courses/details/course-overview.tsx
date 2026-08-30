import * as React from "react";
import { cn } from "@/lib/utils";

interface CourseOverviewProps {
  description: string;
  className?: string;
}

export function CourseOverview({
  description,
  className,
}: CourseOverviewProps) {
  if (!description) return null;

  // Split description by double newlines to render formatted paragraphs cleanly
  const paragraphs = description
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <section
      aria-labelledby="course-overview-heading"
      className={cn("flex flex-col gap-4", className)}
    >
      <h2
        id="course-overview-heading"
        className="text-2xl font-bold tracking-tight text-ink sm:text-3xl"
      >
        About this course
      </h2>

      <div className="flex flex-col gap-4 text-base leading-relaxed text-ink/80 dark:text-ink/85">
        {paragraphs.map((p, idx) => {
          // If paragraph is a list
          if (p.startsWith("- ") || p.startsWith("* ")) {
            const listItems = p
              .split("\n")
              .map((li) => li.replace(/^[-*]\s*/, "").trim())
              .filter(Boolean);

            return (
              <ul key={idx} className="list-disc pl-5 space-y-1.5 text-muted">
                {listItems.map((item, liIdx) => (
                  <li key={liIdx}>{item}</li>
                ))}
              </ul>
            );
          }

          return <p key={idx}>{p}</p>;
        })}
      </div>
    </section>
  );
}

