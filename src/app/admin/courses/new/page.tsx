import type { Metadata } from "next";
import { getAdminCategories, getAdminInstructorsList } from "@/lib/queries/admin";
import { NewCourseForm } from "@/components/admin/new-course-form";

export const metadata: Metadata = {
  title: "New Course | Meritloom Admin",
  robots: {
    index: false,
    follow: false,
  },
};

export const dynamic = "force-dynamic";

export default async function AdminNewCoursePage() {
  const [categories, instructors] = await Promise.all([
    getAdminCategories(),
    getAdminInstructorsList(),
  ]);

  return <NewCourseForm categories={categories} instructors={instructors} />;
}
