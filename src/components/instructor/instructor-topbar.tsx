"use client";

import * as React from "react";
import Link from "next/link";
import { GraduationCap, Menu } from "lucide-react";

import { Logo } from "@/components/brand/logo";
import { InstructorMobileNav } from "@/components/instructor/instructor-mobile-nav";
import { StaffProfileMenu } from "@/components/staff/staff-profile-menu";
import { WorkspaceButtons } from "@/components/staff/workspace-buttons";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import type { AvailableWorkspaces, UserRole } from "@/lib/types/staff";

interface InstructorTopbarProps {
  user: {
    id: string;
    name: string;
    email?: string | null;
    avatarUrl: string | null;
    role: UserRole;
  };
  workspaces?: AvailableWorkspaces;
}

export function InstructorTopbar({ user, workspaces }: InstructorTopbarProps) {
  const [isMobileOpen, setIsMobileOpen] = React.useState(false);
  const resolvedWorkspaces: AvailableWorkspaces = workspaces || {
    learner: true,
    instructor: true,
    admin: user.role === "admin" || user.role === "sub_admin",
  };

  return (
    <>
      <header
        aria-label="Instructor dashboard header"
        className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-line bg-background/80 px-4 backdrop-blur-md transition-colors sm:px-6 lg:px-8"
      >
        {/* Left: Mobile hamburger & branding */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsMobileOpen(true)}
            aria-label="Open instructor navigation"
            className="grid size-10 place-items-center rounded-xl border border-line bg-card text-ink shadow-xs lg:hidden hover:bg-surface transition-colors cursor-pointer"
          >
            <Menu className="size-5" aria-hidden="true" />
          </button>

          <div className="lg:hidden flex items-center gap-2">
            <Link href="/instructor" aria-label="Instructor Studio home">
              <Logo />
            </Link>
            <span className="rounded-md bg-cyan-500/10 px-1.5 py-0.5 text-[9px] font-extrabold text-cyan-400 uppercase tracking-wider">
              Instructor
            </span>
          </div>

          <div className="hidden lg:flex items-center gap-2">
            <GraduationCap className="size-5 text-primary" aria-hidden="true" />
            <span className="text-sm font-bold text-ink">
              Instructor Studio
            </span>
          </div>
        </div>

        {/* Right: Quick Workspace Actions + Theme Toggle + Polished Profile Menu */}
        <div className="flex items-center gap-3">
          <WorkspaceButtons
            workspaces={resolvedWorkspaces}
            currentWorkspace="instructor"
          />

          <div className="hidden md:block h-4 w-px bg-line" />

          <ThemeToggle />

          <StaffProfileMenu
            user={user}
            workspaces={resolvedWorkspaces}
            currentWorkspace="instructor"
          />
        </div>
      </header>

      {/* Mobile Drawer */}
      <InstructorMobileNav
        user={user}
        isOpen={isMobileOpen}
        onClose={() => setIsMobileOpen(false)}
      />
    </>
  );
}
