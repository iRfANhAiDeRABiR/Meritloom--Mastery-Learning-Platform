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
  ShieldCheck,
  StickyNote,
  UserRound,
  X,
} from "lucide-react";

import { Logo } from "@/components/brand/logo";
import { Avatar } from "@/components/ui/avatar";
import { routes } from "@/lib/routes";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import type { LearnerProfile } from "@/lib/types";
import { cn } from "@/lib/utils";

interface LearnerMobileNavProps {
  user: LearnerProfile;
  isOpen: boolean;
  onClose: () => void;
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

export function LearnerMobileNav({
  user,
  isOpen,
  onClose,
}: LearnerMobileNavProps) {
  const pathname = usePathname();
  const router = useRouter();

  // Close drawer when pressing Escape
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Mobile Navigation"
      className="fixed inset-0 z-50 flex lg:hidden"
    >
      {/* Backdrop */}
      <div
        aria-hidden="true"
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
      />

      {/* Drawer */}
      <div className="relative flex w-full max-w-[280px] flex-col justify-between bg-[#10172A] p-6 text-white shadow-2xl z-10 border-r border-[#1E293B]">
        {/* Top Header with Logo and Close Button */}
        <div className="flex items-center justify-between">
          <Link
            href={routes.home}
            onClick={onClose}
            aria-label="Meritloom home"
            className="rounded-xl text-white"
          >
            <Logo />
          </Link>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close navigation"
            className="grid size-9 place-items-center rounded-lg text-white/60 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
          >
            <X className="size-5" aria-hidden="true" />
          </button>
        </div>

        {/* Navigation Links */}
        <div className="my-auto py-6">
          <nav aria-label="Mobile" className="flex flex-col gap-2">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = item.exact
                ? pathname === item.href
                : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={onClose}
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    "flex items-center gap-3.5 rounded-xl px-4 py-3 text-sm font-bold transition-all duration-200",
                    isActive
                      ? "bg-primary text-white shadow-soft"
                      : "text-white/70 hover:bg-white/[0.08] hover:text-white",
                  )}
                >
                  <Icon className="size-5" aria-hidden="true" />
                  <span>{item.label}</span>
                </Link>
              );
            })}

            {user.role === "admin" && (
              <Link
                href="/admin"
                onClick={onClose}
                className="flex items-center gap-3.5 rounded-xl border border-purple-500/30 bg-purple-500/10 px-4 py-3 text-sm font-bold text-purple-300 hover:bg-purple-500/20 hover:text-white transition-all mt-2"
              >
                <ShieldCheck className="size-5 text-purple-400" aria-hidden="true" />
                <span>Admin Panel</span>
              </Link>
            )}
          </nav>
        </div>

        {/* User Info & Sign Out */}
        <div className="pt-4 border-t border-white/10 flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <Avatar
              src={user.avatarUrl}
              name={user.name}
              className="size-10 ring-2 ring-primary/40"
            />
            <div className="flex flex-1 flex-col overflow-hidden text-left">
              <span className="truncate text-sm font-bold text-white">
                {user.name}
              </span>
              <span className="text-xs text-white/50">Learner</span>
            </div>
          </div>

          <button
            type="button"
            onClick={async () => {
              const supabase = createSupabaseBrowserClient();
              if (supabase) {
                await supabase.auth.signOut();
              }
              onClose();
              router.push("/");
              router.refresh();
            }}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 py-2.5 text-xs font-bold text-white/80 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
          >
            <LogOut className="size-4" aria-hidden="true" />
            <span>Sign out</span>
          </button>
        </div>
      </div>
    </div>
  );
}

