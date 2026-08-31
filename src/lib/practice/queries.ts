import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getPracticeConfigForLesson } from "./defaults";
import type { PracticeConfig, PracticeStarterCode } from "./types";

export interface LessonPracticeSessionData {
  config: PracticeConfig;
  initialCode: PracticeStarterCode;
  hasDraft: boolean;
  lastSavedAt?: string;
}

/**
 * Loads the practice configuration and initial starter or saved draft code for a lesson.
 */
export async function getLessonPracticeData(
  userId: string,
  lessonId: string,
  courseSlug: string,
  lessonSlug: string,
  lessonTitle: string,
  customContentJson?: string | null,
): Promise<LessonPracticeSessionData> {
  const config = getPracticeConfigForLesson(
    courseSlug,
    lessonSlug,
    lessonTitle,
    customContentJson,
  );

  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return {
      config,
      initialCode: config.starterCode,
      hasDraft: false,
    };
  }

  try {
    const { data: draft } = await supabase
      .from("lesson_practice_drafts")
      .select("html_code, css_code, javascript_code, updated_at")
      .eq("user_id", userId)
      .eq("lesson_id", lessonId)
      .maybeSingle();

    if (draft) {
      return {
        config,
        initialCode: {
          html: draft.html_code ?? config.starterCode.html,
          css: draft.css_code ?? config.starterCode.css,
          javascript: draft.javascript_code ?? config.starterCode.javascript,
        },
        hasDraft: true,
        lastSavedAt: draft.updated_at,
      };
    }
  } catch {
    // If draft table is unpopulated, fallback gracefully to starter code
  }

  return {
    config,
    initialCode: config.starterCode,
    hasDraft: false,
  };
}
