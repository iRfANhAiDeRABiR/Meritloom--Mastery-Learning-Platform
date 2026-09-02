import { SettingsSkeleton } from "@/components/profile/settings-skeleton";

export default function ProfileLoading() {
  return (
    <div className="p-4 sm:p-6 lg:p-10">
      <SettingsSkeleton />
    </div>
  );
}
