import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CourseEditorShell } from "@/components/admin/course-editor/course-editor-shell";
import { requireInstructorForCourse } from "@/lib/auth/rbac";
import {
  getAdminCategories,
  getAdminCourseDetail,
  getAdminInstructorsList,
  getAdminSkills,
} from "@/lib/queries/admin";

export const metadata: Metadata = {
  title: "Edit Course | Instructor Studio | Meritloom",
  robots: {
    index: false,
    follow: false,
  },
};

export const dynamic = "force-dynamic";

interface InstructorCourseDetailPageProps {
  params: Promise<{
    courseId: string;
  }>;
}

export default async function InstructorCourseDetailPage({
  params,
}: InstructorCourseDetailPageProps) {
  const { courseId } = await params;

  // 1. Enforce strict server-side authorization (Assigned Instructor, Authorized Sub-Admin, or Root Admin)
  const session = await requireInstructorForCourse(courseId);

  // 2. Fetch course details and metadata
  const [course, categories, allSkills, instructors] = await Promise.all([
    getAdminCourseDetail(courseId),
    getAdminCategories(),
    getAdminSkills(),
    getAdminInstructorsList(),
  ]);

  if (!course) {
    notFound();
  }

  const isRootAdmin = session.profile.role === "admin";

  return (
    <CourseEditorShell
      course={course}
      categories={categories}
      allSkills={allSkills}
      instructors={instructors}
      backHref="/instructor/courses"
      isInstructorView={true}
      canPublish={isRootAdmin}
    />
  );
}

