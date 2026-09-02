"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { GraduationCap, Menu, ShieldCheck, X } from "lucide-react";

import { Logo } from "@/components/brand/logo";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { routes } from "@/lib/routes";
import type { LearnerProfile } from "@/lib/types";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { label: "Courses", href: routes.courses.index, isCourseRoute: true },
  { label: "Learning Paths", href: `/${routes.anchors.paths}`, isCourseRoute: false },
  { label: "How It Works", href: `/${routes.anchors.howItWorks}`, isCourseRoute: false },
  { label: "About", href: `/${routes.anchors.about}`, isCourseRoute: false },
] as const;

export function MobileNavigation({
  user,
}: {
  user: LearnerProfile | null;
}) {
  const pathname = usePathname();

  return (
    <DialogPrimitive.Root>
      <DialogPrimitive.Trigger asChild>
        <button
          type="button"
          aria-label="Open navigation menu"
          className="grid size-10 place-items-center rounded-full border border-line bg-card text-ink transition-colors hover:bg-lavender/60 md:hidden focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
        >
          <Menu className="size-5" aria-hidden="true" />
        </button>
      </DialogPrimitive.Trigger>

      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <DialogPrimitive.Content
          className={cn(
            "fixed inset-y-0 right-0 z-50 flex w-full max-w-sm flex-col gap-6 border-l border-line bg-card p-6 shadow-lift",
            "focus:outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right",
          )}
        >
          <div className="flex items-center justify-between">
            <DialogPrimitive.Title className="sr-only">
              Meritloom navigation
            </DialogPrimitive.Title>
            <Logo />
            <DialogPrimitive.Close
              aria-label="Close navigation menu"
              className="grid size-10 place-items-center rounded-full border border-line text-ink transition-colors hover:bg-lavender/60 focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
            >
              <X className="size-5" aria-hidden="true" />
            </DialogPrimitive.Close>
          </div>

          <nav aria-label="Mobile Navigation" className="mt-4">
            <ul className="flex flex-col gap-1">
              {NAV_LINKS.map((link) => {
                const isActive = link.isCourseRoute && pathname.startsWith("/courses");

                return (
                  <li key={link.href}>
                    <DialogPrimitive.Close asChild>
                      <Link
                        href={link.href}
                        className={cn(
                          "block rounded-[14px] px-4 py-3 text-base font-semibold transition-colors",
                          isActive
                            ? "bg-lavender text-primary"
                            : "text-ink hover:bg-surface",
                        )}
                        aria-current={isActive ? "page" : undefined}
                      >
                        {link.label}
                      </Link>
                    </DialogPrimitive.Close>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="mt-auto flex flex-col gap-3">
            {user ? (
              <>
                <div className="flex items-center gap-3 p-2 rounded-xl bg-surface border border-line">
                  <Avatar name={user.name} src={user.avatarUrl} className="size-9 ring-2 ring-primary/20" />
                  <div className="flex flex-col min-w-0">
                    <span className="truncate text-xs font-bold text-ink">{user.name}</span>
                    {user.email && (
                      <span className="truncate text-[11px] text-muted">{user.email}</span>
                    )}
                  </div>
                </div>

                <DialogPrimitive.Close asChild>
                  <Button asChild size="lg" className="w-full">
                    <Link href={routes.myLearning}>Go to my learning</Link>
                  </Button>
                </DialogPrimitive.Close>

                {user.workspaces?.admin && (
                  <DialogPrimitive.Close asChild>
                    <Button
                      asChild
                      variant="outline"
                      size="lg"
                      className="w-full border-purple-500/30 bg-purple-500/10 text-purple-300 font-bold hover:bg-purple-500/20 hover:text-white"
                    >
                      <Link href="/admin" className="flex items-center justify-center gap-2">
                        <ShieldCheck className="size-4 text-purple-400" />
                        <span>Admin Studio</span>
                      </Link>
                    </Button>
                  </DialogPrimitive.Close>
                )}

                {user.workspaces?.instructor && (
                  <DialogPrimitive.Close asChild>
                    <Button
                      asChild
                      variant="outline"
                      size="lg"
                      className="w-full border-cyan-500/30 bg-cyan-500/10 text-cyan-300 font-bold hover:bg-cyan-500/20 hover:text-white"
                    >
                      <Link href="/instructor" className="flex items-center justify-center gap-2">
                        <GraduationCap className="size-4 text-cyan-400" />
                        <span>Instructor Studio</span>
                      </Link>
                    </Button>
                  </DialogPrimitive.Close>
                )}
              </>
            ) : (
              <>
                <DialogPrimitive.Close asChild>
                  <Button asChild variant="outline" size="lg" className="w-full">
                    <Link href={routes.auth.signIn}>Sign In</Link>
                  </Button>
                </DialogPrimitive.Close>
                <DialogPrimitive.Close asChild>
                  <Button asChild size="lg" className="w-full">
                    <Link href={routes.auth.signUp}>Start Learning Free</Link>
                  </Button>
                </DialogPrimitive.Close>
              </>
            )}
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
