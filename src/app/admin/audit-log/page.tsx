import type { Metadata } from "next";
import { requireAdmin } from "@/lib/auth/admin";
import { getAdminAuditLogs } from "@/lib/queries/users";
import { AuditLogView } from "@/components/admin/audit/audit-log-view";

export const metadata: Metadata = {
  title: "Administrative Audit Log | Meritloom Admin",
  robots: {
    index: false,
    follow: false,
  },
};

export const dynamic = "force-dynamic";

interface AuditLogPageProps {
  searchParams: Promise<{
    action?: string;
    target?: string;
    page?: string;
  }>;
}

export default async function AdminAuditLogPage({ searchParams }: AuditLogPageProps) {
  await requireAdmin();
  const params = await searchParams;
  const page = params.page ? parseInt(params.page, 10) : 1;

  const { logs, totalCount, totalPages } = await getAdminAuditLogs({
    action: params.action,
    targetType: params.target,
    page,
    limit: 30,
  });

  return (
    <AuditLogView
      logs={logs}
      totalCount={totalCount}
      currentPage={page}
      totalPages={totalPages}
    />
  );
}

