import { getCategories } from "@/lib/queries";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type {
  ContentPreference,
  CourseDifficulty,
  PrimaryLearningGoal,
  ProfileSettingsData,
  ProfileTabId,
  StudyPace,
} from "@/lib/types";

/**
 * Fetch all personalized data required for the Profile & Settings page.
 * Recovers safely from missing profile or preferences rows.
 */
export async function getProfileSettingsData(
  userId: string,
  tabQuery?: string,
): Promise<ProfileSettingsData | null> {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return null;

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user || user.id !== userId) return null;

    const email = user.email || "";

    // 1. Fetch or initialize profile
    let fullName =
      user.user_metadata?.full_name ||
      user.user_metadata?.name ||
      email.split("@")[0] ||
      "Learner";
    let avatarUrl: string | null =
      user.user_metadata?.avatar_url || user.user_metadata?.picture || null;
    let createdAt = user.created_at || new Date().toISOString();

    try {
      const { data: profileRow } = await supabase
        .from("profiles")
        .select("id, full_name, avatar_url, created_at")
        .eq("id", userId)
        .maybeSingle();

      if (profileRow) {
        fullName = profileRow.full_name || fullName;
        avatarUrl = profileRow.avatar_url || avatarUrl;
        createdAt = profileRow.created_at || createdAt;
      } else {
        // Automatically create missing profile row
        await supabase.from("profiles").upsert(
          {
            id: userId,
            full_name: fullName,
            avatar_url: avatarUrl,
            created_at: createdAt,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "id" },
        );
      }
    } catch {
      // Ignore
    }

    // 2. Fetch or default preferences
    let learningGoal: PrimaryLearningGoal | null = null;
    let levelPreference: CourseDifficulty | null = null;
    let preferredMinutesPerDay: number | null = null;
    let schedulePreference: StudyPace | null = null;
    let contentPreferences: ContentPreference[] = [];
    let learningReminders = false;

    try {
      const { data: prefRow } = await supabase
        .from("learner_preferences")
        .select(
          "learning_goal, level_preference, preferred_minutes_per_day, schedule_preference, content_preferences, learning_reminders",
        )
        .eq("user_id", userId)
        .maybeSingle();

      if (prefRow) {
        learningGoal = (prefRow.learning_goal as PrimaryLearningGoal) || null;
        levelPreference = (prefRow.level_preference as CourseDifficulty) || null;
        preferredMinutesPerDay = prefRow.preferred_minutes_per_day || null;
        schedulePreference = (prefRow.schedule_preference as StudyPace) || null;
        contentPreferences = (prefRow.content_preferences as ContentPreference[]) || [];
        learningReminders = Boolean(prefRow.learning_reminders);
      }
    } catch {
      // Ignore
    }

    // 3. Fetch learner interests
    let selectedCategoryIds: string[] = [];
    try {
      const { data: interestRows } = await supabase
        .from("learner_interests")
        .select("category_id")
        .eq("user_id", userId);

      if (interestRows && interestRows.length > 0) {
        selectedCategoryIds = interestRows.map((r) => r.category_id);
      }
    } catch {
      // Ignore
    }

    // 4. Fetch all active categories
    const categories = await getCategories();

    // 5. Determine auth provider
    let provider: "email" | "google" | "unknown" = "email";
    const appProvider = user.app_metadata?.provider;
    if (appProvider === "google") {
      provider = "google";
    } else if (user.identities && user.identities.some((i) => i.provider === "google")) {
      provider = "google";
    }

    // 6. Validate active tab
    const validTabs: ProfileTabId[] = ["profile", "learning", "appearance", "account"];
    const activeTab: ProfileTabId = validTabs.includes(tabQuery as ProfileTabId)
      ? (tabQuery as ProfileTabId)
      : "profile";

    return {
      profile: {
        id: userId,
        fullName,
        avatarUrl,
        email,
        createdAt,
      },
      preferences: {
        learningGoal,
        levelPreference,
        preferredMinutesPerDay,
        schedulePreference,
        contentPreferences,
        learningReminders,
      },
      selectedCategoryIds,
      categories,
      provider,
      activeTab,
    };
  } catch {
    return null;
  }
}

