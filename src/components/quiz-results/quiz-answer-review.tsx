"use client";

import * as React from "react";
import {
  CheckCircle2,
  ChevronDown,
  Lightbulb,
} from "lucide-react";

import { QuizCodeBlock } from "@/components/quiz/quiz-code-block";
import type { QuizReviewQuestion } from "@/lib/types";
import { cn } from "@/lib/utils";

interface QuizAnswerReviewProps {
  questions: QuizReviewQuestion[];
}

type FilterTab = "all" | "review" | "correct";

export function QuizAnswerReview({ questions }: QuizAnswerReviewProps) {
  const [activeFilter, setActiveFilter] = React.useState<FilterTab>("all");

  // Initial expanded state: expand missed questions by default, collapse correct
  const [expandedMap, setExpandedMap] = React.useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    for (const q of questions) {
      initial[q.id] = !q.isCorrect; // true if missed
    }
    // If all correct, expand the first one
    if (questions.length > 0 && Object.values(initial).every((v) => !v)) {
      initial[questions[0].id] = true;
    }
    return initial;
  });

  const toggleExpand = (id: string) => {
    setExpandedMap((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleAll = (expand: boolean) => {
    const next: Record<string, boolean> = {};
    for (const q of questions) {
      next[q.id] = expand;
    }
    setExpandedMap(next);
  };

  const totalCount = questions.length;
  const correctCount = questions.filter((q) => q.isCorrect).length;
  const reviewCount = totalCount - correctCount;

  const filteredQuestions = questions.filter((q) => {
    if (activeFilter === "correct") return q.isCorrect;
    if (activeFilter === "review") return !q.isCorrect;
    return true;
  });

  const allExpanded = questions.every((q) => expandedMap[q.id]);

  return (
    <section id="answers" aria-label="Question review" className="flex flex-col gap-5 pt-4">
      {/* Header & Filter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-line pb-4">
        <div className="flex flex-col gap-1">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-muted">
            Detailed Review
          </span>
          <h3 className="text-xl font-bold text-ink">
            Review your answers
          </h3>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Filter Pills */}
          <div className="flex items-center gap-1 rounded-xl border border-line bg-surface p-1 shadow-2xs">
            <button
              type="button"
              onClick={() => setActiveFilter("all")}
              aria-pressed={activeFilter === "all"}
              className={cn(
                "rounded-lg px-3 py-1 text-xs font-bold transition-colors cursor-pointer",
                activeFilter === "all"
                  ? "bg-card text-ink shadow-xs"
                  : "text-muted hover:text-ink",
              )}
            >
              All ({totalCount})
            </button>

            <button
              type="button"
              onClick={() => setActiveFilter("review")}
              aria-pressed={activeFilter === "review"}
              className={cn(
                "rounded-lg px-3 py-1 text-xs font-bold transition-colors cursor-pointer",
                activeFilter === "review"
                  ? "bg-card text-amber-700 dark:text-amber-300 shadow-xs"
                  : "text-muted hover:text-ink",
              )}
            >
              Review ({reviewCount})
            </button>

            <button
              type="button"
              onClick={() => setActiveFilter("correct")}
              aria-pressed={activeFilter === "correct"}
              className={cn(
                "rounded-lg px-3 py-1 text-xs font-bold transition-colors cursor-pointer",
                activeFilter === "correct"
                  ? "bg-card text-[#14895A] dark:text-[#74E0B8] shadow-xs"
                  : "text-muted hover:text-ink",
              )}
            >
              Correct ({correctCount})
            </button>
          </div>

          {/* Expand/Collapse All */}
          <button
            type="button"
            onClick={() => toggleAll(!allExpanded)}
            className="rounded-xl border border-line bg-card px-3 py-1.5 text-xs font-semibold text-muted hover:text-ink hover:border-primary/40 transition-colors cursor-pointer shadow-2xs"
          >
            {allExpanded ? "Collapse all" : "Expand all"}
          </button>
        </div>
      </div>

      {/* Questions Accordion List */}
      <div className="flex flex-col gap-3.5">
        {filteredQuestions.map((q) => {
          const isExpanded = Boolean(expandedMap[q.id]);

          return (
            <div
              key={q.id}
              className="flex flex-col rounded-[18px] border border-line bg-card overflow-hidden shadow-soft transition-all"
            >
              {/* Question Disclosure Header */}
              <button
                type="button"
                onClick={() => toggleExpand(q.id)}
                aria-expanded={isExpanded}
                className="flex items-center justify-between gap-4 p-4 sm:p-5 text-left hover:bg-surface/50 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3 min-w-0">
                  {/* Status Icon */}
                  <div className="shrink-0">
                    {q.isCorrect ? (
                      <CheckCircle2
                        className="size-5 text-[#19B99A]"
                        aria-hidden="true"
                      />
                    ) : (
                      <Lightbulb
                        className="size-5 text-amber-500"
                        aria-hidden="true"
                      />
                    )}
                  </div>

                  <div className="flex flex-col min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-muted">
                        Question {q.position}
                      </span>
                      {q.topic && (
                        <span className="rounded-md bg-surface px-2 py-0.2 text-[10px] font-bold text-muted border border-line">
                          {q.topic}
                        </span>
                      )}
                    </div>
                    <p className="truncate text-xs sm:text-sm font-bold text-ink mt-0.5">
                      {q.questionText}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 shrink-0">
                  <span
                    className={cn(
                      "rounded-md px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider border",
                      q.isCorrect
                        ? "bg-mint/40 text-[#14895A] dark:text-[#74E0B8] border-[#19B99A]/30"
                        : "bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-300/40",
                    )}
                  >
                    {q.isCorrect ? "Correct" : "Review"}
                  </span>

                  <ChevronDown
                    className={cn(
                      "size-4 text-muted transition-transform duration-200",
                      isExpanded && "rotate-180",
                    )}
                    aria-hidden="true"
                  />
                </div>
              </button>

              {/* Expanded Question Details */}
              {isExpanded && (
                <div className="flex flex-col gap-4 border-t border-line/60 bg-surface/30 p-5 sm:p-6 animate-in fade-in-0 duration-150">
                  {/* Full Question Text */}
                  <p className="text-sm font-semibold text-ink leading-relaxed">
                    {q.questionText}
                  </p>

                  {/* Code snippet if any */}
                  {q.codeContent && (
                    <QuizCodeBlock
                      code={q.codeContent}
                      language={q.codeLanguage}
                    />
                  )}

                  {/* Answer Comparison Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    {/* Learner's Answer */}
                    <div className="flex flex-col gap-1.5 rounded-xl border border-line bg-card p-3.5 shadow-2xs">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-muted">
                        Your Answer
                      </span>
                      <div className="flex flex-col gap-1">
                        {q.selectedOptionTexts.length > 0 ? (
                          q.selectedOptionTexts.map((text, i) => (
                            <p key={i} className="text-xs font-semibold text-ink">
                              {text}
                            </p>
                          ))
                        ) : (
                          <p className="text-xs text-muted italic">No answer submitted</p>
                        )}
                      </div>
                    </div>

                    {/* Correct Answer */}
                    <div className="flex flex-col gap-1.5 rounded-xl border border-[#19B99A]/30 bg-mint/20 p-3.5 shadow-2xs">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#14895A] dark:text-[#74E0B8]">
                        Correct Answer
                      </span>
                      <div className="flex flex-col gap-1">
                        {q.correctOptionTexts.map((text, i) => (
                          <p key={i} className="text-xs font-semibold text-ink">
                            {text}
                          </p>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Explanation Callout */}
                  {q.explanation && (
                    <div className="flex items-start gap-3 rounded-xl border border-line bg-card p-4 shadow-2xs">
                      <Lightbulb className="size-4 text-primary shrink-0 mt-0.5" aria-hidden="true" />
                      <div className="flex flex-col gap-0.5">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-primary">
                          Explanation
                        </span>
                        <p className="text-xs text-ink/90 leading-relaxed">
                          {q.explanation}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
