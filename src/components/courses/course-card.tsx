import Link from "next/link";
import { ArrowRight, Clock, ListChecks } from "lucide-react";

import { CourseCover } from "@/components/courses/course-cover";
import { Button } from "@/components/ui/button";
import { routes } from "@/lib/routes";
import type { CourseSummary } from "@/lib/types";
import { cn, formatDifficulty, formatDuration } from "@/lib/utils";

interface CourseCardProps {
  course: CourseSummary;
  priority?: boolean;
  className?: string;
}

/**
 * Course Card for the Catalog Grid.
 * Displays only real database values from Supabase — no fake ratings, student counts or discount badges.
 */
export function CourseCard({
  course,
  priority = false,
  className,
}: CourseCardProps) {
  const href = routes.courses.detail(course.slug);

  return (
    <article
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-card border border-line bg-card shadow-soft transition-all duration-200 hover:-translate-y-1 hover:shadow-lift",
        className,
      )}
    >
      {/* Course Cover with fallback */}
      <CourseCover
        src={course.thumbnailUrl}
        title={course.title}
        categorySlug={course.categorySlug}
        priority={priority}
      />

      {/* Card Body */}
      <div className="flex flex-1 flex-col gap-3 p-5 sm:p-6">
        {/* Category & Difficulty */}
        <div className="flex items-center justify-between text-xs">
          {course.categoryName ? (
            <span className="font-bold uppercase tracking-wider text-primary">
              {course.categoryName}
            </span>
          ) : (
            <span className="text-muted">General</span>
          )}
          <span className="rounded-md bg-surface px-2 py-0.5 font-medium text-muted border border-line">
            {formatDifficulty(course.difficulty)}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold leading-snug text-ink group-hover:text-primary transition-colors">
          <Link
            href={href}
            className="after:absolute after:inset-0 after:content-['']"
          >
            {course.title}
          </Link>
        </h3>

        {/* Short Description */}
        {course.shortDescription ? (
          <p className="line-clamp-2 text-sm text-muted">
            {course.shortDescription}
          </p>
        ) : null}

        {/* Real Metadata: Lessons & Duration (only when available) */}
        <div className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-1.5 pt-3 text-xs font-medium text-muted border-t border-line/60">
          {course.lessonCount > 0 && (
            <span className="flex items-center gap-1.5">
              <ListChecks className="size-3.5 text-primary" aria-hidden="true" />
              {course.lessonCount} {course.lessonCount === 1 ? "lesson" : "lessons"}
            </span>
          )}
          {course.estimatedMinutes > 0 && (
            <span className="flex items-center gap-1.5">
              <Clock className="size-3.5 text-primary" aria-hidden="true" />
              {formatDuration(course.estimatedMinutes)}
            </span>
          )}
        </div>

        {/* Action Button */}
        <Button
          asChild
          variant="secondary"
          size="sm"
          className="relative z-10 mt-3 w-full"
          aria-label={`View course: ${course.title}`}
        >
          <Link href={href}>
            <span>View course</span>
            <ArrowRight
              className="size-4 transition-transform group-hover:translate-x-1"
              aria-hidden="true"
            />
          </Link>
        </Button>
      </div>
    </article>
  );
}

