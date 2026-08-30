"use client";

import { Check } from "lucide-react";
import type { PracticeQuestionOption, QuestionType } from "@/lib/types";
import { cn } from "@/lib/utils";

interface QuizAnswerOptionsProps {
  questionId: string;
  questionType: QuestionType;
  options: PracticeQuestionOption[];
  selectedOptionIds: string[];
  isSubmitted: boolean;
  correctOptionIds?: string[];
  onToggleOption: (optionId: string) => void;
}

const OPTION_LETTERS = ["A", "B", "C", "D", "E", "F"];

export function QuizAnswerOptions({
  questionId,
  questionType,
  options,
  selectedOptionIds,
  isSubmitted,
  correctOptionIds,
  onToggleOption,
}: QuizAnswerOptionsProps) {
  const isMultiple = questionType === "multiple_choice";

  return (
    <fieldset className="flex flex-col gap-3">
      <legend className="sr-only">Answer options</legend>

      {isMultiple && (
        <span className="text-[11px] font-bold uppercase tracking-wider text-muted mb-0.5">
          Select all that apply
        </span>
      )}

      <div className="flex flex-col gap-2.5">
        {options.map((opt, idx) => {
          const isSelected = selectedOptionIds.includes(opt.id);
          const letter = OPTION_LETTERS[idx] || `${idx + 1}`;
          const isCorrectOption = correctOptionIds?.includes(opt.id);

          // State styling
          let cardStyle =
            "border-line bg-surface/80 hover:border-primary/50 hover:bg-surface text-ink";
          let badgeStyle = "bg-card text-muted border-line";

          if (isSelected) {
            cardStyle = "border-primary bg-lavender/50 text-ink shadow-xs";
            badgeStyle = "bg-primary text-white border-primary";
          }

          // If submitted and correctness revealed
          if (isSubmitted && correctOptionIds) {
            if (isCorrectOption) {
              cardStyle = "border-[#19B99A] bg-mint/30 text-ink";
              badgeStyle = "bg-[#19B99A] text-white border-[#19B99A]";
            } else if (isSelected && !isCorrectOption) {
              cardStyle = "border-amber-400/80 bg-amber-50/50 dark:bg-amber-950/20 text-ink";
              badgeStyle = "bg-amber-500 text-white border-amber-500";
            }
          }

          return (
            <label
              key={opt.id}
              className={cn(
                "group flex items-center justify-between gap-3.5 rounded-[14px] sm:rounded-[16px] border p-4 text-xs sm:text-sm font-semibold transition-all duration-150 cursor-pointer select-none",
                cardStyle,
                isSubmitted && "cursor-default pointer-events-none",
              )}
            >
              <div className="flex items-center gap-3.5 min-w-0">
                {/* Hidden native input for semantic accessibility */}
                <input
                  type={isMultiple ? "checkbox" : "radio"}
                  name={`quiz-question-${questionId}`}
                  value={opt.id}
                  checked={isSelected}
                  disabled={isSubmitted}
                  onChange={() => onToggleOption(opt.id)}
                  className="sr-only"
                  aria-label={`Option ${letter}: ${opt.optionText}`}
                />

                {/* Option Letter Badge */}
                <span
                  className={cn(
                    "grid size-7 place-items-center rounded-xl border text-xs font-bold shrink-0 transition-colors shadow-xs",
                    badgeStyle,
                  )}
                >
                  {letter}
                </span>

                {/* Option Text */}
                <span className="leading-relaxed">{opt.optionText}</span>
              </div>

              {/* Selection / State Indicator */}
              <div className="shrink-0">
                {isSubmitted && isCorrectOption ? (
                  <span className="flex items-center gap-1 text-[11px] font-bold text-[#19B99A]">
                    <Check className="size-4" aria-hidden="true" />
                    <span className="hidden xs:inline">Correct answer</span>
                  </span>
                ) : isSelected ? (
                  <div className="size-4 rounded-full border-2 border-primary bg-primary flex items-center justify-center text-white">
                    <span className="size-1.5 rounded-full bg-white" />
                  </div>
                ) : (
                  <div className="size-4 rounded-full border border-line bg-card" />
                )}
              </div>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
