"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";

import type { LearnerTabStatus, MyLearningCounts } from "@/lib/types";
import { cn } from "@/lib/utils";

interface CourseStatusTabsProps {
  currentTab: LearnerTabStatus;
  counts: MyLearningCounts;
}

const TABS = [
  { id: "active" as LearnerTabStatus, label: "In progress" },
  { id: "completed" as LearnerTabStatus, label: "Completed" },
  { id: "saved" as LearnerTabStatus, label: "Saved" },
] as const;

export function CourseStatusTabs({
  currentTab,
  counts,
}: CourseStatusTabsProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleTabChange = (tabId: LearnerTabStatus) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("status", tabId);
    router.push(`/learn/courses?${params.toString()}`);
  };

  const getCount = (tabId: LearnerTabStatus) => {
    switch (tabId) {
      case "active":
        return counts.activeCount;
      case "completed":
        return counts.completedCount;
      case "saved":
        return counts.savedCount;
      default:
        return 0;
    }
  };

  return (
    <div
      role="tablist"
      aria-label="Course status filters"
      className="flex flex-wrap items-center gap-2 border-b border-line pb-4"
    >
      {TABS.map((tab) => {
        const isSelected = currentTab === tab.id;
        const count = getCount(tab.id);

        return (
          <button
            key={tab.id}
            role="tab"
            type="button"
            aria-selected={isSelected}
            onClick={() => handleTabChange(tab.id)}
            className={cn(
              "flex items-center gap-2 rounded-[12px] px-4 py-2 text-xs font-bold transition-all duration-200 cursor-pointer shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
              isSelected
                ? "bg-lavender text-primary shadow-soft ring-1 ring-primary/30"
                : "border border-line bg-card text-muted hover:border-primary/30 hover:bg-surface hover:text-ink",
            )}
          >
            <span>{tab.label}</span>
            <span
              className={cn(
                "grid min-w-[20px] h-5 place-items-center rounded-full px-1.5 text-[11px] font-extrabold transition-colors",
                isSelected
                  ? "bg-primary text-white"
                  : "bg-surface text-muted border border-line",
              )}
            >
              {count}
            </span>
          </button>
        );
      })}
    </div>
  );
}

