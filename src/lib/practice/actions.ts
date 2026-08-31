"use server";

import { getCurrentUser } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const MAX_CODE_BYTES = 50 * 1024; // 50 KB limit per file

export interface SavePracticeDraftParams {
  lessonId: string;
  html: string;
  css: string;
  javascript: string;
}

/**
 * Saves or updates learner's in-progress practice code draft.
 */
export async function savePracticeDraftAction(
  params: SavePracticeDraftParams,
): Promise<{ success: boolean; error?: string; savedAt?: string }> {
  try {
    const user = await getCurrentUser();
    if (!user) return { success: false, error: "Authentication required." };

    const supabase = await createSupabaseServerClient();
    if (!supabase) return { success: false, error: "Database unavailable." };

    const { lessonId, html, css, javascript } = params;

    // Validate size limit (50 KB per language)
    if (
      (html && html.length > MAX_CODE_BYTES) ||
      (css && css.length > MAX_CODE_BYTES) ||
      (javascript && javascript.length > MAX_CODE_BYTES)
    ) {
      return {
        success: false,
        error: "Practice code exceeds the 50 KB per-file limit.",
      };
    }

    const now = new Date().toISOString();

    const { error } = await supabase
      .from("lesson_practice_drafts")
      .upsert(
        {
          user_id: user.id,
          lesson_id: lessonId,
          html_code: html || "",
          css_code: css || "",
          javascript_code: javascript || "",
          updated_at: now,
        },
        { onConflict: "user_id,lesson_id" },
      );

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, savedAt: now };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to save practice code.";
    return { success: false, error: msg };
  }
}

/**
 * Resets the practice draft by removing the learner's draft row so original starter code is restored.
 */
export async function resetPracticeDraftAction(
  lessonId: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    const user = await getCurrentUser();
    if (!user) return { success: false, error: "Authentication required." };

    const supabase = await createSupabaseServerClient();
    if (!supabase) return { success: false, error: "Database unavailable." };

    const { error } = await supabase
      .from("lesson_practice_drafts")
      .delete()
      .eq("user_id", user.id)
      .eq("lesson_id", lessonId);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to reset practice code.";
    return { success: false, error: msg };
  }
}
