import * as React from "react";
import Link from "next/link";
import { ArrowRight, Check, Compass, Info, Sparkles, Target } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface CourseMetaSectionsProps {
  courseSlug?: string;
  prerequisites?: string[];
  skills?: string[];
  targetAudience?: string[];
  className?: string;
}

export function CourseMetaSections({
  courseSlug = "css-fundamentals",
  prerequisites,
  skills,
  targetAudience,
  className,
}: CourseMetaSectionsProps) {
  const isHtml = courseSlug.toLowerCase().includes("html");
  const isCss = courseSlug.toLowerCase().includes("css");

  const hasPrereqs = prerequisites && prerequisites.length > 0;
  const hasSkills = skills && skills.length > 0;
  const hasAudience = targetAudience && targetAudience.length > 0;

  return (
    <div className={cn("flex flex-col gap-8", className)}>
      {/* 1. Prerequisites (Shown if available or for CSS) */}
      {(hasPrereqs || isCss) && (
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
            {isCss && (
              <li className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-primary/20 bg-lavender/30 p-3.5">
                <div className="flex items-start gap-2.5">
                  <span className="grid size-5 shrink-0 place-items-center rounded-full bg-primary text-white mt-0.5 shadow-xs">
                    <Check className="size-3.5" aria-hidden="true" />
                  </span>
                  <div className="flex flex-col">
                    <span className="font-bold text-ink">
                      Recommended before starting: HTML Fundamentals
                    </span>
                    <span className="text-xs text-muted">
                      A basic foundation in HTML elements, tags, and structure makes learning CSS faster and easier.
                    </span>
                  </div>
                </div>

                <Link
                  href="/courses/html-fundamentals"
                  className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-primary px-3.5 py-1.5 text-xs font-bold text-white shadow-soft transition-all duration-150 hover:bg-primary-600 shrink-0"
                >
                  <span>Review HTML Fundamentals</span>
                  <ArrowRight className="size-3.5" aria-hidden="true" />
                </Link>
              </li>
            )}

            {prerequisites &&
              prerequisites
                .filter((p) => !p.toLowerCase().includes("html fundamentals"))
                .map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 px-1">
                    <span className="grid size-4.5 shrink-0 place-items-center rounded-full bg-lavender text-primary mt-0.5">
                      <Check className="size-3" aria-hidden="true" />
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
          </ul>
        </section>
      )}

      {/* 2. Web Development Learning Sequence Track */}
      <section
        aria-labelledby="course-sequence-heading"
        className="flex flex-col gap-4 rounded-card border border-line bg-card p-6 shadow-soft"
      >
        <div className="flex items-center gap-2">
          <Compass className="size-5 text-primary" aria-hidden="true" />
          <h2
            id="course-sequence-heading"
            className="text-lg font-bold text-ink"
          >
            Learning sequence
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          {/* Step 1: HTML Fundamentals */}
          {isHtml ? (
            <div className="flex items-center gap-2.5 p-3.5 rounded-xl border border-primary/40 bg-lavender/30">
              <span className="grid size-6 place-items-center rounded-full bg-primary text-white text-xs font-bold shadow-xs">
                1
              </span>
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-extrabold text-ink truncate">
                  HTML Fundamentals
                </span>
                <span className="text-[10px] text-primary font-bold">
                  Current Course
                </span>
              </div>
            </div>
          ) : (
            <Link
              href="/courses/html-fundamentals"
              className="flex items-center justify-between gap-2 p-3.5 rounded-xl border border-line bg-surface/60 hover:bg-surface transition-all duration-150 group hover:border-primary/30"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="grid size-6 place-items-center rounded-full bg-primary/10 text-primary text-xs font-bold">
                  1
                </span>
                <div className="flex flex-col min-w-0">
                  <span className="text-xs font-bold text-ink group-hover:text-primary transition-colors truncate">
                    HTML Fundamentals
                  </span>
                  <span className="text-[10px] text-muted font-medium">
                    Prerequisite
                  </span>
                </div>
              </div>
              <ArrowRight className="size-3.5 text-muted group-hover:text-primary transition-colors shrink-0" />
            </Link>
          )}

          {/* Step 2: CSS Fundamentals */}
          {isCss ? (
            <div className="flex items-center gap-2.5 p-3.5 rounded-xl border border-primary/40 bg-lavender/30">
              <span className="grid size-6 place-items-center rounded-full bg-primary text-white text-xs font-bold shadow-xs">
                2
              </span>
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-extrabold text-ink truncate">
                  CSS Fundamentals
                </span>
                <span className="text-[10px] text-primary font-bold">
                  Current Course
                </span>
              </div>
            </div>
          ) : (
            <Link
              href="/courses/css-fundamentals"
              className="flex items-center justify-between gap-2 p-3.5 rounded-xl border border-line bg-surface/60 hover:bg-surface transition-all duration-150 group hover:border-primary/30"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="grid size-6 place-items-center rounded-full bg-primary/10 text-primary text-xs font-bold">
                  2
                </span>
                <div className="flex flex-col min-w-0">
                  <span className="text-xs font-bold text-ink group-hover:text-primary transition-colors truncate">
                    CSS Fundamentals
                  </span>
                  <span className="text-[10px] text-primary font-semibold">
                    Next Course
                  </span>
                </div>
              </div>
              <ArrowRight className="size-3.5 text-muted group-hover:text-primary transition-colors shrink-0" />
            </Link>
          )}

          {/* Step 3: JavaScript Fundamentals */}
          <div className="flex items-center justify-between gap-2 p-3.5 rounded-xl border border-line/60 bg-surface/30 opacity-80">
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="grid size-6 place-items-center rounded-full bg-surface text-muted text-xs font-bold border border-line">
                3
              </span>
              <span className="text-xs font-medium text-muted truncate">
                JavaScript Fundamentals
              </span>
            </div>
            <Badge variant="neutral" className="text-[10px] font-medium text-muted shrink-0">
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

