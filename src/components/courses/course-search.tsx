"use client";

import * as React from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Search, X } from "lucide-react";

import { cn } from "@/lib/utils";

export function CourseSearch({ className }: { className?: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentQuery = searchParams.get("q") ?? "";
  const [value, setValue] = React.useState(currentQuery);

  // State derivation pattern to sync external URL param changes without useEffect setState
  const [prevQuery, setPrevQuery] = React.useState(currentQuery);
  if (prevQuery !== currentQuery) {
    setPrevQuery(currentQuery);
    setValue(currentQuery);
  }

  const updateSearchQuery = React.useCallback(
    (newQuery: string) => {
      const params = new URLSearchParams(searchParams.toString());
      const trimmed = newQuery.trim();

      if (trimmed) {
        params.set("q", trimmed);
      } else {
        params.delete("q");
      }

      // Reset page to 1 when search query changes
      params.delete("page");

      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [pathname, router, searchParams],
  );

  // Debounced search update to Next.js router
  React.useEffect(() => {
    if (value === currentQuery) return;

    const timer = setTimeout(() => {
      updateSearchQuery(value);
    }, 400);

    return () => clearTimeout(timer);
  }, [value, currentQuery, updateSearchQuery]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    updateSearchQuery(value);
  };

  const handleClear = () => {
    setValue("");
    updateSearchQuery("");
  };

  return (
    <form
      role="search"
      onSubmit={handleSubmit}
      className={cn("relative w-full max-w-2xl", className)}
    >
      <label htmlFor="course-search-input" className="sr-only">
        Search courses by title, topic, skill or instructor
      </label>

      <div className="relative flex items-center">
        <span
          className="pointer-events-none absolute left-4.5 text-white/70 transition-colors"
          aria-hidden="true"
        >
          <Search className="size-5" />
        </span>

        <input
          id="course-search-input"
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Search by course, skill, topic or instructor"
          autoComplete="off"
          spellCheck="false"
          className={cn(
            "h-13 w-full rounded-full border border-white/15 bg-white/10 pl-12 pr-12 text-[15px] text-white placeholder:text-white/60 shadow-lift backdrop-blur-md transition-all",
            "focus:border-primary focus:bg-white/15 focus:outline-none focus:ring-2 focus:ring-primary/50",
          )}
        />

        {value.length > 0 && (
          <button
            type="button"
            onClick={handleClear}
            aria-label="Clear search input"
            className="absolute right-3.5 grid size-7 place-items-center rounded-full text-white/70 transition-colors hover:bg-white/20 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary cursor-pointer"
          >
            <X className="size-4" aria-hidden="true" />
          </button>
        )}
      </div>
    </form>
  );
}

