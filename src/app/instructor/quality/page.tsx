import type { Metadata } from "next";
import { InstructorQualityView } from "@/components/instructor/instructor-quality-view";
import { requireInstructorSession } from "@/lib/auth/rbac";
import { getInstructorDashboardData } from "@/lib/queries/instructor";

export const metadata: Metadata = {
  title: "Course Quality Health | Instructor Studio | Meritloom",
  robots: {
    index: false,
    follow: false,
  },
};

export const dynamic = "force-dynamic";

export default async function InstructorQualityPage() {
  const session = await requireInstructorSession();
  const data = await getInstructorDashboardData(session.user.id);

  return (
    <InstructorQualityView
      issues={data.needsAttention}
    />
  );
}

