import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAdminCourseDetail } from "@/lib/queries/admin";
import { CoursePreviewView } from "@/components/admin/course-preview-view";

export const metadata: Metadata = {
  title: "Preview Course | Meritloom Admin",
  robots: {
    index: false,
    follow: false,
  },
};

export const dynamic = "force-dynamic";

interface AdminCoursePreviewPageProps {
  params: Promise<{
    courseId: string;
  }>;
}

export default async function AdminCoursePreviewPage({
  params,
}: AdminCoursePreviewPageProps) {
  const { courseId } = await params;
  const course = await getAdminCourseDetail(courseId);

  if (!course) {
    notFound();
  }

  return <CoursePreviewView course={course} />;
}
