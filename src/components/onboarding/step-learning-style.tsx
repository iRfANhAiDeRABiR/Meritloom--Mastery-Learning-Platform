"use client";

import * as React from "react";
import {
  ArrowLeft,
  ArrowRight,
  Bell,
  BookOpen,
  Check,
  CircleHelp,
  Hammer,
  Loader2,
  PencilLine,
  PlayCircle,
  Sparkles,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import type { ContentPreference, StudyPace } from "@/lib/types";
import { cn } from "@/lib/utils";

interface StepLearningStyleProps {
  selectedPace: StudyPace | null;
  selectedFormats: ContentPreference[];
  remindersEnabled: boolean;
  isLoading: boolean;
  onSelectPace: (pace: StudyPace) => void;
  onToggleFormat: (format: ContentPreference) => void;
  onToggleReminders: () => void;
  onSubmit: () => void;
  onBack: () => void;
}

const PACES = [
  { id: "15_min" as StudyPace, label: "15 min/day" },
  { id: "30_min" as StudyPace, label: "30 min/day" },
  { id: "45_min" as StudyPace, label: "45 min/day" },
  { id: "60_min" as StudyPace, label: "1 hour/day" },
  { id: "few_times_week" as StudyPace, label: "A few times a week" },
  { id: "no_schedule" as StudyPace, label: "No schedule" },
] as const;

const FORMATS = [
  {
    id: "video" as ContentPreference,
    icon: PlayCircle,
    label: "Video lessons",
    desc: "Visual walkthroughs & code-alongs",
  },
  {
    id: "reading" as ContentPreference,
    icon: BookOpen,
    label: "Reading & guides",
    desc: "Clear explanations & references",
  },
  {
    id: "exercises" as ContentPreference,
    icon: PencilLine,
    label: "Practice exercises",
    desc: "Hands-on coding challenges",
  },
  {
    id: "projects" as ContentPreference,
    icon: Hammer,
    label: "Practical projects",
    desc: "Build real-world solutions",
  },
  {
    id: "knowledge_checks" as ContentPreference,
    icon: CircleHelp,
    label: "Quick knowledge checks",
    desc: "Verify concept mastery",
  },
] as const;

export function StepLearningStyle({
  selectedPace,
  selectedFormats,
  remindersEnabled,
  isLoading,
  onSelectPace,
  onToggleFormat,
  onToggleReminders,
  onSubmit,
  onBack,
}: StepLearningStyleProps) {
  return (
    <div className="flex flex-col gap-8">
      {/* Header & Step Badge */}
      <div className="flex flex-col items-start gap-3">
        <Badge
          variant="default"
          className="gap-1.5 border border-primary/30 bg-primary/10 px-3 py-0.5 text-xs font-bold text-primary shadow-xs"
        >
          <Sparkles className="size-3 text-primary" aria-hidden="true" />
          Step 3 of 3
        </Badge>

        <h1 className="text-2xl font-bold tracking-tight text-ink sm:text-3xl lg:text-[34px]">
          How would you like to learn?
        </h1>
        <p className="lead-text max-w-xl text-sm text-muted sm:text-base">
          Choose a pace and format that feels comfortable. This won&apos;t limit what
          you can access.
        </p>
      </div>

      {/* 1. Study Pace Options */}
      <div className="flex flex-col gap-3">
        <h2 className="text-xs font-bold uppercase tracking-wider text-muted">
          How much time would you usually like to spend?
        </h2>

        <div className="flex flex-wrap gap-2.5">
          {PACES.map((pace) => {
            const isSelected = selectedPace === pace.id;

            return (
              <button
                key={pace.id}
                type="button"
                onClick={() => onSelectPace(pace.id)}
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
                <span>{pace.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Content Preferences (Multi-Select) */}
      <div className="flex flex-col gap-3 pt-2">
        <h2 className="text-xs font-bold uppercase tracking-wider text-muted">
          What helps you learn best?
        </h2>

        <div className="grid gap-3 sm:grid-cols-2">
          {FORMATS.map((fmt) => {
            const isSelected = selectedFormats.includes(fmt.id);
            const Icon = fmt.icon;

            return (
              <button
                key={fmt.id}
                type="button"
                onClick={() => onToggleFormat(fmt.id)}
                aria-pressed={isSelected}
                className={cn(
                  "group flex items-start gap-3 rounded-[16px] border p-4 text-left transition-all duration-200 cursor-pointer shadow-xs hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                  isSelected
                    ? "border-primary/60 bg-lavender/70 shadow-soft ring-1 ring-primary/40"
                    : "border-line bg-card hover:border-primary/30 hover:bg-surface",
                )}
              >
                <span
                  className={cn(
                    "grid size-9 shrink-0 place-items-center rounded-[10px] transition-colors",
                    isSelected
                      ? "bg-primary text-white"
                      : "bg-surface border border-line text-primary group-hover:border-primary/40",
                  )}
                >
                  <Icon className="size-4.5" aria-hidden="true" />
                </span>

                <div className="flex flex-1 flex-col">
                  <span className="text-sm font-bold text-ink">
                    {fmt.label}
                  </span>
                  <span className="text-xs text-muted">
                    {fmt.desc}
                  </span>
                </div>

                {isSelected && (
                  <span className="grid size-4.5 shrink-0 place-items-center rounded-full bg-primary text-white mt-0.5">
                    <Check className="size-2.5 stroke-[3]" aria-hidden="true" />
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Study Reminder Toggle */}
      <div className="rounded-[16px] border border-line bg-card p-4.5 shadow-xs">
        <label className="flex items-center justify-between gap-4 cursor-pointer">
          <div className="flex items-center gap-3">
            <span className="grid size-9 shrink-0 place-items-center rounded-[10px] bg-surface text-primary border border-line">
              <Bell className="size-4.5" aria-hidden="true" />
            </span>
            <div className="flex flex-col text-left">
              <span className="text-sm font-bold text-ink">
                Help me remember to learn
              </span>
              <span className="text-xs text-muted">
                You can configure study reminders anytime in your settings.
              </span>
            </div>
          </div>

          <button
            type="button"
            role="switch"
            aria-checked={remindersEnabled}
            onClick={onToggleReminders}
            className={cn(
              "relative inline-flex h-6 w-11 shrink-0 rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
              remindersEnabled ? "bg-primary" : "bg-line",
            )}
          >
            <span
              aria-hidden="true"
              className={cn(
                "pointer-events-none inline-block size-5 rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out",
                remindersEnabled ? "translate-x-5" : "translate-x-0",
              )}
            />
          </button>
        </label>
      </div>

      {/* Step 3 Actions */}
      <div className="flex items-center justify-between gap-4 pt-4 border-t border-line">
        <button
          type="button"
          onClick={onBack}
          disabled={isLoading}
          className="flex items-center gap-2 text-xs font-bold text-muted hover:text-ink transition-colors cursor-pointer py-2 px-3 disabled:opacity-50"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          <span>Back</span>
        </button>

        <button
          type="button"
          onClick={onSubmit}
          disabled={isLoading}
          className="group flex h-[48px] items-center justify-center gap-2.5 rounded-[13px] bg-gradient-to-r from-[#7357FF] via-[#7C5CFF] to-[#6847F5] px-8 text-sm font-bold text-white shadow-soft transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_4px_20px_rgba(109,74,255,0.35)] active:translate-y-0 disabled:pointer-events-none disabled:opacity-60 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          {isLoading ? (
            <>
              <Loader2 className="size-4.5 animate-spin" aria-hidden="true" />
              <span>Saving preferences...</span>
            </>
          ) : (
            <>
              <Sparkles className="size-4 text-mint" aria-hidden="true" />
              <span>Show my recommendations</span>
              <ArrowRight
                className="size-4 transition-transform duration-200 group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </>
          )}
        </button>
      </div>
    </div>
  );
}

