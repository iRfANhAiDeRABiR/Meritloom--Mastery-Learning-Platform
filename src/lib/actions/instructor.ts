"use server";

import { revalidatePath } from "next/cache";
import { requireInstructorSession } from "@/lib/auth/rbac";
import { createSupabaseServerClient } from "@/lib/supabase/server";

interface UpdateInstructorProfilePayload {
  professionalTitle?: string | null;
  bio?: string | null;
  websiteUrl?: string | null;
  githubUrl?: string | null;
  twitterUrl?: string | null;
  linkedinUrl?: string | null;
}

export async function updateInstructorProfileAction(
  payload: UpdateInstructorProfilePayload,
): Promise<{ success: boolean; error?: string }> {
  try {
    const session = await requireInstructorSession();
    const supabase = await createSupabaseServerClient();
    if (!supabase) {
      return { success: false, error: "Database unavailable" };
    }

    // 1. Update instructor_profiles row
    const { error: upsertError } = await supabase
      .from("instructor_profiles")
      .upsert(
        {
          user_id: session.user.id,
          professional_title: payload.professionalTitle?.trim() || null,
          bio: payload.bio?.trim() || null,
          website_url: payload.websiteUrl?.trim() || null,
          github_url: payload.githubUrl?.trim() || null,
          twitter_url: payload.twitterUrl?.trim() || null,
          linkedin_url: payload.linkedinUrl?.trim() || null,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id" },
      );

    if (upsertError) {
      console.error("Error updating instructor profile:", upsertError);
      return { success: false, error: "Failed to update instructor profile" };
    }

    revalidatePath("/instructor/profile");
    revalidatePath("/instructor");

    return { success: true };
  } catch (err) {
    console.error("Error in updateInstructorProfileAction:", err);
    return { success: false, error: "Unauthorized or internal error" };
  }
}

