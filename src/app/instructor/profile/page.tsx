import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { InstructorProfileView } from "@/components/instructor/instructor-profile-view";
import { requireInstructorSession } from "@/lib/auth/rbac";
import { getInstructorProfile } from "@/lib/queries/instructor";

export const metadata: Metadata = {
  title: "Profile | Instructor Studio | Meritloom",
  robots: {
    index: false,
    follow: false,
  },
};

export const dynamic = "force-dynamic";

export default async function InstructorProfilePage() {
  const session = await requireInstructorSession();
  const profile = await getInstructorProfile(session.user.id);

  if (!profile) {
    notFound();
  }

  return <InstructorProfileView initialProfile={profile} />;
}

