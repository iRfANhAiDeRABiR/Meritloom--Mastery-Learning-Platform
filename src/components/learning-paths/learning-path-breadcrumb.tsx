import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { routes } from "@/lib/routes";

interface LearningPathBreadcrumbProps {
  title: string;
}

export function LearningPathBreadcrumb({ title }: LearningPathBreadcrumbProps) {
  return (
    <nav
      aria-label="Breadcrumb"
      className="container-page pt-6 pb-2 text-xs font-medium text-muted"
    >
      <ol className="flex items-center gap-1.5 flex-wrap">
        <li>
          <Link
            href={routes.home}
            className="flex items-center gap-1 hover:text-ink transition-colors"
          >
            <Home className="size-3.5" aria-hidden="true" />
            <span className="sr-only sm:not-sr-only sm:inline">Home</span>
          </Link>
        </li>
        <li aria-hidden="true">
          <ChevronRight className="size-3 text-muted/60" />
        </li>
        <li>
          <Link
            href={routes.learningPaths.index}
            className="hover:text-ink transition-colors"
          >
            Learning Paths
          </Link>
        </li>
        <li aria-hidden="true">
          <ChevronRight className="size-3 text-muted/60" />
        </li>
        <li className="font-semibold text-ink truncate max-w-[240px] sm:max-w-none" aria-current="page">
          {title}
        </li>
      </ol>
    </nav>
  );
}
