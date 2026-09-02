"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  BookOpen,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  ShieldCheck,
  Sparkles,
  UserRound,
  X,
} from "lucide-react";

import { Logo } from "@/components/brand/logo";
import { Avatar } from "@/components/ui/avatar";
import { routes } from "@/lib/routes";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import type { UserRole } from "@/lib/types/staff";
import { cn } from "@/lib/utils";

interface InstructorMobileNavProps {
  user: {
    id: string;
    name: string;
    avatarUrl: string | null;
    role: UserRole;
  };
  isOpen: boolean;
  onClose: () => void;
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

export function InstructorMobileNav({
  user,
  isOpen,
  onClose,
}: InstructorMobileNavProps) {
  const pathname = usePathname();
  const router = useRouter();

  React.useEffect(() => {
    onClose();
  }, [pathname, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer Panel */}
      <div className="fixed inset-y-0 left-0 flex w-[280px] flex-col justify-between bg-[#0e1626] p-6 text-white shadow-2xl">
        <div className="flex flex-col gap-6">
          {/* Header & Close Button */}
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <Logo variant="light" />
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-cyan-400 pl-1">
                Instructor Studio
              </span>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="grid size-8 place-items-center rounded-lg text-white/60 hover:bg-white/10 hover:text-white"
              aria-label="Close navigation"
            >
              <X className="size-5" />
            </button>
          </div>

          {/* Navigation Items */}
          <nav className="flex flex-col gap-2 pt-2">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = item.exact
                ? pathname === item.href
                : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold transition-all",
                    isActive
                      ? "bg-primary text-white shadow-md shadow-primary/30"
                      : "text-white/60 hover:bg-white/10 hover:text-white",
                  )}
                >
                  <Icon className="size-5 shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer / App Switcher */}
        <div className="flex flex-col gap-3 border-t border-white/10 pt-4">
          <Link
            href={routes.learn}
            className="flex items-center gap-2.5 rounded-xl border border-white/15 bg-white/5 px-3.5 py-2.5 text-xs font-bold text-white/80 hover:bg-white/10 hover:text-white"
          >
            <GraduationCap className="size-4 text-cyan-400" />
            <span>Learner Home</span>
          </Link>

          {(user.role === "admin" || user.role === "sub_admin") && (
            <Link
              href="/admin"
              className="flex items-center gap-2.5 rounded-xl border border-purple-500/30 bg-purple-500/10 px-3.5 py-2.5 text-xs font-bold text-purple-300 hover:bg-purple-500/20 hover:text-white"
            >
              <ShieldCheck className="size-4 text-purple-400" />
              <span>Admin Studio</span>
            </Link>
          )}

          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-3">
              <Avatar
                src={user.avatarUrl}
                name={user.name}
                className="size-9 ring-2 ring-primary/30"
              />
              <div className="flex flex-col text-left">
                <span className="text-xs font-bold text-white truncate max-w-[130px]">
                  {user.name}
                </span>
                <span className="text-[10px] text-white/50 capitalize">
                  {user.role}
                </span>
              </div>
            </div>

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
              className="grid size-8 place-items-center rounded-lg text-white/50 hover:bg-white/10 hover:text-white"
              title="Sign out"
            >
              <LogOut className="size-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

