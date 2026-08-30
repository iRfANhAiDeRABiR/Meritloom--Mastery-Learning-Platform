import Link from "next/link";
import { ArrowRight, Clock, ListChecks } from "lucide-react";

import { Thumbnail } from "@/components/landing/thumbnail";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { routes } from "@/lib/routes";
import type { CourseSummary } from "@/lib/types";
import { cn, formatDifficulty, formatDuration } from "@/lib/utils";

/**
 * A single free-course card.
 * Renders only verified database values from Supabase — no fake stats, ratings, or student counts.
 */
export function CourseCard({
  course,
  priority = false,
  className,
}: {
  course: CourseSummary;
  priority?: boolean;
  className?: string;
}) {
  const href = routes.courses.detail(course.slug);

  return (
    <article
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-card border border-line bg-card shadow-soft transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lift",
        className,
      )}
    >
      {/* Course Thumbnail */}
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-lavender">
        <Thumbnail
          src={course.thumbnailUrl}
          alt={`${course.title} course thumbnail`}
          priority={priority}
        />
        <div className="absolute left-3 top-3">
          <Badge variant="mint">
            <ListChecks className="size-3" aria-hidden="true" />
            Free
          </Badge>
        </div>
      </div>

      {/* Card Content */}
      <div className="flex flex-1 flex-col gap-3 p-5 sm:p-6">
        <div className="flex items-center gap-2 text-xs">
          {course.categoryName ? (
            <span className="font-semibold uppercase tracking-wide text-primary">
              {course.categoryName}
            </span>
          ) : null}
          <span className="text-muted">{formatDifficulty(course.difficulty)}</span>
        </div>

        <h3 className="text-lg font-bold leading-snug text-ink">
          <Link
            href={href}
            className="after:absolute after:inset-0 after:content-[''] hover:text-primary transition-colors"
          >
            {course.title}
          </Link>
        </h3>

        {course.shortDescription ? (
          <p className="line-clamp-2 text-sm text-muted">
            {course.shortDescription}
          </p>
        ) : null}

        {/* Real metadata only: lessons & estimated duration if > 0 */}
        <ul className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-1 pt-2 text-xs text-muted">
          {course.lessonCount > 0 ? (
            <li className="flex items-center gap-1.5">
              <ListChecks className="size-3.5" aria-hidden="true" />
              {course.lessonCount} {course.lessonCount === 1 ? "lesson" : "lessons"}
            </li>
          ) : null}
          {course.estimatedMinutes > 0 ? (
            <li className="flex items-center gap-1.5">
              <Clock className="size-3.5" aria-hidden="true" />
              {formatDuration(course.estimatedMinutes)}
            </li>
          ) : null}
        </ul>

        {/* Action button */}
        <Button
          asChild
          variant="secondary"
          size="sm"
          className="relative z-10 mt-3 w-full"
          aria-label={`View ${course.title}`}
        >
          <Link href={href}>
            View Course
            <ArrowRight
              className="size-4 transition-transform group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </Link>
        </Button>
      </div>
    </article>
  );
}
