import Link from "next/link";
import { BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { routes } from "@/lib/routes";

export function LearningPathsEmptyState() {
  return (
    <div className="container-page py-16 text-center">
      <div className="mx-auto max-w-md rounded-[24px] border border-line bg-card p-8 shadow-soft">
        <span className="mx-auto grid size-12 place-items-center rounded-xl bg-lavender text-primary">
          <BookOpen className="size-6" aria-hidden="true" />
        </span>
        <h3 className="heading-3 mt-4 text-ink">Learning Paths are coming soon</h3>
        <p className="mt-2 text-sm text-muted">
          Explore free individual courses while we prepare guided learning journeys.
        </p>
        <div className="mt-6">
          <Button asChild className="font-bold">
            <Link href={routes.courses.index}>Browse courses</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
