import Link from "next/link";
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  BookCheck,
  CheckCircle2,
  Clock,
  History,
  Mail,
  Route,
  ShieldAlert,
  ShieldCheck,
  Users,
} from "lucide-react";

import type { SubAdminDashboardData } from "@/lib/types/instructor";

interface SubAdminDashboardProps {
  data: SubAdminDashboardData;
}

function formatRelativeTime(isoString: string): string {
  try {
    const date = new Date(isoString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays}d ago`;

    return date.toLocaleDateString([], { month: "short", day: "numeric" });
  } catch {
    return "Recently";
  }
}

export function SubAdminDashboard({ data }: SubAdminDashboardProps) {
  const { user, metrics, needsAttention, recentActivity } = data;
  const firstName = user.name.trim().split(/\s+/)[0] || "Sub-Admin";
  const perms = new Set(user.permissions);
  const hasZeroPermissions = user.permissions.length === 0;

  return (
    <div className="flex flex-col gap-8 pb-12">
      {/* 1. Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-line/60 pb-6">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-ink sm:text-3xl font-display">
              Welcome back, {firstName}
            </h1>
            <span className="rounded-md bg-cyan-500/10 border border-cyan-500/30 px-2 py-0.5 text-xs font-bold text-cyan-400">
              Sub-admin · Delegated
            </span>
          </div>
          <p className="text-sm text-ink-muted">
            Manage the platform modules and features assigned to your staff profile.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-ink-muted">
            {user.permissions.length} active permissions
          </span>
        </div>
      </div>

      {/* Zero Permissions State */}
      {hasZeroPermissions ? (
        <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-line bg-surface p-10 text-center">
          <ShieldAlert className="size-10 text-amber-500" />
          <h2 className="text-lg font-bold text-ink">No administrative permissions assigned</h2>
          <p className="text-xs text-ink-muted max-w-md leading-relaxed">
            Your account is registered as a Sub-Administrator, but no specific module permissions have been delegated to you yet. Please contact a Root Administrator to configure your access.
          </p>
          <Link
            href="/learn"
            className="mt-2 inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-xs font-bold text-white shadow-sm"
          >
            <span>Go to Learner Home</span>
            <ArrowRight className="size-3.5" />
          </Link>
        </div>
      ) : (
        <>
          {/* 2. Permission-Scoped Metric Cards */}
          <section aria-label="Permitted module metrics" className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {/* Users / Active / Suspended (if users.view) */}
            {perms.has("users.view") && metrics.totalUsers !== undefined && (
              <div className="flex flex-col justify-between rounded-2xl border border-line bg-surface p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-ink-muted">
                    Total Users
                  </span>
                  <span className="flex size-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Users className="size-4" />
                  </span>
                </div>
                <div className="pt-3 flex items-baseline justify-between">
                  <span className="text-2xl sm:text-3xl font-bold tracking-tight text-ink font-display">
                    {metrics.totalUsers}
                  </span>
                  <span className="text-[11px] font-semibold text-emerald-500">
                    {metrics.activeUsers} active
                  </span>
                </div>
              </div>
            )}

            {perms.has("users.view") && metrics.suspendedUsers !== undefined && (
              <div className="flex flex-col justify-between rounded-2xl border border-line bg-surface p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-ink-muted">
                    Suspended Accounts
                  </span>
                  <span className="flex size-7 items-center justify-center rounded-lg bg-amber-500/10 text-amber-400">
                    <ShieldAlert className="size-4" />
                  </span>
                </div>
                <div className="pt-3">
                  <span className="text-2xl sm:text-3xl font-bold tracking-tight text-ink font-display">
                    {metrics.suspendedUsers}
                  </span>
                </div>
              </div>
            )}

            {/* Courses (if courses.view) */}
            {perms.has("courses.view") && metrics.publishedCourses !== undefined && (
              <div className="flex flex-col justify-between rounded-2xl border border-line bg-surface p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-ink-muted">
                    Published Courses
                  </span>
                  <span className="flex size-7 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
                    <BookCheck className="size-4" />
                  </span>
                </div>
                <div className="pt-3 flex items-baseline justify-between">
                  <span className="text-2xl sm:text-3xl font-bold tracking-tight text-ink font-display">
                    {metrics.publishedCourses}
                  </span>
                  <span className="text-[11px] font-semibold text-amber-500">
                    {metrics.draftCourses} draft
                  </span>
                </div>
              </div>
            )}

            {/* Learning Paths (if learning_paths.view) */}
            {perms.has("learning_paths.view") && metrics.totalLearningPaths !== undefined && (
              <div className="flex flex-col justify-between rounded-2xl border border-line bg-surface p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-ink-muted">
                    Learning Paths
                  </span>
                  <span className="flex size-7 items-center justify-center rounded-lg bg-purple-500/10 text-purple-400">
                    <Route className="size-4" />
                  </span>
                </div>
                <div className="pt-3">
                  <span className="text-2xl sm:text-3xl font-bold tracking-tight text-ink font-display">
                    {metrics.totalLearningPaths}
                  </span>
                </div>
              </div>
            )}

            {/* Open Support Messages */}
            {(perms.has("users.view") || perms.has("staff.view")) && metrics.openMessages !== undefined && (
              <div className="flex flex-col justify-between rounded-2xl border border-line bg-surface p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-ink-muted">
                    Support Inquiries
                  </span>
                  <span className="flex size-7 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-400">
                    <Mail className="size-4" />
                  </span>
                </div>
                <div className="pt-3">
                  <span className="text-2xl sm:text-3xl font-bold tracking-tight text-ink font-display">
                    {metrics.openMessages} open
                  </span>
                </div>
              </div>
            )}

            {/* System Health (if system.view) */}
            {perms.has("system.view") && metrics.dbLatencyMs !== undefined && (
              <div className="flex flex-col justify-between rounded-2xl border border-line bg-surface p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-ink-muted">
                    System Health
                  </span>
                  <span className="flex size-7 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
                    <Activity className="size-4" />
                  </span>
                </div>
                <div className="pt-3 flex items-baseline justify-between">
                  <span className="text-2xl sm:text-3xl font-bold tracking-tight text-ink font-display">
                    {metrics.dbLatencyMs}ms
                  </span>
                  <span className="text-[11px] font-semibold text-emerald-500">
                    Operational
                  </span>
                </div>
              </div>
            )}
          </section>

          {/* 3. Needs Attention & Recent Sub-Admin Activity */}
          <section aria-label="Tasks and Activity" className="grid gap-6 lg:grid-cols-2 items-stretch">
            {/* Needs Attention Card */}
            <div className="flex h-full flex-col justify-between rounded-2xl border border-line bg-surface p-5 sm:p-6 shadow-sm">
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-500">
                    <AlertTriangle className="size-3.5 text-amber-500" />
                    Needs Attention
                  </span>
                  <span className="text-[11px] font-semibold text-ink-muted">
                    Permission-filtered items
                  </span>
                </div>

                {needsAttention.length === 0 ? (
                  <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-line bg-surface-elevated/20 p-6 text-center">
                    <CheckCircle2 className="size-5 text-emerald-500" />
                    <p className="text-xs text-ink-muted font-medium">
                      No urgent tasks pending for your assigned areas.
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2.5">
                    {needsAttention.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between gap-3 rounded-xl border border-line bg-surface-elevated/40 p-3 text-xs"
                      >
                        <div className="flex flex-col gap-0.5 min-w-0">
                          <span className="font-bold text-ink truncate">
                            {item.title}
                          </span>
                          <span className="text-[11px] text-ink-muted line-clamp-1">
                            {item.description}
                          </span>
                        </div>

                        <Link
                          href={item.actionHref}
                          className="shrink-0 rounded-lg bg-primary px-3 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-primary-hover transition"
                        >
                          {item.actionLabel}
                        </Link>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Recent Administrative Activity */}
            <div className="flex h-full flex-col justify-between rounded-2xl border border-line bg-surface p-5 sm:p-6 shadow-sm">
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-ink-muted">
                    <History className="size-3.5 text-primary" />
                    Recent Staff Activity
                  </span>
                  <span className="text-[11px] font-semibold text-ink-muted">
                    Audited actions by you
                  </span>
                </div>

                {recentActivity.length === 0 ? (
                  <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-line bg-surface-elevated/20 p-6 text-center">
                    <Clock className="size-5 text-ink-muted/60" />
                    <p className="text-xs text-ink-muted font-medium">
                      Your recent administrative work will appear here automatically.
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2.5">
                    {recentActivity.map((act) => (
                      <div
                        key={act.id}
                        className="flex items-center justify-between gap-3 rounded-xl border border-line bg-surface-elevated/40 p-3 text-xs"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span className="flex size-6 items-center justify-center rounded-lg bg-primary/10 text-primary shrink-0">
                            <ShieldCheck className="size-3" />
                          </span>
                          <div className="flex flex-col min-w-0">
                            <span className="font-bold text-ink truncate">
                              {act.targetTitle}
                            </span>
                            <span className="text-[11px] text-ink-muted capitalize truncate">
                              {act.action.replace(/_/g, " ")} · {act.targetType}
                            </span>
                          </div>
                        </div>

                        <span className="shrink-0 text-[10px] font-medium text-ink-muted">
                          {formatRelativeTime(act.createdAt)}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  );
}

