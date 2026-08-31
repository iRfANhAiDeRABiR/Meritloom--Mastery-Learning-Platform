"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, LayoutDashboard, LogOut } from "lucide-react";

import { Logo } from "@/components/brand/logo";
import { MobileNavigation } from "@/components/landing/mobile-navigation";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuPanel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { routes } from "@/lib/routes";
import type { LearnerProfile } from "@/lib/types";
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

/**
 * Sticky site header with transparent blur effect and light/dark theme toggle.
 * Positioned before the Sign In button.
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
                  <li key={link.label}>
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
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label={`Account menu for ${user.name}`}
          className="flex items-center gap-1.5 rounded-full border border-line bg-card p-1 pr-2 transition-colors hover:border-primary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          <Avatar name={user.name} src={user.avatarUrl} />
          <ChevronDown className="size-4 text-muted" aria-hidden="true" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuPanel align="end">
        <div className="px-3 py-2">
          <p className="text-sm font-semibold text-ink">{user.name}</p>
        </div>
        <DropdownMenuSeparator className="my-1 h-px bg-line" />
        <DropdownMenuItem asChild>
          <Link
            href={routes.myLearning}
            className="flex items-center gap-2 rounded-[12px] px-3 py-2.5 text-sm font-medium text-ink outline-none transition-colors data-[highlighted]:bg-lavender focus:bg-lavender"
          >
            <LayoutDashboard className="size-4 text-muted" aria-hidden="true" />
            My Learning
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link
            href={routes.auth.signOut}
            className="flex items-center gap-2 rounded-[12px] px-3 py-2.5 text-sm font-medium text-ink outline-none transition-colors data-[highlighted]:bg-lavender focus:bg-lavender"
          >
            <LogOut className="size-4 text-muted" aria-hidden="true" />
            Sign out
          </Link>
        </DropdownMenuItem>
      </DropdownMenuPanel>
    </DropdownMenu>
  );
}

function Avatar({ name, src }: { name: string; src: string | null }) {
  const fallback = name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
  return (
    <span
      className={cn(
        "grid size-9 shrink-0 place-items-center overflow-hidden rounded-full bg-primary text-sm font-bold text-white",
      )}
      aria-hidden="true"
    >
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt="" className="size-full object-cover" />
      ) : (
        fallback || "M"
      )}
    </span>
  );
}
