"use client";

import { AccountTab } from "@/components/profile/account-tab";
import { AppearanceTab } from "@/components/profile/appearance-tab";
import { LearningPreferencesTab } from "@/components/profile/learning-preferences-tab";
import { ProfileTab } from "@/components/profile/profile-tab";
import { SettingsNavigation } from "@/components/profile/settings-navigation";
import type { ProfileSettingsData } from "@/lib/types";

interface ProfileSettingsLayoutProps {
  data: ProfileSettingsData;
}

export function ProfileSettingsLayout({ data }: ProfileSettingsLayoutProps) {
  const { profile, preferences, selectedCategoryIds, categories, provider, activeTab } = data;

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col gap-6 sm:gap-8 pb-16">
      {/* Header */}
      <div className="flex flex-col gap-1.5">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-ink">
          Profile & settings
        </h1>
        <p className="text-xs sm:text-sm text-muted max-w-2xl leading-relaxed">
          Manage your profile and personalize how you learn on Meritloom.
        </p>
      </div>

      {/* Main Settings Two-Column Layout */}
      <div className="flex flex-col md:flex-row gap-6 md:gap-10 items-start">
        {/* Left / Top Navigation */}
        <SettingsNavigation activeTab={activeTab} />

        {/* Right Settings Content Area */}
        <main className="w-full min-w-0 flex-1">
          {activeTab === "profile" && <ProfileTab profile={profile} />}

          {activeTab === "learning" && (
            <LearningPreferencesTab
              preferences={preferences}
              selectedCategoryIds={selectedCategoryIds}
              categories={categories}
            />
          )}

          {activeTab === "appearance" && <AppearanceTab />}

          {activeTab === "account" && (
            <AccountTab
              profile={profile}
              provider={provider}
            />
          )}
        </main>
      </div>
    </div>
  );
}

