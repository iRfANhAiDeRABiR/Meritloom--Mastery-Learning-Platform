"use client";

import Link from "next/link";
import {
  ArrowRight,
  ChartNoAxesColumnIncreasing,
  Compass,
  PencilLine,
  PlayCircle,
  Rocket,
  Sparkles,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { routes } from "@/lib/routes";
import type { LearnerProfile } from "@/lib/types";

export function HowItWorksHeroVisual() {
  const steps = [
    { label: "Discover", icon: Compass, color: "text-primary bg-primary/10 border-primary/20" },
    { label: "Learn", icon: PlayCircle, color: "text-amber-500 bg-amber-500/10 border-amber-500/20" },
    { label: "Practice", icon: PencilLine, color: "text-cyan-500 bg-cyan-500/10 border-cyan-500/20" },
    { label: "Progress", icon: ChartNoAxesColumnIncreasing, color: "text-mint-ink bg-mint/30 border-mint-ink/20" },
    { label: "Build", icon: Rocket, color: "text-[#8B5CF6] bg-[#8B5CF6]/10 border-[#8B5CF6]/20" },
  ];

  return (
    <div className="relative w-full max-w-[480px] select-none">
      {/* Background Ambient Glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-8 rounded-[40px] bg-gradient-to-tr from-primary/20 via-[#8B5CF6]/15 to-mint/15 blur-2xl"
      />

      {/* Glassmorphic Container */}
      <div className="relative overflow-hidden rounded-[26px] border border-line bg-card/85 backdrop-blur-md p-6 sm:p-7 shadow-lift">
        <div className="flex items-center justify-between border-b border-line pb-4">
          <span className="font-mono text-xs text-muted">Learner Lifecycle</span>
          <span className="rounded-full bg-lavender px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-primary">
            Continuous Flow
          </span>
        </div>

        {/* Vertical Connected Flow */}
        <div className="relative mt-6 space-y-3.5">
          {/* Connector Line */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-5 top-4 bottom-4 w-0.5 border-l-2 border-dashed border-primary/30 z-0"
          />

          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={step.label}
                className="relative z-10 flex items-center justify-between gap-3 rounded-xl border border-line bg-surface/70 p-3 shadow-xs transition-transform duration-200 hover:-translate-y-0.5 hover:border-primary/30"
              >
                <div className="flex items-center gap-3">
                  <div className={`grid size-8 place-items-center rounded-lg border ${step.color} shadow-xs`}>
                    <Icon className="size-4" aria-hidden="true" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-ink">{step.label}</span>
                  </div>
                </div>

                <span className="font-mono text-[10px] font-bold text-muted">
                  0{idx + 1}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export function HowItWorksHero({ user }: { user: LearnerProfile | null }) {
  const startHref = user ? routes.courses.index : routes.auth.signUp;

  return (
    <section
      aria-labelledby="how-hero-heading"
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
        {/* Left Column: Hero Text */}
        <div className="flex max-w-xl flex-col items-start gap-6 text-left">
          <Badge
            variant="default"
            className="gap-2 border border-primary/20 bg-primary/10 dark:border-primary/30 dark:bg-primary/20 px-3.5 py-1.5 text-xs font-bold text-primary dark:text-white shadow-soft"
          >
            <Sparkles className="size-3.5 text-primary dark:text-mint" aria-hidden="true" />
            <span>HOW MERITLOOM WORKS</span>
          </Badge>

          <h1
            id="how-hero-heading"
            className="text-4xl font-extrabold leading-[1.12] text-ink sm:text-5xl lg:text-[3.25rem] tracking-tight"
          >
            A{" "}
            <span className="bg-gradient-to-r from-primary via-[#8B5CF6] to-[#A855F7] bg-clip-text text-transparent">
              clearer way
            </span>{" "}
            to learn.
          </h1>

          <p className="lead-text max-w-lg text-muted text-base sm:text-lg">
            Find a skill, follow structured lessons, practice what you learn, and continue at your own pace — all for free.
          </p>

          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row items-center pt-2">
            <Button
              asChild
              size="lg"
              className="w-full sm:w-auto gap-2 shadow-lift hover:-translate-y-0.5 transition-transform font-bold"
            >
              <Link href={startHref}>
                <span>Start learning free</span>
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </Button>

            <Button
              asChild
              variant="outline"
              size="lg"
              className="w-full sm:w-auto gap-2 hover:-translate-y-0.5 transition-transform"
            >
              <Link href={routes.courses.index}>
                <Compass className="size-4 text-muted" aria-hidden="true" />
                <span>Explore courses</span>
              </Link>
            </Button>
          </div>
        </div>

        {/* Right Column: Flow Diagram */}
        <div className="flex justify-center lg:justify-end">
          <HowItWorksHeroVisual />
        </div>
      </div>
    </section>
  );
}
