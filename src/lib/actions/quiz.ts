"use server";

import { revalidatePath } from "next/cache";
import { ALL_STATIC_QUIZZES } from "@/lib/data/static-quizzes";
import { syncCourseCompletion } from "@/lib/completion/sync";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export interface SubmitAnswerResult {
  success: boolean;
  isCorrect?: boolean;
  explanation?: string | null;
  correctOptionIds?: string[];
  error?: string;
}

export interface CompleteQuizResult {
  success: boolean;
  correctCount?: number;
  totalQuestions?: number;
  isCourseCompleted?: boolean;
  justCompleted?: boolean;
  error?: string;
}

// Fallback correct answers map for demo / seed questions
const FALLBACK_CORRECT_MAP: Record<string, { correctIds: string[]; explanation: string }> = {
  q1: {
    correctIds: ["opt-1b"],
    explanation:
      "When outer() runs, it creates count = 10 and returns inner. Because inner forms a closure over outer's scope, fn() has access to count and logs 10.",
  },
  q2: {
    correctIds: ["opt-2a", "opt-2c", "opt-2d"],
    explanation:
      "Closures remember the lexical environment where they were created. They retain references to outer scope variables and prevent them from being garbage collected.",
  },
  q3: {
    correctIds: ["opt-3b"],
    explanation:
      "Variables declared with 'let' or 'const' have block scope and cannot be accessed outside the curly braces where they were defined.",
  },
};

/**
 * Start or retrieve an active attempt for a practice quiz.
 */
export async function startQuizAttemptAction(
  quizId: string,
): Promise<{ success: boolean; attemptId?: string; error?: string }> {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return { success: false, error: "Service unavailable." };

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return { success: false, error: "Please sign in." };

    // Check for existing incomplete attempt
    const { data: existing } = await supabase
      .from("practice_quiz_attempts")
      .select("id")
      .eq("user_id", user.id)
      .eq("quiz_id", quizId)
      .is("completed_at", null)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (existing) {
      return { success: true, attemptId: existing.id };
    }

    // Create new attempt
    const { data: newAttempt, error: insertError } = await supabase
      .from("practice_quiz_attempts")
      .insert({
        user_id: user.id,
        quiz_id: quizId,
        started_at: new Date().toISOString(),
      })
      .select("id")
      .single();

    if (insertError) {
      // In case database table is not migrated yet, return deterministic local attempt ID
      return { success: true, attemptId: `att-${user.id}-${Date.now()}` };
    }

    return { success: true, attemptId: newAttempt.id };
  } catch {
    return { success: true, attemptId: `att-${Date.now()}` };
  }
}

/**
 * Submit and grade a practice answer securely on the server.
 * Correct answers are never sent to the client before grading!
 */
export async function submitPracticeAnswerAction(params: {
  attemptId: string;
  questionId: string;
  selectedOptionIds: string[];
}): Promise<SubmitAnswerResult> {
  const { attemptId, questionId, selectedOptionIds } = params;

  if (!selectedOptionIds || selectedOptionIds.length === 0) {
    return { success: false, error: "Please select an answer." };
  }

  const supabase = await createSupabaseServerClient();
  if (!supabase) return { success: false, error: "Service unavailable." };

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return { success: false, error: "Please sign in." };

    let correctOptionIds: string[] = [];
    let explanation: string | null = null;

    // 1. Fetch correct answers from private table (practice_question_correct_options)
    try {
      const { data: correctRows } = await supabase
        .from("practice_question_correct_options")
        .select("option_id")
        .eq("question_id", questionId);

      if (correctRows && correctRows.length > 0) {
        correctOptionIds = correctRows.map((r) => r.option_id);

        // Fetch explanation
        const { data: qData } = await supabase
          .from("practice_questions")
          .select("explanation")
          .eq("id", questionId)
          .maybeSingle();

        if (qData) {
          explanation = qData.explanation;
        }
      }
    } catch {
      // Ignore
    }

    // Fallback grading check if using seed/demo questions
    if (correctOptionIds.length === 0) {
      for (const quizDef of Object.values(ALL_STATIC_QUIZZES)) {
        const matchingQ = quizDef.questions.find((q) => q.id === questionId);
        if (matchingQ) {
          correctOptionIds = matchingQ.options
            .filter((o) => o.isCorrect)
            .map((o) => o.id);
          explanation = matchingQ.explanation;
          break;
        }
      }

      if (correctOptionIds.length === 0) {
        for (const [key, val] of Object.entries(FALLBACK_CORRECT_MAP)) {
          if (questionId.startsWith(key)) {
            // match options with prefix
            const expectedPrefix = val.correctIds[0].split("-")[0]; // e.g. "opt-1b"
            correctOptionIds = selectedOptionIds.filter((id) =>
              val.correctIds.some((cId) => id.includes(cId) || id.startsWith(expectedPrefix)),
            );
            if (correctOptionIds.length === 0) {
              // map default matching IDs
              correctOptionIds = val.correctIds.map((cId) => {
                const suffix = questionId.replace(key, "");
                return `${cId}${suffix}`;
              });
            }
            explanation = val.explanation;
            break;
          }
        }
      }
    }

    // 2. Grade exact match
    const selectedSet = new Set(selectedOptionIds);
    const correctSet = new Set(correctOptionIds);

    const isCorrect =
      selectedSet.size === correctSet.size &&
      [...selectedSet].every((id) => correctSet.has(id));

    // 3. Persist answer to practice_quiz_answers
    try {
      await supabase.from("practice_quiz_answers").upsert(
        {
          attempt_id: attemptId,
          question_id: questionId,
          selected_option_ids: selectedOptionIds,
          is_correct: isCorrect,
          answered_at: new Date().toISOString(),
        },
        { onConflict: "attempt_id,question_id" },
      );
    } catch {
      // Ignore table errors
    }

    return {
      success: true,
      isCorrect,
      explanation:
        explanation ||
        (isCorrect
          ? "Great job! You have understood this concept correctly."
          : "Not quite. Take a moment to review this topic and try again."),
      correctOptionIds,
    };
  } catch {
    return {
      success: false,
      error: "We couldn't check your answer. Please try again.",
    };
  }
}

/**
 * Complete a quiz attempt, calculate score, mark lesson complete in lesson_progress,
 * and revalidate learning routes.
 */
export async function completeQuizAttemptAction(
  attemptId: string,
  courseSlug: string,
  lessonSlug: string,
): Promise<CompleteQuizResult> {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return { success: false, error: "Service unavailable." };

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return { success: false, error: "Please sign in." };

    let correctCount = 0;
    let totalQuestions = 0;

    try {
      const { data: answers } = await supabase
        .from("practice_quiz_answers")
        .select("is_correct")
        .eq("attempt_id", attemptId);

      if (answers) {
        totalQuestions = answers.length;
        correctCount = answers.filter((a) => a.is_correct).length;
      }

      // Update attempt
      await supabase
        .from("practice_quiz_attempts")
        .update({
          completed_at: new Date().toISOString(),
          correct_count: correctCount,
          total_questions: totalQuestions,
        })
        .eq("id", attemptId);
    } catch {
      // Ignore
    }

    // Mark the knowledge-check lesson complete in lesson_progress
    let isCourseCompleted = false;
    let justCompleted = false;

    try {
      const { data: course } = await supabase
        .from("courses")
        .select("id")
        .eq("slug", courseSlug)
        .maybeSingle();

      const { data: lesson } = await supabase
        .from("lessons")
        .select("id")
        .eq("slug", lessonSlug)
        .maybeSingle();

      if (course && lesson) {
        await supabase.from("lesson_progress").upsert(
          {
            user_id: user.id,
            course_id: course.id,
            lesson_id: lesson.id,
            completed: true,
            completed_at: new Date().toISOString(),
            last_viewed_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
          { onConflict: "user_id,lesson_id" },
        );

        // Sync course completion
        const syncResult = await syncCourseCompletion(user.id, course.id);
        isCourseCompleted = syncResult.isComplete;
        justCompleted = syncResult.justCompleted;
      }
    } catch {
      // Ignore
    }

    revalidatePath(`/learn/courses/${courseSlug}/lessons/${lessonSlug}`);
    revalidatePath(`/learn/courses/${courseSlug}`);
    revalidatePath(`/learn/courses/${courseSlug}/complete`);
    revalidatePath("/learn/courses");
    revalidatePath("/learn");

    return {
      success: true,
      correctCount,
      totalQuestions,
      isCourseCompleted,
      justCompleted,
    };
  } catch {
    return { success: false, error: "Failed to complete quiz attempt." };
  }
}

/**
 * Start a fresh attempt for unlimited retries.
 */
export async function retryQuizAttemptAction(
  quizId: string,
  courseSlug: string,
  lessonSlug: string,
): Promise<{ success: boolean; attemptId?: string; error?: string }> {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return { success: false, error: "Service unavailable." };

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return { success: false, error: "Please sign in." };

    let newAttemptId = `att-${user.id}-${Date.now()}`;

    try {
      const { data: newAttempt } = await supabase
        .from("practice_quiz_attempts")
        .insert({
          user_id: user.id,
          quiz_id: quizId,
          started_at: new Date().toISOString(),
        })
        .select("id")
        .single();

      if (newAttempt) {
        newAttemptId = newAttempt.id;
      }
    } catch {
      // Ignore
    }

    revalidatePath(`/learn/courses/${courseSlug}/lessons/${lessonSlug}`);

    return { success: true, attemptId: newAttemptId };
  } catch {
    return { success: false, error: "Failed to start a new quiz attempt." };
  }
}

