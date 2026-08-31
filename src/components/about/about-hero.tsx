"use client";

import Link from "next/link";
import { ArrowRight, BookOpen, Compass, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { routes } from "@/lib/routes";

export function AboutHeroVisual() {
  return (
    <div className="relative w-full max-w-[480px] select-none">
      {/* Ambient Lighting Glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-8 rounded-[40px] bg-gradient-to-tr from-primary/20 via-[#8B5CF6]/15 to-mint/15 blur-2xl"
      />

      {/* Glassmorphic Learning System Box */}
      <div className="relative overflow-hidden rounded-[26px] border border-line bg-card/85 backdrop-blur-md p-6 sm:p-7 shadow-lift">
        <div className="flex items-center justify-between border-b border-line pb-4">
          <span className="font-mono text-xs text-muted">The Learning Ecosystem</span>
          <span className="rounded-full bg-lavender px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-primary">
            Curated Flow
          </span>
        </div>

        {/* 4 Connected Learning Stages */}
        <div className="relative mt-6 grid grid-cols-2 gap-3.5">
          {/* Stage 1: Learn */}
          <div className="flex flex-col items-center justify-center gap-1.5 rounded-2xl border border-amber-500/30 bg-amber-500/5 dark:bg-amber-500/10 p-4 text-center shadow-xs">
            <span className="font-mono text-[10px] font-extrabold uppercase text-amber-500 bg-amber-500/15 px-2 py-0.5 rounded">
              HTML
            </span>
            <p className="text-xs font-bold text-ink mt-1">1. Structure</p>
            <p className="text-[10px] text-muted">Understand foundations</p>
          </div>

          {/* Stage 2: Style */}
          <div className="flex flex-col items-center justify-center gap-1.5 rounded-2xl border border-cyan-500/30 bg-cyan-500/5 dark:bg-cyan-500/10 p-4 text-center shadow-xs">
            <span className="font-mono text-[10px] font-extrabold uppercase text-cyan-500 bg-cyan-500/15 px-2 py-0.5 rounded">
              CSS
            </span>
            <p className="text-xs font-bold text-ink mt-1">2. Layout</p>
            <p className="text-[10px] text-muted">Design responsive UI</p>
          </div>

          {/* Stage 3: Logic */}
          <div className="flex flex-col items-center justify-center gap-1.5 rounded-2xl border border-amber-400/30 bg-amber-400/5 dark:bg-amber-400/10 p-4 text-center shadow-xs">
            <span className="font-mono text-[10px] font-extrabold uppercase text-amber-500 bg-amber-400/15 px-2 py-0.5 rounded">
              JS
            </span>
            <p className="text-xs font-bold text-ink mt-1">3. Behavior</p>
            <p className="text-[10px] text-muted">Add interactivity</p>
          </div>

          {/* Stage 4: Capstone */}
          <div className="flex flex-col items-center justify-center gap-1.5 rounded-2xl border border-primary/40 bg-primary/10 p-4 text-center shadow-xs">
            <span className="font-mono text-[10px] font-extrabold uppercase text-primary bg-lavender px-2 py-0.5 rounded">
              PATH
            </span>
            <p className="text-xs font-bold text-ink mt-1">4. Project</p>
            <p className="text-[10px] text-muted">Build something real</p>
          </div>
        </div>

        {/* Bottom Connected Status Bar */}
        <div className="mt-4 pt-3 border-t border-line/60 flex items-center justify-between text-[11px] font-semibold text-muted">
          <span>Zero paywalls</span>
          <span className="text-primary font-bold">100% Free Access</span>
          <span>Self-paced</span>
        </div>
      </div>
    </div>
  );
}

export function AboutHero() {
  return (
    <section
      aria-labelledby="about-hero-heading"
      className="relative overflow-hidden pt-8 pb-14 sm:pt-14 sm:pb-20 transition-colors"
    >
      {/* Background Lighting */}
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
            <Sparkles className="size-3.5 text-primary dark:text-mint" aria-hidden="true" />
            <span>ABOUT MERITLOOM</span>
          </Badge>

          <h1
            id="about-hero-heading"
            className="text-4xl font-extrabold leading-[1.12] text-ink sm:text-5xl lg:text-[3.25rem] tracking-tight"
          >
            Learning should feel{" "}
            <span className="bg-gradient-to-r from-primary via-[#8B5CF6] to-[#A855F7] bg-clip-text text-transparent">
              clear, not overwhelming.
            </span>
          </h1>

          <p className="lead-text max-w-lg text-muted text-base sm:text-lg">
            Meritloom organizes free learning into structured courses, practical lessons, and guided paths so you can focus on understanding what matters and keep moving forward.
          </p>

          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row items-center pt-2">
            <Button
              asChild
              size="lg"
              className="w-full sm:w-auto gap-2 shadow-lift hover:-translate-y-0.5 transition-transform font-bold"
            >
              <Link href={routes.courses.index}>
                <BookOpen className="size-4" aria-hidden="true" />
                <span>Explore courses</span>
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </Button>

            <Button
              asChild
              variant="outline"
              size="lg"
              className="w-full sm:w-auto gap-2 hover:-translate-y-0.5 transition-transform"
            >
              <Link href={routes.howItWorks}>
                <Compass className="size-4 text-muted" aria-hidden="true" />
                <span>How Meritloom works</span>
              </Link>
            </Button>
          </div>
        </div>

        {/* Right Column: Hero Visual */}
        <div className="flex justify-center lg:justify-end">
          <AboutHeroVisual />
        </div>
      </div>
    </section>
  );
}
