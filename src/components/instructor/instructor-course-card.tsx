import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ExternalLink,
  FileQuestion,
  Layers,
} from "lucide-react";

import { CourseCover } from "@/components/courses/course-cover";
import type { InstructorCourseSummary } from "@/lib/types/instructor";
import { formatDifficulty } from "@/lib/utils";

interface InstructorCourseCardProps {
  course: InstructorCourseSummary;
}

export function InstructorCourseCard({ course }: InstructorCourseCardProps) {
  const editHref = `/instructor/courses/${course.id}`;
  const previewHref = `/courses/${course.slug}`;

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-card border border-line bg-card shadow-soft transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lift">
      {/* Cover Image */}
      <div className="relative h-32 sm:h-36 w-full overflow-hidden bg-surface">
        <CourseCover
          src={course.coverImageUrl}
          title={course.title}
        />
        {/* Publication Status Badge Overlay */}
        <div className="absolute top-3 right-3 z-10">
          {course.isPublished ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/90 px-2.5 py-0.5 text-[10px] font-bold text-white shadow-sm backdrop-blur-xs">
              <span className="size-1.5 rounded-full bg-white animate-pulse" />
              Published
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/90 px-2.5 py-0.5 text-[10px] font-bold text-white shadow-sm backdrop-blur-xs">
              Draft
            </span>
          )}
        </div>
      </div>

      {/* Card Content */}
      <div className="flex flex-1 flex-col justify-between gap-4 p-5">
        <div className="flex flex-col gap-2.5">
          {/* Category & Difficulty */}
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold uppercase tracking-wider text-cyan-400 text-[11px]">
              {course.categoryName || "General"}
            </span>
            <span className="rounded-md bg-surface px-2 py-0.5 text-[10px] font-semibold text-muted border border-line">
              {formatDifficulty(course.difficulty)}
            </span>
          </div>

          {/* Title */}
          <h3 className="text-base font-bold leading-snug text-ink group-hover:text-primary transition-colors line-clamp-1">
            <Link href={editHref} className="after:absolute after:inset-0 after:content-['']">
              {course.title}
            </Link>
          </h3>

          {/* Stats Badges */}
          <div className="grid grid-cols-2 gap-2 pt-1 text-xs text-muted">
            <div className="flex items-center gap-1.5">
              <Layers className="size-3.5 text-primary shrink-0" aria-hidden="true" />
              <span>{course.moduleCount} modules · {course.totalLessons} lessons</span>
            </div>
            <div className="flex items-center gap-1.5">
              <FileQuestion className="size-3.5 text-cyan-400 shrink-0" aria-hidden="true" />
              <span>{course.quizCount} checks</span>
            </div>
          </div>

          {/* Quality Summary */}
          <div className="flex items-center justify-between pt-1 border-t border-line/60 text-xs">
            <span className="text-muted">Content Quality:</span>
            {course.qualityWarningCount > 0 ? (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-500">
                <AlertTriangle className="size-3" aria-hidden="true" />
                <span>{course.qualityWarningCount} {course.qualityWarningCount === 1 ? "warning" : "warnings"}</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-500">
                <CheckCircle2 className="size-3" aria-hidden="true" />
                <span>Good health</span>
              </span>
            )}
          </div>
        </div>

        {/* Card Actions */}
        <div className="relative z-10 flex items-center gap-2 pt-2 border-t border-line/60">
          <Link
            href={editHref}
            className="flex-1 flex h-9 items-center justify-center gap-1.5 rounded-xl bg-primary px-3 text-xs font-bold text-white shadow-xs transition-all hover:bg-primary-hover cursor-pointer"
          >
            <BookOpen className="size-3.5" aria-hidden="true" />
            <span>Edit course</span>
            <ArrowRight className="size-3.5" aria-hidden="true" />
          </Link>

          <Link
            href={previewHref}
            target="_blank"
            rel="noopener noreferrer"
            title="Preview public course page"
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-line bg-surface text-muted hover:border-primary/40 hover:text-primary transition-colors cursor-pointer"
          >
            <ExternalLink className="size-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </article>
  );
}

