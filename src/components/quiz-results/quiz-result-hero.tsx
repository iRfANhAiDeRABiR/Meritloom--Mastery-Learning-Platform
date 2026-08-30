"use client";

import Link from "next/link";
import { ArrowRight, BookOpen, RotateCcw } from "lucide-react";

import { QuizScoreRing } from "@/components/quiz-results/quiz-score-ring";
import type { LessonNavigationItem } from "@/lib/types";

interface QuizResultHeroProps {
  courseSlug: string;
  lessonSlug: string;
  correctCount: number;
  totalQuestions: number;
  percent: number;
  attemptNumber: number;
  completedAt: string;
  nextLesson: LessonNavigationItem | null;
  onRetry: () => void;
  onScrollToAnswers: () => void;
}

export function QuizResultHero({
  courseSlug,
  correctCount,
  totalQuestions,
  percent,
  attemptNumber,
  completedAt,
  nextLesson,
  onRetry,
  onScrollToAnswers,
}: QuizResultHeroProps) {
  // Supportive headline based on score bracket
  let headline = "Great work — you understood most of these concepts.";
  if (percent < 50) {
    headline = "This is a useful point to review a few ideas.";
  } else if (percent < 80) {
    headline = "Good progress — a quick review may help.";
  }

  let description = `You answered ${correctCount} of ${totalQuestions} questions correctly. Review any missed concepts below or continue when you're ready.`;
  if (percent === 100) {
    description = "You answered every question correctly! You can review your answers or continue learning.";
  } else if (percent === 0) {
    description = "You can review each explanation below and try the knowledge check again whenever you want.";
  }

  const nextHref = nextLesson
    ? `/learn/courses/${courseSlug}/lessons/${nextLesson.slug}`
    : `/learn/courses/${courseSlug}`;

  const formattedDate = new Date(completedAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <section
      aria-label="Knowledge check summary"
      className="relative overflow-hidden rounded-[24px] border border-primary/20 bg-gradient-to-br from-[#FAF8FF] via-card to-lavender/30 dark:from-[#18152B] dark:via-card dark:to-[#18152B] p-6 sm:p-10 shadow-lift"
    >
      {/* Ambient background glow */}
      <div className="pointer-events-none absolute -top-24 -right-24 size-72 rounded-full bg-primary/10 blur-3xl" />

      <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
        {/* Left column: Badge, Heading, Description, Actions */}
        <div className="flex flex-col gap-4 max-w-xl text-center lg:text-left items-center lg:items-start">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-md bg-lavender px-2.5 py-0.5 text-[11px] font-extrabold uppercase tracking-wider text-primary border border-primary/20">
              Knowledge check complete
            </span>
            <span className="text-xs text-muted">
              Attempt {attemptNumber} • {formattedDate}
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-ink">
            {headline}
          </h2>

          <p className="text-xs sm:text-sm text-muted leading-relaxed">
            {description}
          </p>

          {/* Actions Row */}
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-3">
            {/* Primary Continue Learning Button (Never gated!) */}
            <Link
              href={nextHref}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-primary px-6 text-xs font-bold text-white shadow-soft transition-all duration-200 hover:bg-primary-hover hover:-translate-y-0.5"
            >
              <span>{nextLesson ? "Continue learning" : "Return to course"}</span>
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>

            {/* Review Answers Button */}
            <button
              type="button"
              onClick={onScrollToAnswers}
              className="inline-flex h-11 items-center justify-center gap-1.5 rounded-xl border border-line bg-card px-4 text-xs font-bold text-ink hover:border-primary/40 hover:text-primary transition-all cursor-pointer shadow-xs"
            >
              <BookOpen className="size-3.5" aria-hidden="true" />
              <span>Review answers</span>
            </button>

            {/* Try Again Button */}
            <button
              type="button"
              onClick={onRetry}
              className="inline-flex h-11 items-center justify-center gap-1.5 rounded-xl border border-line bg-surface px-4 text-xs font-bold text-ink hover:border-primary/40 hover:text-primary transition-all cursor-pointer shadow-xs"
            >
              <RotateCcw className="size-3.5" aria-hidden="true" />
              <span>Try again</span>
            </button>
          </div>
        </div>

        {/* Right column: Circular Score Ring */}
        <div className="shrink-0 flex flex-col items-center gap-2">
          <QuizScoreRing
            percent={percent}
            correctCount={correctCount}
            totalQuestions={totalQuestions}
            size={160}
            strokeWidth={12}
          />
        </div>
      </div>
    </section>
  );
}

