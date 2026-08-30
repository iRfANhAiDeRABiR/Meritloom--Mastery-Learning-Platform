import { LearnerLayout } from "@/components/learn/learner-layout";
import { SettingsSkeleton } from "@/components/profile/settings-skeleton";
import { getCurrentUser } from "@/lib/auth";

export default async function ProfileLoading() {
  const user = await getCurrentUser();

  if (!user) {
    return (
      <div className="p-4 sm:p-6 lg:p-10">
        <SettingsSkeleton />
      </div>
    );
  }

  return (
    <LearnerLayout user={user}>
      <div className="p-4 sm:p-6 lg:p-10">
        <SettingsSkeleton />
      </div>
    </LearnerLayout>
  );
}

