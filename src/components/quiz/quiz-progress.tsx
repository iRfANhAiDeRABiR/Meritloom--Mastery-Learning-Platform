"use client";

import { Check } from "lucide-react";
import type { QuizAttemptAnswer } from "@/lib/types";
import { cn } from "@/lib/utils";

interface QuizProgressProps {
  currentIndex: number;
  totalQuestions: number;
  answers: Record<string, QuizAttemptAnswer>;
  questionIds: string[];
  onSelectIndex: (index: number) => void;
}

export function QuizProgress({
  currentIndex,
  totalQuestions,
  answers,
  questionIds,
  onSelectIndex,
}: QuizProgressProps) {
  const currentNumber = currentIndex + 1;
  const progressPercent =
    totalQuestions > 0
      ? Math.round((currentNumber / totalQuestions) * 100)
      : 0;

  return (
    <div className="flex flex-col gap-3.5">
      {/* Question Counter and Percent */}
      <div className="flex items-center justify-between text-xs font-bold">
        <span className="text-ink">
          Question {currentNumber} of {totalQuestions}
        </span>
        <span className="text-primary">{progressPercent}%</span>
      </div>

      {/* Primary Purple Progress Bar */}
      <div
        className="h-2 w-full overflow-hidden rounded-full bg-line"
        role="progressbar"
        aria-valuenow={progressPercent}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Quiz progress"
      >
        <div
          className="h-full rounded-full bg-primary transition-all duration-300 shadow-[0_0_8px_rgba(124,92,255,0.4)]"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Accessible Question Dots (if <= 15 questions) */}
      {totalQuestions <= 15 && (
        <div
          className="flex flex-wrap items-center gap-1.5 pt-1"
          role="navigation"
          aria-label="Question steps"
        >
          {questionIds.map((qId, idx) => {
            const isCurrent = idx === currentIndex;
            const answer = answers[qId];
            const isAnswered = Boolean(answer);
            const isCorrect = answer?.isCorrect;

            let dotStyle = "border-line bg-surface text-muted hover:border-primary/40";
            let statusLabel = `Question ${idx + 1} — not answered`;

            if (isAnswered) {
              if (isCorrect) {
                dotStyle = "border-[#19B99A] bg-[#19B99A] text-white shadow-xs";
                statusLabel = `Question ${idx + 1} — correct`;
              } else {
                dotStyle = "border-[#D97706] bg-[#D97706] text-white shadow-xs";
                statusLabel = `Question ${idx + 1} — reviewed`;
              }
            }

            if (isCurrent) {
              dotStyle = "border-primary bg-primary text-white ring-2 ring-primary/30 shadow-soft scale-110 font-bold";
              statusLabel = `Question ${idx + 1} — current`;
            }

            return (
              <button
                key={qId}
                type="button"
                onClick={() => onSelectIndex(idx)}
                aria-label={statusLabel}
                title={statusLabel}
                aria-current={isCurrent ? "step" : undefined}
                className={cn(
                  "grid size-7 place-items-center rounded-lg border text-[11px] font-semibold transition-all cursor-pointer",
                  dotStyle,
                )}
              >
                {isAnswered && !isCurrent ? (
                  isCorrect ? (
                    <Check className="size-3 stroke-[3]" aria-hidden="true" />
                  ) : (
                    <span className="text-[10px] font-bold">●</span>
                  )
                ) : (
                  idx + 1
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
