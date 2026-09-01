"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type {
  ContentPreference,
  CourseDifficulty,
  PrimaryLearningGoal,
  StudyPace,
} from "@/lib/types";

const MAX_AVATAR_SIZE = 5 * 1024 * 1024; // 5 MB
const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"];

/**
 * Update user's full name.
 */
export async function updateProfileNameAction(params: {
  fullName: string;
}): Promise<{ success: boolean; error?: string }> {
  const trimmed = params.fullName?.trim();
  if (!trimmed || trimmed.length < 1) {
    return { success: false, error: "Please enter your full name." };
  }
  if (trimmed.length > 100) {
    return { success: false, error: "Name must be under 100 characters." };
  }

  const supabase = await createSupabaseServerClient();
  if (!supabase) return { success: false, error: "Service unavailable." };

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return { success: false, error: "Please sign in." };

    // 1. Update profiles table
    const { error: profileError } = await supabase
      .from("profiles")
      .update({
        full_name: trimmed,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id);

    if (profileError) {
      return { success: false, error: "We couldn't save your profile." };
    }

    // 2. Sync with auth user_metadata
    try {
      await supabase.auth.updateUser({
        data: { full_name: trimmed },
      });
    } catch {
      // Ignore metadata sync error
    }

    revalidatePath("/profile");
    revalidatePath("/learn");
    revalidatePath("/learn/courses");

    return { success: true };
  } catch {
    return { success: false, error: "We couldn't save your profile. Please try again." };
  }
}

/**
 * Upload an avatar image to Supabase Storage and update profile.
 */
export async function uploadAvatarAction(
  formData: FormData,
): Promise<{ success: boolean; avatarUrl?: string; error?: string }> {
  const file = formData.get("avatar") as File | null;
  if (!file) {
    return { success: false, error: "Please select an image file." };
  }

  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    return {
      success: false,
      error: "Unsupported file format. Please upload a JPG, PNG, or WebP image.",
    };
  }

  if (file.size > MAX_AVATAR_SIZE) {
    return {
      success: false,
      error: "Image size must be 5 MB or smaller.",
    };
  }

  const supabase = await createSupabaseServerClient();
  if (!supabase) return { success: false, error: "Service unavailable." };

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return { success: false, error: "Please sign in." };

    // Sanitized file extension
    const extension = file.type.split("/")[1] || "png";
    const fileName = `${user.id}/${Date.now()}.${extension}`;

    // Upload to Supabase Storage 'avatars' bucket
    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(fileName, file, {
        cacheControl: "3600",
        upsert: true,
      });

    if (uploadError) {
      return { success: false, error: "We couldn't upload that image." };
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from("avatars")
      .getPublicUrl(fileName);

    const publicUrl = urlData.publicUrl;

    // Update profile
    await supabase
      .from("profiles")
      .update({
        avatar_url: publicUrl,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id);

    try {
      await supabase.auth.updateUser({
        data: { avatar_url: publicUrl },
      });
    } catch {
      // Ignore
    }

    revalidatePath("/profile");
    revalidatePath("/learn");

    return { success: true, avatarUrl: publicUrl };
  } catch {
    return { success: false, error: "We couldn't upload that image." };
  }
}

/**
 * Remove avatar photo from profile.
 */
export async function removeAvatarAction(): Promise<{
  success: boolean;
  error?: string;
}> {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return { success: false, error: "Service unavailable." };

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return { success: false, error: "Please sign in." };

    await supabase
      .from("profiles")
      .update({
        avatar_url: null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id);

    try {
      await supabase.auth.updateUser({
        data: { avatar_url: null },
      });
    } catch {
      // Ignore
    }

    revalidatePath("/profile");
    revalidatePath("/learn");

    return { success: true };
  } catch {
    return { success: false, error: "We couldn't remove your photo." };
  }
}

/**
 * Update user's learning preferences and interests.
 */
export async function updateLearningPreferencesAction(params: {
  selectedCategoryIds: string[];
  learningGoal: PrimaryLearningGoal | null;
  levelPreference: CourseDifficulty | null;
  studyPace: StudyPace | null;
  contentPreferences: ContentPreference[];
  learningReminders: boolean;
}): Promise<{ success: boolean; error?: string }> {
  const {
    selectedCategoryIds,
    learningGoal,
    levelPreference,
    studyPace,
    contentPreferences,
    learningReminders,
  } = params;

  // Enforce max 5 interests
  const sanitizedCategories = (selectedCategoryIds || []).slice(0, 5);

  let preferredMinutes: number | null = null;
  if (studyPace === "15_min") preferredMinutes = 15;
  else if (studyPace === "30_min") preferredMinutes = 30;
  else if (studyPace === "45_min") preferredMinutes = 45;
  else if (studyPace === "60_min") preferredMinutes = 60;

  const supabase = await createSupabaseServerClient();
  if (!supabase) return { success: false, error: "Service unavailable." };

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return { success: false, error: "Please sign in." };

    // 1. Upsert learner_preferences
    const { error: prefError } = await supabase.from("learner_preferences").upsert(
      {
        user_id: user.id,
        learning_goal: learningGoal,
        level_preference: levelPreference,
        preferred_minutes_per_day: preferredMinutes,
        schedule_preference: studyPace,
        content_preferences: contentPreferences || [],
        learning_reminders: learningReminders,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id" },
    );

    if (prefError) {
      return {
        success: false,
        error: "We couldn't update your learning preferences.",
      };
    }

    // 2. Sync learner_interests
    try {
      // Delete existing interests
      await supabase
        .from("learner_interests")
        .delete()
        .eq("user_id", user.id);

      // Insert new interests
      if (sanitizedCategories.length > 0) {
        const rows = sanitizedCategories.map((catId) => ({
          user_id: user.id,
          category_id: catId,
        }));
        await supabase.from("learner_interests").insert(rows);
      }
    } catch {
      // Ignore interest sync table error if not present
    }

    revalidatePath("/profile");
    revalidatePath("/learn");
    revalidatePath("/learn/courses");

    return { success: true };
  } catch {
    return {
      success: false,
      error: "We couldn't update your learning preferences.",
    };
  }
}

/**
 * Update user's password securely via Supabase Auth.
 */
export async function updatePasswordAction(params: {
  newPassword: string;
}): Promise<{ success: boolean; error?: string }> {
  const { newPassword } = params;

  if (!newPassword || newPassword.length < 8) {
    return {
      success: false,
      error: "Password must be at least 8 characters long.",
    };
  }

  const supabase = await createSupabaseServerClient();
  if (!supabase) return { success: false, error: "Service unavailable." };

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return { success: false, error: "Please sign in." };

    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      return {
        success: false,
        error: error.message || "We couldn't update your password.",
      };
    }

    return { success: true };
  } catch {
    return { success: false, error: "We couldn't update your password." };
  }
}

/**
 * Delete account securely server-side.
 */
export async function deleteAccountAction(params: {
  confirmationText: string;
}): Promise<{ success: boolean; error?: string }> {
  if (params.confirmationText !== "DELETE") {
    return {
      success: false,
      error: "Please type DELETE in capital letters to confirm.",
    };
  }

  const supabase = await createSupabaseServerClient();
  if (!supabase) return { success: false, error: "Service unavailable." };

  try {
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: false, error: "Please sign in to delete your account." };
    }

    // 1. Attempt to invoke complete delete_user_account RPC
    const { error: rpcError } = await supabase.rpc("delete_user_account");

    if (rpcError) {
      console.warn(
        "[deleteAccountAction] RPC delete_user_account not found or failed, deleting profile directly:",
        rpcError.message,
      );

      // 2. Fallback to direct profile delete (cascades to enrollments, notes, bookmarks, drafts)
      const { error: profileDeleteError } = await supabase
        .from("profiles")
        .delete()
        .eq("id", user.id);

      if (profileDeleteError) {
        console.error(
          "[deleteAccountAction] Failed to delete profile:",
          profileDeleteError.message,
        );
        return {
          success: false,
          error: "Failed to delete account. Please try again.",
        };
      }
    }

    // 3. Sign out session cleanly
    await supabase.auth.signOut();

    return { success: true };
  } catch (err) {
    console.error("[deleteAccountAction] Unexpected exception during account deletion:", err);
    return { success: false, error: "Failed to delete account. Please try again." };
  }
}

