"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { LearnerOnboardingState } from "@/lib/types";

export interface OnboardingResult {
  success: boolean;
  error?: string;
  redirectUrl?: string;
}

/**
 * Server action to save onboarding choices for the authenticated learner.
 * Resilient: saves to user metadata and safely updates profile table if available.
 */
export async function saveOnboardingAction(
  data: LearnerOnboardingState,
): Promise<OnboardingResult> {
  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return {
      success: false,
      error: "Service is temporarily unavailable. Please try again.",
    };
  }

  try {
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return {
        success: false,
        error: "Please sign in to save your learning preferences.",
        redirectUrl: "/auth/sign-in?next=/onboarding",
      };
    }

    const payload = {
      onboarding_completed: true,
      onboarding_completed_at: new Date().toISOString(),
      learning_goal: data.goal,
      interests: data.interests,
      level_preference: data.notSureLevel ? null : data.level,
      study_pace: data.studyPace,
      content_preferences: data.contentPreferences,
      learning_reminders: data.reminders,
    };

    // 1. Update user auth metadata (always available)
    await supabase.auth.updateUser({
      data: payload,
    });

    // 2. Safely attempt to update profile record if profiles table exists
    try {
      await supabase
        .from("profiles")
        .update({
          onboarding_completed: true,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);
    } catch {
      // Ignore if profiles table is not yet migrated
    }

    return {
      success: true,
      redirectUrl: "/courses?recommended=true",
    };
  } catch {
    return {
      success: false,
      error: "Could not save your preferences. Please try again.",
    };
  }
}

