import * as React from "react";
import {
  BadgeCheck,
  BookOpen,
  Code2,
  Compass,
  Cpu,
  Layers,
  Play,
  Search,
  Sparkles,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";

/**
 * Abstract preview of the Meritloom learning platform.
 * Communicates "browse and learn" rather than "personal progress dashboard".
 * Does NOT contain progress percentages, student names, quiz answers, locked lessons, or analytics.
 */
export function ProductPreview() {
  return (
    <div className="relative w-full max-w-[580px]">
      {/* Decorative background glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-4 rounded-[36px] bg-gradient-to-tr from-primary/20 via-lavender/30 to-mint/20 blur-2xl dark:from-primary/15 dark:via-lavender/10 dark:to-mint/10"
      />

      {/* Main Browser Frame */}
      <div className="relative overflow-hidden rounded-container border border-line bg-card shadow-lift">
        {/* Browser Top Window Bar */}
        <div className="flex items-center justify-between border-b border-line bg-surface px-4 py-3 sm:px-5">
          <div className="flex items-center gap-2">
            <span className="size-3 rounded-full bg-rose-400/80" />
            <span className="size-3 rounded-full bg-amber-400/80" />
            <span className="size-3 rounded-full bg-emerald-400/80" />
          </div>

          <div className="flex items-center gap-2 rounded-full border border-line bg-card px-3 py-1 text-xs text-muted shadow-xs">
            <Search className="size-3 text-muted" aria-hidden="true" />
            <span className="font-mono text-[11px]">meritloom.com/courses</span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-primary/40" />
            <span className="size-2 rounded-full bg-primary/60" />
          </div>
        </div>

        {/* Platform Content Preview Area */}
        <div className="grid gap-4 p-4 sm:grid-cols-[140px_minmax(0,1fr)] sm:p-5">
          {/* Discovery Sidebar */}
          <div className="hidden flex-col gap-3 rounded-card border border-line bg-surface p-3 sm:flex">
            <p className="px-1 text-[11px] font-bold uppercase tracking-wider text-muted">
              Discover
            </p>
            <div className="flex flex-col gap-1 text-xs font-medium">
              <div className="flex items-center gap-2 rounded-lg bg-lavender px-2.5 py-1.5 font-semibold text-primary">
                <Compass className="size-3.5" aria-hidden="true" />
                <span>All Courses</span>
              </div>
              <div className="flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-muted transition-colors hover:text-ink">
                <Code2 className="size-3.5" aria-hidden="true" />
                <span>Web Dev</span>
              </div>
              <div className="flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-muted transition-colors hover:text-ink">
                <Cpu className="size-3.5" aria-hidden="true" />
                <span>Computer Science</span>
              </div>
              <div className="flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-muted transition-colors hover:text-ink">
                <Layers className="size-3.5" aria-hidden="true" />
                <span>System Design</span>
              </div>
            </div>

            <div className="mt-auto rounded-lg border border-line bg-card p-2.5 text-center">
              <span className="inline-block rounded-full bg-mint px-2 py-0.5 text-[10px] font-bold text-mint-ink">
                100% Free
              </span>
              <p className="mt-1 text-[11px] font-medium text-muted">
                No paywall ever
              </p>
            </div>
          </div>

          {/* Main Course Showcase View */}
          <div className="flex flex-col gap-3.5">
            {/* Featured Lesson Video Thumbnail Card */}
            <div className="relative overflow-hidden rounded-card border border-line bg-surface p-3.5 sm:p-4">
              <div className="relative aspect-[16/8] w-full overflow-hidden rounded-[12px] bg-gradient-to-br from-primary/90 via-primary-700 to-indigo-900 p-4 text-white shadow-soft">
                {/* Background geometric pattern */}
                <div
                  className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white/20 via-transparent to-transparent"
                  aria-hidden="true"
                />

                <div className="relative flex h-full flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1 rounded-full bg-black/40 px-2.5 py-0.5 text-[11px] font-semibold backdrop-blur-sm">
                      <BookOpen className="size-3" aria-hidden="true" />
                      Lesson Preview
                    </span>
                    <Badge variant="mint" className="py-0.5 text-[10px]">
                      Free Course
                    </Badge>
                  </div>

                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-xs font-semibold text-white/80">
                        Modern Web Foundations
                      </p>
                      <p className="text-sm font-bold text-white">
                        Component Architecture & State
                      </p>
                    </div>

                    <div className="grid size-9 shrink-0 place-items-center rounded-full bg-white text-primary shadow-lg transition-transform hover:scale-105">
                      <Play className="ml-0.5 size-4 fill-primary" aria-hidden="true" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Two Generic Course Discovery Cards */}
            <div className="grid grid-cols-2 gap-2.5">
              <div className="flex flex-col justify-between rounded-card border border-line bg-card p-3 shadow-xs">
                <div className="flex items-start justify-between gap-1">
                  <span className="grid size-7 place-items-center rounded-lg bg-lavender text-primary">
                    <Code2 className="size-4" aria-hidden="true" />
                  </span>
                  <span className="rounded-full bg-mint px-2 py-0.5 text-[10px] font-bold text-mint-ink">
                    Free
                  </span>
                </div>
                <div className="mt-2">
                  <p className="text-xs font-bold leading-tight text-ink">
                    TypeScript Fundamentals
                  </p>
                  <p className="mt-1 text-[11px] text-muted">
                    Structured lessons
                  </p>
                </div>
              </div>

              <div className="flex flex-col justify-between rounded-card border border-line bg-card p-3 shadow-xs">
                <div className="flex items-start justify-between gap-1">
                  <span className="grid size-7 place-items-center rounded-lg bg-lavender text-primary">
                    <Layers className="size-4" aria-hidden="true" />
                  </span>
                  <span className="rounded-full bg-mint px-2 py-0.5 text-[10px] font-bold text-mint-ink">
                    Free
                  </span>
                </div>
                <div className="mt-2">
                  <p className="text-xs font-bold leading-tight text-ink">
                    Algorithms & Design
                  </p>
                  <p className="mt-1 text-[11px] text-muted">
                    Practical exercises
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Floating Badges */}
      <div className="absolute -top-3 -right-3 hidden items-center gap-1.5 rounded-full border border-line bg-card px-3.5 py-1.5 text-xs font-bold text-mint-ink shadow-lift sm:inline-flex">
        <BadgeCheck className="size-4 text-mint-ink" aria-hidden="true" />
        <span>Free for everyone</span>
      </div>

      <div className="absolute -bottom-3 -left-3 hidden items-center gap-2 rounded-full border border-line bg-card px-3.5 py-1.5 text-xs font-bold text-primary shadow-lift sm:inline-flex">
        <Sparkles className="size-3.5 text-primary" aria-hidden="true" />
        <span>Mastery-based learning</span>
      </div>
    </div>
  );
}
