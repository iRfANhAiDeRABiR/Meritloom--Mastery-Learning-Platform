"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";

export type SupportTopic =
  | "course"
  | "video"
  | "account"
  | "progress"
  | "learning_path"
  | "bug"
  | "content_feedback"
  | "general";

const VALID_TOPICS: SupportTopic[] = [
  "course",
  "video",
  "account",
  "progress",
  "learning_path",
  "bug",
  "content_feedback",
  "general",
];

export interface SupportActionState {
  success?: boolean;
  error?: string;
  fieldErrors?: {
    name?: string;
    email?: string;
    topic?: string;
    message?: string;
    pageUrl?: string;
  };
}

export async function submitSupportMessage(
  _prevState: SupportActionState,
  formData: FormData,
): Promise<SupportActionState> {
  // 1. Honeypot check for spam prevention
  const honeypot = (formData.get("website_hp") as string) || "";
  if (honeypot.trim().length > 0) {
    // Silently return success to avoid bot feedback loop
    return { success: true };
  }

  const name = ((formData.get("name") as string) || "").trim();
  const email = ((formData.get("email") as string) || "").trim().toLowerCase();
  const topic = ((formData.get("topic") as string) || "general").trim() as SupportTopic;
  const message = ((formData.get("message") as string) || "").trim();
  const pageUrl = ((formData.get("pageUrl") as string) || "").trim();

  const fieldErrors: SupportActionState["fieldErrors"] = {};

  // 2. Validate fields
  if (!name || name.length < 2) {
    fieldErrors.name = "Please enter your name (at least 2 characters).";
  } else if (name.length > 100) {
    fieldErrors.name = "Name must be 100 characters or fewer.";
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    fieldErrors.email = "Please provide a valid email address.";
  }

  if (!VALID_TOPICS.includes(topic)) {
    fieldErrors.topic = "Please select a valid support category.";
  }

  if (!message || message.length < 10) {
    fieldErrors.message = "Please describe your question or issue in at least 10 characters.";
  } else if (message.length > 5000) {
    fieldErrors.message = "Message must be 5,000 characters or fewer.";
  }

  if (pageUrl && pageUrl.length > 500) {
    fieldErrors.pageUrl = "Page URL must be 500 characters or fewer.";
  }

  if (Object.keys(fieldErrors).length > 0) {
    return {
      success: false,
      fieldErrors,
      error: "Please check the highlighted fields above.",
    };
  }

  // 3. Authenticate user if available
  const supabase = await createSupabaseServerClient();
  let userId: string | null = null;

  if (supabase) {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        userId = user.id;
      }
    } catch {
      // Anonymous submission is allowed
      userId = null;
    }
  }

  // 4. Save to Supabase
  if (supabase) {
    try {
      const { error: insertError } = await supabase.from("support_messages").insert({
        user_id: userId,
        name,
        email,
        topic,
        message,
        page_url: pageUrl || null,
        status: "new",
      });

      if (insertError) {
        console.warn("Could not insert support_message into Supabase:", insertError);
      }
    } catch (e) {
      console.warn("Exception writing support message to Supabase:", e);
    }
  }

  return {
    success: true,
  };
}
