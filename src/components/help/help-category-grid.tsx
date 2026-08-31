"use client";

import {
  BookOpen,
  ChartNoAxesColumnIncreasing,
  CircleHelp,
  PlayCircle,
  Route,
  UserRound,
} from "lucide-react";
import { HELP_CATEGORIES, type HelpCategory } from "@/lib/data/help-center";
import { cn } from "@/lib/utils";

interface HelpCategoryGridProps {
  selectedCategory: string | null;
  onSelectCategory: (categoryId: string | null) => void;
}

export function HelpCategoryGrid({
  selectedCategory,
  onSelectCategory,
}: HelpCategoryGridProps) {
  const getIcon = (iconName: HelpCategory["iconName"]) => {
    switch (iconName) {
      case "UserRound":
        return <UserRound className="size-5 text-primary" aria-hidden="true" />;
      case "BookOpen":
        return <BookOpen className="size-5 text-amber-500" aria-hidden="true" />;
      case "Route":
        return <Route className="size-5 text-[#8B5CF6]" aria-hidden="true" />;
      case "ChartNoAxesColumnIncreasing":
        return <ChartNoAxesColumnIncreasing className="size-5 text-mint-ink" aria-hidden="true" />;
      case "PlayCircle":
        return <PlayCircle className="size-5 text-cyan-500" aria-hidden="true" />;
      case "CircleHelp":
        return <CircleHelp className="size-5 text-amber-400" aria-hidden="true" />;
      default:
        return <BookOpen className="size-5 text-primary" aria-hidden="true" />;
    }
  };

  return (
    <section aria-labelledby="help-categories-heading" className="section-py bg-surface/50 transition-colors border-y border-line/60">
      <div className="container-page">
        <div className="flex flex-col items-center text-center">
          <span className="text-xs font-extrabold uppercase tracking-wider text-muted">
            Knowledge Base
          </span>
          <h2 id="help-categories-heading" className="heading-2 mt-2 text-ink">
            Browse by category
          </h2>
          <p className="lead-text mt-3 max-w-md text-muted text-base sm:text-lg">
            Select a topic to view related guides and common questions.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {HELP_CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() =>
                  onSelectCategory(isSelected ? null : cat.id)
                }
                className={cn(
                  "flex flex-col items-start text-left gap-3.5 rounded-[22px] border p-6 transition-all duration-200",
                  "hover:-translate-y-1 hover:shadow-lift",
                  isSelected
                    ? "border-primary bg-primary/10 shadow-soft ring-2 ring-primary/20"
                    : "border-line bg-card shadow-soft hover:border-primary/40",
                )}
              >
                <div className="flex w-full items-center justify-between">
                  <span className="grid size-12 place-items-center rounded-xl bg-surface border border-line shadow-xs">
                    {getIcon(cat.iconName)}
                  </span>
                  <span className="text-[11px] font-bold text-muted">
                    {cat.itemCount} articles
                  </span>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-ink">{cat.name}</h3>
                  <p className="mt-1.5 text-xs text-muted leading-relaxed">
                    {cat.description}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {selectedCategory && (
          <div className="mt-8 flex justify-center">
            <button
              type="button"
              onClick={() => onSelectCategory(null)}
              className="text-xs font-bold text-primary hover:underline"
            >
              Show all popular questions
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
