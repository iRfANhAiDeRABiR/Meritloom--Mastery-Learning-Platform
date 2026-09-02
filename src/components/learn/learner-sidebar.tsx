"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Bookmark,
  BookOpen,
  Compass,
  House,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
  ShieldCheck,
  StickyNote,
  UserRound,
} from "lucide-react";

import { Logo } from "@/components/brand/logo";
import { Avatar } from "@/components/ui/avatar";
import { routes } from "@/lib/routes";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import type { LearnerProfile } from "@/lib/types";
import { cn } from "@/lib/utils";

interface LearnerSidebarProps {
  user: LearnerProfile;
  className?: string;
  defaultCollapsed?: boolean;
}

const NAV_ITEMS = [
  {
    label: "Home",
    href: routes.learn,
    icon: House,
    exact: true,
  },
  {
    label: "My Learning",
    href: routes.learnCourses,
    icon: BookOpen,
    exact: false,
  },
  {
    label: "Explore Courses",
    href: routes.learnExplore,
    icon: Compass,
    exact: false,
  },
  {
    label: "Saved",
    href: routes.learnSaved,
    icon: Bookmark,
    exact: false,
  },
  {
    label: "Notes",
    href: "/learn/notes",
    icon: StickyNote,
    exact: false,
  },
  {
    label: "Profile",
    href: routes.profile,
    icon: UserRound,
    exact: false,
  },
] as const;

export function LearnerSidebar({
  user,
  className,
  defaultCollapsed = false,
}: LearnerSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isCollapsed, setIsCollapsed] = React.useState<boolean>(() => {
    if (typeof window === "undefined") return defaultCollapsed;
    try {
      const saved = localStorage.getItem("meritloom_sidebar_collapsed");
      return saved !== null ? saved === "true" : defaultCollapsed;
    } catch {
      return defaultCollapsed;
    }
  });

  const toggleCollapse = () => {
    setIsCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem("meritloom_sidebar_collapsed", String(next));
      } catch {
        // Ignore
      }
      return next;
    });
  };

  return (
    <aside
      aria-label="Learner navigation"
      className={cn(
        "relative flex h-full flex-col justify-between overflow-hidden bg-[#10172A] text-white select-none border-r border-[#1E293B] transition-all duration-300 ease-in-out shrink-0",
        isCollapsed ? "w-[76px] p-3" : "w-[250px] p-5",
        className,
      )}
    >
      {/* Subtle ambient glows */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-12 -top-12 size-40 rounded-full bg-primary/15 blur-[50px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-12 -right-12 size-40 rounded-full bg-mint/10 blur-[50px]"
      />

      {/* Top: Brand Logo & Collapse/Expand Toggle */}
      <div
        className={cn(
          "relative z-10 flex items-center pt-2",
          isCollapsed ? "flex-col gap-3 items-center" : "justify-between px-1",
        )}
      >
        <Link
          href={routes.home}
          aria-label="Meritloom home"
          className="inline-block rounded-xl text-white transition-opacity hover:opacity-90"
        >
          {isCollapsed ? (
            <span className="grid size-10 place-items-center rounded-[12px] bg-primary text-white shadow-soft">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path
                  d="M4 19V6.5C4 5.7 4.9 5.3 5.5 5.9L11 11.5 16.5 5.9C17.1 5.3 18 5.7 18 6.5V19"
                  stroke="currentColor"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M4 19h14"
                  stroke="currentColor"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                />
              </svg>
            </span>
          ) : (
            <Logo variant="light" />
          )}
        </Link>

        {/* Collapse / Expand Button */}
        <button
          type="button"
          onClick={toggleCollapse}
          title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          className={cn(
            "grid size-8 place-items-center rounded-lg text-white/60 hover:bg-white/10 hover:text-white transition-colors cursor-pointer",
            isCollapsed && "size-7 text-white/50",
          )}
        >
          {isCollapsed ? (
            <PanelLeftOpen className="size-4" aria-hidden="true" />
          ) : (
            <PanelLeftClose className="size-4" aria-hidden="true" />
          )}
        </button>
      </div>

      {/* Center: Main Navigation List (Centered Vertically in the Middle) */}
      <div className="relative z-10 flex flex-1 flex-col justify-center py-6">
        <nav aria-label="Main" className="flex flex-col gap-2">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = item.exact
              ? pathname === item.href
              : pathname.startsWith(item.href);

            return (
              <Link
                key={item.label}
                href={item.href}
                title={isCollapsed ? item.label : undefined}
                aria-label={item.label}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "flex items-center rounded-xl text-sm font-bold transition-all duration-200",
                  isCollapsed
                    ? "justify-center size-12 mx-auto"
                    : "gap-3 px-3.5 py-2.5",
                  isActive
                    ? "bg-primary text-white shadow-[0_0_14px_rgba(109,74,255,0.45)]"
                    : "text-white/60 hover:bg-white/[0.06] hover:text-white",
                )}
              >
                <Icon
                  className={cn(
                    "size-5 shrink-0 transition-colors",
                    isActive ? "text-white" : "text-white/50",
                  )}
                  aria-hidden="true"
                />
                {!isCollapsed && <span className="truncate">{item.label}</span>}
              </Link>
            );
          })}

          {user.role === "admin" && (
            <Link
              href="/admin"
              title={isCollapsed ? "Admin Panel" : undefined}
              className={cn(
                "flex items-center rounded-xl text-sm font-bold transition-all duration-200 mt-2 border border-purple-500/30 bg-purple-500/10 text-purple-300 hover:bg-purple-500/20 hover:text-white",
                isCollapsed
                  ? "justify-center size-12 mx-auto"
                  : "gap-3 px-3.5 py-2.5",
              )}
            >
              <ShieldCheck className="size-5 shrink-0 text-purple-400" aria-hidden="true" />
              {!isCollapsed && <span className="truncate">Admin Panel</span>}
            </Link>
          )}
        </nav>
      </div>

      {/* Bottom: Learner Profile & Sign Out */}
      <div
        className={cn(
          "relative z-10 pt-4 border-t border-white/10 flex flex-col gap-3",
          isCollapsed && "items-center px-0",
        )}
      >
        <div
          className={cn(
            "flex items-center",
            isCollapsed
              ? "flex-col gap-2 justify-center"
              : "gap-3 px-2 justify-between",
          )}
        >
          <Avatar
            src={user.avatarUrl}
            name={user.name}
            className="size-9 ring-2 ring-primary/30 shrink-0"
          />

          {!isCollapsed && (
            <div className="flex flex-1 flex-col overflow-hidden text-left">
              <span className="truncate text-xs font-bold text-white">
                {user.name}
              </span>
              <span className="text-[11px] text-white/50">Learner</span>
            </div>
          )}

          <button
            type="button"
            onClick={async () => {
              const supabase = createSupabaseBrowserClient();
              if (supabase) {
                await supabase.auth.signOut();
              }
              router.push("/");
              router.refresh();
            }}
            title="Sign out"
            aria-label="Sign out"
            className="grid size-8 place-items-center rounded-lg text-white/50 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
          >
            <LogOut className="size-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    </aside>
  );
}

