import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";

import { LearnerLayout } from "@/components/learn/learner-layout";
import { LessonPlayerWrapper } from "@/components/lesson/lesson-player-wrapper";
import { PracticeQuiz } from "@/components/quiz/practice-quiz";
import { getCurrentUser } from "@/lib/auth";
import {
  getLessonPlayerData,
  getPracticeQuizData,
} from "@/lib/queries/learner";
import { routes } from "@/lib/routes";

interface LessonPlayerPageProps {
  params: Promise<{
    courseSlug: string;
    lessonSlug: string;
  }>;
}

export async function generateMetadata({
  params,
}: LessonPlayerPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const user = await getCurrentUser();

  if (!user) {
    return {
      title: "Lesson | Meritloom",
      robots: { index: false, follow: false },
    };
  }

  const data = await getLessonPlayerData(
    user.id,
    resolvedParams.courseSlug,
    resolvedParams.lessonSlug,
  );

  if (!data) {
    return {
      title: "Lesson Not Found | Meritloom",
      robots: { index: false, follow: false },
    };
  }

  const isQuiz =
    data.currentLesson.lessonType === "knowledge_check" ||
    data.currentLesson.lessonType === "quiz";

  return {
    title: `${data.currentLesson.title} ${
      isQuiz ? "Knowledge Check" : ""
    } | ${data.course.title} | Meritloom`,
    description: data.currentLesson.summary || data.course.title,
    robots: {
      index: false,
      follow: false,
    },
  };
}

/**
 * Meritloom Lesson Player & Practice Quiz — Pages 9 & 10.
 * Route: /learn/courses/[courseSlug]/lessons/[lessonSlug]
 *
 * Implements:
 * - Page 9: Figma Frame 4:279 — 10 Lesson Player (video / article / exercise)
 * - Page 10: Figma Frame 5:60 — 12 Knowledge Check (optional practice quiz, zero-gate learning)
 *
 * Protected route: requires authenticated session.
 */
export default async function LessonPlayerPage({
  params,
}: LessonPlayerPageProps) {
  const user = await getCurrentUser();
  const resolvedParams = await params;

  if (!user) {
    redirect(
      `${routes.auth.signIn}?next=/learn/courses/${resolvedParams.courseSlug}/lessons/${resolvedParams.lessonSlug}`,
    );
  }

  const data = await getLessonPlayerData(
    user.id,
    resolvedParams.courseSlug,
    resolvedParams.lessonSlug,
  );

  if (!data) {
    notFound();
  }

  // If this lesson is a knowledge check or quiz, render the Practice Quiz experience
  if (
    data.currentLesson.lessonType === "knowledge_check" ||
    data.currentLesson.lessonType === "quiz"
  ) {
    const quizData = await getPracticeQuizData(
      user.id,
      resolvedParams.courseSlug,
      resolvedParams.lessonSlug,
    );

    if (!quizData) {
      notFound();
    }

    return (
      <LearnerLayout user={user}>
        <div className="p-4 sm:p-6 lg:p-10">
          <PracticeQuiz data={quizData} />
        </div>
      </LearnerLayout>
    );
  }

  // Standard video/article/exercise lesson player
  return <LessonPlayerWrapper data={data} user={user} />;
}
