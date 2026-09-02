"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Activity,
  BookOpen,
  ChevronRight,
  DatabaseBackup,
  FileQuestion,
  GraduationCap,
  Layers,
  LayoutDashboard,
  Mail,
  Route,
  ScrollText,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import type { AdminUserSession } from "@/lib/auth/admin";
import type { StaffPermission } from "@/lib/types/staff";
import { cn } from "@/lib/utils";

interface AdminSidebarProps {
  session?: AdminUserSession;
  className?: string;
}

interface NavItem {
  label: string;
  href: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon: any;
  exact: boolean;
  requiredPermission?: StaffPermission;
  rootOnly?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  {
    label: "Overview",
    href: "/admin",
    icon: LayoutDashboard,
    exact: true,
  },
  {
    label: "Courses",
    href: "/admin/courses",
    icon: BookOpen,
    exact: false,
    requiredPermission: "courses.view",
  },
  {
    label: "Knowledge Checks",
    href: "/admin/quizzes",
    icon: FileQuestion,
    exact: false,
    requiredPermission: "courses.view",
  },
  {
    label: "Learning Paths",
    href: "/admin/learning-paths",
    icon: Route,
    exact: false,
    requiredPermission: "learning_paths.view",
  },
  {
    label: "Users",
    href: "/admin/users",
    icon: Users,
    exact: false,
    requiredPermission: "users.view",
  },
  {
    label: "Staff",
    href: "/admin/staff",
    icon: ShieldCheck,
    exact: false,
    rootOnly: true,
  },
  {
    label: "System Health",
    href: "/admin/system",
    icon: Activity,
    exact: false,
    requiredPermission: "system.view",
  },
  {
    label: "Audit Log",
    href: "/admin/audit-log",
    icon: ScrollText,
    exact: false,
    rootOnly: true,
  },
  {
    label: "Support Messages",
    href: "/admin/messages",
    icon: Mail,
    exact: false,
    requiredPermission: "users.view",
  },
  {
    label: "Content Tools",
    href: "/admin/content-tools",
    icon: DatabaseBackup,
    exact: false,
    requiredPermission: "content_tools.export",
  },
  {
    label: "Categories",
    href: "/admin/categories",
    icon: Layers,
    exact: false,
    requiredPermission: "categories.manage",
  },
  {
    label: "Skills",
    href: "/admin/skills",
    icon: Sparkles,
    exact: false,
    requiredPermission: "skills.manage",
  },
];

export function AdminSidebar({ session, className }: AdminSidebarProps) {
  const pathname = usePathname();
  const isRootAdmin = !session || session.profile.role === "admin";
  const userPermissions = new Set(session?.profile?.permissions || []);

  // Filter items based on role and explicit staff permissions
  const visibleItems = NAV_ITEMS.filter((item) => {
    if (isRootAdmin) return true;
    if (item.rootOnly) return false;
    if (!item.requiredPermission) return true;
    return userPermissions.has(item.requiredPermission);
  });

  return (
    <aside className={cn("flex flex-col border-r border-line bg-surface-elevated/40 p-4", className)}>
      <div className="mb-2 px-3 text-xs font-bold uppercase tracking-wider text-ink-muted flex items-center justify-between">
        <span>{isRootAdmin ? "Admin Studio" : "Delegated Studio"}</span>
        {!isRootAdmin && (
          <span className="rounded bg-cyan-500/10 px-1.5 py-0.2 text-[9px] font-bold text-cyan-400">
            Sub-admin
          </span>
        )}
      </div>

      <nav className="flex flex-1 flex-col gap-1">
        {visibleItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group flex items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-semibold transition",
                isActive
                  ? "bg-primary text-white shadow-sm shadow-primary/25"
                  : "text-ink-muted hover:bg-surface hover:text-ink",
              )}
            >
              <div className="flex items-center gap-3">
                <Icon className={cn("h-4 w-4", isActive ? "text-white" : "text-ink-muted group-hover:text-ink")} />
                <span>{item.label}</span>
              </div>
              {isActive && <ChevronRight className="h-4 w-4 opacity-80" />}
            </Link>
          );
        })}
      </nav>

      {/* Workspaces Section */}
      <div className="mt-auto flex flex-col gap-2 pt-4 border-t border-line">
        <div className="px-1 text-[10px] font-bold uppercase tracking-wider text-ink-muted">
          Workspaces
        </div>

        {/* Instructor Studio (only if authorized as instructor) */}
        {session?.workspaces?.instructor && (
          <Link
            href="/instructor"
            className="flex items-center gap-2.5 rounded-xl border border-line bg-surface px-3 py-2 text-xs font-semibold text-ink-muted hover:text-ink hover:border-primary/40 transition"
          >
            <GraduationCap className="h-3.5 w-3.5 text-cyan-400" />
            <span>Instructor Studio</span>
          </Link>
        )}

        {/* Learner Home */}
        <Link
          href="/learn"
          className="flex items-center gap-2.5 rounded-xl border border-line bg-surface px-3 py-2 text-xs font-semibold text-ink-muted hover:text-ink hover:border-primary/40 transition"
        >
          <BookOpen className="h-3.5 w-3.5 text-emerald-400" />
          <span>Learner Home</span>
        </Link>

        <div className="rounded-xl border border-line bg-surface p-3 text-xs text-ink-muted">
          <p className="font-semibold text-ink">
            {isRootAdmin ? "Meritloom Admin Studio" : "Meritloom Delegated Admin"}
          </p>
          <p className="mt-0.5 text-[11px] text-ink-muted">
            {isRootAdmin
              ? "Complete control over courses, learners, staff, and system."
              : "Permission-scoped access to assigned administrative modules."}
          </p>
        </div>
      </div>
    </aside>
  );
}
