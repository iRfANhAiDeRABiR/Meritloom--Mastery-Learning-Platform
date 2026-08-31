import type { Metadata } from "next";
import { NewLearningPathForm } from "@/components/admin/learning-paths/new-learning-path-form";

export const metadata: Metadata = {
  title: "New Learning Path | Meritloom Admin",
  robots: {
    index: false,
    follow: false,
  },
};

export const dynamic = "force-dynamic";

export default function AdminNewLearningPathPage() {
  return <NewLearningPathForm />;
}
