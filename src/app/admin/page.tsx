import type { Metadata } from "next";
import { getAdminDashboardMetrics } from "@/lib/queries/admin";
import { AdminDashboardView } from "@/components/admin/admin-dashboard-view";

export const metadata: Metadata = {
  title: "Dashboard | Meritloom Admin",
  robots: {
    index: false,
    follow: false,
  },
};

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const metrics = await getAdminDashboardMetrics();

  return <AdminDashboardView metrics={metrics} />;
}
