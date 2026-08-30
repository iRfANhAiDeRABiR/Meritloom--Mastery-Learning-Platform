"use client";

import * as React from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import type { Category } from "@/lib/types";
import { cn } from "@/lib/utils";

interface CategoryFilterChipsProps {
  categories: Category[];
  className?: string;
}

export function CategoryFilterChips({
  categories,
  className,
}: CategoryFilterChipsProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const activeCategory = searchParams.get("category") ?? "all";

  const handleSelectCategory = (slug: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (slug === "all") {
      params.delete("category");
    } else {
      params.set("category", slug);
    }

    // Reset page to 1 on category change
    params.delete("page");

    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const allCategories = [
    { id: "all", slug: "all", name: "All courses", courseCount: 0 },
    ...categories,
  ];

  return (
    <div
      className={cn(
        "relative w-full overflow-hidden py-4",
        className,
      )}
    >
      <div
        role="group"
        aria-label="Filter courses by category"
        className="flex items-center gap-2 overflow-x-auto pb-2 pt-1 no-scrollbar sm:flex-wrap"
      >
        {allCategories.map((cat) => {
          const isSelected =
            cat.slug === "all"
              ? !searchParams.get("category") || activeCategory === "all"
              : activeCategory === cat.slug;

          return (
            <button
              key={cat.slug}
              type="button"
              onClick={() => handleSelectCategory(cat.slug)}
              aria-pressed={isSelected}
              className={cn(
                "inline-flex items-center whitespace-nowrap rounded-full px-4.5 py-2 text-sm font-semibold transition-all duration-150 cursor-pointer shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
                isSelected
                  ? "bg-primary text-white shadow-soft"
                  : "border border-line bg-card text-muted hover:border-primary/40 hover:text-ink active:bg-surface",
              )}
            >
              {cat.name}
            </button>
          );
        })}
      </div>
    </div>
  );
}

