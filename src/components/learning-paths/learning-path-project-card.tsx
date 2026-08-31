"use client";

import Link from "next/link";
import { ArrowRight, CheckCircle2, Rocket, Sparkles, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { LearningPathProjectItem } from "@/lib/types";

interface LearningPathProjectCardProps {
  item: LearningPathProjectItem;
  isAuthenticated?: boolean;
}

export function LearningPathProjectCard({
  item,
}: LearningPathProjectCardProps) {
  const isCurrent = item.isCurrentStep;

  return (
    <div
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-[24px] p-6 sm:p-8 text-white shadow-lift transition-all duration-200",
        "hover:-translate-y-1 hover:shadow-[0_20px_50px_-15px_rgba(109,74,255,0.45)]",
        isCurrent ? "ring-2 ring-amber-300/60" : "",
        "bg-gradient-to-br from-[#6847F5] via-[#7C5CFF] to-[#9A7CFF]",
      )}
    >
      {/* Background Decorative Sparkles & Ambient Rings */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-12 -right-12 size-48 rounded-full bg-white/15 blur-2xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-16 -left-16 size-52 rounded-full bg-black/20 blur-2xl"
      />

      {/* Top Header Row with Floating Rocket Icon */}
      <div className="relative z-10 flex items-start justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="grid size-12 sm:size-14 place-items-center rounded-[16px] border border-white/30 bg-white/15 backdrop-blur-md shadow-xs text-white transition-transform duration-200 group-hover:-translate-y-0.5">
            <Rocket className="size-6 text-amber-300" aria-hidden="true" />
          </div>

          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-extrabold uppercase tracking-widest text-white/80">
                {item.stepLabel}
              </span>
              <Star className="size-3 text-amber-300 fill-amber-300" aria-hidden="true" />
            </div>
            <h3 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white">
              {item.title}
            </h3>
          </div>
        </div>

        <Badge
          variant="default"
          className="border-white/30 bg-white/20 text-white font-bold px-3 py-1 text-xs backdrop-blur-sm"
        >
          <Sparkles className="size-3 text-amber-300" aria-hidden="true" />
          <span>CAPSTONE</span>
        </Badge>
      </div>

      {/* Description */}
      <p className="relative z-10 mt-4 text-sm sm:text-[15px] leading-relaxed text-white/90">
        {item.description}
      </p>

      {/* Outcomes Checklist */}
      <div className="relative z-10 mt-5 rounded-xl border border-white/20 bg-white/10 p-4 backdrop-blur-sm">
        <p className="text-xs font-bold uppercase tracking-wider text-white/80">
          What you will build:
        </p>
        <ul className="mt-2.5 space-y-2 text-xs sm:text-sm text-white/95">
          {item.outcomes.map((outcome, idx) => (
            <li key={idx} className="flex items-start gap-2">
              <CheckCircle2 className="size-4 text-emerald-300 shrink-0 mt-0.5" aria-hidden="true" />
              <span>{outcome}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Footer CTA */}
      <div className="relative z-10 mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-white/20 pt-5">
        <span className="text-xs font-semibold text-white/80">
          Final interactive milestone
        </span>

        <Button
          asChild
          size="sm"
          className="bg-white text-primary hover:bg-white/90 active:bg-white/80 font-bold shadow-soft hover:-translate-y-0.5 transition-all"
        >
          <Link href={item.projectUrl || "/courses/javascript-fundamentals"}>
            <span>Start Final Project</span>
            <ArrowRight className="size-3.5 text-primary transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden="true" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
