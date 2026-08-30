import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";

import { CourseCover } from "@/components/courses/course-cover";
import { routes } from "@/lib/routes";
import type { ActiveEnrollmentDetail } from "@/lib/types";
import { formatDifficulty } from "@/lib/utils";

interface ActiveCourseCardProps {
  enrollment: ActiveEnrollmentDetail;
}

export function ActiveCourseCard({ enrollment }: ActiveCourseCardProps) {
  const href = routes.courses.detail(enrollment.courseSlug);

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-card border border-line bg-card shadow-soft transition-all duration-200 hover:-translate-y-1 hover:shadow-lift">
      {/* Course Cover */}
      <CourseCover
        src={enrollment.thumbnailUrl}
        title={enrollment.courseTitle}
        categorySlug={enrollment.categorySlug}
      />

      {/* Card Body */}
      <div className="flex flex-1 flex-col gap-3 p-5 sm:p-6">
        {/* Category & Level */}
        <div className="flex items-center justify-between text-xs">
          {enrollment.categoryName ? (
            <span className="font-bold uppercase tracking-wider text-primary">
              {enrollment.categoryName}
            </span>
          ) : (
            <span className="text-muted">General</span>
          )}
          <span className="rounded-md bg-surface px-2 py-0.5 font-medium text-muted border border-line">
            {formatDifficulty(enrollment.difficulty)}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-base font-bold leading-snug text-ink group-hover:text-primary transition-colors">
          <Link href={href} className="after:absolute after:inset-0 after:content-['']">
            {enrollment.courseTitle}
          </Link>
        </h3>

        {/* Next Lesson Preview */}
        {enrollment.nextLessonTitle && (
          <p className="text-xs text-muted line-clamp-1">
            Next: <span className="font-semibold text-ink">{enrollment.nextLessonTitle}</span>
          </p>
        )}

        {/* Real Progress (only when total lessons > 0) */}
        {enrollment.totalLessons > 0 && (
          <div className="mt-auto flex flex-col gap-1.5 pt-2">
            <div className="flex items-center justify-between text-xs font-semibold text-muted">
              <span>
                {enrollment.completedLessons} of {enrollment.totalLessons} lessons
              </span>
              <span>{enrollment.progressPercent}%</span>
            </div>
            <div
              className="h-1.5 w-full overflow-hidden rounded-full bg-line"
              role="progressbar"
              aria-valuenow={enrollment.progressPercent}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={`${enrollment.courseTitle} progress`}
            >
              <div
                className="h-full rounded-full bg-primary transition-all duration-300"
                style={{ width: `${enrollment.progressPercent}%` }}
              />
            </div>
          </div>
        )}

        {/* Action Button */}
        <div className="relative z-10 mt-2">
          <Link
            href={href}
            className="flex h-9 w-full items-center justify-center gap-2 rounded-xl bg-surface border border-line text-xs font-bold text-ink shadow-xs transition-all duration-200 group-hover:bg-primary group-hover:text-white group-hover:border-primary"
          >
            <BookOpen className="size-3.5" aria-hidden="true" />
            <span>Continue</span>
            <ArrowRight className="size-3.5" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </article>
  );
}

