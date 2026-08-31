"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  BookmarkCheck,
  CheckCircle2,
  Clock,
  ListChecks,
  Loader2,
  Play,
  RotateCcw,
  Sparkles,
} from "lucide-react";

import { CourseCover } from "@/components/courses/course-cover";
import { startSavedCourseAction, toggleSaveCourseAction } from "@/lib/actions/my-learning";
import { notify } from "@/lib/notifications/toast";
import { routes } from "@/lib/routes";
import type { SavedCourseItem } from "@/lib/types";
import { cn, formatDifficulty, formatDuration } from "@/lib/utils";

interface SavedCourseCardProps {
  course: SavedCourseItem;
  onRemoveOptimistic: (courseId: string) => void;
}

export function SavedCourseCard({
  course,
  onRemoveOptimistic,
}: SavedCourseCardProps) {
  const router = useRouter();
  const [isStarting, setIsStarting] = React.useState(false);
  const [isRemoving, setIsRemoving] = React.useState(false);

  const courseHref = routes.courses.detail(course.courseSlug);
  const learnHref = `/learn/courses/${course.courseSlug}`;

  const handleRemove = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isRemoving) return;

    setIsRemoving(true);
    // Optimistically remove from grid
    onRemoveOptimistic(course.courseId);

    const res = await toggleSaveCourseAction(course.courseId);
    if (!res.success) {
      // Revert if server failed
      notify.error({ title: res.error || "Could not remove saved course." });
      router.refresh();
    } else {
      notify.success({ title: "Removed from saved" });
    }
  };

  const handleStart = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (isStarting) return;

    setIsStarting(true);
    const res = await startSavedCourseAction(course.courseId);
    if (res.success && res.redirectUrl) {
      router.push(res.redirectUrl);
    } else {
      notify.error({ title: res.error || "Could not start this course." });
      setIsStarting(false);
    }
  };

  // State-aware badge
  let statusBadge = (
    <span className="rounded-md bg-lavender px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-primary border border-primary/20">
      Saved
    </span>
  );

  if (course.enrollmentStatus === "completed") {
    statusBadge = (
      <span className="rounded-md bg-mint/40 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-[#14895A] dark:text-[#74E0B8] border border-[#19B99A]/30 flex items-center gap-1">
        <CheckCircle2 className="size-3" aria-hidden="true" />
        <span>Completed</span>
      </span>
    );
  } else if (course.enrollmentStatus === "active") {
    statusBadge = (
      <span className="rounded-md bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-amber-700 dark:text-amber-300 border border-amber-300/40 flex items-center gap-1">
        <Sparkles className="size-3" aria-hidden="true" />
        <span>In progress</span>
      </span>
    );
  }

  return (
    <article
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-[20px] border border-line bg-card shadow-soft transition-all duration-200 hover:-translate-y-1 hover:shadow-lift",
        isRemoving && "opacity-40 scale-95 pointer-events-none",
      )}
    >
      {/* Top Cover with Category, Bookmark action */}
      <div className="relative">
        <CourseCover
          src={course.thumbnailUrl}
          title={course.courseTitle}
          categorySlug={course.categorySlug}
          className="h-48 w-full"
        />

        {/* Top-Right Bookmark Button */}
        <button
          type="button"
          onClick={handleRemove}
          disabled={isRemoving}
          aria-label={`Remove ${course.courseTitle} from saved courses`}
          title="Remove from saved"
          className="absolute right-3 top-3 z-10 grid size-9.5 place-items-center rounded-full bg-card/90 dark:bg-[#151D31]/90 backdrop-blur-xs text-primary border border-line shadow-soft hover:bg-card hover:scale-110 hover:text-rose-500 transition-all cursor-pointer"
        >
          <BookmarkCheck className="size-4.5" aria-hidden="true" />
        </button>
      </div>

      {/* Card Body */}
      <div className="flex flex-1 flex-col justify-between p-5 sm:p-6 gap-4">
        <div className="flex flex-col gap-2.5">
          {/* Category & Status Pill */}
          <div className="flex items-center justify-between gap-2">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-primary truncate">
              {course.categoryName || "Course"}
            </span>
            {statusBadge}
          </div>

          {/* Title */}
          <h3 className="text-base sm:text-lg font-bold leading-snug text-ink group-hover:text-primary transition-colors">
            <Link href={courseHref} className="hover:underline">
              {course.courseTitle}
            </Link>
          </h3>

          {/* Short description */}
          {course.shortDescription && (
            <p className="line-clamp-2 text-xs sm:text-sm text-muted leading-relaxed">
              {course.shortDescription}
            </p>
          )}
        </div>

        {/* Progress or Metadata Block */}
        <div className="flex flex-col gap-3 pt-3 border-t border-line/60">
          {course.enrollmentStatus === "active" ? (
            /* Real Progress Bar for actively enrolled courses */
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between text-xs font-semibold text-muted">
                <span>
                  {course.completedLessonsCount} of {course.totalLessonsCount} lessons
                </span>
                <span className="font-bold text-ink">{course.progressPercent}%</span>
              </div>
              <div
                className="h-1.5 w-full overflow-hidden rounded-full bg-line"
                role="progressbar"
                aria-valuenow={course.progressPercent}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={`${course.courseTitle} progress`}
              >
                <div
                  className="h-full rounded-full bg-primary transition-all duration-300"
                  style={{ width: `${course.progressPercent}%` }}
                />
              </div>
            </div>
          ) : (
            /* Metadata (Lessons & Duration) for not started or completed courses */
            <div className="flex flex-wrap items-center justify-between text-xs font-medium text-muted">
              <div className="flex items-center gap-3">
                {course.lessonCount > 0 && (
                  <span className="flex items-center gap-1">
                    <ListChecks className="size-3.5 text-primary" aria-hidden="true" />
                    <span>{course.lessonCount} lessons</span>
                  </span>
                )}
                {course.estimatedMinutes > 0 && (
                  <span className="flex items-center gap-1">
                    <Clock className="size-3.5 text-primary" aria-hidden="true" />
                    <span>{formatDuration(course.estimatedMinutes)}</span>
                  </span>
                )}
              </div>
              <span className="rounded-md bg-surface px-2 py-0.5 text-[11px] font-semibold text-muted border border-line">
                {formatDifficulty(course.difficulty)}
              </span>
            </div>
          )}

          {/* Action Row */}
          <div className="flex items-center gap-2 pt-1">
            {/* Primary Action Button */}
            {course.enrollmentStatus === "not_started" ? (
              <button
                type="button"
                onClick={handleStart}
                disabled={isStarting}
                className="flex-1 inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-primary px-4 text-xs font-bold text-white shadow-soft transition-all duration-200 hover:bg-primary-hover hover:-translate-y-0.5 disabled:opacity-50 cursor-pointer"
              >
                {isStarting ? (
                  <>
                    <Loader2 className="size-3.5 animate-spin" aria-hidden="true" />
                    <span>Starting…</span>
                  </>
                ) : (
                  <>
                    <Play className="size-3.5 fill-white" aria-hidden="true" />
                    <span>Start course</span>
                  </>
                )}
              </button>
            ) : course.enrollmentStatus === "active" ? (
              <Link
                href={learnHref}
                className="flex-1 inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-primary px-4 text-xs font-bold text-white shadow-soft transition-all duration-200 hover:bg-primary-hover hover:-translate-y-0.5"
              >
                <span>Continue</span>
                <ArrowRight className="size-3.5" aria-hidden="true" />
              </Link>
            ) : (
              <Link
                href={learnHref}
                className="flex-1 inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-primary px-4 text-xs font-bold text-white shadow-soft transition-all duration-200 hover:bg-primary-hover hover:-translate-y-0.5"
              >
                <RotateCcw className="size-3.5" aria-hidden="true" />
                <span>Review course</span>
              </Link>
            )}

            {/* Secondary View Details */}
            <Link
              href={courseHref}
              className="inline-flex h-10 items-center justify-center rounded-xl border border-line bg-surface px-3 text-xs font-bold text-muted hover:text-ink hover:border-primary/40 transition-all shadow-2xs"
            >
              Details
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}

