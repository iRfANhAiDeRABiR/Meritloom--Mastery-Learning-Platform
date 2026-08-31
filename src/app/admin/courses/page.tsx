import type { Metadata } from "next";
import { getAdminCategories, getAdminCoursesList } from "@/lib/queries/admin";
import { AdminCoursesTable } from "@/components/admin/admin-courses-table";

export const metadata: Metadata = {
  title: "Courses | Meritloom Admin",
  robots: {
    index: false,
    follow: false,
  },
};

export const dynamic = "force-dynamic";

interface AdminCoursesPageProps {
  searchParams: Promise<{
    q?: string;
    status?: string;
    category?: string;
  }>;
}

export default async function AdminCoursesPage({
  searchParams,
}: AdminCoursesPageProps) {
  const params = await searchParams;
  const [courses, categories] = await Promise.all([
    getAdminCoursesList(params),
    getAdminCategories(),
  ]);

  return <AdminCoursesTable courses={courses} categories={categories} />;
}
