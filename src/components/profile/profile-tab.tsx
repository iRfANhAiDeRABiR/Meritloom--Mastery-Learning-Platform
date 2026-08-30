"use client";

import * as React from "react";
import { Check, Loader2 } from "lucide-react";

import { AvatarUploader } from "@/components/profile/avatar-uploader";
import { updateProfileNameAction } from "@/lib/actions/profile";
import type { ProfileSettingsData } from "@/lib/types";

interface ProfileTabProps {
  profile: ProfileSettingsData["profile"];
}

export function ProfileTab({ profile }: ProfileTabProps) {
  const [fullName, setFullName] = React.useState(profile.fullName);
  const [avatarUrl, setAvatarUrl] = React.useState<string | null>(profile.avatarUrl);
  const [isSaving, setIsSaving] = React.useState(false);
  const [saveStatus, setSaveStatus] = React.useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  const hasUnsavedChanges = fullName.trim() !== profile.fullName;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || isSaving) return;

    setIsSaving(true);
    setSaveStatus("idle");
    setErrorMessage(null);

    const result = await updateProfileNameAction({ fullName });

    if (result.success) {
      setSaveStatus("success");
      setTimeout(() => setSaveStatus("idle"), 3000);
    } else {
      setSaveStatus("error");
      setErrorMessage(result.error || "We couldn't save your profile. Please try again.");
    }

    setIsSaving(false);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-1 border-b border-line pb-4">
        <h2 className="text-xl sm:text-2xl font-bold text-ink">
          Your profile
        </h2>
        <p className="text-xs sm:text-sm text-muted">
          Update the information used across your Meritloom account.
        </p>
      </div>

      <form onSubmit={handleSave} className="flex flex-col gap-6">
        {/* Avatar Management */}
        <div className="rounded-[18px] border border-line bg-card p-5 sm:p-6 shadow-soft">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-muted mb-4 block">
            Profile Photo
          </span>
          <AvatarUploader
            currentAvatarUrl={avatarUrl}
            fullName={fullName || "Learner"}
            onAvatarChange={(newUrl) => setAvatarUrl(newUrl)}
          />
        </div>

        {/* Name & Email Fields */}
        <div className="rounded-[18px] border border-line bg-card p-5 sm:p-6 shadow-soft flex flex-col gap-5">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-muted block">
            Basic Information
          </span>

          {/* Full Name */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="profile-full-name" className="text-xs font-bold text-ink">
              Full name <span className="text-rose-500">*</span>
            </label>
            <input
              id="profile-full-name"
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Enter your full name"
              maxLength={100}
              className="h-11 sm:h-12 w-full rounded-xl border border-line bg-surface px-4 text-xs sm:text-sm font-semibold text-ink placeholder:text-muted/60 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>

          {/* Email (Read-only) */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label htmlFor="profile-email" className="text-xs font-bold text-ink">
                Email address
              </label>
              <span className="text-[11px] font-normal text-muted">
                Managed through your account
              </span>
            </div>
            <input
              id="profile-email"
              type="email"
              disabled
              value={profile.email}
              className="h-11 sm:h-12 w-full rounded-xl border border-line bg-surface/50 px-4 text-xs sm:text-sm font-semibold text-muted cursor-not-allowed select-all"
            />
          </div>
        </div>

        {/* Feedback Messages */}
        {saveStatus === "success" && (
          <div className="flex items-center gap-2 text-xs font-bold text-[#14895A] dark:text-[#74E0B8] bg-mint/30 border border-[#19B99A]/30 rounded-xl px-4 py-2.5 animate-in fade-in-0 duration-150">
            <Check className="size-4" aria-hidden="true" />
            <span>Profile updated successfully</span>
          </div>
        )}

        {saveStatus === "error" && errorMessage && (
          <div className="text-xs font-bold text-rose-500 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 rounded-xl px-4 py-2.5 animate-in fade-in-0 duration-150">
            {errorMessage}
          </div>
        )}

        {/* Save Button */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="submit"
            disabled={!hasUnsavedChanges || isSaving || !fullName.trim()}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-primary px-6 text-xs font-bold text-white shadow-soft transition-all duration-200 hover:bg-primary-hover hover:-translate-y-0.5 disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
          >
            {isSaving ? (
              <>
                <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                <span>Saving…</span>
              </>
            ) : (
              <span>Save changes</span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

