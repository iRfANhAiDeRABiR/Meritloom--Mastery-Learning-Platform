import type { Metadata } from "next";
import { getAdminInstructorsList } from "@/lib/queries/admin";
import { InstructorsView } from "@/components/admin/instructors-view";

export const metadata: Metadata = {
  title: "Instructors | Meritloom Admin",
  robots: {
    index: false,
    follow: false,
  },
};

export const dynamic = "force-dynamic";

export default async function AdminInstructorsPage() {
  const instructors = await getAdminInstructorsList();

  return <InstructorsView initialInstructors={instructors} />;
}

