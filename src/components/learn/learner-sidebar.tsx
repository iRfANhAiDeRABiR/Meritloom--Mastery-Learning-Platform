"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bookmark,
  BookOpen,
  Compass,
  House,
  LogOut,
  UserRound,
} from "lucide-react";

import { Logo } from "@/components/brand/logo";
import { Avatar } from "@/components/ui/avatar";
import { routes } from "@/lib/routes";
import type { LearnerProfile } from "@/lib/types";
import { cn } from "@/lib/utils";

interface LearnerSidebarProps {
  user: LearnerProfile;
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
    href: routes.courses.index,
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
    label: "Profile",
    href: routes.profile,
    icon: UserRound,
    exact: false,
  },
] as const;

export function LearnerSidebar({ user }: LearnerSidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      aria-label="Learner navigation"
      className="relative flex h-full w-[250px] flex-col justify-between overflow-hidden bg-[#10172A] p-5 text-white select-none border-r border-[#1E293B]"
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

      {/* Top: Brand Logo */}
      <div className="relative z-10 px-2 pt-2">
        <Link
          href={routes.home}
          aria-label="Meritloom home"
          className="inline-block rounded-xl text-white transition-opacity hover:opacity-90"
        >
          <Logo />
        </Link>
      </div>

      {/* Center: Main Navigation List */}
      <div className="relative z-10 my-auto py-6">
        <nav aria-label="Main" className="flex flex-col gap-1.5">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = item.exact
              ? pathname === item.href
              : pathname.startsWith(item.href);

            return (
              <Link
                key={item.label}
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-bold transition-all duration-200",
                  isActive
                    ? "bg-primary text-white shadow-[0_0_14px_rgba(109,74,255,0.45)]"
                    : "text-white/60 hover:bg-white/[0.06] hover:text-white",
                )}
              >
                <Icon
                  className={cn(
                    "size-4.5 transition-colors",
                    isActive ? "text-white" : "text-white/50",
                  )}
                  aria-hidden="true"
                />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom: Learner Profile & Sign Out */}
      <div className="relative z-10 pt-4 border-t border-white/10 flex flex-col gap-3">
        <div className="flex items-center gap-3 px-2">
          <Avatar
            src={user.avatarUrl}
            name={user.name}
            className="size-9 ring-2 ring-primary/30"
          />
          <div className="flex flex-1 flex-col overflow-hidden text-left">
            <span className="truncate text-xs font-bold text-white">
              {user.name}
            </span>
            <span className="text-[11px] text-white/50">Learner</span>
          </div>

          <form action="/auth/sign-out" method="POST">
            <button
              type="submit"
              title="Sign out"
              aria-label="Sign out"
              className="grid size-8 place-items-center rounded-lg text-white/50 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
            >
              <LogOut className="size-4" aria-hidden="true" />
            </button>
          </form>
        </div>
      </div>
    </aside>
  );
}

