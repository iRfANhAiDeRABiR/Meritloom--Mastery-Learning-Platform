"use client";

import * as React from "react";

import { QuizHeader } from "@/components/quiz/quiz-header";
import { QuizProgress } from "@/components/quiz/quiz-progress";
import { QuizQuestionCard } from "@/components/quiz/quiz-question-card";
import { QuizResultsCard } from "@/components/quiz/quiz-results-card";
import {
  completeQuizAttemptAction,
  retryQuizAttemptAction,
  startQuizAttemptAction,
  submitPracticeAnswerAction,
} from "@/lib/actions/quiz";
import type {
  PracticeQuizData,
  QuizAttemptAnswer,
} from "@/lib/types";

interface PracticeQuizProps {
  data: PracticeQuizData;
}

export function PracticeQuiz({ data }: PracticeQuizProps) {
  const {
    id: quizId,
    courseSlug,
    lessonSlug,
    title,
    estimatedMinutes,
    questions,
    nextLesson,
    currentAttempt,
  } = data;

  const [attemptId, setAttemptId] = React.useState<string>(
    currentAttempt?.id || "",
  );

  // Map of question ID -> submitted & graded answer
  const [answers, setAnswers] = React.useState<Record<string, QuizAttemptAnswer>>(
    () => currentAttempt?.answers || {},
  );

  // Map of question ID -> currently selected option IDs
  const [selectedMap, setSelectedMap] = React.useState<Record<string, string[]>>(
    () => {
      const initial: Record<string, string[]> = {};
      if (currentAttempt?.answers) {
        for (const [qId, a] of Object.entries(currentAttempt.answers)) {
          initial[qId] = a.selectedOptionIds;
        }
      }
      return initial;
    },
  );

  // Determine starting question index: first unanswered question or 0
  const [currentIndex, setCurrentIndex] = React.useState<number>(() => {
    if (!currentAttempt?.answers) return 0;
    const firstUnanswered = questions.findIndex(
      (q) => !currentAttempt.answers[q.id],
    );
    return firstUnanswered !== -1 ? firstUnanswered : 0;
  });

  const [isCompleted, setIsCompleted] = React.useState<boolean>(
    Boolean(currentAttempt?.completedAt),
  );
  const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false);

  // Ensure attemptId is initialized on mount if not already present
  React.useEffect(() => {
    if (!attemptId) {
      startQuizAttemptAction(quizId).then((res) => {
        if (res.success && res.attemptId) {
          setAttemptId(res.attemptId);
        }
      });
    }
  }, [attemptId, quizId]);

  const currentQuestion = questions[currentIndex];
  const questionIds = questions.map((q) => q.id);
  const currentSelectedIds = selectedMap[currentQuestion?.id] || [];
  const currentSubmittedAnswer = answers[currentQuestion?.id];

  const handleToggleOption = (optionId: string) => {
    if (currentSubmittedAnswer || !currentQuestion) return;

    if (currentQuestion.questionType === "multiple_choice") {
      setSelectedMap((prev) => {
        const existing = prev[currentQuestion.id] || [];
        const next = existing.includes(optionId)
          ? existing.filter((id) => id !== optionId)
          : [...existing, optionId];
        return { ...prev, [currentQuestion.id]: next };
      });
    } else {
      // Single choice / true_false
      setSelectedMap((prev) => ({
        ...prev,
        [currentQuestion.id]: [optionId],
      }));
    }
  };

  const handleSubmitAnswer = async () => {
    if (!currentQuestion || currentSubmittedAnswer || isSubmitting) return;

    const selected = selectedMap[currentQuestion.id] || [];
    if (selected.length === 0) return;

    setIsSubmitting(true);

    const result = await submitPracticeAnswerAction({
      attemptId: attemptId || `att-${Date.now()}`,
      questionId: currentQuestion.id,
      selectedOptionIds: selected,
    });

    if (result.success) {
      const submittedAnswer: QuizAttemptAnswer = {
        questionId: currentQuestion.id,
        selectedOptionIds: selected,
        isCorrect: Boolean(result.isCorrect),
        explanation: result.explanation,
        correctOptionIds: result.correctOptionIds,
      };

      setAnswers((prev) => ({
        ...prev,
        [currentQuestion.id]: submittedAnswer,
      }));
    }

    setIsSubmitting(false);
  };

  const handleNextQuestion = async () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      // Completed all questions
      setIsSubmitting(true);
      await completeQuizAttemptAction(attemptId, courseSlug, lessonSlug);
      setIsSubmitting(false);
      setIsCompleted(true);
    }
  };

  const handlePrevQuestion = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleSelectIndex = (idx: number) => {
    if (idx >= 0 && idx < questions.length) {
      setIsCompleted(false);
      setCurrentIndex(idx);
    }
  };

  const handleRetry = async () => {
    const res = await retryQuizAttemptAction(quizId, courseSlug, lessonSlug);
    if (res.success && res.attemptId) {
      setAttemptId(res.attemptId);
    }
    setAnswers({});
    setSelectedMap({});
    setCurrentIndex(0);
    setIsCompleted(false);
  };

  const correctCount = Object.values(answers).filter((a) => a.isCorrect).length;

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-6 sm:gap-8 pb-12">
      {/* 1. Header */}
      <QuizHeader
        courseSlug={courseSlug}
        title={title}
        estimatedMinutes={estimatedMinutes}
      />

      {/* 2. Progress */}
      <QuizProgress
        currentIndex={currentIndex}
        totalQuestions={questions.length}
        answers={answers}
        questionIds={questionIds}
        onSelectIndex={handleSelectIndex}
      />

      {/* 3. Question Card or Results */}
      {isCompleted ? (
        <QuizResultsCard
          courseSlug={courseSlug}
          lessonSlug={lessonSlug}
          attemptId={attemptId}
          totalQuestions={questions.length}
          correctCount={correctCount}
          questions={questions}
          answers={answers}
          nextLesson={nextLesson}
          onRetry={handleRetry}
          onReviewQuestions={() => {
            setIsCompleted(false);
            setCurrentIndex(0);
          }}
        />
      ) : (
        currentQuestion && (
          <QuizQuestionCard
            question={currentQuestion}
            currentIndex={currentIndex}
            totalQuestions={questions.length}
            selectedOptionIds={currentSelectedIds}
            submittedAnswer={currentSubmittedAnswer}
            isSubmitting={isSubmitting}
            isLastQuestion={currentIndex === questions.length - 1}
            onToggleOption={handleToggleOption}
            onSubmitAnswer={handleSubmitAnswer}
            onNextQuestion={handleNextQuestion}
            onPrevQuestion={handlePrevQuestion}
          />
        )
      )}
    </div>
  );
}
