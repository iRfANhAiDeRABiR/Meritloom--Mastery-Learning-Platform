import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";

import { LearnerLayout } from "@/components/learn/learner-layout";
import { QuizResultsContainer } from "@/components/quiz-results/quiz-results-container";
import { getCurrentUser } from "@/lib/auth";
import { getQuizResultsPageData } from "@/lib/queries/learner";
import { routes } from "@/lib/routes";

interface QuizResultsPageProps {
  params: Promise<{
    courseSlug: string;
    lessonSlug: string;
    attemptId: string;
  }>;
}

export async function generateMetadata({
  params,
}: QuizResultsPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const user = await getCurrentUser();

  if (!user) {
    return {
      title: "Quiz Results | Meritloom",
      robots: { index: false, follow: false },
    };
  }

  const { data } = await getQuizResultsPageData(
    user.id,
    resolvedParams.courseSlug,
    resolvedParams.lessonSlug,
    resolvedParams.attemptId,
  );

  if (!data) {
    return {
      title: "Results Not Found | Meritloom",
      robots: { index: false, follow: false },
    };
  }

  return {
    title: `Results: ${data.quiz.title} | ${data.course.title} | Meritloom`,
    description: `Scored ${data.attempt.correctCount} of ${data.attempt.totalQuestions} (${data.attempt.percent}%) on ${data.quiz.title}.`,
    robots: {
      index: false,
      follow: false,
    },
  };
}

/**
 * Meritloom Practice Quiz Results & Review — Page 11.
 * Route: /learn/courses/[courseSlug]/lessons/[lessonSlug]/results/[attemptId]
 *
 * Implements Figma Frame 5:115 — 13 Remediation Plan:
 * - Redesigned as supportive Quiz Results & Review workspace without gates
 * - Large result hero with circular score ring & supportive copy
 * - 3-column concept performance breakdown grid (Strong / Good progress / Review)
 * - Optional deterministic recommendations
 * - Detailed question-by-question answer review with filter pills and explanations
 * - Historical attempts review
 *
 * Protected route: requires authenticated session and ownership check.
 */
export default async function QuizResultsPage({
  params,
}: QuizResultsPageProps) {
  const user = await getCurrentUser();
  const resolvedParams = await params;

  if (!user) {
    redirect(
      `${routes.auth.signIn}?next=/learn/courses/${resolvedParams.courseSlug}/lessons/${resolvedParams.lessonSlug}/results/${resolvedParams.attemptId}`,
    );
  }

  const { data, isIncomplete } = await getQuizResultsPageData(
    user.id,
    resolvedParams.courseSlug,
    resolvedParams.lessonSlug,
    resolvedParams.attemptId,
  );

  // If the attempt is still in progress, redirect to the active quiz
  if (isIncomplete) {
    redirect(
      `/learn/courses/${resolvedParams.courseSlug}/lessons/${resolvedParams.lessonSlug}`,
    );
  }

  if (!data) {
    notFound();
  }

  return (
    <LearnerLayout user={user}>
      <div className="p-4 sm:p-6 lg:p-10">
        <QuizResultsContainer data={data} />
      </div>
    </LearnerLayout>
  );
}

