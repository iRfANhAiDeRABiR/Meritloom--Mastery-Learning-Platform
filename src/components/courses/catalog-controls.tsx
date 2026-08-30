"use client";

import * as React from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { ArrowUpDown, ChevronDown, Filter, SlidersHorizontal, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { Category } from "@/lib/types";
import { cn } from "@/lib/utils";

interface CatalogControlsProps {
  totalCount: number;
  categories: Category[];
  className?: string;
}

const DIFFICULTY_OPTIONS = [
  { value: "all", label: "All levels" },
  { value: "beginner", label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "advanced", label: "Advanced" },
] as const;

const SORT_OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "title", label: "Course title" },
  { value: "duration", label: "Shortest duration" },
  { value: "lessons", label: "Most lessons" },
] as const;

export function CatalogControls({
  totalCount,
  categories,
  className,
}: CatalogControlsProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentLevel = searchParams.get("level") ?? "all";
  const currentSort = searchParams.get("sort") ?? "newest";
  const currentCategory = searchParams.get("category") ?? "all";

  const handleParamChange = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value === "all" || (key === "sort" && value === "newest")) {
      params.delete(key);
    } else {
      params.set(key, value);
    }

    // Reset pagination on filter/sort change
    params.delete("page");

    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const hasActiveFilters = Boolean(
    searchParams.get("q") ||
      searchParams.get("category") ||
      searchParams.get("level") ||
      (searchParams.get("sort") && searchParams.get("sort") !== "newest"),
  );

  const handleResetFilters = () => {
    router.push(pathname, { scroll: false });
  };

  return (
    <div
      className={cn(
        "flex flex-wrap items-center justify-between gap-4 border-b border-line pb-4 pt-2",
        className,
      )}
    >
      {/* Left side: Results Count */}
      <div className="flex items-center gap-3">
        <p className="text-sm font-semibold text-ink" aria-live="polite">
          <span className="font-extrabold text-primary">{totalCount}</span>{" "}
          {totalCount === 1 ? "course available" : "courses available"}
        </p>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={handleResetFilters}
            className="text-xs font-semibold text-primary underline-offset-4 hover:underline cursor-pointer"
          >
            Reset filters
          </button>
        )}
      </div>

      {/* Right side: Desktop Selects & Mobile Filter Button */}
      <div className="flex items-center gap-2.5">
        {/* Desktop Difficulty Filter */}
        <div className="hidden sm:flex items-center gap-1.5 text-xs font-medium text-muted">
          <label htmlFor="difficulty-select" className="sr-only">
            Filter by difficulty
          </label>
          <div className="relative">
            <select
              id="difficulty-select"
              value={currentLevel}
              onChange={(e) => handleParamChange("level", e.target.value)}
              className={cn(
                "h-9 appearance-none rounded-full border border-line bg-card pl-3.5 pr-8 text-xs font-semibold text-ink transition-colors cursor-pointer",
                "hover:border-primary/40 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20",
              )}
            >
              {DIFFICULTY_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <ChevronDown
              className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted"
              aria-hidden="true"
            />
          </div>
        </div>

        {/* Desktop Sort Dropdown */}
        <div className="hidden sm:flex items-center gap-1.5 text-xs font-medium text-muted">
          <label htmlFor="sort-select" className="sr-only">
            Sort courses
          </label>
          <div className="relative">
            <select
              id="sort-select"
              value={currentSort}
              onChange={(e) => handleParamChange("sort", e.target.value)}
              className={cn(
                "h-9 appearance-none rounded-full border border-line bg-card pl-3.5 pr-8 text-xs font-semibold text-ink transition-colors cursor-pointer",
                "hover:border-primary/40 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20",
              )}
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  Sort: {opt.label}
                </option>
              ))}
            </select>
            <ArrowUpDown
              className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 size-3 text-muted"
              aria-hidden="true"
            />
          </div>
        </div>

        {/* Mobile Filters Drawer / Sheet */}
        <MobileFilterSheet
          categories={categories}
          currentCategory={currentCategory}
          currentLevel={currentLevel}
          currentSort={currentSort}
          onParamChange={handleParamChange}
          onReset={handleResetFilters}
          hasActiveFilters={hasActiveFilters}
        />
      </div>
    </div>
  );
}

function MobileFilterSheet({
  categories,
  currentCategory,
  currentLevel,
  currentSort,
  onParamChange,
  onReset,
  hasActiveFilters,
}: {
  categories: Category[];
  currentCategory: string;
  currentLevel: string;
  currentSort: string;
  onParamChange: (key: string, value: string) => void;
  onReset: () => void;
  hasActiveFilters: boolean;
}) {
  const [open, setOpen] = React.useState(false);

  return (
    <DialogPrimitive.Root open={open} onOpenChange={setOpen}>
      <DialogPrimitive.Trigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="flex sm:hidden items-center gap-1.5 h-9 px-3 text-xs"
        >
          <SlidersHorizontal className="size-3.5 text-primary" aria-hidden="true" />
          <span>Filters</span>
          {hasActiveFilters && (
            <span className="size-1.5 rounded-full bg-primary" />
          )}
        </Button>
      </DialogPrimitive.Trigger>

      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <DialogPrimitive.Content
          className={cn(
            "fixed inset-y-0 right-0 z-50 flex w-full max-w-xs flex-col gap-5 border-l border-line bg-card p-6 shadow-lift",
            "focus:outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right",
          )}
        >
          <div className="flex items-center justify-between">
            <DialogPrimitive.Title className="text-lg font-bold text-ink flex items-center gap-2">
              <Filter className="size-4 text-primary" aria-hidden="true" />
              Filter & Sort
            </DialogPrimitive.Title>
            <DialogPrimitive.Close
              aria-label="Close filters"
              className="grid size-8 place-items-center rounded-full border border-line text-ink transition-colors hover:bg-lavender/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <X className="size-4" aria-hidden="true" />
            </DialogPrimitive.Close>
          </div>

          <div className="flex flex-col gap-5 overflow-y-auto pr-1">
            {/* Category Filter */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold uppercase tracking-wider text-muted">
                Category
              </label>
              <div className="flex flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={() => onParamChange("category", "all")}
                  className={cn(
                    "rounded-full px-3 py-1 text-xs font-semibold transition-colors cursor-pointer",
                    currentCategory === "all"
                      ? "bg-primary text-white"
                      : "border border-line bg-card text-muted hover:text-ink",
                  )}
                >
                  All
                </button>
                {categories.map((c) => (
                  <button
                    key={c.slug}
                    type="button"
                    onClick={() => onParamChange("category", c.slug)}
                    className={cn(
                      "rounded-full px-3 py-1 text-xs font-semibold transition-colors cursor-pointer",
                      currentCategory === c.slug
                        ? "bg-primary text-white"
                        : "border border-line bg-card text-muted hover:text-ink",
                    )}
                  >
                    {c.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Difficulty Level */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold uppercase tracking-wider text-muted">
                Difficulty Level
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                {DIFFICULTY_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => onParamChange("level", opt.value)}
                    className={cn(
                      "rounded-xl border p-2 text-center text-xs font-semibold transition-colors cursor-pointer",
                      currentLevel === opt.value
                        ? "border-primary bg-lavender text-primary"
                        : "border-line bg-card text-muted hover:text-ink",
                    )}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Sort Option */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold uppercase tracking-wider text-muted">
                Sort Order
              </label>
              <div className="flex flex-col gap-1.5">
                {SORT_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => onParamChange("sort", opt.value)}
                    className={cn(
                      "flex items-center justify-between rounded-xl border px-3 py-2 text-left text-xs font-semibold transition-colors cursor-pointer",
                      currentSort === opt.value
                        ? "border-primary bg-lavender text-primary"
                        : "border-line bg-card text-muted hover:text-ink",
                    )}
                  >
                    <span>{opt.label}</span>
                    {currentSort === opt.value && (
                      <span className="size-1.5 rounded-full bg-primary" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-auto flex flex-col gap-2 pt-4 border-t border-line">
            {hasActiveFilters && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  onReset();
                  setOpen(false);
                }}
                className="w-full"
              >
                Reset All Filters
              </Button>
            )}
            <DialogPrimitive.Close asChild>
              <Button size="sm" className="w-full">
                Apply & View Courses
              </Button>
            </DialogPrimitive.Close>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}

