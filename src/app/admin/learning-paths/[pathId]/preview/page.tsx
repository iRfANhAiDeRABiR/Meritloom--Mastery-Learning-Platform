import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAdminLearningPathDetail } from "@/lib/queries/admin";
import { AdminLearningPathPreview } from "@/components/admin/learning-paths/admin-learning-path-preview";

export const metadata: Metadata = {
  title: "Preview Learning Path | Meritloom Admin",
  robots: {
    index: false,
    follow: false,
  },
};

export const dynamic = "force-dynamic";

interface AdminLearningPathPreviewPageProps {
  params: Promise<{
    pathId: string;
  }>;
}

export default async function AdminLearningPathPreviewPage({
  params,
}: AdminLearningPathPreviewPageProps) {
  const { pathId } = await params;
  const path = await getAdminLearningPathDetail(pathId);

  if (!path) {
    notFound();
  }

  return <AdminLearningPathPreview path={path} />;
}
