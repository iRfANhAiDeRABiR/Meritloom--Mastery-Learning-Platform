import type { Metadata } from "next";
import { requireAdmin } from "@/lib/auth/admin";
import {
  getAdminStaffList,
  getAvailableCoursesForAssignment,
} from "@/lib/queries/users";
import { StaffListView } from "@/components/admin/staff/staff-list-view";

export const metadata: Metadata = {
  title: "Staff & Role Management | Meritloom Admin",
  robots: {
    index: false,
    follow: false,
  },
};

export const dynamic = "force-dynamic";

interface StaffPageProps {
  searchParams: Promise<{
    tab?: "all" | "sub_admins" | "instructors";
  }>;
}

export default async function AdminStaffPage({ searchParams }: StaffPageProps) {
  await requireAdmin();
  const params = await searchParams;
  const activeTab = params.tab || "all";

  const [staffMembers, availableCourses] = await Promise.all([
    getAdminStaffList({ tab: activeTab }),
    getAvailableCoursesForAssignment(),
  ]);

  return (
    <StaffListView
      staffMembers={staffMembers}
      availableCourses={availableCourses}
      activeTab={activeTab}
    />
  );
}

