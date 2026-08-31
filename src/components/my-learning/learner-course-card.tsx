"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Archive,
  ArrowRight,
  BookmarkX,
  CheckCircle2,
  Clock,
  ExternalLink,
  ListChecks,
  MoreVertical,
  Play,
  RotateCcw,
  Sparkles,
} from "lucide-react";

import { CourseCover } from "@/components/courses/course-cover";
import {
  archiveCourseAction,
  startSavedCourseAction,
  toggleSaveCourseAction,
} from "@/lib/actions/my-learning";
import { notify } from "@/lib/notifications/toast";
import { routes } from "@/lib/routes";
import type { LearnerCourseItem } from "@/lib/types";
import { cn, formatDifficulty, formatDuration } from "@/lib/utils";

interface LearnerCourseCardProps {
  course: LearnerCourseItem;
}

export function LearnerCourseCard({ course }: LearnerCourseCardProps) {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [isActionPending, setIsActionPending] = React.useState(false);

  const menuRef = React.useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen]);

  const courseHref = routes.courses.detail(course.courseSlug);

  const handleArchive = async () => {
    setIsActionPending(true);
    setIsMenuOpen(false);
    const res = await archiveCourseAction(course.id);
    if (res.success) {
      notify.success({ title: "Course archived" });
    } else {
      notify.error({ title: res.error || "Could not archive course." });
    }
    setIsActionPending(false);
  };

  const handleRemoveSaved = async () => {
    setIsActionPending(true);
    setIsMenuOpen(false);
    const res = await toggleSaveCourseAction(course.courseId);
    if (res.success) {
      notify.success({ title: "Removed from saved" });
    } else {
      notify.error({ title: res.error || "Could not remove from saved." });
    }
    setIsActionPending(false);
  };

  const router = useRouter();

  const handleStartSaved = async () => {
    setIsActionPending(true);
    const res = await startSavedCourseAction(course.courseId);
    if (res.redirectUrl) {
      router.push(res.redirectUrl);
    } else {
      notify.error({ title: res.error || "Could not start this course." });
    }
    setIsActionPending(false);
  };

  return (
    <article
      className={cn(
        "group relative flex flex-col sm:flex-row overflow-hidden rounded-[20px] border border-line bg-card shadow-soft transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lift",
        isActionPending && "opacity-60 pointer-events-none",
      )}
    >
      {/* Course Cover (Left on Desktop, Top on Mobile) */}
      <div className="relative w-full sm:w-[220px] md:w-[240px] shrink-0">
        <CourseCover
          src={course.thumbnailUrl}
          title={course.courseTitle}
          categorySlug={course.categorySlug}
          className="h-44 sm:h-full w-full rounded-none"
        />

        {/* Recently Active Tag */}
        {course.isRecentlyActive && (
          <div className="absolute top-2.5 left-2.5 z-10 flex items-center gap-1 rounded-md bg-[#6847F5] px-2 py-0.5 text-[10px] font-extrabold text-white shadow-soft">
            <Sparkles className="size-2.5" aria-hidden="true" />
            <span>Last active</span>
          </div>
        )}
      </div>

      {/* Course Content Area */}
      <div className="flex flex-1 flex-col justify-between gap-3.5 p-5 sm:p-6">
        {/* Status Badge & Actions Header */}
        <div className="flex items-center justify-between">
          {/* Status Badge */}
          {course.status === "active" && (
            <span className="inline-flex items-center gap-1.5 rounded-md bg-lavender px-2.5 py-0.5 text-[11px] font-extrabold uppercase tracking-wider text-primary border border-primary/20">
              <span className="size-1.5 rounded-full bg-primary" />
              In progress
            </span>
          )}

          {course.status === "completed" && (
            <span className="inline-flex items-center gap-1.5 rounded-md bg-mint px-2.5 py-0.5 text-[11px] font-extrabold uppercase tracking-wider text-mint-ink border border-mint-ink/20">
              <CheckCircle2 className="size-3" aria-hidden="true" />
              Completed
            </span>
          )}

          {course.status === "saved" && (
            <span className="inline-flex items-center gap-1.5 rounded-md bg-surface px-2.5 py-0.5 text-[11px] font-extrabold uppercase tracking-wider text-muted border border-line">
              Saved
            </span>
          )}

          {/* Context Options Menu */}
          <div className="relative" ref={menuRef}>
            <button
              type="button"
              onClick={() => setIsMenuOpen((prev) => !prev)}
              aria-label="Course options"
              aria-expanded={isMenuOpen}
              className="grid size-7 place-items-center rounded-lg text-muted hover:bg-surface hover:text-ink transition-colors cursor-pointer"
            >
              <MoreVertical className="size-4" aria-hidden="true" />
            </button>

            {isMenuOpen && (
              <div
                role="menu"
                className="absolute right-0 top-8 z-30 flex w-44 flex-col rounded-xl border border-line bg-card p-1.5 shadow-lift text-xs font-semibold"
              >
                <Link
                  href={courseHref}
                  role="menuitem"
                  className="flex items-center gap-2 rounded-lg px-2.5 py-2 text-ink hover:bg-surface transition-colors"
                >
                  <ExternalLink className="size-3.5 text-muted" aria-hidden="true" />
                  <span>View course details</span>
                </Link>

                {course.status === "active" && (
                  <button
                    type="button"
                    role="menuitem"
                    onClick={handleArchive}
                    className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-muted hover:bg-surface hover:text-rose-500 transition-colors cursor-pointer"
                  >
                    <Archive className="size-3.5" aria-hidden="true" />
                    <span>Archive course</span>
                  </button>
                )}

                {course.status === "saved" && (
                  <button
                    type="button"
                    role="menuitem"
                    onClick={handleRemoveSaved}
                    className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-muted hover:bg-surface hover:text-rose-500 transition-colors cursor-pointer"
                  >
                    <BookmarkX className="size-3.5" aria-hidden="true" />
                    <span>Remove from saved</span>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Title & Metadata */}
        <div className="flex flex-col gap-1.5">
          <h2 className="text-base font-bold leading-snug text-ink group-hover:text-primary transition-colors sm:text-lg">
            <Link href={courseHref} className="hover:underline">
              {course.courseTitle}
            </Link>
          </h2>

          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted">
            {course.categoryName && (
              <span className="font-semibold text-primary">
                {course.categoryName}
              </span>
            )}
            <span className="text-line">•</span>
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

        {/* Dynamic State Section */}
        {/* 1. IN PROGRESS STATE */}
        {course.status === "active" && (
          <div className="flex flex-col gap-3 pt-1">
            {/* Next Lesson Info */}
            {course.nextLessonTitle ? (
              <p className="text-xs text-muted line-clamp-1">
                Next:{" "}
                <span className="font-bold text-ink">
                  {course.nextLessonTitle}
                </span>
              </p>
            ) : (
              <p className="text-xs text-muted">Continue where you left off</p>
            )}

            {/* Real Progress Bar */}
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
                  aria-label={`${course.courseTitle} completion progress`}
                >
                  <div
                    className="h-full rounded-full bg-[#19B99A] transition-all duration-300 shadow-[0_0_6px_rgba(25,185,154,0.3)]"
                    style={{ width: `${course.progressPercent}%` }}
                  />
                </div>
              </div>
            )}

            {/* Continue Button */}
            <div className="pt-2">
              <Link
                href={courseHref}
                className={cn(
                  "inline-flex h-9.5 w-full sm:w-auto items-center justify-center gap-2 rounded-xl px-5 text-xs font-bold transition-all duration-200 cursor-pointer shadow-xs hover:-translate-y-0.5",
                  course.isRecentlyActive
                    ? "bg-primary text-white shadow-soft hover:bg-primary-hover"
                    : "bg-surface border border-line text-ink hover:border-primary/40 hover:bg-card hover:text-primary",
                )}
              >
                <span>Continue</span>
                <ArrowRight className="size-3.5" aria-hidden="true" />
              </Link>
            </div>
          </div>
        )}

        {/* 2. COMPLETED STATE */}
        {course.status === "completed" && (
          <div className="flex flex-col gap-3 pt-1">
            <p className="text-xs text-muted flex items-center gap-1.5">
              <CheckCircle2 className="size-3.5 text-mint-ink" aria-hidden="true" />
              <span>All lessons completed</span>
            </p>

            <div className="pt-2">
              <Link
                href={courseHref}
                className="inline-flex h-9.5 w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-surface border border-line px-5 text-xs font-bold text-ink shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:bg-card hover:text-primary"
              >
                <RotateCcw className="size-3.5" aria-hidden="true" />
                <span>Review course</span>
                <ArrowRight className="size-3.5" aria-hidden="true" />
              </Link>
            </div>
          </div>
        )}

        {/* 3. SAVED STATE */}
        {course.status === "saved" && (
          <div className="flex flex-col gap-3 pt-1">
            <p className="text-xs text-muted">
              Bookmarked for later. Ready when you are.
            </p>

            <div className="flex flex-wrap items-center gap-2.5 pt-2">
              <button
                type="button"
                onClick={handleStartSaved}
                className="inline-flex h-9.5 flex-1 sm:flex-initial items-center justify-center gap-2 rounded-xl bg-primary px-5 text-xs font-bold text-white shadow-soft transition-all duration-200 hover:-translate-y-0.5 hover:bg-primary-hover cursor-pointer"
              >
                <Play className="size-3.5 fill-current" aria-hidden="true" />
                <span>Start course</span>
              </button>

              <button
                type="button"
                onClick={handleRemoveSaved}
                className="inline-flex h-9.5 items-center justify-center gap-1.5 rounded-xl border border-line bg-card px-3.5 text-xs font-bold text-muted hover:text-rose-500 hover:border-rose-500/30 transition-colors cursor-pointer"
                title="Remove from saved"
              >
                <BookmarkX className="size-3.5" aria-hidden="true" />
                <span className="hidden sm:inline">Remove</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </article>
  );
}

