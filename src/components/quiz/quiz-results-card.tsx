"use client";

import Link from "next/link";
import { ArrowRight, BookOpen, RotateCcw, Sparkles } from "lucide-react";

import type { LessonNavigationItem, PracticeQuestion, QuizAttemptAnswer } from "@/lib/types";

interface QuizResultsCardProps {
  courseSlug: string;
  lessonSlug?: string;
  attemptId?: string;
  totalQuestions: number;
  correctCount: number;
  questions: PracticeQuestion[];
  answers: Record<string, QuizAttemptAnswer>;
  nextLesson: LessonNavigationItem | null;
  isCourseCompleted?: boolean;
  onRetry: () => void;
  onReviewQuestions: () => void;
}

export function QuizResultsCard({
  courseSlug,
  lessonSlug,
  attemptId,
  totalQuestions,
  correctCount,
  questions,
  answers,
  nextLesson,
  isCourseCompleted,
  onRetry,
  onReviewQuestions,
}: QuizResultsCardProps) {
  const percent =
    totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;

  // Encouraging contextual feedback
  let feedbackMessage =
    "Great work! You have a solid grasp of the core concepts in this section.";
  if (percent < 50) {
    feedbackMessage =
      "This is a great checkpoint to review the lesson topics and try again whenever you're ready.";
  } else if (percent < 80) {
    feedbackMessage =
      "Good progress! A quick review of a few key ideas will help cement your understanding.";
  }

  // Derive missed topics for "Worth reviewing" list
  const missedTopics: string[] = [];
  for (const q of questions) {
    const a = answers[q.id];
    if (a && !a.isCorrect && q.topic && !missedTopics.includes(q.topic)) {
      missedTopics.push(q.topic);
    }
  }

  const nextHref = isCourseCompleted
    ? `/learn/courses/${courseSlug}/complete`
    : nextLesson
    ? `/learn/courses/${courseSlug}/lessons/${nextLesson.slug}`
    : `/learn/courses/${courseSlug}`;

  const ctaLabel = isCourseCompleted
    ? "View course summary"
    : nextLesson
    ? "Continue learning"
    : "Return to course";

  return (
    <div className="w-full rounded-[20px] border border-line bg-card p-6 sm:p-10 shadow-lift flex flex-col gap-8">
      {/* Header & Score Presentation */}
      <div className="flex flex-col items-center text-center gap-3">
        <div className="grid size-16 place-items-center rounded-2xl bg-lavender text-primary shadow-soft">
          <Sparkles className="size-8" aria-hidden="true" />
        </div>

        <div className="flex flex-col gap-1 mt-2">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-primary">
            Knowledge Check Complete
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-ink">
            Nice work — here&apos;s how you did
          </h2>
        </div>

        {/* Score Pill */}
        <div className="mt-2 flex items-baseline gap-2 rounded-2xl border border-primary/20 bg-lavender/40 px-6 py-3">
          <span className="text-3xl sm:text-4xl font-extrabold text-primary">
            {correctCount} / {totalQuestions}
          </span>
          <span className="text-xs sm:text-sm font-bold text-muted">
            questions correct ({percent}%)
          </span>
        </div>

        <p className="text-xs sm:text-sm text-muted max-w-md mt-1">
          {feedbackMessage}
        </p>
      </div>

      {/* Worth Reviewing Topics (if any missed) */}
      {missedTopics.length > 0 && (
        <div className="rounded-[16px] border border-line bg-surface p-5 flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <BookOpen className="size-4 text-primary" aria-hidden="true" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-ink">
              Worth reviewing
            </h3>
          </div>
          <p className="text-xs text-muted">
            You missed questions related to these concepts. Re-reading these sections will help reinforce your understanding:
          </p>
          <div className="flex flex-wrap gap-2 pt-1">
            {missedTopics.map((topic, i) => (
              <span
                key={i}
                className="rounded-lg bg-card px-3 py-1.5 text-xs font-semibold text-ink border border-line shadow-2xs"
              >
                {topic}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3.5 border-t border-line pt-6">
        <div className="flex items-center gap-2.5">
          {/* Try Again / Retry CTA */}
          <button
            type="button"
            onClick={onRetry}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-line bg-surface px-4 text-xs font-bold text-ink hover:border-primary/40 hover:text-primary transition-all cursor-pointer shadow-xs"
          >
            <RotateCcw className="size-3.5" aria-hidden="true" />
            <span>Try again</span>
          </button>

          {/* Review Questions CTA */}
          <button
            type="button"
            onClick={onReviewQuestions}
            className="inline-flex h-11 items-center justify-center gap-1.5 rounded-xl border border-line bg-surface px-4 text-xs font-bold text-ink hover:border-primary/40 hover:text-primary transition-all cursor-pointer shadow-xs"
          >
            <span>Review answers</span>
          </button>

          {/* Full Results & Breakdown Link */}
          {attemptId && lessonSlug && (
            <Link
              href={`/learn/courses/${courseSlug}/lessons/${lessonSlug}/results/${attemptId}`}
              className="inline-flex h-11 items-center justify-center gap-1.5 rounded-xl border border-line bg-surface px-4 text-xs font-bold text-muted hover:text-ink hover:border-primary/40 transition-all shadow-xs"
            >
              <span>Full report</span>
            </Link>
          )}
        </div>

        {/* Primary Continue Learning Button (Never locked or gated!) */}
        <Link
          href={nextHref}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-primary px-6 text-xs font-bold text-white shadow-soft transition-all duration-200 hover:bg-primary-hover hover:-translate-y-0.5"
        >
          <span>{ctaLabel}</span>
          <ArrowRight className="size-4" aria-hidden="true" />
        </Link>
      </div>
    </div>
  );
}
