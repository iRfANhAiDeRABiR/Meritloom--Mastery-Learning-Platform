import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getAdminAvailableCoursesForPath,
  getAdminLearningPathDetail,
} from "@/lib/queries/admin";
import { LearningPathEditorShell } from "@/components/admin/learning-paths/learning-path-editor-shell";

export const metadata: Metadata = {
  title: "Edit Learning Path | Meritloom Admin",
  robots: {
    index: false,
    follow: false,
  },
};

export const dynamic = "force-dynamic";

interface AdminLearningPathDetailPageProps {
  params: Promise<{
    pathId: string;
  }>;
}

export default async function AdminLearningPathDetailPage({
  params,
}: AdminLearningPathDetailPageProps) {
  const { pathId } = await params;

  const [path, availableCourses] = await Promise.all([
    getAdminLearningPathDetail(pathId),
    getAdminAvailableCoursesForPath(),
  ]);

  if (!path) {
    notFound();
  }

  return (
    <LearningPathEditorShell
      path={path}
      availableCourses={availableCourses}
    />
  );
}
