"use client";

import Image from "next/image";
import { ArrowLeft, ArrowRight, Sparkles } from "lucide-react";

import { QuizAnswerOptions } from "@/components/quiz/quiz-answer-options";
import { QuizCodeBlock } from "@/components/quiz/quiz-code-block";
import { QuizFeedbackCard } from "@/components/quiz/quiz-feedback-card";
import type { PracticeQuestion, QuizAttemptAnswer } from "@/lib/types";
import { cn } from "@/lib/utils";

interface QuizQuestionCardProps {
  question: PracticeQuestion;
  currentIndex: number;
  totalQuestions: number;
  selectedOptionIds: string[];
  submittedAnswer?: QuizAttemptAnswer;
  isSubmitting: boolean;
  isLastQuestion: boolean;
  onToggleOption: (optionId: string) => void;
  onSubmitAnswer: () => void;
  onNextQuestion: () => void;
  onPrevQuestion: () => void;
}

export function QuizQuestionCard({
  question,
  currentIndex,
  totalQuestions,
  selectedOptionIds,
  submittedAnswer,
  isSubmitting,
  isLastQuestion,
  onToggleOption,
  onSubmitAnswer,
  onNextQuestion,
  onPrevQuestion,
}: QuizQuestionCardProps) {
  const isSubmitted = Boolean(submittedAnswer);
  const isCorrect = submittedAnswer?.isCorrect;
  const canSubmit = selectedOptionIds.length > 0 && !isSubmitting && !isSubmitted;

  return (
    <div className="w-full rounded-[20px] border border-line bg-card p-6 sm:p-8 lg:p-10 shadow-lift transition-all">
      {/* Question Header Meta */}
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <span className="text-[11px] font-extrabold uppercase tracking-wider text-primary">
          Question {currentIndex + 1} of {totalQuestions}
        </span>
        {question.topic && (
          <>
            <span className="text-muted font-bold text-xs">•</span>
            <span className="rounded-md bg-surface px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-muted border border-line">
              {question.topic}
            </span>
          </>
        )}
      </div>

      {/* Main Question Text */}
      <h2 className="text-lg sm:text-2xl font-bold leading-snug text-ink">
        {question.questionText}
      </h2>

      {/* Optional Diagram / Image */}
      {question.imageUrl && (
        <div className="my-4 overflow-hidden rounded-xl border border-line relative h-48 sm:h-64 w-full">
          <Image
            src={question.imageUrl}
            alt={question.questionText}
            fill
            className="object-contain"
          />
        </div>
      )}

      {/* Optional Code Snippet */}
      {question.codeContent && (
        <QuizCodeBlock
          code={question.codeContent}
          language={question.codeLanguage}
        />
      )}

      {/* Answer Options */}
      <div className="mt-6">
        <QuizAnswerOptions
          questionId={question.id}
          questionType={question.questionType}
          options={question.options}
          selectedOptionIds={selectedOptionIds}
          isSubmitted={isSubmitted}
          correctOptionIds={submittedAnswer?.correctOptionIds}
          onToggleOption={onToggleOption}
        />
      </div>

      {/* Inline Feedback Card when Answered */}
      {isSubmitted && (
        <div className="mt-5">
          <QuizFeedbackCard
            isCorrect={Boolean(isCorrect)}
            explanation={submittedAnswer?.explanation || null}
          />
        </div>
      )}

      {/* Actions Row */}
      <div className="mt-8 flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-3.5 border-t border-line pt-6">
        {/* Previous Question Button */}
        {currentIndex > 0 ? (
          <button
            type="button"
            onClick={onPrevQuestion}
            className="inline-flex h-11 items-center justify-center gap-1.5 rounded-xl border border-line bg-surface px-4 text-xs font-bold text-ink hover:border-primary/40 hover:text-primary transition-all cursor-pointer shadow-xs"
          >
            <ArrowLeft className="size-3.5" aria-hidden="true" />
            <span>Previous</span>
          </button>
        ) : (
          <div />
        )}

        {/* Primary CTA (Submit Answer or Next Question / See Results) */}
        {!isSubmitted ? (
          <button
            type="button"
            onClick={onSubmitAnswer}
            disabled={!canSubmit}
            className={cn(
              "inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-primary px-6 text-xs font-bold text-white shadow-soft transition-all duration-200 cursor-pointer hover:bg-primary-hover",
              !canSubmit && "opacity-50 pointer-events-none",
            )}
          >
            <span>{isSubmitting ? "Checking…" : "Submit answer"}</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={onNextQuestion}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-primary px-6 text-xs font-bold text-white shadow-soft transition-all duration-200 cursor-pointer hover:bg-primary-hover hover:-translate-y-0.5"
          >
            <span>{isLastQuestion ? "See results" : "Next question"}</span>
            {isLastQuestion ? (
              <Sparkles className="size-4" aria-hidden="true" />
            ) : (
              <ArrowRight className="size-4" aria-hidden="true" />
            )}
          </button>
        )}
      </div>
    </div>
  );
}
