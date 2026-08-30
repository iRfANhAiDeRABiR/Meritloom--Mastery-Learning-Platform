import Link from "next/link";
import { Compass } from "lucide-react";

import { routes } from "@/lib/routes";

interface LearnerWelcomeProps {
  name: string;
}

export function LearnerWelcome({ name }: LearnerWelcomeProps) {
  const firstName = name.trim().split(" ")[0] || "Learner";

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight text-ink sm:text-3xl lg:text-[32px]">
          Welcome back, {firstName}
        </h1>
        <p className="text-sm text-muted">
          Ready to keep learning?
        </p>
      </div>

      <div className="shrink-0">
        <Link
          href={routes.courses.index}
          className="inline-flex items-center gap-2 rounded-xl border border-line bg-card px-4 py-2 text-xs font-bold text-ink shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:bg-surface hover:text-primary"
        >
          <Compass className="size-4 text-primary" aria-hidden="true" />
          <span>Explore courses</span>
        </Link>
      </div>
    </div>
  );
}

