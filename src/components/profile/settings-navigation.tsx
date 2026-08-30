"use client";

import Link from "next/link";
import {
  Palette,
  ShieldCheck,
  SlidersHorizontal,
  UserRound,
} from "lucide-react";
import type { ProfileTabId } from "@/lib/types";
import { cn } from "@/lib/utils";

interface SettingsNavigationProps {
  activeTab: ProfileTabId;
}

const SETTINGS_TABS = [
  {
    id: "profile" as ProfileTabId,
    label: "Profile",
    fullLabel: "Profile",
    icon: UserRound,
  },
  {
    id: "learning" as ProfileTabId,
    label: "Learning",
    fullLabel: "Learning preferences",
    icon: SlidersHorizontal,
  },
  {
    id: "appearance" as ProfileTabId,
    label: "Appearance",
    fullLabel: "Appearance",
    icon: Palette,
  },
  {
    id: "account" as ProfileTabId,
    label: "Account",
    fullLabel: "Account",
    icon: ShieldCheck,
  },
] as const;

export function SettingsNavigation({ activeTab }: SettingsNavigationProps) {
  return (
    <>
      {/* Mobile Horizontal Tabs */}
      <nav
        aria-label="Settings sections"
        className="flex md:hidden w-full overflow-x-auto no-scrollbar border-b border-line pb-2 gap-1.5"
      >
        {SETTINGS_TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <Link
              key={tab.id}
              href={`/profile?tab=${tab.id}`}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "flex items-center gap-2 shrink-0 rounded-xl px-3.5 py-2 text-xs font-bold transition-all select-none",
                isActive
                  ? "bg-lavender text-primary border border-primary/20 shadow-xs"
                  : "bg-surface/60 text-muted hover:bg-surface hover:text-ink border border-transparent",
              )}
            >
              <Icon className={cn("size-3.5", isActive ? "text-primary" : "text-muted")} aria-hidden="true" />
              <span>{tab.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Desktop Vertical Sidebar */}
      <aside aria-label="Settings sections" className="hidden md:flex flex-col gap-1 w-56 shrink-0">
        {SETTINGS_TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <Link
              key={tab.id}
              href={`/profile?tab=${tab.id}`}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "flex items-center gap-3 rounded-xl px-4 py-3 text-xs font-bold transition-all select-none group",
                isActive
                  ? "bg-lavender text-primary border border-primary/20 shadow-xs"
                  : "text-muted hover:bg-surface hover:text-ink border border-transparent",
              )}
            >
              <Icon
                className={cn(
                  "size-4 transition-transform group-hover:scale-105",
                  isActive ? "text-primary" : "text-muted group-hover:text-ink",
                )}
                aria-hidden="true"
              />
              <span>{tab.fullLabel}</span>
            </Link>
          );
        })}
      </aside>
    </>
  );
}

