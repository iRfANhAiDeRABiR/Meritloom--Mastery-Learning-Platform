"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Bookmark,
  BookmarkCheck,
  CheckCircle2,
  Clock,
  ListChecks,
  Play,
  RotateCcw,
} from "lucide-react";

import { CourseCover } from "@/components/courses/course-cover";
import { enrollInCourseAction } from "@/lib/actions/course-overview";
import { toggleSaveCourseAction } from "@/lib/actions/my-learning";
import { notify } from "@/lib/notifications/toast";
import type { ExploreCourseItem } from "@/lib/types";
import { cn, formatDifficulty, formatDuration } from "@/lib/utils";

interface ExploreCourseCardProps {
  course: ExploreCourseItem;
}

export function ExploreCourseCard({ course }: ExploreCourseCardProps) {
  const router = useRouter();
  const [isSaved, setIsSaved] = React.useState(course.isSaved);
  const [prevCourseSaved, setPrevCourseSaved] = React.useState(course.isSaved);
  const [isSaving, setIsSaving] = React.useState(false);
  const [isEnrolling, setIsEnrolling] = React.useState(false);

  // Synchronize prop changes via state derivation
  if (prevCourseSaved !== course.isSaved) {
    setPrevCourseSaved(course.isSaved);
    setIsSaved(course.isSaved);
  }

  const courseHref = `/learn/courses/${course.slug}`;

  const handleToggleSave = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isSaving) return;
    const nextSaved = !isSaved;
    setIsSaved(nextSaved);
    setIsSaving(true);

    try {
      const res = await toggleSaveCourseAction(course.id);
      if (res.success) {
        notify.success({
          title: nextSaved ? "Course saved" : "Course removed from saved",
          description: nextSaved
            ? "Added to your saved collection."
            : "Removed from your saved collection.",
        });
      } else {
        // Revert optimistic update
        setIsSaved(!nextSaved);
        notify.error({ title: res.error || "Could not update saved status." });
      }
    } catch {
      setIsSaved(!nextSaved);
      notify.error({ title: "Could not update saved status." });
    } finally {
      setIsSaving(false);
    }
  };

  const handleStartCourse = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isEnrolling) return;
    setIsEnrolling(true);

    try {
      const res = await enrollInCourseAction(course.slug);
      if (res.success && res.redirectUrl) {
        notify.success({
          title: "Course added to My Learning",
          description: "Starting your learning journey.",
        });
        router.push(res.redirectUrl);
      } else {
        notify.error({ title: res.error || "Could not start this course." });
        setIsEnrolling(false);
      }
    } catch {
      notify.error({ title: "Could not start this course." });
      setIsEnrolling(false);
    }
  };

  return (
    <article
      className={cn(
        "group relative flex flex-col sm:flex-row overflow-hidden rounded-[20px] border border-line bg-card shadow-soft transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lift",
        (isSaving || isEnrolling) && "opacity-85",
      )}
    >
      {/* Course Cover (Left on Desktop, Top on Mobile) */}
      <div className="relative w-full sm:w-[220px] md:w-[240px] shrink-0">
        <Link href={courseHref} tabIndex={-1} aria-hidden="true">
          <CourseCover
            src={course.thumbnailUrl}
            title={course.title}
            categorySlug={course.categorySlug}
            className="h-44 sm:h-full w-full rounded-none"
          />
        </Link>

        {/* Save Bookmark Button */}
        <button
          type="button"
          onClick={handleToggleSave}
          disabled={isSaving}
          title={isSaved ? "Remove from saved" : "Save course"}
          aria-label={isSaved ? "Remove from saved" : "Save course"}
          className={cn(
            "absolute top-2.5 right-2.5 z-10 grid size-8 place-items-center rounded-lg backdrop-blur-md transition-all cursor-pointer shadow-xs",
            isSaved
              ? "bg-primary text-white shadow-soft"
              : "bg-black/50 text-white/80 hover:bg-black/70 hover:text-white",
          )}
        >
          {isSaved ? (
            <BookmarkCheck className="size-4" aria-hidden="true" />
          ) : (
            <Bookmark className="size-4" aria-hidden="true" />
          )}
        </button>
      </div>

      {/* Course Content Area */}
      <div className="flex flex-1 flex-col justify-between gap-3.5 p-5 sm:p-6">
        {/* Status Badge & Category Header */}
        <div className="flex items-center justify-between gap-2">
          {/* Status Badge */}
          {course.enrollmentStatus === "in_progress" && (
            <span className="inline-flex items-center gap-1.5 rounded-md bg-lavender px-2.5 py-0.5 text-[11px] font-extrabold uppercase tracking-wider text-primary border border-primary/20">
              <span className="size-1.5 rounded-full bg-primary animate-pulse" />
              In progress
            </span>
          )}

          {course.enrollmentStatus === "completed" && (
            <span className="inline-flex items-center gap-1.5 rounded-md bg-mint px-2.5 py-0.5 text-[11px] font-extrabold uppercase tracking-wider text-mint-ink border border-mint-ink/20">
              <CheckCircle2 className="size-3" aria-hidden="true" />
              Completed
            </span>
          )}

          {course.enrollmentStatus === "not_started" && (
            <span className="inline-flex items-center gap-1.5 rounded-md bg-surface px-2.5 py-0.5 text-[11px] font-extrabold uppercase tracking-wider text-muted border border-line">
              Free course
            </span>
          )}

          {/* Category Chip */}
          {course.categoryName && (
            <span className="text-[11px] font-bold text-primary truncate">
              {course.categoryName}
            </span>
          )}
        </div>

        {/* Title & Metadata */}
        <div className="flex flex-col gap-1.5">
          <h2 className="text-base font-bold leading-snug text-ink group-hover:text-primary transition-colors sm:text-lg">
            <Link href={courseHref} className="hover:underline">
              {course.title}
            </Link>
          </h2>

          <p className="text-xs text-muted leading-relaxed line-clamp-2">
            {course.summary}
          </p>

          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 pt-1 text-xs text-muted">
            <span>{formatDifficulty(course.difficulty)}</span>
            {course.totalLessons > 0 && (
              <>
                <span className="text-line">•</span>
                <span className="flex items-center gap-1">
                  <ListChecks className="size-3" aria-hidden="true" />
                  {course.totalLessons} {course.totalLessons === 1 ? "lesson" : "lessons"}
                </span>
              </>
            )}
            {course.estimatedMinutes > 0 && (
              <>
                <span className="text-line">•</span>
                <span className="flex items-center gap-1">
                  <Clock className="size-3" aria-hidden="true" />
                  {formatDuration(course.estimatedMinutes)}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Dynamic Action Section based on Learner State */}
        {/* 1. IN PROGRESS STATE */}
        {course.enrollmentStatus === "in_progress" && (
          <div className="flex flex-col gap-3 pt-1 border-t border-line/60">
            {/* Progress Bar */}
            {course.totalLessons > 0 && (
              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between text-[11px] font-semibold text-muted">
                  <span>
                    {course.completedLessons} of {course.totalLessons} lessons completed
                  </span>
                  <span>{course.progressPercent}%</span>
                </div>
                <div
                  className="h-2 w-full overflow-hidden rounded-full bg-line"
                  role="progressbar"
                  aria-valuenow={course.progressPercent}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label={`${course.title} completion progress`}
                >
                  <div
                    className="h-full rounded-full bg-[#19B99A] transition-all duration-300 shadow-[0_0_6px_rgba(25,185,154,0.3)]"
                    style={{ width: `${course.progressPercent}%` }}
                  />
                </div>
              </div>
            )}

            {/* Continue Button */}
            <div className="pt-1">
              <Link
                href={courseHref}
                className="inline-flex h-9.5 w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-primary px-5 text-xs font-bold text-white shadow-soft transition-all duration-200 hover:-translate-y-0.5 hover:bg-primary-hover"
              >
                <span>Continue</span>
                <ArrowRight className="size-3.5" aria-hidden="true" />
              </Link>
            </div>
          </div>
        )}

        {/* 2. COMPLETED STATE */}
        {course.enrollmentStatus === "completed" && (
          <div className="flex flex-col gap-2.5 pt-1 border-t border-line/60">
            <p className="text-xs text-muted flex items-center gap-1.5">
              <CheckCircle2 className="size-3.5 text-mint-ink" aria-hidden="true" />
              <span>All required lessons completed</span>
            </p>

            <div className="flex flex-wrap items-center gap-2 pt-1">
              <Link
                href={courseHref}
                className="inline-flex h-9.5 items-center justify-center gap-2 rounded-xl bg-surface border border-line px-4 text-xs font-bold text-ink shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:bg-card hover:text-primary"
              >
                <RotateCcw className="size-3.5" aria-hidden="true" />
                <span>Review course</span>
              </Link>
              <Link
                href={`/learn/courses/${course.slug}/complete`}
                className="inline-flex h-9.5 items-center justify-center gap-1.5 rounded-xl border border-primary/30 bg-primary/10 px-3.5 text-xs font-bold text-primary shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:bg-primary/20"
              >
                <span>Summary</span>
                <ArrowRight className="size-3.5" aria-hidden="true" />
              </Link>
            </div>
          </div>
        )}

        {/* 3. NOT STARTED STATE */}
        {course.enrollmentStatus === "not_started" && (
          <div className="flex flex-wrap items-center gap-2.5 pt-2 border-t border-line/60">
            <Link
              href={courseHref}
              className="inline-flex h-9.5 flex-1 sm:flex-initial items-center justify-center gap-2 rounded-xl bg-surface border border-line px-5 text-xs font-bold text-ink shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:bg-card hover:text-primary"
            >
              <span>View course</span>
              <ArrowRight className="size-3.5" aria-hidden="true" />
            </Link>

            <button
              type="button"
              disabled={isEnrolling}
              onClick={handleStartCourse}
              className="inline-flex h-9.5 items-center justify-center gap-2 rounded-xl bg-primary px-4 text-xs font-bold text-white shadow-soft transition-all duration-200 hover:-translate-y-0.5 hover:bg-primary-hover disabled:opacity-60 cursor-pointer"
            >
              <Play className="size-3.5 fill-current" aria-hidden="true" />
              <span>{isEnrolling ? "Starting..." : "Start course"}</span>
            </button>
          </div>
        )}
      </div>
    </article>
  );
}
