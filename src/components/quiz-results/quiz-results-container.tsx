"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronRight } from "lucide-react";

import { AttemptHistory } from "@/components/quiz-results/attempt-history";
import { ConceptPerformanceGrid } from "@/components/quiz-results/concept-performance-grid";
import { QuizAnswerReview } from "@/components/quiz-results/quiz-answer-review";
import { QuizRecommendationSection } from "@/components/quiz-results/quiz-recommendation-section";
import { QuizResultHero } from "@/components/quiz-results/quiz-result-hero";
import { retryQuizAttemptAction } from "@/lib/actions/quiz";
import type { QuizResultsPageData } from "@/lib/types";

interface QuizResultsContainerProps {
  data: QuizResultsPageData;
}

export function QuizResultsContainer({ data }: QuizResultsContainerProps) {
  const router = useRouter();
  const {
    attempt,
    quiz,
    course,
    lesson,
    concepts,
    recommendations,
    reviewQuestions,
    previousAttempts,
    nextLesson,
  } = data;

  const handleScrollToAnswers = () => {
    const el = document.getElementById("answers");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleRetry = async () => {
    const res = await retryQuizAttemptAction(quiz.id, course.slug, lesson.slug);
    if (res.success) {
      router.push(`/learn/courses/${course.slug}/lessons/${lesson.slug}`);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col gap-8 sm:gap-10 pb-16">
      {/* 1. Breadcrumbs & Page Heading */}
      <div className="flex flex-col gap-3">
        <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-xs text-muted">
          <Link href="/learn/courses" className="hover:text-ink transition-colors">
            My Learning
          </Link>
          <ChevronRight className="size-3" aria-hidden="true" />
          <Link
            href={`/learn/courses/${course.slug}`}
            className="hover:text-ink transition-colors truncate max-w-[150px] sm:max-w-[200px]"
          >
            {course.title}
          </Link>
          <ChevronRight className="size-3" aria-hidden="true" />
          <Link
            href={`/learn/courses/${course.slug}/lessons/${lesson.slug}`}
            className="hover:text-ink transition-colors truncate max-w-[150px] sm:max-w-[200px]"
          >
            {lesson.title}
          </Link>
          <ChevronRight className="size-3" aria-hidden="true" />
          <span className="font-semibold text-ink">Results</span>
        </nav>

        <div className="flex flex-col gap-1">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-ink">
            Knowledge check results
          </h1>
          <p className="text-xs sm:text-sm text-muted max-w-2xl leading-relaxed">
            Review your answers, revisit any concepts you&apos;d like to strengthen, or continue to the next lesson.
          </p>
        </div>
      </div>

      {/* 2. Large Result Hero with Score Ring */}
      <QuizResultHero
        courseSlug={course.slug}
        lessonSlug={lesson.slug}
        correctCount={attempt.correctCount}
        totalQuestions={attempt.totalQuestions}
        percent={attempt.percent}
        attemptNumber={attempt.attemptNumber}
        completedAt={attempt.completedAt}
        nextLesson={nextLesson}
        onRetry={handleRetry}
        onScrollToAnswers={handleScrollToAnswers}
      />

      {/* 3. Concept Performance Grid (3-column) */}
      <ConceptPerformanceGrid concepts={concepts} />

      {/* 4. Recommended Next Steps */}
      <QuizRecommendationSection recommendations={recommendations} />

      {/* 5. Detailed Question-by-Question Review with Filters */}
      <QuizAnswerReview questions={reviewQuestions} />

      {/* 6. Previous Attempts History */}
      <AttemptHistory
        courseSlug={course.slug}
        lessonSlug={lesson.slug}
        currentAttemptId={attempt.id}
        attempts={previousAttempts}
      />
    </div>
  );
}

