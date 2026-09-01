import type { Metadata } from "next";
import { getAdminKnowledgeChecksOverview } from "@/lib/queries/admin";
import { QuizzesView } from "@/components/admin/quizzes/quizzes-view";

export const metadata: Metadata = {
  title: "Knowledge Checks & Questions | Meritloom Admin",
  robots: {
    index: false,
    follow: false,
  },
};

export const dynamic = "force-dynamic";

export default async function AdminQuizzesPage() {
  const data = await getAdminKnowledgeChecksOverview();

  return <QuizzesView initialData={data} />;
}
