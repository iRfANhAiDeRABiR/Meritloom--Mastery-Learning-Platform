"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  BookOpen,
  Check,
  ChevronDown,
  GraduationCap,
  KeyRound,
  LogOut,
  ShieldCheck,
  UserRound,
} from "lucide-react";

import { Avatar } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { routes } from "@/lib/routes";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import type { ActiveWorkspace, AvailableWorkspaces, UserRole } from "@/lib/types/staff";
import { cn } from "@/lib/utils";

interface StaffProfileMenuProps {
  user: {
    id: string;
    name: string;
    email?: string | null;
    avatarUrl: string | null;
    role: UserRole;
  };
  workspaces: AvailableWorkspaces;
  currentWorkspace: ActiveWorkspace;
  className?: string;
  isCompact?: boolean;
}

function getRoleDisplay(role: UserRole): { label: string; badgeClass: string } {
  switch (role) {
    case "admin":
      return {
        label: "Administrator",
        badgeClass: "bg-purple-500/10 text-purple-400 border-purple-500/30",
      };
    case "sub_admin":
      return {
        label: "Sub-admin",
        badgeClass: "bg-cyan-500/10 text-cyan-400 border-cyan-500/30",
      };
    case "instructor":
      return {
        label: "Instructor",
        badgeClass: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
      };
    default:
      return {
        label: "Learner",
        badgeClass: "bg-surface text-ink-muted border-line",
      };
  }
}

export function StaffProfileMenu({
  user,
  workspaces,
  currentWorkspace,
  className,
  isCompact = false,
}: StaffProfileMenuProps) {
  const router = useRouter();
  const roleInfo = getRoleDisplay(user.role);

  const handleSignOut = async () => {
    const supabase = createSupabaseBrowserClient();
    if (supabase) {
      await supabase.auth.signOut();
    }
    router.push("/");
    router.refresh();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label="Open account and workspace menu"
          className={cn(
            "group flex items-center gap-2.5 rounded-xl border border-line bg-surface p-1.5 transition-all hover:border-primary/40 hover:bg-surface-elevated focus:outline-hidden focus:ring-2 focus:ring-primary/40 cursor-pointer select-none",
            isCompact ? "p-1" : "pr-3",
            className,
          )}
        >
          <Avatar
            src={user.avatarUrl}
            name={user.name}
            className="size-8 sm:size-9 ring-2 ring-primary/20 shrink-0"
          />

          {!isCompact && (
            <div className="hidden md:flex flex-col text-left min-w-0">
              <span className="truncate text-xs font-bold text-ink max-w-[140px] leading-tight">
                {user.name}
              </span>
              <span className="text-[10px] font-semibold text-ink-muted leading-tight">
                {roleInfo.label}
              </span>
            </div>
          )}

          <ChevronDown
            className="size-3.5 text-ink-muted transition-transform duration-200 group-data-[state=open]:rotate-180 shrink-0"
            aria-hidden="true"
          />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        sideOffset={8}
        className="w-72 rounded-2xl border border-line bg-surface p-2 shadow-xl ring-1 ring-black/5 dark:ring-white/5"
      >
        {/* User Identity Header */}
        <div className="flex items-center gap-3 p-2.5">
          <Avatar
            src={user.avatarUrl}
            name={user.name}
            className="size-10 ring-2 ring-primary/30 shrink-0"
          />
          <div className="flex flex-col min-w-0">
            <span className="truncate text-sm font-bold text-ink leading-snug">
              {user.name}
            </span>
            {user.email && (
              <span className="truncate text-xs text-ink-muted leading-snug">
                {user.email}
              </span>
            )}
            <div className="mt-1">
              <span
                className={cn(
                  "inline-flex items-center rounded-md border px-1.5 py-0.2 text-[10px] font-bold",
                  roleInfo.badgeClass,
                )}
              >
                {roleInfo.label}
              </span>
            </div>
          </div>
        </div>

        <DropdownMenuSeparator className="-mx-1 my-1.5 h-px bg-line" />

        {/* Workspace Switcher */}
        <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-ink-muted">
          Switch Workspace
        </div>

        <div className="flex flex-col gap-0.5">
          {/* Admin Studio (if user has admin/sub_admin access) */}
          {workspaces.admin && (
            <DropdownMenuItem asChild>
              <Link
                href="/admin"
                className={cn(
                  "flex items-center justify-between rounded-xl px-2.5 py-2 text-xs font-semibold transition-colors",
                  currentWorkspace === "admin"
                    ? "bg-primary/10 text-primary font-bold"
                    : "text-ink hover:bg-surface-elevated",
                )}
              >
                <div className="flex items-center gap-2.5">
                  <ShieldCheck className="size-4 text-purple-400" aria-hidden="true" />
                  <span>Admin Studio</span>
                </div>
                {currentWorkspace === "admin" && (
                  <Check className="size-3.5 text-primary" aria-hidden="true" />
                )}
              </Link>
            </DropdownMenuItem>
          )}

          {/* Instructor Studio (only if authorized as instructor) */}
          {workspaces.instructor && (
            <DropdownMenuItem asChild>
              <Link
                href="/instructor"
                className={cn(
                  "flex items-center justify-between rounded-xl px-2.5 py-2 text-xs font-semibold transition-colors",
                  currentWorkspace === "instructor"
                    ? "bg-primary/10 text-primary font-bold"
                    : "text-ink hover:bg-surface-elevated",
                )}
              >
                <div className="flex items-center gap-2.5">
                  <GraduationCap className="size-4 text-cyan-400" aria-hidden="true" />
                  <span>Instructor Studio</span>
                </div>
                {currentWorkspace === "instructor" && (
                  <Check className="size-3.5 text-primary" aria-hidden="true" />
                )}
              </Link>
            </DropdownMenuItem>
          )}

          {/* Learner Home (available to all active users) */}
          {workspaces.learner && (
            <DropdownMenuItem asChild>
              <Link
                href={routes.learn}
                className={cn(
                  "flex items-center justify-between rounded-xl px-2.5 py-2 text-xs font-semibold transition-colors",
                  currentWorkspace === "learner"
                    ? "bg-primary/10 text-primary font-bold"
                    : "text-ink hover:bg-surface-elevated",
                )}
              >
                <div className="flex items-center gap-2.5">
                  <BookOpen className="size-4 text-emerald-400" aria-hidden="true" />
                  <span>Learner Home</span>
                </div>
                {currentWorkspace === "learner" && (
                  <Check className="size-3.5 text-primary" aria-hidden="true" />
                )}
              </Link>
            </DropdownMenuItem>
          )}
        </div>

        <DropdownMenuSeparator className="-mx-1 my-1.5 h-px bg-line" />

        {/* Account Links */}
        <DropdownMenuItem asChild>
          <Link
            href="/profile"
            className="flex items-center gap-2.5 rounded-xl px-2.5 py-2 text-xs font-medium text-ink hover:bg-surface-elevated"
          >
            <UserRound className="size-4 text-ink-muted" aria-hidden="true" />
            <span>My Profile</span>
          </Link>
        </DropdownMenuItem>

        {user.role === "sub_admin" && (
          <DropdownMenuItem asChild>
            <Link
              href="/profile?tab=roles"
              className="flex items-center gap-2.5 rounded-xl px-2.5 py-2 text-xs font-medium text-ink hover:bg-surface-elevated"
            >
              <KeyRound className="size-4 text-ink-muted" aria-hidden="true" />
              <span>My Permissions</span>
            </Link>
          </DropdownMenuItem>
        )}

        <DropdownMenuSeparator className="-mx-1 my-1.5 h-px bg-line" />

        {/* Sign out */}
        <DropdownMenuItem
          destructive
          onClick={handleSignOut}
          className="flex items-center gap-2.5 rounded-xl px-2.5 py-2 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 cursor-pointer"
        >
          <LogOut className="size-4" aria-hidden="true" />
          <span>Sign out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

