"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  GraduationCap,
  LayoutDashboard,
  PanelLeftClose,
  PanelLeftOpen,
  ShieldCheck,
  Sparkles,
  UserRound,
} from "lucide-react";

import { Logo } from "@/components/brand/logo";
import { StaffProfileMenu } from "@/components/staff/staff-profile-menu";
import { routes } from "@/lib/routes";
import type { AvailableWorkspaces, UserRole } from "@/lib/types/staff";
import { cn } from "@/lib/utils";

interface InstructorSidebarProps {
  user: {
    id: string;
    name: string;
    email?: string | null;
    avatarUrl: string | null;
    role: UserRole;
  };
  workspaces?: AvailableWorkspaces;
  className?: string;
  defaultCollapsed?: boolean;
}

const NAV_ITEMS = [
  {
    label: "Overview",
    href: "/instructor",
    icon: LayoutDashboard,
    exact: true,
  },
  {
    label: "My Courses",
    href: "/instructor/courses",
    icon: BookOpen,
    exact: false,
  },
  {
    label: "Course Quality",
    href: "/instructor/quality",
    icon: Sparkles,
    exact: false,
  },
  {
    label: "Profile",
    href: "/instructor/profile",
    icon: UserRound,
    exact: false,
  },
] as const;

export function InstructorSidebar({
  user,
  workspaces,
  className,
  defaultCollapsed = false,
}: InstructorSidebarProps) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = React.useState<boolean>(() => {
    if (typeof window === "undefined") return defaultCollapsed;
    try {
      const saved = localStorage.getItem("meritloom_instructor_sidebar_collapsed");
      return saved !== null ? saved === "true" : defaultCollapsed;
    } catch {
      return defaultCollapsed;
    }
  });

  const resolvedWorkspaces: AvailableWorkspaces = workspaces || {
    learner: true,
    instructor: true,
    admin: user.role === "admin" || user.role === "sub_admin",
  };

  const toggleCollapse = () => {
    setIsCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem("meritloom_instructor_sidebar_collapsed", String(next));
      } catch {
        // Ignore
      }
      return next;
    });
  };

  return (
    <aside
      aria-label="Instructor navigation"
      className={cn(
        "relative flex h-full flex-col justify-between overflow-hidden bg-[#0e1626] text-white select-none border-r border-line/60 transition-all duration-300 ease-in-out shrink-0",
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
        className="pointer-events-none absolute -bottom-12 -right-12 size-40 rounded-full bg-cyan-500/10 blur-[50px]"
      />

      {/* Top: Brand Logo & Collapse Toggle */}
      <div
        className={cn(
          "relative z-10 flex items-center pt-2",
          isCollapsed ? "flex-col gap-3 items-center" : "justify-between px-1",
        )}
      >
        <Link
          href="/instructor"
          aria-label="Instructor studio home"
          className="inline-block rounded-xl text-white transition-opacity hover:opacity-90"
        >
          {isCollapsed ? (
            <span className="grid size-10 place-items-center rounded-[12px] bg-primary text-white shadow-soft">
              <GraduationCap className="size-5" aria-hidden="true" />
            </span>
          ) : (
            <div className="flex flex-col gap-0.5">
              <Logo variant="light" />
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-cyan-400 pl-1">
                Instructor Studio
              </span>
            </div>
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

      {/* Center: Main Navigation List */}
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
        </nav>
      </div>

      {/* Bottom: Workspaces & Profile Menu */}
      <div
        className={cn(
          "relative z-10 pt-4 border-t border-white/10 flex flex-col gap-3",
          isCollapsed && "items-center px-0",
        )}
      >
        {!isCollapsed && (
          <div className="px-1 text-[10px] font-bold uppercase tracking-wider text-white/40">
            Workspaces
          </div>
        )}

        {/* Switch to Admin Studio (if user has admin/sub_admin privileges) */}
        {resolvedWorkspaces.admin && (
          <Link
            href="/admin"
            title={isCollapsed ? "Admin Studio" : undefined}
            className={cn(
              "flex items-center rounded-xl text-xs font-bold transition-all duration-200 border border-purple-500/30 bg-purple-500/10 text-purple-300 hover:bg-purple-500/20 hover:text-white",
              isCollapsed ? "justify-center size-10 mx-auto" : "gap-2.5 px-3 py-2",
            )}
          >
            <ShieldCheck className="size-4 shrink-0 text-purple-400" aria-hidden="true" />
            {!isCollapsed && <span>Admin Studio</span>}
          </Link>
        )}

        {/* Switch to Learner Home */}
        <Link
          href={routes.learn}
          title={isCollapsed ? "Learner Home" : undefined}
          className={cn(
            "flex items-center rounded-xl text-xs font-bold transition-all duration-200 border border-white/15 bg-white/5 text-white/80 hover:bg-white/10 hover:text-white",
            isCollapsed ? "justify-center size-10 mx-auto" : "gap-2.5 px-3 py-2",
          )}
        >
          <BookOpen className="size-4 shrink-0 text-emerald-400" aria-hidden="true" />
          {!isCollapsed && <span>Learner Home</span>}
        </Link>

        {/* Profile Menu Trigger */}
        <div className="pt-2">
          <StaffProfileMenu
            user={user}
            workspaces={resolvedWorkspaces}
            currentWorkspace="instructor"
            isCompact={isCollapsed}
            className="w-full justify-between bg-white/5 text-white hover:bg-white/10 border-white/10"
          />
        </div>
      </div>
    </aside>
  );
}
