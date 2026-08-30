"use client";

import * as React from "react";
import Link from "next/link";
import { useSearchParams, usePathname } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CatalogPaginationProps {
  currentPage: number;
  totalPages: number;
  className?: string;
}

export function CatalogPagination({
  currentPage,
  totalPages,
  className,
}: CatalogPaginationProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  if (totalPages <= 1) return null;

  const createPageUrl = (pageNumber: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", pageNumber.toString());
    return `${pathname}?${params.toString()}#catalog-results`;
  };

  // Generate visible page numbers (sliding window around currentPage)
  const getPageNumbers = () => {
    const delta = 2;
    const range: number[] = [];
    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      range.unshift(-1); // ellipsis
    }
    if (currentPage + delta < totalPages - 1) {
      range.push(-2); // ellipsis
    }

    range.unshift(1);
    if (totalPages > 1) {
      range.push(totalPages);
    }

    return range;
  };

  const pages = getPageNumbers();

  return (
    <nav
      aria-label="Course catalog pagination"
      className={cn("flex items-center justify-center gap-1.5 py-8", className)}
    >
      {/* Previous Page Button */}
      <Button
        asChild={currentPage > 1}
        disabled={currentPage <= 1}
        variant="outline"
        size="sm"
        className="h-10 px-3 gap-1 rounded-full text-xs font-semibold"
        aria-label="Go to previous page"
      >
        {currentPage > 1 ? (
          <Link href={createPageUrl(currentPage - 1)}>
            <ChevronLeft className="size-4" aria-hidden="true" />
            <span className="hidden sm:inline">Previous</span>
          </Link>
        ) : (
          <span>
            <ChevronLeft className="size-4" aria-hidden="true" />
            <span className="hidden sm:inline">Previous</span>
          </span>
        )}
      </Button>

      {/* Page Numbers */}
      <div className="flex items-center gap-1">
        {pages.map((p, idx) => {
          if (p < 0) {
            return (
              <span
                key={`ellipsis-${idx}`}
                className="grid size-10 place-items-center text-sm font-bold text-muted"
              >
                …
              </span>
            );
          }

          const isCurrent = p === currentPage;

          return (
            <Button
              key={p}
              asChild={!isCurrent}
              variant={isCurrent ? "default" : "outline"}
              size="sm"
              className={cn(
                "size-10 rounded-full p-0 text-xs font-bold transition-all",
                isCurrent
                  ? "bg-primary text-white shadow-soft pointer-events-none"
                  : "border-line bg-card text-muted hover:border-primary/40 hover:text-ink",
              )}
              aria-current={isCurrent ? "page" : undefined}
              aria-label={`Page ${p}`}
            >
              {isCurrent ? <span>{p}</span> : <Link href={createPageUrl(p)}>{p}</Link>}
            </Button>
          );
        })}
      </div>

      {/* Next Page Button */}
      <Button
        asChild={currentPage < totalPages}
        disabled={currentPage >= totalPages}
        variant="outline"
        size="sm"
        className="h-10 px-3 gap-1 rounded-full text-xs font-semibold"
        aria-label="Go to next page"
      >
        {currentPage < totalPages ? (
          <Link href={createPageUrl(currentPage + 1)}>
            <span className="hidden sm:inline">Next</span>
            <ChevronRight className="size-4" aria-hidden="true" />
          </Link>
        ) : (
          <span>
            <span className="hidden sm:inline">Next</span>
            <ChevronRight className="size-4" aria-hidden="true" />
          </span>
        )}
      </Button>
    </nav>
  );
}

