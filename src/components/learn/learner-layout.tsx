import * as React from "react";

import { LearnerSidebar } from "@/components/learn/learner-sidebar";
import { LearnerTopbar } from "@/components/learn/learner-topbar";
import type { LearnerProfile } from "@/lib/types";

interface LearnerLayoutProps {
  user: LearnerProfile;
  children: React.ReactNode;
}

export function LearnerLayout({ user, children }: LearnerLayoutProps) {
  return (
    <div className="flex min-h-dvh bg-background text-ink transition-colors duration-300">
      {/* Desktop Left Sidebar (250px) */}
      <div className="hidden lg:block lg:w-[250px] shrink-0">
        <div className="sticky top-0 h-screen w-full">
          <LearnerSidebar user={user} />
        </div>
      </div>

      {/* Main Right Content Panel */}
      <div className="relative flex flex-1 flex-col overflow-x-hidden">
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

        {/* Scrollable Dashboard Body */}
        <main
          id="learner-main"
          className="mx-auto w-full max-w-[1400px] flex-1 p-5 sm:p-8 lg:p-10"
        >
          {children}
        </main>
      </div>
    </div>
  );
}

