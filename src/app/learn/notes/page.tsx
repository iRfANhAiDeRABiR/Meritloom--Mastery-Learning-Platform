import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { getMyNotesAndBookmarksData } from "@/lib/queries/notes-and-bookmarks";
import { MyNotesView } from "@/components/notes/my-notes-view";
import { routes } from "@/lib/routes";

export const metadata: Metadata = {
  title: "My Notes & Bookmarks | Meritloom",
  description: "Review private study notes and bookmarked lessons across your Meritloom courses.",
  robots: {
    index: false,
    follow: false,
  },
};

export const dynamic = "force-dynamic";

export default async function MyNotesPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect(`${routes.auth.signIn}?next=/learn/notes`);
  }

  const data = await getMyNotesAndBookmarksData(user.id);

  return (
    <div className="p-4 sm:p-6 lg:p-10">
      <MyNotesView data={data} />
    </div>
  );
}
