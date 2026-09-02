"use client";

import * as React from "react";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  Compass,
  Play,
  RotateCcw,
  Sparkles,
} from "lucide-react";

import { enrollInCourseAction } from "@/lib/actions/course-overview";
import { routes } from "@/lib/routes";
import type { CourseLearningOverviewData } from "@/lib/types";

interface ContinueLearningCardProps {
  data: CourseLearningOverviewData;
}

export function ContinueLearningCard({ data }: ContinueLearningCardProps) {
  const {
    course,
    isEnrolled,
    isCourseCompleted,
    nextLesson,
    completedLessons,
  } = data;

  const [isPending, setIsPending] = React.useState(false);

  const handleEnroll = async () => {
    setIsPending(true);
    await enrollInCourseAction(course.slug);
    setIsPending(false);
  };

  // 1. Not Enrolled State
  if (!isEnrolled) {
    return (
      <div className="flex flex-col gap-4 rounded-[20px] border border-primary/30 bg-gradient-to-br from-card to-lavender/30 p-5 sm:p-6 shadow-soft">
        <div className="flex items-center gap-2">
          <span className="grid size-8 place-items-center rounded-xl bg-primary text-white shadow-soft">
            <Play className="size-4 fill-current ml-0.5" aria-hidden="true" />
          </span>
          <h2 className="text-base font-bold text-ink">Start this course</h2>
        </div>

        <p className="text-xs text-muted leading-relaxed">
          This course is completely free. Enroll with one click to begin and track your progress.
        </p>

        <button
          type="button"
          disabled={isPending}
          onClick={handleEnroll}
          className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 text-xs font-bold text-white shadow-soft transition-all duration-200 hover:-translate-y-0.5 hover:bg-primary-hover disabled:opacity-60 cursor-pointer"
        >
          <span>{isPending ? "Starting..." : "Start learning"}</span>
          <ArrowRight className="size-4" aria-hidden="true" />
        </button>
      </div>
    );
  }

  // 2. Course Completed Celebration State
  if (isCourseCompleted) {
    const firstLessonSlug =
      data.modules.length > 0 && data.modules[0].lessons.length > 0
        ? data.modules[0].lessons[0].slug
        : "";
    const reviewHref = firstLessonSlug
      ? `/learn/courses/${course.slug}/lessons/${firstLessonSlug}`
      : `/learn/courses/${course.slug}`;

    return (
      <div className="flex flex-col gap-4 rounded-[20px] border border-mint-ink/30 bg-gradient-to-br from-card to-mint/20 p-5 sm:p-6 shadow-soft">
        <div className="flex items-center gap-2.5">
          <span className="grid size-9 place-items-center rounded-xl bg-mint text-mint-ink border border-mint-ink/30">
            <CheckCircle2 className="size-5" aria-hidden="true" />
          </span>
          <div>
            <h2 className="text-base font-bold text-ink">Course completed!</h2>
            <p className="text-[11px] font-semibold text-mint-ink">
              All lessons finished
            </p>
          </div>
        </div>

        <p className="text-xs text-muted leading-relaxed">
          You&apos;ve completed every published lesson in this course. You can review any topic or explore a new course.
        </p>

        <div className="flex flex-col gap-2 pt-1">
          <Link
            href={reviewHref}
            className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-surface border border-line px-4 text-xs font-bold text-ink shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:text-primary"
          >
            <RotateCcw className="size-3.5" aria-hidden="true" />
            <span>Review course</span>
          </Link>

          <Link
            href={routes.learnExplore}
            className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 text-xs font-bold text-white shadow-soft transition-all duration-200 hover:-translate-y-0.5 hover:bg-primary-hover"
          >
            <Compass className="size-3.5" aria-hidden="true" />
            <span>Explore more courses</span>
          </Link>
        </div>
      </div>
    );
  }

  // 3. New Enrollment / Zero Progress State
  if (completedLessons === 0 && nextLesson) {
    const startLessonHref = `/learn/courses/${course.slug}/lessons/${nextLesson.lesson.slug}`;

    return (
      <div className="flex flex-col gap-4 rounded-[20px] border border-line bg-card p-5 sm:p-6 shadow-soft">
        <div className="flex items-center gap-2">
          <span className="grid size-8 place-items-center rounded-xl bg-primary text-white shadow-soft">
            <Play className="size-3.5 fill-current ml-0.5" aria-hidden="true" />
          </span>
          <h2 className="text-base font-bold text-ink">Start learning</h2>
        </div>

        <div className="flex flex-col gap-1 rounded-xl bg-surface p-3.5 border border-line">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-primary">
            First lesson
          </span>
          <h3 className="text-xs font-bold text-ink line-clamp-2">
            {nextLesson.lesson.title}
          </h3>
          <span className="text-[11px] text-muted flex items-center gap-1 mt-1">
            <Clock className="size-3" aria-hidden="true" />
            {nextLesson.lesson.estimatedMinutes} min
          </span>
        </div>

        <Link
          href={startLessonHref}
          className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 text-xs font-bold text-white shadow-soft transition-all duration-200 hover:-translate-y-0.5 hover:bg-primary-hover cursor-pointer"
        >
          <span>Start first lesson</span>
          <ArrowRight className="size-4" aria-hidden="true" />
        </Link>
      </div>
    );
  }

  // 4. In Progress Continue Card (Default Active State)
  const continueHref = nextLesson
    ? `/learn/courses/${course.slug}/lessons/${nextLesson.lesson.slug}`
    : `/learn/courses/${course.slug}`;

  return (
    <div className="flex flex-col gap-4 rounded-[20px] border border-primary/30 bg-gradient-to-br from-card via-card to-lavender/40 p-5 sm:p-6 shadow-soft">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="grid size-7 place-items-center rounded-lg bg-primary text-white shadow-soft">
            <Sparkles className="size-3.5 fill-current" aria-hidden="true" />
          </span>
          <h2 className="text-sm font-bold uppercase tracking-wider text-primary">
            Continue learning
          </h2>
        </div>
      </div>

      {nextLesson ? (
        <div className="flex flex-col gap-1.5 rounded-xl border border-line bg-card p-3.5">
          <span className="text-[11px] font-semibold text-muted">
            Module {nextLesson.modulePosition} • {nextLesson.moduleTitle}
          </span>
          <h3 className="text-xs font-bold text-ink line-clamp-2">
            {nextLesson.lesson.title}
          </h3>
          <span className="text-[11px] text-muted flex items-center gap-1 mt-0.5">
            <Clock className="size-3" aria-hidden="true" />
            {nextLesson.lesson.estimatedMinutes} min
          </span>
        </div>
      ) : (
        <p className="text-xs text-muted">
          Pick up right where you left off.
        </p>
      )}

      <Link
        href={continueHref}
        className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 text-xs font-bold text-white shadow-soft transition-all duration-200 hover:-translate-y-0.5 hover:bg-primary-hover"
      >
        <span>Continue lesson</span>
        <ArrowRight className="size-4" aria-hidden="true" />
      </Link>
    </div>
  );
}

