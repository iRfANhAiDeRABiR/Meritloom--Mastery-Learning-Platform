import * as React from "react";
import { Check, Info, Target } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface CourseMetaSectionsProps {
  prerequisites?: string[];
  skills?: string[];
  targetAudience?: string[];
  className?: string;
}

export function CourseMetaSections({
  prerequisites,
  skills,
  targetAudience,
  className,
}: CourseMetaSectionsProps) {
  const hasPrereqs = prerequisites && prerequisites.length > 0;
  const hasSkills = skills && skills.length > 0;
  const hasAudience = targetAudience && targetAudience.length > 0;

  if (!hasPrereqs && !hasSkills && !hasAudience) return null;

  return (
    <div className={cn("flex flex-col gap-8", className)}>
      {/* 1. Prerequisites */}
      {hasPrereqs && (
        <section
          aria-labelledby="course-prereqs-heading"
          className="flex flex-col gap-3 rounded-card border border-line bg-card p-6 shadow-soft"
        >
          <div className="flex items-center gap-2">
            <Info className="size-5 text-primary" aria-hidden="true" />
            <h2
              id="course-prereqs-heading"
              className="text-lg font-bold text-ink"
            >
              Before you start
            </h2>
          </div>

          <ul className="flex flex-col gap-2 pt-1 text-sm text-ink/85">
            {prerequisites.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2.5">
                <span className="grid size-4.5 shrink-0 place-items-center rounded-full bg-lavender text-primary mt-0.5">
                  <Check className="size-3" aria-hidden="true" />
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* 2. Skills covered */}
      {hasSkills && (
        <section
          aria-labelledby="course-skills-heading"
          className="flex flex-col gap-3 rounded-card border border-line bg-card p-6 shadow-soft"
        >
          <h2
            id="course-skills-heading"
            className="text-lg font-bold text-ink"
          >
            Skills you&apos;ll build
          </h2>

          <div className="flex flex-wrap gap-2 pt-1">
            {skills.map((skill, idx) => (
              <Badge
                key={idx}
                variant="neutral"
                className="px-3.5 py-1.5 text-xs font-semibold text-ink"
              >
                {skill}
              </Badge>
            ))}
          </div>
        </section>
      )}

      {/* 3. Who this course is for */}
      {hasAudience && (
        <section
          aria-labelledby="course-audience-heading"
          className="flex flex-col gap-3 rounded-card border border-line bg-card p-6 shadow-soft"
        >
          <div className="flex items-center gap-2">
            <Target className="size-5 text-primary" aria-hidden="true" />
            <h2
              id="course-audience-heading"
              className="text-lg font-bold text-ink"
            >
              Who this course is for
            </h2>
          </div>

          <ul className="flex flex-col gap-2 pt-1 text-sm text-ink/85">
            {targetAudience.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2.5">
                <span className="size-1.5 rounded-full bg-primary mt-2 shrink-0" aria-hidden="true" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}

