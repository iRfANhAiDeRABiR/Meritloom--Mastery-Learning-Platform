"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";

/**
 * Save or update a private lesson note with debounced autosave.
 * Deletes the record if content is empty.
 */
export async function saveLessonNoteAction(
  lessonId: string,
  content: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    const user = await getCurrentUser();
    if (!user) return { success: false, error: "Authentication required." };

    const supabase = await createSupabaseServerClient();
    if (!supabase) return { success: false, error: "Database unavailable." };

    const trimmed = (content || "").trim();

    if (!trimmed) {
      // Delete note row if content is cleared
      await supabase
        .from("lesson_notes")
        .delete()
        .eq("user_id", user.id)
        .eq("lesson_id", lessonId);

      revalidatePath("/learn/notes");
      return { success: true };
    }

    if (trimmed.length > 10000) {
      return {
        success: false,
        error: "Note exceeds maximum limit of 10,000 characters.",
      };
    }

    const { error } = await supabase
      .from("lesson_notes")
      .upsert(
        {
          user_id: user.id,
          lesson_id: lessonId,
          content: trimmed,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id,lesson_id" },
      );

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath("/learn/notes");
    return { success: true };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to save note.";
    return { success: false, error: msg };
  }
}

/**
 * Delete a private lesson note.
 */
export async function deleteLessonNoteAction(
  lessonId: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    const user = await getCurrentUser();
    if (!user) return { success: false, error: "Authentication required." };

    const supabase = await createSupabaseServerClient();
    if (!supabase) return { success: false, error: "Database unavailable." };

    const { error } = await supabase
      .from("lesson_notes")
      .delete()
      .eq("user_id", user.id)
      .eq("lesson_id", lessonId);

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath("/learn/notes");
    return { success: true };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to delete note.";
    return { success: false, error: msg };
  }
}

/**
 * Toggle bookmark state for a specific lesson.
 */
export async function toggleLessonBookmarkAction(
  lessonId: string,
): Promise<{ success: boolean; isBookmarked: boolean; error?: string }> {
  try {
    const user = await getCurrentUser();
    if (!user) return { success: false, isBookmarked: false, error: "Authentication required." };

    const supabase = await createSupabaseServerClient();
    if (!supabase) return { success: false, isBookmarked: false, error: "Database unavailable." };

    const { data: existing } = await supabase
      .from("lesson_bookmarks")
      .select("id")
      .eq("user_id", user.id)
      .eq("lesson_id", lessonId)
      .maybeSingle();

    if (existing) {
      await supabase
        .from("lesson_bookmarks")
        .delete()
        .eq("user_id", user.id)
        .eq("lesson_id", lessonId);

      revalidatePath("/learn/notes");
      return { success: true, isBookmarked: false };
    } else {
      await supabase.from("lesson_bookmarks").insert({
        user_id: user.id,
        lesson_id: lessonId,
      });

      revalidatePath("/learn/notes");
      return { success: true, isBookmarked: true };
    }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to toggle bookmark.";
    return { success: false, isBookmarked: false, error: msg };
  }
}
