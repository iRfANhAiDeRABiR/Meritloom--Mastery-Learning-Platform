import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * Meritloom wordmark. Built as inline SVG + text so it needs no image asset
 * and inherits the purple brand colour. Decorative for assistive tech; the
 * surrounding link provides the accessible name.
 */
export function Logo({
  className,
  variant = "dark",
}: {
  className?: string;
  /** "dark" adapts with text-ink, "light" is white for dark footer backgrounds. */
  variant?: "dark" | "light";
}) {
  return (
    <span
      className={cn("inline-flex items-center gap-2.5", className)}
      aria-hidden="true"
    >
      <span className="grid size-9 place-items-center rounded-[12px] bg-primary text-white shadow-soft">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path
            d="M4 19V6.5C4 5.7 4.9 5.3 5.5 5.9L11 11.5 16.5 5.9C17.1 5.3 18 5.7 18 6.5V19"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M4 19h14"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
          />
        </svg>
      </span>
      <span
        className={cn(
          "text-[19px] font-bold tracking-tight transition-colors",
          variant === "dark" ? "text-ink" : "text-white",
        )}
      >
        Meritloom
      </span>
    </span>
  );
}
