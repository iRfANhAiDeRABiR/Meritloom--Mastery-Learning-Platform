"use client";

import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { StaffProfileMenu } from "@/components/staff/staff-profile-menu";
import { WorkspaceButtons } from "@/components/staff/workspace-buttons";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { Badge } from "@/components/ui/badge";
import type { AdminUserSession } from "@/lib/auth/admin";

interface AdminHeaderProps {
  session: AdminUserSession;
}

export function AdminHeader({ session }: AdminHeaderProps) {
  const isRootAdmin = session.profile.role === "admin";

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-line bg-surface/95 px-4 backdrop-blur md:px-6">
      {/* Left: Studio Branding & Role Badge */}
      <div className="flex items-center gap-3">
        <Link
          href="/admin"
          className="flex items-center gap-2 font-display text-lg font-bold tracking-tight text-ink transition hover:opacity-90"
        >
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-white shadow-sm shadow-primary/30">
            <ShieldCheck className="h-4 w-4" aria-hidden="true" />
          </span>
          <span>Meritloom Studio</span>
        </Link>

        <Badge
          variant="outline"
          className={`hidden sm:inline-flex text-[11px] font-bold ${
            isRootAdmin
              ? "border-purple-500/30 bg-purple-500/10 text-purple-400"
              : "border-cyan-500/30 bg-cyan-500/10 text-cyan-400"
          }`}
        >
          {isRootAdmin ? "Root Administrator" : "Sub-admin · Delegated"}
        </Badge>
      </div>

      {/* Right: Quick Workspace Actions + Theme Toggle + Polished Profile Menu */}
      <div className="flex items-center gap-3">
        <WorkspaceButtons
          workspaces={session.workspaces}
          currentWorkspace="admin"
        />

        <div className="hidden md:block h-4 w-px bg-line" />

        <ThemeToggle />

        <StaffProfileMenu
          user={session.profile}
          workspaces={session.workspaces}
          currentWorkspace="admin"
        />
      </div>
    </header>
  );
}
