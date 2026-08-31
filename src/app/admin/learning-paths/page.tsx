import type { Metadata } from "next";
import { getAdminLearningPathsList } from "@/lib/queries/admin";
import { AdminLearningPathsTable } from "@/components/admin/learning-paths/admin-learning-paths-table";

export const metadata: Metadata = {
  title: "Learning Paths | Meritloom Admin",
  robots: {
    index: false,
    follow: false,
  },
};

export const dynamic = "force-dynamic";

interface AdminLearningPathsPageProps {
  searchParams: Promise<{
    q?: string;
    status?: string;
  }>;
}

export default async function AdminLearningPathsPage({
  searchParams,
}: AdminLearningPathsPageProps) {
  const params = await searchParams;
  const paths = await getAdminLearningPathsList(params);

  return <AdminLearningPathsTable paths={paths} />;
}
