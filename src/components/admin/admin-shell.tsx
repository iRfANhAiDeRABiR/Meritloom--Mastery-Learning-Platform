"use client";

import * as React from "react";
import { AdminHeader } from "@/components/admin/admin-header";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import type { AdminUserSession } from "@/lib/auth/admin";

interface AdminShellProps {
  session: AdminUserSession;
  children: React.ReactNode;
}

export function AdminShell({ session, children }: AdminShellProps) {
  return (
    <div className="min-h-screen bg-bg font-sans text-ink">
      <AdminHeader session={session} />
      <div className="flex min-h-[calc(100vh-4rem)]">
        <AdminSidebar session={session} className="hidden w-64 md:flex shrink-0" />
        <main className="flex-1 overflow-x-hidden p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}
