import Link from "next/link";
import { ArrowRight, ChevronRight, ExternalLink, Sparkles } from "lucide-react";

import { routes } from "@/lib/routes";
import type { CourseLearningOverviewData } from "@/lib/types";
import { formatDifficulty } from "@/lib/utils";

interface CourseLearningHeaderProps {
  data: CourseLearningOverviewData;
}

export function CourseLearningHeader({ data }: CourseLearningHeaderProps) {
  const { course, completedLessons, totalLessons, progressPercent, nextLesson, isCourseCompleted } =
    data;

  const nextLessonHref = nextLesson
    ? `/learn/courses/${course.slug}/lessons/${nextLesson.lesson.slug}`
    : `/learn/courses/${course.slug}`;

  return (
    <div className="flex flex-col gap-5 border-b border-line pb-6">
      {/* Breadcrumbs */}
      <nav aria-label="Breadcrumbs" className="flex items-center gap-1.5 text-xs text-muted">
        <Link
          href={routes.learnCourses}
          className="hover:text-ink transition-colors font-medium"
        >
          My Learning
        </Link>
        <ChevronRight className="size-3 text-muted/60" aria-hidden="true" />
        <span className="font-semibold text-ink truncate max-w-[280px] sm:max-w-md" aria-current="page">
          {course.title}
        </span>
      </nav>

      {/* Main Header Row */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-col gap-2 max-w-3xl">
          {/* Metadata Badges */}
          <div className="flex flex-wrap items-center gap-2">
            {course.category && (
              <span className="rounded-md bg-lavender px-2.5 py-0.5 text-xs font-bold text-primary border border-primary/20">
                {course.category.name}
              </span>
            )}
            <span className="rounded-md bg-surface px-2.5 py-0.5 text-xs font-semibold text-muted border border-line">
              {formatDifficulty(course.difficulty)}
            </span>
            {course.isFree && (
              <span className="rounded-md bg-mint px-2 py-0.5 text-[11px] font-extrabold uppercase tracking-wider text-mint-ink border border-mint-ink/20">
                Free
              </span>
            )}
          </div>

          {/* Course Title */}
          <h1 className="text-2xl font-bold tracking-tight text-ink sm:text-3xl lg:text-[32px] leading-tight">
            {course.title}
          </h1>

          <p className="text-xs sm:text-sm text-muted">
            Continue from where you left off or open any lesson you would like to explore.
          </p>
        </div>

        {/* Header Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <Link
            href={routes.courses.detail(course.slug)}
            className="inline-flex items-center gap-1.5 rounded-xl border border-line bg-card px-4 py-2.5 text-xs font-bold text-muted hover:bg-surface hover:text-ink transition-colors shadow-xs"
          >
            <ExternalLink className="size-3.5" aria-hidden="true" />
            <span>Course details</span>
          </Link>

          {!isCourseCompleted && nextLesson && (
            <Link
              href={nextLessonHref}
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-xs font-bold text-white shadow-soft transition-all duration-200 hover:-translate-y-0.5 hover:bg-primary-hover"
            >
              <Sparkles className="size-3.5 fill-current" aria-hidden="true" />
              <span>Continue learning</span>
              <ArrowRight className="size-3.5" aria-hidden="true" />
            </Link>
          )}
        </div>
      </div>

      {/* Real Course Progress Bar */}
      {totalLessons > 0 && (
        <div className="flex flex-col gap-1.5 pt-1">
          <div className="flex items-center justify-between text-xs font-semibold text-muted">
            <span>
              {completedLessons} of {totalLessons} lessons completed
            </span>
            <span className="font-bold text-ink">{progressPercent}% complete</span>
          </div>
          <div
            className="h-2 w-full overflow-hidden rounded-full bg-line"
            role="progressbar"
            aria-valuenow={progressPercent}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`${course.title} overall progress`}
          >
            <div
              className="h-full rounded-full bg-[#19B99A] transition-all duration-300 shadow-[0_0_6px_rgba(25,185,154,0.3)]"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

