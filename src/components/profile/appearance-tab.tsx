"use client";

import * as React from "react";
import { Check, Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { cn } from "@/lib/utils";

const emptySubscribe = () => () => {};

export function AppearanceTab() {
  const { theme, setTheme } = useTheme();
  const mounted = React.useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );

  const currentTheme = mounted ? theme || "system" : "system";

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-1 border-b border-line pb-4">
        <h2 className="text-xl sm:text-2xl font-bold text-ink">
          Appearance
        </h2>
        <p className="text-xs sm:text-sm text-muted">
          Choose how Meritloom looks on this device. Changes apply instantly.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        <span className="text-[11px] font-extrabold uppercase tracking-wider text-muted">
          Theme Mode
        </span>

        {/* 3 Theme Choice Cards */}
        <div
          role="radiogroup"
          aria-label="Theme mode"
          className="grid grid-cols-1 sm:grid-cols-3 gap-4"
        >
          {/* 1. Light Theme */}
          <button
            type="button"
            role="radio"
            aria-checked={currentTheme === "light"}
            onClick={() => setTheme("light")}
            className={cn(
              "group relative flex flex-col items-start gap-3 rounded-[18px] border p-4 text-left transition-all cursor-pointer shadow-soft hover:-translate-y-0.5",
              currentTheme === "light"
                ? "border-primary bg-lavender/50 shadow-soft ring-1 ring-primary/40"
                : "border-line bg-card hover:border-primary/40 hover:bg-surface",
            )}
          >
            {/* Visual Preview Box */}
            <div className="w-full h-24 rounded-xl border border-[#E5E9F2] bg-[#F7F8FC] p-3 flex flex-col justify-between overflow-hidden shadow-2xs">
              <div className="flex items-center justify-between">
                <div className="h-2 w-12 rounded bg-[#10172A]/80" />
                <div className="size-3 rounded-full bg-primary" />
              </div>
              <div className="flex flex-col gap-1.5">
                <div className="h-1.5 w-full rounded bg-[#E5E9F2]" />
                <div className="h-1.5 w-3/4 rounded bg-[#E5E9F2]" />
              </div>
              <div className="h-3 w-14 rounded bg-primary" />
            </div>

            {/* Label */}
            <div className="flex items-center justify-between w-full pt-1">
              <div className="flex items-center gap-2">
                <Sun className="size-4 text-amber-500" aria-hidden="true" />
                <span className="text-xs font-bold text-ink">Light</span>
              </div>
              {currentTheme === "light" && (
                <div className="size-4 rounded-full bg-primary flex items-center justify-center text-white">
                  <Check className="size-2.5 stroke-[3]" aria-hidden="true" />
                </div>
              )}
            </div>
          </button>

          {/* 2. Dark Theme */}
          <button
            type="button"
            role="radio"
            aria-checked={currentTheme === "dark"}
            onClick={() => setTheme("dark")}
            className={cn(
              "group relative flex flex-col items-start gap-3 rounded-[18px] border p-4 text-left transition-all cursor-pointer shadow-soft hover:-translate-y-0.5",
              currentTheme === "dark"
                ? "border-primary bg-lavender/50 shadow-soft ring-1 ring-primary/40"
                : "border-line bg-card hover:border-primary/40 hover:bg-surface",
            )}
          >
            {/* Visual Preview Box */}
            <div className="w-full h-24 rounded-xl border border-[#29334A] bg-[#0E1424] p-3 flex flex-col justify-between overflow-hidden shadow-2xs">
              <div className="flex items-center justify-between">
                <div className="h-2 w-12 rounded bg-white/80" />
                <div className="size-3 rounded-full bg-primary" />
              </div>
              <div className="flex flex-col gap-1.5">
                <div className="h-1.5 w-full rounded bg-white/10" />
                <div className="h-1.5 w-3/4 rounded bg-white/10" />
              </div>
              <div className="h-3 w-14 rounded bg-primary" />
            </div>

            {/* Label */}
            <div className="flex items-center justify-between w-full pt-1">
              <div className="flex items-center gap-2">
                <Moon className="size-4 text-primary" aria-hidden="true" />
                <span className="text-xs font-bold text-ink">Dark</span>
              </div>
              {currentTheme === "dark" && (
                <div className="size-4 rounded-full bg-primary flex items-center justify-center text-white">
                  <Check className="size-2.5 stroke-[3]" aria-hidden="true" />
                </div>
              )}
            </div>
          </button>

          {/* 3. System Theme */}
          <button
            type="button"
            role="radio"
            aria-checked={currentTheme === "system"}
            onClick={() => setTheme("system")}
            className={cn(
              "group relative flex flex-col items-start gap-3 rounded-[18px] border p-4 text-left transition-all cursor-pointer shadow-soft hover:-translate-y-0.5",
              currentTheme === "system"
                ? "border-primary bg-lavender/50 shadow-soft ring-1 ring-primary/40"
                : "border-line bg-card hover:border-primary/40 hover:bg-surface",
            )}
          >
            {/* Visual Preview Box (Split) */}
            <div className="w-full h-24 rounded-xl border border-line overflow-hidden flex shadow-2xs">
              <div className="w-1/2 bg-[#F7F8FC] p-3 flex flex-col justify-between border-r border-line">
                <div className="h-2 w-8 rounded bg-[#10172A]/80" />
                <div className="h-1.5 w-full rounded bg-[#E5E9F2]" />
                <div className="h-3 w-8 rounded bg-primary" />
              </div>
              <div className="w-1/2 bg-[#0E1424] p-3 flex flex-col justify-between">
                <div className="h-2 w-8 rounded bg-white/80" />
                <div className="h-1.5 w-full rounded bg-white/10" />
                <div className="h-3 w-8 rounded bg-primary" />
              </div>
            </div>

            {/* Label */}
            <div className="flex items-center justify-between w-full pt-1">
              <div className="flex items-center gap-2">
                <Monitor className="size-4 text-muted" aria-hidden="true" />
                <span className="text-xs font-bold text-ink">System</span>
              </div>
              {currentTheme === "system" && (
                <div className="size-4 rounded-full bg-primary flex items-center justify-center text-white">
                  <Check className="size-2.5 stroke-[3]" aria-hidden="true" />
                </div>
              )}
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}

