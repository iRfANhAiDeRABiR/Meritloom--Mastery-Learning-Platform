"use client";

import * as React from "react";
import { CheckCircle2, Star } from "lucide-react";
import { LearningPathMilestoneCard } from "./learning-path-milestone-card";
import { LearningPathProjectCard } from "./learning-path-project-card";
import { cn } from "@/lib/utils";
import type { LearningPathDetail } from "@/lib/types";

interface LearningPathRoadmapProps {
  path: LearningPathDetail;
  isAuthenticated: boolean;
}

export function LearningPathRoadmap({
  path,
  isAuthenticated,
}: LearningPathRoadmapProps) {
  const learnerProgress = path.learnerProgress;

  return (
    <section aria-labelledby="roadmap-heading" className="section-py relative overflow-hidden transition-colors">
      <div className="container-page relative max-w-6xl">
        {/* Centered Roadmap Introduction */}
        <div className="flex flex-col items-center text-center">
          <h2
            id="roadmap-heading"
            className="heading-2 max-w-xl text-ink"
          >
            Your learning journey
          </h2>
          <p className="lead-text mt-3 max-w-lg text-muted text-base sm:text-lg">
            Follow the recommended sequence or jump into any course whenever you&apos;re ready.
          </p>

          {/* Authenticated Progress Summary Pill */}
          {isAuthenticated && learnerProgress && (
            <div className="mt-6 inline-flex items-center gap-3 rounded-full border border-line bg-card px-4 py-2 text-xs font-semibold text-ink shadow-xs">
              <span className="flex items-center gap-1.5 text-primary">
                <CheckCircle2 className="size-4" aria-hidden="true" />
                <span>
                  {learnerProgress.completedCourses} of {learnerProgress.totalCourses} courses completed
                </span>
              </span>
              <span className="text-line" aria-hidden="true">|</span>
              <span className="text-muted">
                {learnerProgress.overallPercent}% overall path progress
              </span>
            </div>
          )}
        </div>

        {/* ================================================================= */}
        {/* DESKTOP ALTERNATING ROADMAP (>= 768px)                           */}
        {/* ================================================================= */}
        <div className="hidden md:block relative mt-16 lg:mt-24">
          {/* Central Dashed Connector Track */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-8 bottom-12 w-0.5 -translate-x-1/2 border-l-2 border-dashed border-primary/25 dark:border-primary/30 z-0"
          />

          <div className="space-y-16 lg:space-y-24">
            {path.items.map((item, index) => {
              const isLeft = index % 2 === 0;
              const isProject = item.itemType === "project";
              const isCompleted = item.status === "completed";
              const isCurrent = item.isCurrentStep;

              return (
                <div
                  key={item.id}
                  className="relative grid grid-cols-[1fr_auto_1fr] items-center gap-6 lg:gap-12"
                >
                  {/* Left Column Area (44% width) */}
                  <div className={cn("relative z-10", isLeft ? "block" : "hidden md:block md:invisible")}>
                    {isLeft && (
                      isProject ? (
                        <LearningPathProjectCard
                          item={item}
                          isAuthenticated={isAuthenticated}
                        />
                      ) : (
                        <LearningPathMilestoneCard
                          item={item}
                          isLeft={true}
                          isAuthenticated={isAuthenticated}
                        />
                      )
                    )}
                  </div>

                  {/* Central Node Marker */}
                  <div className="relative z-20 flex flex-col items-center justify-center">
                    <div
                      className={cn(
                        "grid size-11 lg:size-12 place-items-center rounded-full border-2 text-xs lg:text-sm font-extrabold shadow-soft transition-all duration-200",
                        isCompleted
                          ? "border-mint-ink bg-mint text-mint-ink dark:bg-mint/30 shadow-[0_0_12px_var(--color-mint-ink)]"
                          : isCurrent
                          ? "border-primary bg-primary text-white shadow-[0_0_16px_var(--color-primary)] ring-4 ring-primary/20"
                          : "border-line bg-card text-muted hover:border-primary/40",
                      )}
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="size-5" aria-hidden="true" />
                      ) : isProject ? (
                        <Star className="size-5 text-amber-300 fill-amber-300" aria-hidden="true" />
                      ) : (
                        <span>0{item.stepNumber}</span>
                      )}
                    </div>
                  </div>

                  {/* Right Column Area (44% width) */}
                  <div className={cn("relative z-10", !isLeft ? "block" : "hidden md:block md:invisible")}>
                    {!isLeft && (
                      isProject ? (
                        <LearningPathProjectCard
                          item={item}
                          isAuthenticated={isAuthenticated}
                        />
                      ) : (
                        <LearningPathMilestoneCard
                          item={item}
                          isLeft={false}
                          isAuthenticated={isAuthenticated}
                        />
                      )
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ================================================================= */}
        {/* MOBILE VERTICAL TIMELINE (< 768px)                               */}
        {/* ================================================================= */}
        <div className="block md:hidden relative mt-12 pl-6 sm:pl-8">
          {/* Left Vertical Dashed Line */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-3 sm:left-4 top-6 bottom-8 w-0.5 border-l-2 border-dashed border-primary/25 dark:border-primary/30 z-0"
          />

          <div className="space-y-8">
            {path.items.map((item) => {
              const isProject = item.itemType === "project";
              const isCompleted = item.status === "completed";
              const isCurrent = item.isCurrentStep;

              return (
                <div key={item.id} className="relative">
                  {/* Left Timeline Node */}
                  <div
                    className={cn(
                      "absolute -left-[23px] sm:-left-[27px] top-6 grid size-8 sm:size-9 place-items-center rounded-full border-2 text-[11px] font-extrabold shadow-xs z-20",
                      isCompleted
                        ? "border-mint-ink bg-mint text-mint-ink dark:bg-mint/30"
                        : isCurrent
                        ? "border-primary bg-primary text-white ring-2 ring-primary/20"
                        : "border-line bg-card text-muted",
                    )}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="size-4" aria-hidden="true" />
                    ) : isProject ? (
                      <Star className="size-3.5 text-amber-300 fill-amber-300" aria-hidden="true" />
                    ) : (
                      <span>0{item.stepNumber}</span>
                    )}
                  </div>

                  {/* Card on Right */}
                  <div className="relative z-10">
                    {isProject ? (
                      <LearningPathProjectCard
                        item={item}
                        isAuthenticated={isAuthenticated}
                      />
                    ) : (
                      <LearningPathMilestoneCard
                        item={item}
                        isLeft={false}
                        isAuthenticated={isAuthenticated}
                      />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
