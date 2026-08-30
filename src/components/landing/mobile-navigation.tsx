"use client";

import * as React from "react";
import Link from "next/link";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Menu, X } from "lucide-react";

import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { routes } from "@/lib/routes";
import type { LearnerProfile } from "@/lib/types";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { label: "Courses", href: routes.anchors.courses },
  { label: "Learning Paths", href: routes.anchors.paths },
  { label: "How It Works", href: routes.anchors.howItWorks },
  { label: "About", href: routes.anchors.about },
] as const;

export function MobileNavigation({
  user,
}: {
  user: LearnerProfile | null;
}) {
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
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <DialogPrimitive.Close asChild>
                    <Link
                      href={link.href}
                      className="block rounded-[14px] px-4 py-3 text-base font-semibold text-ink transition-colors hover:bg-surface"
                    >
                      {link.label}
                    </Link>
                  </DialogPrimitive.Close>
                </li>
              ))}
            </ul>
          </nav>

          <div className="mt-auto flex flex-col gap-3">
            {user ? (
              <>
                <p className="px-1 text-sm text-muted">
                  Signed in as <span className="font-semibold text-ink">{user.name}</span>
                </p>
                <DialogPrimitive.Close asChild>
                  <Button asChild size="lg" className="w-full">
                    <Link href={routes.myLearning}>Go to my learning</Link>
                  </Button>
                </DialogPrimitive.Close>
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
