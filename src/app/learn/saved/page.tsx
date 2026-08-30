import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";

import { LearnerLayout } from "@/components/learn/learner-layout";
import { SavedCoursesGrid } from "@/components/saved/saved-courses-grid";
import { getCurrentUser } from "@/lib/auth";
import { getSavedCoursesPageData } from "@/lib/queries/saved";
import { routes } from "@/lib/routes";

export const metadata: Metadata = {
  title: "Saved Courses | Meritloom",
  description: "Courses you've bookmarked to explore or learn later on Meritloom.",
  robots: {
    index: false,
    follow: false,
  },
};

interface SavedCoursesPageProps {
  searchParams: Promise<{
    q?: string;
    category?: string;
    difficulty?: string;
    sort?: string;
  }>;
}

/**
 * Meritloom Saved Courses — Page 13.
 * Route: /learn/saved
 *
 * Implements Figma Frame 4:123 — 08 My Courses adapted for personal Saved Courses:
 * - Clean personal learning list with search, category & level filters, and sorting
 * - 3-column responsive grid with state-aware course cards (Start / Continue / Review)
 * - Optimistic bookmark removal and duplicate enrollment prevention
 * - Two distinct empty states (no bookmarks vs no filter matches)
 * - Recommendations section at the bottom
 *
 * Protected route: requires authenticated session.
 */
export default async function SavedCoursesPage({
  searchParams,
}: SavedCoursesPageProps) {
  const user = await getCurrentUser();
  const resolvedSearchParams = await searchParams;

  if (!user) {
    redirect(`${routes.auth.signIn}?next=/learn/saved`);
  }

  const data = await getSavedCoursesPageData(user.id, {
    q: resolvedSearchParams.q,
    category: resolvedSearchParams.category,
    difficulty: resolvedSearchParams.difficulty,
    sort: resolvedSearchParams.sort,
  });

  if (!data) {
    notFound();
  }

  return (
    <LearnerLayout user={user}>
      <div className="p-4 sm:p-6 lg:p-10">
        <SavedCoursesGrid data={data} />
      </div>
    </LearnerLayout>
  );
}

