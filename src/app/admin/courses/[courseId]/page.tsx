import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getAdminCategories,
  getAdminCourseDetail,
  getAdminSkills,
} from "@/lib/queries/admin";
import { CourseEditorShell } from "@/components/admin/course-editor/course-editor-shell";

export const metadata: Metadata = {
  title: "Edit Course | Meritloom Admin",
  robots: {
    index: false,
    follow: false,
  },
};

export const dynamic = "force-dynamic";

interface AdminCourseDetailPageProps {
  params: Promise<{
    courseId: string;
  }>;
}

export default async function AdminCourseDetailPage({
  params,
}: AdminCourseDetailPageProps) {
  const { courseId } = await params;

  const [course, categories, allSkills] = await Promise.all([
    getAdminCourseDetail(courseId),
    getAdminCategories(),
    getAdminSkills(),
  ]);

  if (!course) {
    notFound();
  }

  return (
    <CourseEditorShell
      course={course}
      categories={categories}
      allSkills={allSkills}
    />
  );
}
