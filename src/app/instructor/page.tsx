import type { Metadata } from "next";
import { InstructorDashboardView } from "@/components/instructor/instructor-dashboard-view";
import { requireInstructorSession } from "@/lib/auth/rbac";
import { getInstructorDashboardData } from "@/lib/queries/instructor";

export const metadata: Metadata = {
  title: "Dashboard | Instructor Studio | Meritloom",
  robots: {
    index: false,
    follow: false,
  },
};

export const dynamic = "force-dynamic";

export default async function InstructorDashboardPage() {
  const session = await requireInstructorSession();
  const data = await getInstructorDashboardData(session.user.id);

  return <InstructorDashboardView data={data} />;
}

