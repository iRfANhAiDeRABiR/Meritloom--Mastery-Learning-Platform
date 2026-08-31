"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  ChevronRight,
  DatabaseBackup,
  Layers,
  LayoutDashboard,
  Route,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
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
  },
  {
    label: "Learning Paths",
    href: "/admin/learning-paths",
    icon: Route,
    exact: false,
  },
  {
    label: "Content Tools",
    href: "/admin/content-tools",
    icon: DatabaseBackup,
    exact: false,
  },
  {
    label: "Categories",
    href: "/admin/categories",
    icon: Layers,
    exact: false,
  },
  {
    label: "Skills",
    href: "/admin/skills",
    icon: Sparkles,
    exact: false,
  },
];

export function AdminSidebar({ className }: { className?: string }) {
  const pathname = usePathname();

  return (
    <aside className={cn("flex flex-col border-r border-line bg-surface-elevated/40 p-4", className)}>
      <div className="mb-2 px-3 text-xs font-bold uppercase tracking-wider text-ink-muted">
        Content Management
      </div>
      <nav className="flex flex-1 flex-col gap-1">
        {NAV_ITEMS.map((item) => {
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

      <div className="mt-auto rounded-xl border border-line bg-surface p-3 text-xs text-ink-muted">
        <p className="font-semibold text-ink">Meritloom Studio</p>
        <p className="mt-0.5 text-[11px] text-ink-muted">Direct database course authoring without manual SQL.</p>
      </div>
    </aside>
  );
}
