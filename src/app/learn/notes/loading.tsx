import { MyNotesSkeleton } from "@/components/notes/my-notes-skeleton";

export default function MyNotesLoadingPage() {
  return (
    <div className="p-4 sm:p-6 lg:p-10">
      <MyNotesSkeleton />
    </div>
  );
}
