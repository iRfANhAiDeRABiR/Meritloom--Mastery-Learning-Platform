"use client";

import * as React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search, X } from "lucide-react";

import type { Category } from "@/lib/types";

interface SavedCoursesFiltersProps {
  categories: Category[];
  totalResults: number;
}

export function SavedCoursesFilters({
  categories,
  totalResults,
}: SavedCoursesFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentQuery = searchParams.get("q") || "";
  const currentCategory = searchParams.get("category") || "all";
  const currentDifficulty = searchParams.get("difficulty") || "all";
  const currentSort = searchParams.get("sort") || "recently_saved";

  const [searchTerm, setSearchTerm] = React.useState(currentQuery);

  const updateFilters = React.useCallback(
    (updates: Record<string, string | undefined>) => {
      const params = new URLSearchParams(searchParams.toString());

      for (const [key, value] of Object.entries(updates)) {
        if (!value || value === "all" || (key === "sort" && value === "recently_saved")) {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      }

      router.replace(`${pathname}?${params.toString()}`);
    },
    [pathname, router, searchParams],
  );

  // Debounced search update to URL
  React.useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm !== currentQuery) {
        updateFilters({ q: searchTerm || undefined });
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm, currentQuery, updateFilters]);

  const handleClearSearch = () => {
    setSearchTerm("");
    updateFilters({ q: undefined });
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Search & Select Row */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted pointer-events-none"
            aria-hidden="true"
          />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search saved courses by title, topic, or level"
            aria-label="Search saved courses"
            className="h-11 sm:h-12 w-full rounded-xl border border-line bg-card pl-11 pr-10 text-xs sm:text-sm font-semibold text-ink placeholder:text-muted/60 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all shadow-2xs"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={handleClearSearch}
              aria-label="Clear search"
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-muted hover:text-ink transition-colors cursor-pointer"
            >
              <X className="size-3.5" aria-hidden="true" />
            </button>
          )}
        </div>

        {/* Filters Dropdowns */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Category Filter */}
          <select
            value={currentCategory}
            onChange={(e) => updateFilters({ category: e.target.value })}
            aria-label="Filter by category"
            className="h-11 rounded-xl border border-line bg-card px-3 text-xs font-bold text-ink focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer shadow-2xs"
          >
            <option value="all">All categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>

          {/* Difficulty Filter */}
          <select
            value={currentDifficulty}
            onChange={(e) => updateFilters({ difficulty: e.target.value })}
            aria-label="Filter by difficulty"
            className="h-11 rounded-xl border border-line bg-card px-3 text-xs font-bold text-ink focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer shadow-2xs"
          >
            <option value="all">All levels</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>

          {/* Sort Control */}
          <select
            value={currentSort}
            onChange={(e) => updateFilters({ sort: e.target.value })}
            aria-label="Sort courses"
            className="h-11 rounded-xl border border-line bg-card px-3 text-xs font-bold text-ink focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer shadow-2xs"
          >
            <option value="recently_saved">Recently saved</option>
            <option value="course_name">Course name (A–Z)</option>
            <option value="newest">Newest courses</option>
          </select>
        </div>
      </div>

      {/* Results Count indicator */}
      <div className="flex items-center justify-between text-xs text-muted">
        <span className="font-semibold">
          {totalResults} {totalResults === 1 ? "saved course" : "saved courses"}
        </span>
      </div>
    </div>
  );
}
