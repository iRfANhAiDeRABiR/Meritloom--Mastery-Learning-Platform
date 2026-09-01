import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth/admin";
import {
  getAdminUserDetail,
  getAvailableCoursesForAssignment,
} from "@/lib/queries/users";
import { StaffDetailView } from "@/components/admin/staff/staff-detail-view";

export const metadata: Metadata = {
  title: "Configure Staff Member | Meritloom Admin",
  robots: {
    index: false,
    follow: false,
  },
};

export const dynamic = "force-dynamic";

interface StaffDetailPageProps {
  params: Promise<{
    staffId: string;
  }>;
}

export default async function AdminStaffDetailPage({ params }: StaffDetailPageProps) {
  await requireAdmin();
  const { staffId } = await params;

  const [staff, availableCourses] = await Promise.all([
    getAdminUserDetail(staffId),
    getAvailableCoursesForAssignment(),
  ]);

  if (!staff || staff.role === "learner") {
    notFound();
  }

  return <StaffDetailView staff={staff} availableCourses={availableCourses} />;
}
