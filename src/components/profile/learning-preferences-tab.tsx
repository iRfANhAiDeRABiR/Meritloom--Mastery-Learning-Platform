"use client";

import * as React from "react";
import {
  Bell,
  BookOpen,
  BookOpenCheck,
  Check,
  CircleHelp,
  Compass,
  Hammer,
  Layers3,
  Loader2,
  PencilLine,
  PlayCircle,
  Rocket,
  Sprout,
  TrendingUp,
} from "lucide-react";

import { updateLearningPreferencesAction } from "@/lib/actions/profile";
import { notify } from "@/lib/notifications/toast";
import type {
  Category,
  ContentPreference,
  CourseDifficulty,
  PrimaryLearningGoal,
  ProfileSettingsData,
  StudyPace,
} from "@/lib/types";
import { cn } from "@/lib/utils";

interface LearningPreferencesTabProps {
  preferences: ProfileSettingsData["preferences"];
  selectedCategoryIds: string[];
  categories: Category[];
}

const GOALS = [
  {
    id: "explore" as PrimaryLearningGoal,
    icon: Compass,
    title: "Explore something new",
    desc: "Discover a new subject or skill from the beginning.",
  },
  {
    id: "practical_skills" as PrimaryLearningGoal,
    icon: TrendingUp,
    title: "Build practical skills",
    desc: "Learn useful skills through structured lessons and practice.",
  },
  {
    id: "strengthen_knowledge" as PrimaryLearningGoal,
    icon: BookOpenCheck,
    title: "Strengthen my knowledge",
    desc: "Review concepts you already know and go deeper.",
  },
] as const;

const LEVELS = [
  {
    id: "beginner" as CourseDifficulty,
    icon: Sprout,
    title: "Beginner",
    desc: "I'm new to this subject or still learning basics.",
  },
  {
    id: "intermediate" as CourseDifficulty,
    icon: Layers3,
    title: "Intermediate",
    desc: "I understand basics and want stronger skills.",
  },
  {
    id: "advanced" as CourseDifficulty,
    icon: Rocket,
    title: "Advanced",
    desc: "I'm comfortable and want deeper material.",
  },
] as const;

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
  },
  {
    id: "reading" as ContentPreference,
    icon: BookOpen,
    label: "Reading & guides",
  },
  {
    id: "exercises" as ContentPreference,
    icon: PencilLine,
    label: "Practice exercises",
  },
  {
    id: "projects" as ContentPreference,
    icon: Hammer,
    label: "Practical projects",
  },
  {
    id: "knowledge_checks" as ContentPreference,
    icon: CircleHelp,
    label: "Knowledge checks",
  },
] as const;

export function LearningPreferencesTab({
  preferences,
  selectedCategoryIds: initialCategories,
  categories,
}: LearningPreferencesTabProps) {
  const [selectedCategories, setSelectedCategories] = React.useState<string[]>(
    initialCategories || [],
  );
  const [selectedGoal, setSelectedGoal] = React.useState<PrimaryLearningGoal | null>(
    preferences.learningGoal,
  );
  const [selectedLevel, setSelectedLevel] = React.useState<CourseDifficulty | null>(
    preferences.levelPreference,
  );
  const [notSureLevel, setNotSureLevel] = React.useState<boolean>(
    preferences.levelPreference === null,
  );
  const [selectedPace, setSelectedPace] = React.useState<StudyPace | null>(
    preferences.schedulePreference,
  );
  const [selectedFormats, setSelectedFormats] = React.useState<ContentPreference[]>(
    preferences.contentPreferences || [],
  );
  const [remindersEnabled, setRemindersEnabled] = React.useState<boolean>(
    preferences.learningReminders,
  );

  const [isSaving, setIsSaving] = React.useState(false);
  const [saveStatus, setSaveStatus] = React.useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  const toggleCategory = (catId: string) => {
    setSelectedCategories((prev) => {
      if (prev.includes(catId)) {
        return prev.filter((id) => id !== catId);
      }
      if (prev.length >= 5) {
        return prev;
      }
      return [...prev, catId];
    });
  };

  const toggleFormat = (formatId: ContentPreference) => {
    setSelectedFormats((prev) =>
      prev.includes(formatId)
        ? prev.filter((id) => id !== formatId)
        : [...prev, formatId],
    );
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSaving) return;

    setIsSaving(true);
    setSaveStatus("idle");
    setErrorMessage(null);

    const result = await updateLearningPreferencesAction({
      selectedCategoryIds: selectedCategories,
      learningGoal: selectedGoal,
      levelPreference: notSureLevel ? null : selectedLevel,
      studyPace: selectedPace,
      contentPreferences: selectedFormats,
      learningReminders: remindersEnabled,
    });

    if (result.success) {
      setSaveStatus("success");
      notify.success({ title: "Preferences saved" });
      setTimeout(() => setSaveStatus("idle"), 3000);
    } else {
      setSaveStatus("error");
      const title = result.error || "We couldn't update your learning preferences.";
      setErrorMessage(title);
      notify.error({ title });
    }

    setIsSaving(false);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-1 border-b border-line pb-4">
        <h2 className="text-xl sm:text-2xl font-bold text-ink">
          Learning preferences
        </h2>
        <p className="text-xs sm:text-sm text-muted">
          Personalize the topics, starting levels, and study pace Meritloom uses for recommendations.
        </p>
      </div>

      <form onSubmit={handleSave} className="flex flex-col gap-8">
        {/* 1. Interests Multi-select */}
        <div className="rounded-[18px] border border-line bg-card p-5 sm:p-6 shadow-soft flex flex-col gap-3.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-muted">
              Topics of Interest
            </span>
            <span className="text-xs font-semibold text-primary">
              {selectedCategories.length} of 5 selected
            </span>
          </div>

          <p className="text-xs text-muted">
            Select up to 5 subjects you want to explore or improve in.
          </p>

          <div className="flex flex-wrap gap-2 pt-1">
            {categories.map((cat) => {
              const isSelected = selectedCategories.includes(cat.id);

              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => toggleCategory(cat.id)}
                  aria-pressed={isSelected}
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-xl border px-3.5 py-2 text-xs font-bold transition-all cursor-pointer select-none",
                    isSelected
                      ? "border-primary/60 bg-lavender text-primary shadow-xs"
                      : "border-line bg-surface text-ink hover:border-primary/40",
                  )}
                >
                  {isSelected && <Check className="size-3.5 stroke-[3]" aria-hidden="true" />}
                  <span>{cat.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. Main Learning Goal */}
        <div className="rounded-[18px] border border-line bg-card p-5 sm:p-6 shadow-soft flex flex-col gap-3.5">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-muted">
            Primary Learning Goal
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {GOALS.map((g) => {
              const isSelected = selectedGoal === g.id;
              const Icon = g.icon;

              return (
                <button
                  key={g.id}
                  type="button"
                  onClick={() => setSelectedGoal(g.id)}
                  aria-pressed={isSelected}
                  className={cn(
                    "flex flex-col items-start gap-2.5 rounded-xl border p-4 text-left transition-all cursor-pointer",
                    isSelected
                      ? "border-primary/60 bg-lavender/60 shadow-xs ring-1 ring-primary/30"
                      : "border-line bg-surface hover:border-primary/30",
                  )}
                >
                  <span className="grid size-7 place-items-center rounded-lg bg-card text-primary shadow-2xs">
                    <Icon className="size-3.5" aria-hidden="true" />
                  </span>
                  <div>
                    <h4 className="text-xs font-bold text-ink">{g.title}</h4>
                    <p className="text-[11px] text-muted leading-tight mt-0.5">{g.desc}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. Preferred Level */}
        <div className="rounded-[18px] border border-line bg-card p-5 sm:p-6 shadow-soft flex flex-col gap-3.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-muted">
              Preferred Starting Level
            </span>
            <button
              type="button"
              onClick={() => {
                setNotSureLevel(true);
                setSelectedLevel(null);
              }}
              className={cn(
                "text-xs font-bold transition-colors cursor-pointer",
                notSureLevel ? "text-primary" : "text-muted hover:text-ink",
              )}
            >
              Not sure / All levels
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {LEVELS.map((lvl) => {
              const isSelected = selectedLevel === lvl.id && !notSureLevel;
              const Icon = lvl.icon;

              return (
                <button
                  key={lvl.id}
                  type="button"
                  onClick={() => {
                    setSelectedLevel(lvl.id);
                    setNotSureLevel(false);
                  }}
                  aria-pressed={isSelected}
                  className={cn(
                    "flex flex-col items-start gap-2.5 rounded-xl border p-4 text-left transition-all cursor-pointer",
                    isSelected
                      ? "border-primary/60 bg-lavender/60 shadow-xs ring-1 ring-primary/30"
                      : "border-line bg-surface hover:border-primary/30",
                  )}
                >
                  <span className="grid size-7 place-items-center rounded-lg bg-card text-primary shadow-2xs">
                    <Icon className="size-3.5" aria-hidden="true" />
                  </span>
                  <div>
                    <h4 className="text-xs font-bold text-ink">{lvl.title}</h4>
                    <p className="text-[11px] text-muted leading-tight mt-0.5">{lvl.desc}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 4. Study Pace */}
        <div className="rounded-[18px] border border-line bg-card p-5 sm:p-6 shadow-soft flex flex-col gap-3.5">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-muted">
            Preferred Study Pace
          </span>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {PACES.map((p) => {
              const isSelected = selectedPace === p.id;

              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setSelectedPace(p.id)}
                  aria-pressed={isSelected}
                  className={cn(
                    "flex items-center justify-center rounded-xl border py-3 px-3 text-center text-xs font-bold transition-all cursor-pointer",
                    isSelected
                      ? "border-primary/60 bg-lavender text-primary shadow-xs"
                      : "border-line bg-surface text-ink hover:border-primary/30",
                  )}
                >
                  {p.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* 5. Content Formats */}
        <div className="rounded-[18px] border border-line bg-card p-5 sm:p-6 shadow-soft flex flex-col gap-3.5">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-muted">
            Content Formats You Enjoy
          </span>

          <div className="flex flex-wrap gap-2.5">
            {FORMATS.map((f) => {
              const isSelected = selectedFormats.includes(f.id);
              const Icon = f.icon;

              return (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => toggleFormat(f.id)}
                  aria-pressed={isSelected}
                  className={cn(
                    "inline-flex items-center gap-2 rounded-xl border px-3.5 py-2.5 text-xs font-bold transition-all cursor-pointer",
                    isSelected
                      ? "border-primary/60 bg-lavender text-primary shadow-xs"
                      : "border-line bg-surface text-ink hover:border-primary/30",
                  )}
                >
                  <Icon className="size-4" aria-hidden="true" />
                  <span>{f.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 6. Learning Reminders */}
        <div className="rounded-[18px] border border-line bg-card p-5 sm:p-6 shadow-soft flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="grid size-10 place-items-center rounded-xl bg-lavender text-primary shrink-0">
              <Bell className="size-5" aria-hidden="true" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-ink">
                Help me remember to learn
              </h4>
              <p className="text-[11px] sm:text-xs text-muted">
                Save this preference to receive gentle study reminder updates in the future.
              </p>
            </div>
          </div>

          <label className="relative inline-flex items-center cursor-pointer shrink-0">
            <input
              type="checkbox"
              checked={remindersEnabled}
              onChange={(e) => setRemindersEnabled(e.target.checked)}
              className="sr-only peer"
              aria-label="Toggle study reminders"
            />
            <div className="w-11 h-6 bg-surface peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary border border-line" />
          </label>
        </div>

        {/* Feedback Messages */}
        {saveStatus === "success" && (
          <div className="flex items-center gap-2 text-xs font-bold text-[#14895A] dark:text-[#74E0B8] bg-mint/30 border border-[#19B99A]/30 rounded-xl px-4 py-2.5 animate-in fade-in-0 duration-150">
            <Check className="size-4" aria-hidden="true" />
            <span>Learning preferences updated successfully</span>
          </div>
        )}

        {saveStatus === "error" && errorMessage && (
          <div className="text-xs font-bold text-rose-500 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 rounded-xl px-4 py-2.5 animate-in fade-in-0 duration-150">
            {errorMessage}
          </div>
        )}

        {/* Submit Action */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-primary px-6 text-xs font-bold text-white shadow-soft transition-all duration-200 hover:bg-primary-hover hover:-translate-y-0.5 disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
          >
            {isSaving ? (
              <>
                <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                <span>Saving…</span>
              </>
            ) : (
              <span>Save learning preferences</span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

