import type { Metadata } from "next";
import { getAdminLearnersList } from "@/lib/queries/admin";
import { LearnersView } from "@/components/admin/learners-view";

export const metadata: Metadata = {
  title: "Learners & Users | Meritloom Admin",
  robots: {
    index: false,
    follow: false,
  },
};

export const dynamic = "force-dynamic";

interface LearnersPageProps {
  searchParams: Promise<{
    q?: string;
    role?: string;
  }>;
}

export default async function AdminLearnersPage({ searchParams }: LearnersPageProps) {
  const resolvedParams = await searchParams;
  const learners = await getAdminLearnersList({
    q: resolvedParams.q,
    role: resolvedParams.role,
  });

  return (
    <LearnersView
      initialLearners={learners}
      searchQuery={resolvedParams.q || ""}
      selectedRole={resolvedParams.role || "all"}
    />
  );
}

