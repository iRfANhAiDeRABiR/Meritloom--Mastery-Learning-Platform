"use client";

import * as React from "react";
import { usePathname } from "next/navigation";

import { LearnerSidebar } from "@/components/learn/learner-sidebar";
import { LearnerTopbar } from "@/components/learn/learner-topbar";
import type { LearnerProfile } from "@/lib/types";
import { cn } from "@/lib/utils";

interface LearnerLayoutProps {
  user: LearnerProfile;
  children: React.ReactNode;
}

export function LearnerLayout({ user, children }: LearnerLayoutProps) {
  const pathname = usePathname();
  const isLessonRoute = pathname.includes("/lessons/");

  return (
    <div className="flex min-h-dvh bg-background text-ink transition-colors duration-300">
      {/* Desktop Left Sidebar (Collapsible) */}
      <div className="hidden lg:block shrink-0 sticky top-0 h-screen z-30">
        <LearnerSidebar user={user} />
      </div>

      {/* Main Right Content Panel */}
      <div className="relative flex flex-1 flex-col overflow-x-hidden min-w-0">
        {/* Subtle Ambient Background Lighting */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10"
          style={{
            backgroundImage: `
              radial-gradient(circle at 90% 10%, rgba(124, 92, 255, 0.04), transparent 45%),
              radial-gradient(circle at 10% 90%, rgba(109, 74, 255, 0.03), transparent 40%)
            `,
          }}
        />

        {/* Topbar */}
        <LearnerTopbar user={user} />

        {/* Dashboard Body */}
        <main
          id="learner-main"
          className={cn(
            "w-full flex-1 min-w-0",
            isLessonRoute
              ? "p-0 max-w-none flex flex-col"
              : "mx-auto max-w-[1400px] p-5 sm:p-8 lg:p-10",
          )}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
