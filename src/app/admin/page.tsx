import type { Metadata } from "next";
import { AdminDashboardView } from "@/components/admin/admin-dashboard-view";
import { SubAdminDashboard } from "@/components/admin/dashboard/sub-admin-dashboard";
import { requireAdmin } from "@/lib/auth/admin";
import { getAdminDashboardMetrics } from "@/lib/queries/admin";
import { getSubAdminDashboardData } from "@/lib/queries/sub-admin";

export const metadata: Metadata = {
  title: "Dashboard | Meritloom Studio",
  robots: {
    index: false,
    follow: false,
  },
};

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const session = await requireAdmin();

  // Root Administrator: Full Studio Metrics
  if (session.profile.role === "admin") {
    const metrics = await getAdminDashboardMetrics();
    return <AdminDashboardView metrics={metrics} />;
  }

  // Sub-Administrator: Permission-Scoped Delegated Dashboard
  const subAdminData = await getSubAdminDashboardData(
    session.user.id,
    session.profile.permissions || [],
  );

  return <SubAdminDashboard data={subAdminData} />;
}
