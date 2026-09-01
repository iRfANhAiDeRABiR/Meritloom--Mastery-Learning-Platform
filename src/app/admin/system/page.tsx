import type { Metadata } from "next";
import { Suspense } from "react";
import { requireAdmin } from "@/lib/auth/admin";
import { getFullSystemHealthDashboard } from "@/lib/system-health/queries";
import { SystemHealthView } from "@/components/admin/system/system-health-view";
import AdminSystemLoading from "./loading";

export const metadata: Metadata = {
  title: "System Health & Performance | Meritloom Admin",
  robots: {
    index: false,
    follow: false,
  },
};

export const dynamic = "force-dynamic";

export default async function AdminSystemPage() {
  await requireAdmin();

  const initialData = await getFullSystemHealthDashboard("24h");

  return (
    <Suspense fallback={<AdminSystemLoading />}>
      <SystemHealthView initialData={initialData} />
    </Suspense>
  );
}
