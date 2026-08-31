"use client";

import Link from "next/link";
import { ArrowDown, Braces, Code2, Compass, Palette, Rocket, Route } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { routes } from "@/lib/routes";

export function LearningPathsHeroVisual() {
  return (
    <div className="relative w-full max-w-[480px] select-none">
      {/* Background Radial Glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-8 rounded-[40px] bg-gradient-to-tr from-primary/20 via-[#8B5CF6]/15 to-mint/15 blur-2xl"
      />

      {/* Modern Glassmorphic Connected Path Box */}
      <div className="relative overflow-hidden rounded-[26px] border border-line bg-card/80 backdrop-blur-md p-6 sm:p-7 shadow-lift">
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-line pb-4">
          <div className="flex items-center gap-2">
            <span className="size-2.5 rounded-full bg-rose-400" />
            <span className="size-2.5 rounded-full bg-amber-400" />
            <span className="size-2.5 rounded-full bg-emerald-400" />
          </div>
          <span className="font-mono text-[11px] text-muted">Web Dev Journey</span>
          <span className="text-[10px] font-bold uppercase tracking-wider text-primary bg-lavender px-2 py-0.5 rounded-full">
            Recommended
          </span>
        </div>

        {/* 4 Connected Floating Milestone Cards */}
        <div className="relative mt-6 space-y-4">
          {/* Vertical Connecting Track */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-6 top-5 bottom-5 w-0.5 border-l-2 border-dashed border-primary/30 z-0"
          />

          {/* Node 1: HTML */}
          <div className="relative z-10 flex items-center justify-between gap-3 rounded-xl border border-amber-500/20 bg-amber-500/5 dark:bg-amber-500/10 p-3 shadow-xs hover:-translate-y-0.5 transition-transform duration-200">
            <div className="flex items-center gap-3">
              <div className="grid size-9 place-items-center rounded-lg bg-amber-500/15 text-amber-500 font-bold text-xs shadow-xs">
                <Code2 className="size-4" aria-hidden="true" />
              </div>
              <div>
                <p className="text-xs font-bold text-ink">HTML Fundamentals</p>
                <p className="text-[11px] text-muted">Page structure & semantics</p>
              </div>
            </div>
            <span className="text-[10px] font-extrabold uppercase text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded">
              Step 1
            </span>
          </div>

          {/* Node 2: CSS */}
          <div className="relative z-10 flex items-center justify-between gap-3 rounded-xl border border-cyan-500/20 bg-cyan-500/5 dark:bg-cyan-500/10 p-3 shadow-xs hover:-translate-y-0.5 transition-transform duration-200">
            <div className="flex items-center gap-3">
              <div className="grid size-9 place-items-center rounded-lg bg-cyan-500/15 text-cyan-500 font-bold text-xs shadow-xs">
                <Palette className="size-4" aria-hidden="true" />
              </div>
              <div>
                <p className="text-xs font-bold text-ink">CSS Fundamentals</p>
                <p className="text-[11px] text-muted">Visual styling & responsive layouts</p>
              </div>
            </div>
            <span className="text-[10px] font-extrabold uppercase text-cyan-500 bg-cyan-500/10 px-2 py-0.5 rounded">
              Step 2
            </span>
          </div>

          {/* Node 3: JavaScript */}
          <div className="relative z-10 flex items-center justify-between gap-3 rounded-xl border border-amber-400/20 bg-amber-400/5 dark:bg-amber-400/10 p-3 shadow-xs hover:-translate-y-0.5 transition-transform duration-200">
            <div className="flex items-center gap-3">
              <div className="grid size-9 place-items-center rounded-lg bg-amber-400/15 text-amber-500 font-bold text-xs shadow-xs">
                <Braces className="size-4" aria-hidden="true" />
              </div>
              <div>
                <p className="text-xs font-bold text-ink">JavaScript Fundamentals</p>
                <p className="text-[11px] text-muted">Interactivity & DOM logic</p>
              </div>
            </div>
            <span className="text-[10px] font-extrabold uppercase text-amber-500 bg-amber-400/10 px-2 py-0.5 rounded">
              Step 3
            </span>
          </div>

          {/* Node 4: Capstone Project */}
          <div className="relative z-10 flex items-center justify-between gap-3 rounded-xl border border-primary/30 bg-gradient-to-r from-primary/10 via-[#8B5CF6]/10 to-transparent p-3 shadow-xs hover:-translate-y-0.5 transition-transform duration-200">
            <div className="flex items-center gap-3">
              <div className="grid size-9 place-items-center rounded-lg bg-primary text-white font-bold text-xs shadow-xs">
                <Rocket className="size-4 text-amber-300" aria-hidden="true" />
              </div>
              <div>
                <p className="text-xs font-bold text-ink">Interactive Personal Website</p>
                <p className="text-[11px] text-muted">Capstone portfolio project</p>
              </div>
            </div>
            <span className="text-[10px] font-extrabold uppercase text-primary bg-lavender px-2 py-0.5 rounded">
              Project
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function LearningPathsHero() {
  const handleScrollToPaths = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const elem = document.getElementById("paths");
    if (elem) {
      elem.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section aria-labelledby="paths-hero-heading" className="relative overflow-hidden pt-8 pb-14 sm:pt-14 sm:pb-20 transition-colors">
      {/* Ambient Lighting Orbs */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-32 left-1/3 h-[460px] w-[780px] -translate-x-1/2 rounded-full bg-gradient-to-b from-primary/18 via-[#8B5CF6]/12 to-transparent blur-[130px] dark:from-primary/22 dark:via-[#7C3AED]/15"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 -right-20 size-[320px] rounded-full bg-mint/15 blur-[100px] dark:bg-mint/10"
      />

      <div className="container-page relative grid items-center gap-12 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:gap-12">
        {/* Left Column: Hero Copy */}
        <div className="flex max-w-xl flex-col items-start gap-6 text-left">
          <Badge
            variant="default"
            className="gap-2 border border-primary/20 bg-primary/10 dark:border-primary/30 dark:bg-primary/20 px-3.5 py-1.5 text-xs font-bold text-primary dark:text-white shadow-soft"
          >
            <Route className="size-3.5 text-primary dark:text-mint" aria-hidden="true" />
            <span>GUIDED LEARNING</span>
          </Badge>

          <h1
            id="paths-hero-heading"
            className="text-4xl font-extrabold leading-[1.12] text-ink sm:text-5xl lg:text-[3.25rem] tracking-tight"
          >
            Build skills in the{" "}
            <span className="bg-gradient-to-r from-primary via-[#8B5CF6] to-[#A855F7] bg-clip-text text-transparent">
              right order.
            </span>
          </h1>

          <p className="lead-text max-w-lg text-muted text-base sm:text-lg">
            Learning Paths combine related free courses into a clear sequence so you always know what to learn next.
          </p>

          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row items-center pt-2">
            <Button
              asChild
              size="lg"
              className="w-full sm:w-auto gap-2 shadow-lift hover:-translate-y-0.5 transition-transform font-bold"
            >
              <a href="#paths" onClick={handleScrollToPaths}>
                <span>Explore learning paths</span>
                <ArrowDown className="size-4" aria-hidden="true" />
              </a>
            </Button>

            <Button
              asChild
              variant="outline"
              size="lg"
              className="w-full sm:w-auto gap-2 hover:-translate-y-0.5 transition-transform"
            >
              <Link href={routes.courses.index}>
                <Compass className="size-4 text-muted" aria-hidden="true" />
                <span>Browse individual courses</span>
              </Link>
            </Button>
          </div>
        </div>

        {/* Right Column: Visual Journey Graphic */}
        <div className="flex justify-center lg:justify-end">
          <LearningPathsHeroVisual />
        </div>
      </div>
    </section>
  );
}
