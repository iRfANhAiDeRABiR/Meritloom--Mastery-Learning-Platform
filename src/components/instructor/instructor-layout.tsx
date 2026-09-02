"use client";

import * as React from "react";
import { InstructorSidebar } from "@/components/instructor/instructor-sidebar";
import { InstructorTopbar } from "@/components/instructor/instructor-topbar";
import type { AvailableWorkspaces, UserRole } from "@/lib/types/staff";

interface InstructorLayoutProps {
  user: {
    id: string;
    name: string;
    email?: string | null;
    avatarUrl: string | null;
    role: UserRole;
  };
  workspaces?: AvailableWorkspaces;
  children: React.ReactNode;
}

export function InstructorLayout({
  user,
  workspaces,
  children,
}: InstructorLayoutProps) {
  return (
    <div className="flex min-h-dvh bg-background text-ink transition-colors duration-300">
      {/* Desktop Left Sidebar */}
      <div className="hidden lg:block shrink-0 sticky top-0 h-screen z-30">
        <InstructorSidebar user={user} workspaces={workspaces} />
      </div>

      {/* Main Content Area */}
      <div className="relative flex flex-1 flex-col overflow-x-hidden min-w-0">
        {/* Subtle Ambient Background Lighting */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10"
          style={{
            backgroundImage: `
              radial-gradient(circle at 85% 15%, rgba(6, 182, 212, 0.03), transparent 45%),
              radial-gradient(circle at 15% 85%, rgba(124, 92, 255, 0.03), transparent 40%)
            `,
          }}
        />

        <InstructorTopbar user={user} workspaces={workspaces} />

        <main className="mx-auto w-full max-w-[1400px] flex-1 p-5 sm:p-8 lg:p-10 min-w-0">
          {children}
        </main>
      </div>
    </div>
  );
}
