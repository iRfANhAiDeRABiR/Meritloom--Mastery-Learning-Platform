"use client";

import * as React from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Circle,
  Sparkles,
  Gift,
} from "lucide-react";

import { toggleLessonProgressAction } from "@/lib/actions/lesson";
import { notify } from "@/lib/notifications/toast";
import type { LessonNavigationItem } from "@/lib/types";
import { cn } from "@/lib/utils";

interface LessonBottomNavProps {
  courseSlug: string;
  lessonSlug: string;
  isCompleted: boolean;
  previousLesson: LessonNavigationItem | null;
  nextLesson: LessonNavigationItem | null;
  isLastLesson: boolean;
  onCompletionChanged?: (completed: boolean) => void;
}

export function LessonBottomNav({
  courseSlug,
  lessonSlug,
  isCompleted: initialCompleted,
  previousLesson,
  nextLesson,
  isLastLesson,
  onCompletionChanged,
}: LessonBottomNavProps) {
  const [completed, setCompleted] = React.useState(initialCompleted);
  const [isPending, setIsPending] = React.useState(false);

  // Sync state if initialCompleted changes externally
  const [prevInitial, setPrevInitial] = React.useState(initialCompleted);
  if (prevInitial !== initialCompleted) {
    setPrevInitial(initialCompleted);
    setCompleted(initialCompleted);
  }

  const handleToggleComplete = async () => {
    const nextState = !completed;
    setCompleted(nextState);
    setIsPending(true);
    onCompletionChanged?.(nextState);

    const result = await toggleLessonProgressAction(
      courseSlug,
      lessonSlug,
      nextState,
    );

    if (!result.success) {
      // Rollback on failure
      setCompleted(!nextState);
      onCompletionChanged?.(!nextState);
      notify.error({ title: result.error || "Could not update progress." });
    } else if (nextState) {
      notify.success({ title: "Lesson marked complete" });
    }
    setIsPending(false);
  };

  const isNextBonus = Boolean(nextLesson?.isBonus);
  const courseOverviewHref = `/learn/courses/${courseSlug}`;

  const nextHref = nextLesson
    ? `/learn/courses/${courseSlug}/lessons/${nextLesson.slug}`
    : courseOverviewHref;

  const prevHref = previousLesson
    ? `/learn/courses/${courseSlug}/lessons/${previousLesson.slug}`
    : null;

  return (
    <div className="mt-10 flex flex-col gap-6 border-t border-line pt-8">
      {/* Mark Complete Action Row */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-[18px] border border-line bg-card p-5 shadow-soft">
        <div className="flex flex-col gap-1">
          <h3 className="text-sm font-bold text-ink">
            {completed ? "Lesson completed!" : "Finished with this lesson?"}
          </h3>
          <p className="text-xs text-muted">
            {completed
              ? "Great work! You can move to the next lesson or mark as incomplete."
              : "Mark it complete to update your course roadmap and track your progress."}
          </p>
        </div>

        <button
          type="button"
          onClick={handleToggleComplete}
          disabled={isPending}
          className={cn(
            "inline-flex h-11 items-center justify-center gap-2 rounded-xl px-5 text-xs font-bold transition-all duration-200 cursor-pointer shadow-soft hover:-translate-y-0.5",
            completed
              ? "bg-mint text-mint-ink border border-mint-ink/30 hover:bg-mint/80"
              : "bg-primary text-white hover:bg-primary-hover",
            isPending && "opacity-60 pointer-events-none",
          )}
        >
          {completed ? (
            <>
              <CheckCircle2 className="size-4" aria-hidden="true" />
              <span>Completed</span>
            </>
          ) : (
            <>
              <Circle className="size-4" aria-hidden="true" />
              <span>Mark as complete</span>
            </>
          )}
        </button>
      </div>

      {/* When completed last required lesson (e.g. Forms before Bonus Bloopers), offer both Complete Course & Bonus */}
      {isNextBonus ? (
        <div className="flex flex-col gap-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {/* Previous Lesson */}
            {prevHref ? (
              <Link
                href={prevHref}
                className="group flex items-center gap-3 rounded-[16px] border border-line bg-card p-4 text-left transition-all hover:border-primary/40 hover:bg-surface shadow-xs"
              >
                <div className="grid size-9 place-items-center rounded-xl bg-surface group-hover:bg-primary group-hover:text-white text-muted transition-colors shrink-0">
                  <ArrowLeft className="size-4" aria-hidden="true" />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-muted">
                    Previous Lesson
                  </span>
                  <span className="truncate text-xs font-bold text-ink group-hover:text-primary transition-colors">
                    {previousLesson?.title}
                  </span>
                </div>
              </Link>
            ) : (
              <div className="hidden sm:block" />
            )}

            {/* Primary Action: Complete Course / Back to Course */}
            <Link
              href={courseOverviewHref}
              className="group flex items-center justify-between gap-3 rounded-[16px] border border-mint-ink/30 bg-mint/15 p-4 text-right transition-all hover:border-mint-ink/50 hover:bg-mint/25 shadow-soft"
            >
              <div className="flex flex-col min-w-0 text-left sm:text-right">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-mint-ink">
                  Requirements Completed
                </span>
                <span className="truncate text-xs font-bold text-ink group-hover:text-mint-ink transition-colors">
                  Complete Course / Back to Roadmap
                </span>
              </div>
              <div className="grid size-9 place-items-center rounded-xl bg-[#19B99A] text-white shadow-soft transition-transform group-hover:scale-105 shrink-0">
                <Sparkles className="size-4" aria-hidden="true" />
              </div>
            </Link>
          </div>

          {/* Secondary Action: Watch Bonus Bloopers */}
          <Link
            href={nextHref}
            className="flex items-center justify-between rounded-xl border border-primary/20 bg-lavender/30 px-4 py-3 text-xs font-bold text-primary hover:bg-lavender/50 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Gift className="size-4 text-primary" aria-hidden="true" />
              <span>Optional Bonus: {nextLesson?.title}</span>
            </div>
            <div className="flex items-center gap-1">
              <span>Watch bonus</span>
              <ArrowRight className="size-3.5" aria-hidden="true" />
            </div>
          </Link>
        </div>
      ) : (
        /* Standard Previous / Next Navigation */
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {/* Previous Lesson Button */}
          {prevHref ? (
            <Link
              href={prevHref}
              className="group flex items-center gap-3 rounded-[16px] border border-line bg-card p-4 text-left transition-all hover:border-primary/40 hover:bg-surface shadow-xs"
            >
              <div className="grid size-9 place-items-center rounded-xl bg-surface group-hover:bg-primary group-hover:text-white text-muted transition-colors shrink-0">
                <ArrowLeft className="size-4" aria-hidden="true" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-muted">
                  Previous Lesson
                </span>
                <span className="truncate text-xs font-bold text-ink group-hover:text-primary transition-colors">
                  {previousLesson?.title}
                </span>
              </div>
            </Link>
          ) : (
            <div className="hidden sm:block" />
          )}

          {/* Next Lesson or Finish Course Button */}
          <Link
            href={nextHref}
            className="group flex items-center justify-between gap-3 rounded-[16px] border border-primary/30 bg-gradient-to-r from-card via-card to-lavender/40 p-4 text-right transition-all hover:border-primary hover:shadow-soft"
          >
            <div className="flex flex-col min-w-0 text-left sm:text-right">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-primary">
                {isLastLesson ? "Final Lesson" : "Next Lesson"}
              </span>
              <span className="truncate text-xs font-bold text-ink group-hover:text-primary transition-colors">
                {isLastLesson ? "Return to Course Overview" : nextLesson?.title}
              </span>
            </div>

            <div className="grid size-9 place-items-center rounded-xl bg-primary text-white shadow-soft transition-transform group-hover:scale-105 shrink-0">
              {isLastLesson ? (
                <Sparkles className="size-4" aria-hidden="true" />
              ) : (
                <ArrowRight className="size-4" aria-hidden="true" />
              )}
            </div>
          </Link>
        </div>
      )}
    </div>
  );
}
