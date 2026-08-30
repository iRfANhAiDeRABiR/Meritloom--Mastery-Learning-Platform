import * as React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

import { routes } from "@/lib/routes";
import { cn } from "@/lib/utils";

interface CourseBreadcrumbProps {
  courseTitle: string;
  category?: {
    name: string;
    slug: string;
  } | null;
  className?: string;
  variant?: "dark" | "default";
}

export function CourseBreadcrumb({
  courseTitle,
  category,
  className,
  variant = "dark",
}: CourseBreadcrumbProps) {
  const isDark = variant === "dark";

  return (
    <nav
      aria-label="Breadcrumb"
      className={cn("flex items-center text-xs font-medium", className)}
    >
      <ol className="flex flex-wrap items-center gap-1.5 sm:gap-2">
        <li>
          <Link
            href={routes.courses.index}
            className={cn(
              "transition-colors",
              isDark
                ? "text-white/60 hover:text-white"
                : "text-muted hover:text-ink",
            )}
          >
            Courses
          </Link>
        </li>

        {category && (
          <>
            <li aria-hidden="true" className="select-none">
              <ChevronRight
                className={cn(
                  "size-3.5",
                  isDark ? "text-white/40" : "text-muted/60",
                )}
              />
            </li>
            <li>
              <Link
                href={`/courses?category=${category.slug}`}
                className={cn(
                  "transition-colors",
                  isDark
                    ? "text-white/60 hover:text-white"
                    : "text-muted hover:text-ink",
                )}
              >
                {category.name}
              </Link>
            </li>
          </>
        )}

        <li aria-hidden="true" className="select-none">
          <ChevronRight
            className={cn(
              "size-3.5",
              isDark ? "text-white/40" : "text-muted/60",
            )}
          />
        </li>

        <li
          aria-current="page"
          className={cn(
            "max-w-[200px] truncate sm:max-w-md font-semibold",
            isDark ? "text-white" : "text-ink",
          )}
        >
          {courseTitle}
        </li>
      </ol>
    </nav>
  );
}

