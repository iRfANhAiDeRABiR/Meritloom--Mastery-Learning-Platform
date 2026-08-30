import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";

import { LearnerLayout } from "@/components/learn/learner-layout";
import { ProfileSettingsLayout } from "@/components/profile/profile-settings-layout";
import { getCurrentUser } from "@/lib/auth";
import { getProfileSettingsData } from "@/lib/queries/profile";
import { routes } from "@/lib/routes";

export const metadata: Metadata = {
  title: "Profile & Settings | Meritloom",
  description: "Manage your profile and personalize how you learn on Meritloom.",
  robots: {
    index: false,
    follow: false,
  },
};

interface ProfilePageProps {
  searchParams: Promise<{
    tab?: string;
  }>;
}

/**
 * Meritloom Profile, Learning Preferences & Account Settings — Page 12.
 * Route: /profile
 *
 * Supports sections via URL query parameter:
 * - /profile?tab=profile (default)
 * - /profile?tab=learning
 * - /profile?tab=appearance
 * - /profile?tab=account
 *
 * Protected route: requires authenticated session.
 */
export default async function ProfilePage({ searchParams }: ProfilePageProps) {
  const user = await getCurrentUser();
  const resolvedSearchParams = await searchParams;

  if (!user) {
    redirect(`${routes.auth.signIn}?next=/profile`);
  }

  const data = await getProfileSettingsData(user.id, resolvedSearchParams.tab);

  if (!data) {
    notFound();
  }

  return (
    <LearnerLayout user={user}>
      <div className="p-4 sm:p-6 lg:p-10">
        <ProfileSettingsLayout data={data} />
      </div>
    </LearnerLayout>
  );
}

