import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { Compass } from "lucide-react";

import { Button } from "@/components/ui/button";
import { routes } from "@/lib/routes";

/**
 * Polished, non-crashing placeholder shown when a Supabase collection is empty
 * (or unconfigured). Reassures the learner instead of exposing a broken grid.
 */
export function EmptyState({
  icon: Icon = Compass,
  title,
  description,
  actionLabel = "Browse free courses",
  actionHref = routes.courses.index,
}: {
  icon?: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded-container border border-dashed border-line bg-surface px-6 py-14 text-center">
      <span className="grid size-14 place-items-center rounded-2xl bg-lavender text-primary">
        <Icon className="size-7" aria-hidden="true" />
      </span>
      <div className="max-w-md">
        <h3 className="text-lg font-bold text-ink">{title}</h3>
        <p className="mt-1 text-sm text-muted">{description}</p>
      </div>
      <Button asChild variant="secondary">
        <Link href={actionHref}>{actionLabel}</Link>
      </Button>
    </div>
  );
}
