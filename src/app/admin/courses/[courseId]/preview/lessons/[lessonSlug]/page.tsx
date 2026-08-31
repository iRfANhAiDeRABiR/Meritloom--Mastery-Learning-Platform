import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAdminCourseDetail } from "@/lib/queries/admin";
import { LessonPreviewView } from "@/components/admin/lesson-preview-view";

export const metadata: Metadata = {
  title: "Preview Lesson | Meritloom Admin",
  robots: {
    index: false,
    follow: false,
  },
};

export const dynamic = "force-dynamic";

interface AdminLessonPreviewPageProps {
  params: Promise<{
    courseId: string;
    lessonSlug: string;
  }>;
}

export default async function AdminLessonPreviewPage({
  params,
}: AdminLessonPreviewPageProps) {
  const { courseId, lessonSlug } = await params;
  const course = await getAdminCourseDetail(courseId);

  if (!course) {
    notFound();
  }

  // Find the target lesson in course modules
  let targetLesson = null;
  for (const mod of course.modules) {
    const found = mod.lessons.find((l) => l.slug === lessonSlug);
    if (found) {
      targetLesson = found;
      break;
    }
  }

  if (!targetLesson) {
    notFound();
  }

  return <LessonPreviewView course={course} lesson={targetLesson} />;
}
