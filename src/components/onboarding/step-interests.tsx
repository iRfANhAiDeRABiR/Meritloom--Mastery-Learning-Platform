"use client";

import * as React from "react";
import {
  ArrowRight,
  BookOpenCheck,
  Check,
  Compass,
  Search,
  Sparkles,
  TrendingUp,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import type { Category, PrimaryLearningGoal } from "@/lib/types";
import { cn } from "@/lib/utils";

interface StepInterestsProps {
  categories: Category[];
  selectedGoal: PrimaryLearningGoal | null;
  selectedInterests: string[];
  onSelectGoal: (goal: PrimaryLearningGoal) => void;
  onToggleInterest: (slug: string) => void;
  onNext: () => void;
  onSkip: () => void;
}

const GOALS = [
  {
    id: "explore" as PrimaryLearningGoal,
    icon: Compass,
    title: "Explore something new",
    description: "Discover a new subject or skill from the beginning.",
  },
  {
    id: "practical" as PrimaryLearningGoal,
    icon: TrendingUp,
    title: "Build practical skills",
    description: "Learn useful skills through structured lessons and practice.",
  },
  {
    id: "deepen" as PrimaryLearningGoal,
    icon: BookOpenCheck,
    title: "Strengthen my knowledge",
    description: "Review concepts you already know and go deeper.",
  },
] as const;

export function StepInterests({
  categories,
  selectedGoal,
  selectedInterests,
  onSelectGoal,
  onToggleInterest,
  onNext,
  onSkip,
}: StepInterestsProps) {
  const [searchQuery, setSearchQuery] = React.useState("");

  const filteredCategories = React.useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return categories;
    return categories.filter(
      (c) =>
        c.name.toLowerCase().includes(q) || c.slug.toLowerCase().includes(q),
    );
  }, [categories, searchQuery]);

  const canContinue = selectedInterests.length >= 1;

  return (
    <div className="flex flex-col gap-8">
      {/* Header & Step Badge */}
      <div className="flex flex-col items-start gap-3">
        <Badge
          variant="default"
          className="gap-1.5 border border-primary/30 bg-primary/10 px-3 py-0.5 text-xs font-bold text-primary shadow-xs"
        >
          <Sparkles className="size-3 text-primary" aria-hidden="true" />
          Step 1 of 3
        </Badge>

        <h1 className="text-2xl font-bold tracking-tight text-ink sm:text-3xl lg:text-[34px]">
          What would you like to learn?
        </h1>
        <p className="lead-text max-w-xl text-sm text-muted sm:text-base">
          Choose one or more topics and we&apos;ll recommend free courses that match
          your interests.
        </p>
      </div>

      {/* 1. Primary Learning Goal Cards (3 cards, single select) */}
      <div className="flex flex-col gap-3">
        <h2 className="text-xs font-bold uppercase tracking-wider text-muted">
          Your primary goal
        </h2>

        <div className="grid gap-3 sm:grid-cols-3">
          {GOALS.map((goal) => {
            const isSelected = selectedGoal === goal.id;
            const Icon = goal.icon;

            return (
              <button
                key={goal.id}
                type="button"
                onClick={() => onSelectGoal(goal.id)}
                aria-pressed={isSelected}
                className={cn(
                  "group relative flex flex-col items-start gap-3 rounded-[16px] border p-5 text-left transition-all duration-200 cursor-pointer shadow-xs hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                  isSelected
                    ? "border-primary/60 bg-lavender/70 shadow-soft ring-1 ring-primary/40"
                    : "border-line bg-card hover:border-primary/30 hover:bg-surface",
                )}
              >
                <div className="flex w-full items-center justify-between">
                  <span
                    className={cn(
                      "grid size-10 place-items-center rounded-[12px] transition-colors",
                      isSelected
                        ? "bg-primary text-white shadow-xs"
                        : "bg-surface border border-line text-primary group-hover:border-primary/40",
                    )}
                  >
                    <Icon className="size-5" aria-hidden="true" />
                  </span>

                  {isSelected && (
                    <span className="grid size-5 place-items-center rounded-full bg-primary text-white">
                      <Check className="size-3 stroke-[3]" aria-hidden="true" />
                    </span>
                  )}
                </div>

                <div className="flex flex-col gap-1">
                  <span className="text-sm font-bold text-ink">
                    {goal.title}
                  </span>
                  <span className="text-xs leading-relaxed text-muted">
                    {goal.description}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Topics / Interests Multi-Select */}
      <div className="flex flex-col gap-3.5 pt-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-xs font-bold uppercase tracking-wider text-muted">
            What are you interested in?
          </h2>
          <span className="text-xs font-semibold text-primary">
            {selectedInterests.length} of 5 selected
          </span>
        </div>

        {/* Optional quick search for topics */}
        {categories.length > 8 && (
          <div className="relative mb-1">
            <Search
              className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted"
              aria-hidden="true"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search topics..."
              className="h-10 w-full rounded-xl border border-line bg-card pl-10 pr-4 text-xs text-ink placeholder:text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
        )}

        {/* Category Pill Chips */}
        <div className="flex flex-wrap gap-2.5">
          {filteredCategories.map((cat) => {
            const isSelected = selectedInterests.includes(cat.slug);

            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => onToggleInterest(cat.slug)}
                aria-pressed={isSelected}
                className={cn(
                  "flex items-center gap-2 rounded-full border px-4 py-2.5 text-xs font-bold transition-all duration-200 cursor-pointer shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                  isSelected
                    ? "border-primary/60 bg-primary text-white shadow-soft"
                    : "border-line bg-card text-ink hover:border-primary/40 hover:bg-surface",
                )}
              >
                {isSelected && (
                  <Check className="size-3.5 stroke-[2.5]" aria-hidden="true" />
                )}
                <span>{cat.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Step 1 Actions */}
      <div className="flex flex-col-reverse items-center justify-between gap-4 pt-4 border-t border-line sm:flex-row">
        <button
          type="button"
          onClick={onSkip}
          className="text-xs font-bold text-muted hover:text-ink transition-colors cursor-pointer py-2 px-3"
        >
          Skip for now
        </button>

        <button
          type="button"
          onClick={onNext}
          disabled={!canContinue}
          className="group flex h-[48px] w-full items-center justify-center gap-2.5 rounded-[13px] bg-gradient-to-r from-[#7357FF] via-[#7C5CFF] to-[#6847F5] px-8 text-sm font-bold text-white shadow-soft transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_4px_20px_rgba(109,74,255,0.35)] active:translate-y-0 disabled:pointer-events-none disabled:opacity-50 sm:w-auto cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
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

