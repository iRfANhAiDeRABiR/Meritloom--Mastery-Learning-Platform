import * as React from "react";
import { cn } from "@/lib/utils";

interface ErrorIllustrationProps {
  type?: "404" | "error" | "forbidden";
  className?: string;
}

export function ErrorIllustration({
  type = "404",
  className,
}: ErrorIllustrationProps) {
  return (
    <div
      aria-hidden="true"
      className={cn("relative mx-auto flex size-44 sm:size-52 items-center justify-center select-none", className)}
    >
      {/* Ambient glowing radial backdrop */}
      <div className="absolute inset-0 -z-10 rounded-full bg-primary/15 blur-3xl" />
      <div className="absolute -bottom-2 size-28 rounded-full bg-cyan-500/10 blur-2xl" />

      {/* Dotted Grid Background */}
      <svg
        className="absolute inset-0 size-full stroke-line opacity-40 dark:opacity-30"
        viewBox="0 0 200 200"
        fill="none"
      >
        <defs>
          <pattern id="error-dot-grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1.5" className="fill-line" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#error-dot-grid)" />
      </svg>

      {/* SVG Stylized Broken Path / Floating Geometric Card */}
      <div className="relative flex flex-col items-center justify-center">
        {type === "404" && (
          <div className="relative flex items-center justify-center">
            {/* Background 404 Large Glow Number */}
            <span className="font-display text-7xl sm:text-8xl font-black tracking-tighter text-primary/20 dark:text-primary/15 select-none">
              404
            </span>

            {/* Floating Disconnected Lesson Card Icon */}
            <div className="absolute flex flex-col items-center justify-center rounded-2xl border border-line bg-card/90 p-4 shadow-xl backdrop-blur-sm">
              <div className="flex items-center gap-1.5 mb-2">
                <span className="size-2 rounded-full bg-rose-500/80" />
                <span className="size-2 rounded-full bg-amber-500/80" />
                <span className="size-2 rounded-full bg-emerald-500/80" />
              </div>
              <div className="flex flex-col gap-1.5 w-16">
                <div className="h-2 w-14 rounded bg-primary/40 animate-pulse" />
                <div className="h-1.5 w-10 rounded bg-line" />
              </div>
            </div>
          </div>
        )}

        {type === "error" && (
          <div className="relative flex items-center justify-center">
            <div className="size-24 sm:size-28 rounded-3xl border border-rose-500/30 bg-rose-500/10 flex items-center justify-center shadow-xl shadow-rose-500/5">
              <div className="size-16 sm:size-20 rounded-2xl border border-rose-500/40 bg-surface flex items-center justify-center">
                <svg
                  className="size-8 text-rose-500"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
                  <line x1="12" y1="9" x2="12" y2="13" />
                  <line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
              </div>
            </div>
          </div>
        )}

        {type === "forbidden" && (
          <div className="relative flex items-center justify-center">
            <div className="size-24 sm:size-28 rounded-3xl border border-amber-500/30 bg-amber-500/10 flex items-center justify-center shadow-xl">
              <div className="size-16 sm:size-20 rounded-2xl border border-amber-500/40 bg-surface flex items-center justify-center">
                <svg
                  className="size-8 text-amber-500"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

