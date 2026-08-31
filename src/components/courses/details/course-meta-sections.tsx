import * as React from "react";
import Link from "next/link";
import { ArrowRight, Check, Compass, Info, Sparkles, Target } from "lucide-react";
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
          className="flex flex-col gap-4 rounded-card border border-line bg-card p-6 shadow-soft"
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

          <ul className="flex flex-col gap-3 pt-1 text-sm text-ink/85">
            {prerequisites.map((item, idx) => {
              const isHtmlPrereq = item.toLowerCase().includes("html fundamentals");
              return (
                <li key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 rounded-xl border border-line/60 bg-surface/50 p-3">
                  <div className="flex items-start gap-2.5">
                    <span className="grid size-4.5 shrink-0 place-items-center rounded-full bg-lavender text-primary mt-0.5">
                      <Check className="size-3" aria-hidden="true" />
                    </span>
                    <span>
                      {isHtmlPrereq ? "Recommended before starting: HTML Fundamentals" : item}
                    </span>
                  </div>

                  {isHtmlPrereq && (
                    <Link
                      href="/courses/html-fundamentals"
                      className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline shrink-0"
                    >
                      <span>Review HTML Fundamentals</span>
                      <ArrowRight className="size-3.5" aria-hidden="true" />
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
        </section>
      )}

      {/* 2. Learning Sequence Track */}
      <section
        aria-labelledby="course-sequence-heading"
        className="flex flex-col gap-3.5 rounded-card border border-line bg-card p-6 shadow-soft"
      >
        <div className="flex items-center gap-2">
          <Compass className="size-5 text-primary" aria-hidden="true" />
          <h2
            id="course-sequence-heading"
            className="text-lg font-bold text-ink"
          >
            Web Development Learning Sequence
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          <Link
            href="/courses/html-fundamentals"
            className="flex items-center justify-between gap-2 p-3 rounded-xl border border-line bg-surface/60 hover:bg-surface transition-colors group"
          >
            <div className="flex items-center gap-2.5">
              <span className="grid size-6 place-items-center rounded-full bg-primary/10 text-primary text-xs font-bold">
                1
              </span>
              <span className="text-xs font-bold text-ink group-hover:text-primary transition-colors">
                HTML Fundamentals
              </span>
            </div>
            <ArrowRight className="size-3.5 text-muted group-hover:text-primary transition-colors" />
          </Link>

          <div className="flex items-center gap-2.5 p-3 rounded-xl border border-primary/40 bg-lavender/30">
            <span className="grid size-6 place-items-center rounded-full bg-primary text-white text-xs font-bold">
              2
            </span>
            <div className="flex flex-col">
              <span className="text-xs font-extrabold text-ink">
                CSS Fundamentals
              </span>
              <span className="text-[10px] text-primary font-semibold">
                Current Course
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between gap-2 p-3 rounded-xl border border-line/60 bg-surface/30 opacity-75">
            <div className="flex items-center gap-2.5">
              <span className="grid size-6 place-items-center rounded-full bg-surface text-muted text-xs font-bold border border-line">
                3
              </span>
              <span className="text-xs font-medium text-muted">
                JavaScript Fundamentals
              </span>
            </div>
            <Badge variant="neutral" className="text-[10px] font-medium text-muted">
              Coming later
            </Badge>
          </div>
        </div>
      </section>

      {/* 3. Skills covered */}
      {hasSkills && (
        <section
          aria-labelledby="course-skills-heading"
          className="flex flex-col gap-3 rounded-card border border-line bg-card p-6 shadow-soft"
        >
          <div className="flex items-center gap-2">
            <Sparkles className="size-5 text-primary" aria-hidden="true" />
            <h2
              id="course-skills-heading"
              className="text-lg font-bold text-ink"
            >
              Skills you&apos;ll build
            </h2>
          </div>

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

      {/* 4. Who this course is for */}
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

