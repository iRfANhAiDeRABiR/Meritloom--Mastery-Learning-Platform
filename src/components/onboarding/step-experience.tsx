"use client";

import * as React from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  HelpCircle,
  Layers3,
  Rocket,
  Sparkles,
  Sprout,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import type { CourseDifficulty } from "@/lib/types";
import { cn } from "@/lib/utils";

interface StepExperienceProps {
  selectedLevel: CourseDifficulty | null;
  notSureLevel: boolean;
  onSelectLevel: (level: CourseDifficulty) => void;
  onSelectNotSure: () => void;
  onNext: () => void;
  onBack: () => void;
}

const LEVELS = [
  {
    id: "beginner" as CourseDifficulty,
    icon: Sprout,
    title: "Beginner",
    description: "I'm new to this subject or still learning the basics.",
  },
  {
    id: "intermediate" as CourseDifficulty,
    icon: Layers3,
    title: "Intermediate",
    description: "I understand the basics and want to build stronger skills.",
  },
  {
    id: "advanced" as CourseDifficulty,
    icon: Rocket,
    title: "Advanced",
    description: "I'm comfortable with the subject and want deeper material.",
  },
] as const;

export function StepExperience({
  selectedLevel,
  notSureLevel,
  onSelectLevel,
  onSelectNotSure,
  onNext,
  onBack,
}: StepExperienceProps) {
  const canContinue = selectedLevel !== null || notSureLevel;

  return (
    <div className="flex flex-col gap-8">
      {/* Header & Step Badge */}
      <div className="flex flex-col items-start gap-3">
        <Badge
          variant="default"
          className="gap-1.5 border border-primary/30 bg-primary/10 px-3 py-0.5 text-xs font-bold text-primary shadow-xs"
        >
          <Sparkles className="size-3 text-primary" aria-hidden="true" />
          Step 2 of 3
        </Badge>

        <h1 className="text-2xl font-bold tracking-tight text-ink sm:text-3xl lg:text-[34px]">
          Where are you starting from?
        </h1>
        <p className="lead-text max-w-xl text-sm text-muted sm:text-base">
          Choose the option that best matches your experience. You can change
          this anytime later.
        </p>
      </div>

      {/* 3 Large Experience Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        {LEVELS.map((lvl) => {
          const isSelected = selectedLevel === lvl.id && !notSureLevel;
          const Icon = lvl.icon;

          return (
            <button
              key={lvl.id}
              type="button"
              onClick={() => onSelectLevel(lvl.id)}
              aria-pressed={isSelected}
              className={cn(
                "group relative flex flex-col items-start gap-4 rounded-[18px] border p-6 text-left transition-all duration-200 cursor-pointer shadow-xs hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                isSelected
                  ? "border-primary/60 bg-lavender/70 shadow-soft ring-1 ring-primary/40"
                  : "border-line bg-card hover:border-primary/30 hover:bg-surface",
              )}
            >
              <div className="flex w-full items-center justify-between">
                <span
                  className={cn(
                    "grid size-12 place-items-center rounded-[14px] transition-colors",
                    isSelected
                      ? "bg-primary text-white shadow-xs"
                      : "bg-surface border border-line text-primary group-hover:border-primary/40",
                  )}
                >
                  <Icon className="size-6" aria-hidden="true" />
                </span>

                {isSelected && (
                  <span className="grid size-5 place-items-center rounded-full bg-primary text-white">
                    <Check className="size-3 stroke-[3]" aria-hidden="true" />
                  </span>
                )}
              </div>

              <div className="flex flex-col gap-1.5 pt-1">
                <span className="text-base font-bold text-ink">
                  {lvl.title}
                </span>
                <span className="text-xs leading-relaxed text-muted">
                  {lvl.description}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Optional "Not sure yet" Option */}
      <button
        type="button"
        onClick={onSelectNotSure}
        aria-pressed={notSureLevel}
        className={cn(
          "flex items-center gap-3 rounded-[16px] border p-4 text-left transition-all duration-200 cursor-pointer shadow-xs hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
          notSureLevel
            ? "border-primary/60 bg-lavender/70 shadow-soft ring-1 ring-primary/40"
            : "border-line bg-card hover:border-primary/30 hover:bg-surface",
        )}
      >
        <span
          className={cn(
            "grid size-9 shrink-0 place-items-center rounded-[10px] transition-colors",
            notSureLevel
              ? "bg-primary text-white"
              : "bg-surface text-muted border border-line",
          )}
        >
          <HelpCircle className="size-4.5" aria-hidden="true" />
        </span>

        <div className="flex flex-1 flex-col">
          <span className="text-sm font-bold text-ink">Not sure yet</span>
          <span className="text-xs text-muted">
            That&apos;s okay — we&apos;ll start with beginner-friendly recommendations
            and you can adjust anytime.
          </span>
        </div>

        {notSureLevel && (
          <span className="grid size-5 shrink-0 place-items-center rounded-full bg-primary text-white">
            <Check className="size-3 stroke-[3]" aria-hidden="true" />
          </span>
        )}
      </button>

      {/* Step 2 Actions */}
      <div className="flex items-center justify-between gap-4 pt-4 border-t border-line">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-2 text-xs font-bold text-muted hover:text-ink transition-colors cursor-pointer py-2 px-3"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          <span>Back</span>
        </button>

        <button
          type="button"
          onClick={onNext}
          disabled={!canContinue}
          className="group flex h-[48px] items-center justify-center gap-2.5 rounded-[13px] bg-gradient-to-r from-[#7357FF] via-[#7C5CFF] to-[#6847F5] px-8 text-sm font-bold text-white shadow-soft transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_4px_20px_rgba(109,74,255,0.35)] active:translate-y-0 disabled:pointer-events-none disabled:opacity-50 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          <span>Continue</span>
          <ArrowRight
            className="size-4 transition-transform duration-200 group-hover:translate-x-0.5"
            aria-hidden="true"
          />
        </button>
      </div>
    </div>
  );
}

