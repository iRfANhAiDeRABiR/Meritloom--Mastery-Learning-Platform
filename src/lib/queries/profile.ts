import { getCategories } from "@/lib/queries";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getUserAuthMethods } from "@/lib/auth/methods";
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

    // 1. Fetch profile, preferences, interests, and categories concurrently in parallel
    const [profileRes, prefRes, interestRes, categories] = await Promise.all([
      supabase
        .from("profiles")
        .select("id, full_name, avatar_url, created_at")
        .eq("id", userId)
        .maybeSingle(),
      supabase
        .from("learner_preferences")
        .select(
          "learning_goal, level_preference, preferred_minutes_per_day, schedule_preference, content_preferences, learning_reminders",
        )
        .eq("user_id", userId)
        .maybeSingle(),
      supabase
        .from("learner_interests")
        .select("category_id")
        .eq("user_id", userId),
      getCategories(),
    ]);

    const profileRow = profileRes.data;
    const fullName =
      profileRow?.full_name ||
      user.user_metadata?.full_name ||
      user.user_metadata?.name ||
      email.split("@")[0] ||
      "Learner";
    const avatarUrl: string | null =
      profileRow?.avatar_url ||
      user.user_metadata?.avatar_url ||
      user.user_metadata?.picture ||
      null;
    const createdAt = profileRow?.created_at || user.created_at || new Date().toISOString();

    if (!profileRow) {
      // Create missing profile row asynchronously in background
      void supabase
        .from("profiles")
        .upsert(
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

    // 2. Preferences
    const prefRow = prefRes.data;
    const learningGoal: PrimaryLearningGoal | null =
      (prefRow?.learning_goal as PrimaryLearningGoal) || null;
    const levelPreference: CourseDifficulty | null =
      (prefRow?.level_preference as CourseDifficulty) || null;
    const preferredMinutesPerDay: number | null =
      prefRow?.preferred_minutes_per_day || null;
    const schedulePreference: StudyPace | null =
      (prefRow?.schedule_preference as StudyPace) || null;
    const contentPreferences: ContentPreference[] =
      (prefRow?.content_preferences as ContentPreference[]) || [];
    const learningReminders = Boolean(prefRow?.learning_reminders);

    // 3. Learner interests
    const selectedCategoryIds: string[] = (interestRes.data || []).map(
      (r) => r.category_id,
    );

    // 4. Determine auth methods & providers from trusted state
    const authMethods = getUserAuthMethods(user);

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
      provider: authMethods.primaryProvider,
      hasPassword: authMethods.hasPassword,
      hasGoogle: authMethods.hasGoogle,
      activeTab,
    };
  } catch {
    return null;
  }
}

