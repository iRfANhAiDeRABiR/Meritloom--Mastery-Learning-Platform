"use client";

import * as React from "react";
import Link from "next/link";
import { Menu, Search } from "lucide-react";

import { Logo } from "@/components/brand/logo";
import { LearnerMobileNav } from "@/components/learn/learner-mobile-nav";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { Avatar } from "@/components/ui/avatar";
import { routes } from "@/lib/routes";
import type { LearnerProfile } from "@/lib/types";

interface LearnerTopbarProps {
  user: LearnerProfile;
}

export function LearnerTopbar({ user }: LearnerTopbarProps) {
  const [isMobileOpen, setIsMobileOpen] = React.useState(false);

  return (
    <>
      <header
        aria-label="Dashboard header"
        className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-line bg-background/80 px-4 backdrop-blur-md transition-colors sm:px-6 lg:px-8"
      >
        {/* Left: Mobile hamburger or Desktop Section Title */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsMobileOpen(true)}
            aria-label="Open navigation menu"
            className="grid size-10 place-items-center rounded-xl border border-line bg-card text-ink shadow-xs lg:hidden hover:bg-surface transition-colors cursor-pointer"
          >
            <Menu className="size-5" aria-hidden="true" />
          </button>

          <div className="lg:hidden">
            <Link href={routes.home} aria-label="Meritloom home">
              <Logo />
            </Link>
          </div>

          <div className="hidden lg:flex items-center gap-2">
            <span className="text-sm font-bold text-ink">
              Learner Home
            </span>
          </div>
        </div>

        {/* Right: Search trigger, Theme Toggle, Profile */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Quick Search Button */}
          <Link
            href={routes.learnExplore}
            className="flex items-center gap-2 rounded-full border border-line bg-card px-3.5 py-1.5 text-xs font-medium text-muted shadow-xs transition-all hover:border-primary/40 hover:text-ink"
            aria-label="Search courses in catalog"
          >
            <Search className="size-3.5 text-primary" aria-hidden="true" />
            <span className="hidden sm:inline">Search courses...</span>
          </Link>

          {/* Theme Toggle */}
          <ThemeToggle />

          {/* User Profile Avatar */}
          <Link
            href={routes.profile}
            aria-label="View profile"
            className="rounded-full ring-2 ring-primary/20 transition-transform hover:scale-105"
          >
            <Avatar
              src={user.avatarUrl}
              name={user.name}
              className="size-9"
            />
          </Link>
        </div>
      </header>

      {/* Mobile Drawer */}
      <LearnerMobileNav
        user={user}
        isOpen={isMobileOpen}
        onClose={() => setIsMobileOpen(false)}
      />
    </>
  );
}

