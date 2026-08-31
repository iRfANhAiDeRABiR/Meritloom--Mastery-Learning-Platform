import { LearnerLayout } from "@/components/learn/learner-layout";
import { MyNotesSkeleton } from "@/components/notes/my-notes-skeleton";
import { getCurrentUser } from "@/lib/auth";

export default async function MyNotesLoadingPage() {
  const user = await getCurrentUser();

  const fallbackUser = user || {
    id: "",
    name: "Learner",
    avatarUrl: null,
    email: null,
    onboardingCompleted: true,
  };

  return (
    <LearnerLayout user={fallbackUser}>
      <div className="p-4 sm:p-6 lg:p-10">
        <MyNotesSkeleton />
      </div>
    </LearnerLayout>
  );
}
