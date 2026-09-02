"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  BookOpen,
  ChevronDown,
  GraduationCap,
  LogOut,
  ShieldCheck,
  UserRound,
} from "lucide-react";

import { Logo } from "@/components/brand/logo";
import { MobileNavigation } from "@/components/landing/mobile-navigation";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuPanel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { routes } from "@/lib/routes";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import type { LearnerProfile } from "@/lib/types";
import type { UserRole } from "@/lib/types/staff";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { label: "Courses", href: routes.courses.index, pathPrefix: "/courses" },
  {
    label: "Learning Paths",
    href: routes.learningPaths.index,
    pathPrefix: "/learning-paths",
  },
  { label: "How It Works", href: routes.howItWorks, pathPrefix: "/how-it-works" },
  { label: "About", href: routes.about, pathPrefix: "/about" },
] as const;

function getRoleDisplay(role?: UserRole): { label: string; badgeClass: string } | null {
  if (!role || role === "learner") return null;
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
      return null;
  }
}

/**
 * Sticky site header with transparent blur effect and light/dark theme toggle.
 */
export function SiteHeader({ user }: { user: LearnerProfile | null }) {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-line bg-background/80 backdrop-blur-md transition-colors">
      <div className="container-page flex h-16 items-center justify-between gap-4 lg:h-[72px]">
        {/* Left: Logo & Brand navigation */}
        <div className="flex items-center gap-8">
          <Link
            href={routes.home}
            aria-label="Meritloom home"
            className="shrink-0 rounded-[10px]"
          >
            <Logo />
          </Link>

          <nav aria-label="Primary" className="hidden md:block">
            <ul className="flex items-center gap-1">
              {NAV_LINKS.map((link) => {
                const isActive =
                  Boolean(link.pathPrefix) && pathname.startsWith(link.pathPrefix);

                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className={cn(
                        "rounded-full px-3.5 py-2 text-[15px] font-medium transition-colors",
                        isActive
                          ? "bg-lavender text-primary font-bold"
                          : "text-ink/80 hover:bg-lavender/60 hover:text-ink",
                      )}
                      aria-current={isActive ? "page" : undefined}
                    >
                      {link.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>

        {/* Right: Theme toggle & Auth actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          <ThemeToggle />

          {user ? (
            <div className="hidden items-center gap-2 sm:flex">
              {/* Optional single compact staff button if user has staff access */}
              {user.workspaces?.admin && (
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="hidden lg:inline-flex h-9 items-center gap-1.5 rounded-xl border-purple-500/30 bg-purple-500/10 text-xs font-bold text-purple-300 hover:bg-purple-500/20 hover:text-white transition-colors"
                >
                  <Link href="/admin">
                    <ShieldCheck className="size-3.5 text-purple-400" />
                    <span>Admin Studio</span>
                  </Link>
                </Button>
              )}

              {user.workspaces?.instructor && !user.workspaces?.admin && (
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="hidden lg:inline-flex h-9 items-center gap-1.5 rounded-xl border-cyan-500/30 bg-cyan-500/10 text-xs font-bold text-cyan-300 hover:bg-cyan-500/20 hover:text-white transition-colors"
                >
                  <Link href="/instructor">
                    <GraduationCap className="size-3.5 text-cyan-400" />
                    <span>Instructor Studio</span>
                  </Link>
                </Button>
              )}

              <Button
                asChild
                variant="ghost"
                className="font-semibold text-ink/80 hover:text-primary hover:bg-lavender/60 transition-colors"
              >
                <Link href={routes.myLearning}>My Learning</Link>
              </Button>

              <ProfileMenu user={user} />
            </div>
          ) : (
            <div className="hidden items-center gap-2 sm:flex">
              <Button
                asChild
                variant="ghost"
                className="font-semibold text-ink/80 hover:text-primary hover:bg-lavender/60 transition-colors"
              >
                <Link href={routes.auth.signIn}>Sign In</Link>
              </Button>
              <Button asChild>
                <Link href={routes.auth.signUp}>Start Learning Free</Link>
              </Button>
            </div>
          )}

          <MobileNavigation user={user} />
        </div>
      </div>
    </header>
  );
}

function ProfileMenu({ user }: { user: LearnerProfile }) {
  const router = useRouter();
  const roleInfo = getRoleDisplay(user.role);
  const hasWorkspaces = user.workspaces?.admin || user.workspaces?.instructor;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label={`Account menu for ${user.name}`}
          className="flex items-center gap-1.5 rounded-full border border-line bg-card p-1 pr-2.5 transition-colors hover:border-primary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary cursor-pointer select-none"
        >
          <Avatar name={user.name} src={user.avatarUrl} className="size-8" />
          <span className="hidden md:inline-block max-w-[120px] truncate text-xs font-semibold text-ink">
            {user.name}
          </span>
          <ChevronDown className="size-3.5 text-muted" aria-hidden="true" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuPanel align="end" className="w-64 p-2 rounded-2xl">
        {/* User Identity Header */}
        <div className="flex items-center gap-3 p-2">
          <Avatar name={user.name} src={user.avatarUrl} className="size-9 ring-2 ring-primary/20" />
          <div className="flex flex-col min-w-0">
            <span className="truncate text-xs font-bold text-ink leading-tight">
              {user.name}
            </span>
            {user.email && (
              <span className="truncate text-[11px] text-muted leading-tight">
                {user.email}
              </span>
            )}
            {roleInfo && (
              <div className="mt-1">
                <span
                  className={cn(
                    "inline-flex items-center rounded-md border px-1.5 py-0.2 text-[9px] font-bold",
                    roleInfo.badgeClass,
                  )}
                >
                  {roleInfo.label}
                </span>
              </div>
            )}
          </div>
        </div>

        <DropdownMenuSeparator className="my-1.5 h-px bg-line" />

        {/* Primary Learner Links */}
        <DropdownMenuItem asChild>
          <Link
            href={routes.myLearning}
            className="flex items-center gap-2.5 rounded-xl px-2.5 py-2 text-xs font-medium text-ink outline-none transition-colors hover:bg-surface-elevated"
          >
            <BookOpen className="size-4 text-emerald-400" aria-hidden="true" />
            <span>My Learning</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link
            href="/profile"
            className="flex items-center gap-2.5 rounded-xl px-2.5 py-2 text-xs font-medium text-ink outline-none transition-colors hover:bg-surface-elevated"
          >
            <UserRound className="size-4 text-ink-muted" aria-hidden="true" />
            <span>My Profile</span>
          </Link>
        </DropdownMenuItem>

        {/* Workspaces Section (rendered only if staff access exists) */}
        {hasWorkspaces && (
          <>
            <DropdownMenuSeparator className="my-1.5 h-px bg-line" />
            <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-muted">
              Workspaces
            </div>

            {user.workspaces?.admin && (
              <DropdownMenuItem asChild>
                <Link
                  href="/admin"
                  className="flex items-center gap-2.5 rounded-xl px-2.5 py-2 text-xs font-semibold text-purple-400 outline-none transition-colors hover:bg-purple-500/10"
                >
                  <ShieldCheck className="size-4 text-purple-400" aria-hidden="true" />
                  <span>Admin Studio</span>
                </Link>
              </DropdownMenuItem>
            )}

            {user.workspaces?.instructor && (
              <DropdownMenuItem asChild>
                <Link
                  href="/instructor"
                  className="flex items-center gap-2.5 rounded-xl px-2.5 py-2 text-xs font-semibold text-cyan-400 outline-none transition-colors hover:bg-cyan-500/10"
                >
                  <GraduationCap className="size-4 text-cyan-400" aria-hidden="true" />
                  <span>Instructor Studio</span>
                </Link>
              </DropdownMenuItem>
            )}
          </>
        )}

        <DropdownMenuSeparator className="my-1.5 h-px bg-line" />

        {/* Sign Out */}
        <DropdownMenuItem
          onSelect={async () => {
            const supabase = createSupabaseBrowserClient();
            if (supabase) {
              await supabase.auth.signOut();
            }
            router.push("/");
            router.refresh();
          }}
          className="flex items-center gap-2.5 rounded-xl px-2.5 py-2 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 cursor-pointer"
        >
          <LogOut className="size-4" aria-hidden="true" />
          <span>Sign out</span>
        </DropdownMenuItem>
      </DropdownMenuPanel>
    </DropdownMenu>
  );
}
