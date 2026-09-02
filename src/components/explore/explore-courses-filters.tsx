"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Filter, Search, X } from "lucide-react";

import type { Category } from "@/lib/types";

interface ExploreCoursesFiltersProps {
  categories: Category[];
}

export function ExploreCoursesFilters({ categories }: ExploreCoursesFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const queryParam = searchParams.get("q") ?? "";
  const levelParam = searchParams.get("level") ?? "all";
  const categoryParam = searchParams.get("category") ?? "all";
  const statusParam = searchParams.get("status") ?? "all";

  const [searchTerm, setSearchTerm] = React.useState(queryParam);
  const [prevQuery, setPrevQuery] = React.useState(queryParam);

  // Sync external URL param changes (e.g. browser back/forward)
  if (prevQuery !== queryParam) {
    setPrevQuery(queryParam);
    setSearchTerm(queryParam);
  }

  // Debounced search update
  React.useEffect(() => {
    if (searchTerm === queryParam) return;

    const handler = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (searchTerm.trim()) {
        params.set("q", searchTerm.trim());
      } else {
        params.delete("q");
      }
      router.push(`/learn/explore?${params.toString()}`);
    }, 250);

    return () => clearTimeout(handler);
  }, [searchTerm, queryParam, router, searchParams]);

  const handleLevelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const params = new URLSearchParams(searchParams.toString());
    const val = e.target.value;
    if (val && val !== "all") {
      params.set("level", val);
    } else {
      params.delete("level");
    }
    router.push(`/learn/explore?${params.toString()}`);
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const params = new URLSearchParams(searchParams.toString());
    const val = e.target.value;
    if (val && val !== "all") {
      params.set("category", val);
    } else {
      params.delete("category");
    }
    router.push(`/learn/explore?${params.toString()}`);
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const params = new URLSearchParams(searchParams.toString());
    const val = e.target.value;
    if (val && val !== "all") {
      params.set("status", val);
    } else {
      params.delete("status");
    }
    router.push(`/learn/explore?${params.toString()}`);
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    const params = new URLSearchParams(searchParams.toString());
    params.delete("q");
    router.push(`/learn/explore?${params.toString()}`);
  };

  const hasActiveFilters = Boolean(
    queryParam ||
      (levelParam && levelParam !== "all") ||
      (categoryParam && categoryParam !== "all") ||
      (statusParam && statusParam !== "all"),
  );

  const handleClearAll = () => {
    setSearchTerm("");
    const params = new URLSearchParams(searchParams.toString());
    params.delete("q");
    params.delete("level");
    params.delete("category");
    params.delete("status");
    router.push(`/learn/explore?${params.toString()}`);
  };

  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
      {/* Search Input */}
      <div className="relative flex-1 max-w-md">
        <Search
          className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted"
          aria-hidden="true"
        />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search courses..."
          aria-label="Search courses"
          className="h-11 w-full rounded-xl border border-line bg-card pl-10 pr-10 text-xs text-ink placeholder:text-muted transition-colors shadow-xs focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/15"
        />
        {searchTerm && (
          <button
            type="button"
            onClick={handleClearSearch}
            aria-label="Clear search"
            className="absolute right-2.5 top-1/2 -translate-y-1/2 grid size-7 place-items-center rounded-md text-muted hover:text-ink transition-colors cursor-pointer"
          >
            <X className="size-4" aria-hidden="true" />
          </button>
        )}
      </div>

      {/* Filter Selects */}
      <div className="flex flex-wrap items-center gap-2.5">
        {/* Level Filter */}
        <div className="relative">
          <select
            value={levelParam}
            onChange={handleLevelChange}
            aria-label="Filter by level"
            className="h-11 rounded-xl border border-line bg-card px-3.5 text-xs font-semibold text-ink shadow-xs transition-colors cursor-pointer focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/15"
          >
            <option value="all">All levels</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>

        {/* Category Filter */}
        {categories.length > 0 && (
          <div className="relative">
            <select
              value={categoryParam}
              onChange={handleCategoryChange}
              aria-label="Filter by category"
              className="h-11 rounded-xl border border-line bg-card px-3.5 text-xs font-semibold text-ink shadow-xs transition-colors cursor-pointer focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/15"
            >
              <option value="all">All categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Status Filter */}
        <div className="relative">
          <select
            value={statusParam}
            onChange={handleStatusChange}
            aria-label="Filter by enrollment status"
            className="h-11 rounded-xl border border-line bg-card px-3.5 text-xs font-semibold text-ink shadow-xs transition-colors cursor-pointer focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/15"
          >
            <option value="all">All statuses</option>
            <option value="not_started">Not started</option>
            <option value="in_progress">In progress</option>
            <option value="completed">Completed</option>
            <option value="saved">Saved</option>
          </select>
        </div>

        {/* Clear Filters Button */}
        {hasActiveFilters && (
          <button
            type="button"
            onClick={handleClearAll}
            className="flex h-11 items-center gap-1.5 rounded-xl border border-dashed border-line bg-surface px-3.5 text-xs font-bold text-muted hover:text-ink transition-colors cursor-pointer"
          >
            <Filter className="size-3.5" aria-hidden="true" />
            <span>Clear filters</span>
          </button>
        )}
      </div>
    </div>
  );
}

