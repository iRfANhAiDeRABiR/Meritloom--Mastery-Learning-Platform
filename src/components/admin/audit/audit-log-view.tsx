"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ChevronLeft,
  ChevronRight,
  Filter,
  ScrollText,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { AdminAuditLogEntry } from "@/lib/types/staff";

interface AuditLogViewProps {
  logs: AdminAuditLogEntry[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
}

function ActionBadge({ action }: { action: string }) {
  if (action.includes("suspend")) {
    return (
      <span className="inline-flex items-center rounded-md bg-rose-500/10 px-2 py-0.5 font-mono text-[11px] font-bold text-rose-600 dark:text-rose-400">
        {action}
      </span>
    );
  }
  if (action.includes("reactivate")) {
    return (
      <span className="inline-flex items-center rounded-md bg-emerald-500/10 px-2 py-0.5 font-mono text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
        {action}
      </span>
    );
  }
  if (action.includes("role") || action.includes("perm")) {
    return (
      <span className="inline-flex items-center rounded-md bg-purple-500/10 px-2 py-0.5 font-mono text-[11px] font-bold text-purple-600 dark:text-purple-400">
        {action}
      </span>
    );
  }
  if (action.includes("course") || action.includes("publish")) {
    return (
      <span className="inline-flex items-center rounded-md bg-blue-500/10 px-2 py-0.5 font-mono text-[11px] font-bold text-blue-600 dark:text-blue-400">
        {action}
      </span>
    );
  }

  return (
    <span className="inline-flex items-center rounded-md bg-surface-elevated px-2 py-0.5 font-mono text-[11px] font-semibold text-ink-muted">
      {action}
    </span>
  );
}

export function AuditLogView({
  logs,
  totalCount,
  currentPage,
  totalPages,
}: AuditLogViewProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [selectedAction, setSelectedAction] = React.useState(searchParams.get("action") || "all");
  const [selectedTarget, setSelectedTarget] = React.useState(searchParams.get("target") || "all");

  const applyFilters = (newParams: { action?: string; target?: string; page?: number }) => {
    const params = new URLSearchParams(searchParams.toString());
    if (newParams.action !== undefined) {
      if (newParams.action !== "all") params.set("action", newParams.action);
      else params.delete("action");
    }
    if (newParams.target !== undefined) {
      if (newParams.target !== "all") params.set("target", newParams.target);
      else params.delete("target");
    }
    if (newParams.page !== undefined) {
      if (newParams.page > 1) params.set("page", String(newParams.page));
      else params.delete("page");
    } else {
      params.delete("page");
    }
    router.replace(`/admin/audit-log?${params.toString()}`);
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <ScrollText className="size-4.5" />
            </div>
            <h1 className="font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl">
              Administrative Audit Log
            </h1>
          </div>
          <p className="mt-1 text-sm text-ink-muted">
            Immutable chronicle of all staff invitations, role transitions, account suspensions, and policy actions.
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-line bg-surface p-4 shadow-xs">
        <div className="flex items-center gap-2 text-xs font-semibold text-ink-muted">
          <Filter className="size-3.5" />
          <span>Filters:</span>
        </div>

        <div className="flex items-center gap-1.5 rounded-xl border border-line bg-surface px-2.5 py-1.5 text-xs text-ink-muted shadow-xs">
          <span>Action:</span>
          <select
            value={selectedAction}
            onChange={(e) => {
              setSelectedAction(e.target.value);
              applyFilters({ action: e.target.value });
            }}
            className="bg-transparent font-semibold text-ink outline-none cursor-pointer"
          >
            <option value="all">All Actions</option>
            <option value="user_suspended">user_suspended</option>
            <option value="user_reactivated">user_reactivated</option>
            <option value="role_changed">role_changed</option>
            <option value="permissions_updated">permissions_updated</option>
            <option value="instructor_courses_assigned">instructor_courses_assigned</option>
            <option value="staff_invited">staff_invited</option>
          </select>
        </div>

        <div className="flex items-center gap-1.5 rounded-xl border border-line bg-surface px-2.5 py-1.5 text-xs text-ink-muted shadow-xs">
          <span>Target Type:</span>
          <select
            value={selectedTarget}
            onChange={(e) => {
              setSelectedTarget(e.target.value);
              applyFilters({ target: e.target.value });
            }}
            className="bg-transparent font-semibold text-ink outline-none cursor-pointer"
          >
            <option value="all">All Targets</option>
            <option value="user">User</option>
            <option value="staff">Staff</option>
            <option value="course">Course</option>
            <option value="system">System</option>
          </select>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="rounded-2xl border border-line bg-surface shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-line bg-surface-elevated/40 text-ink-muted font-semibold">
                <th className="py-3 px-5 font-medium">Timestamp</th>
                <th className="py-3 px-4 font-medium">Administrator</th>
                <th className="py-3 px-4 font-medium">Action</th>
                <th className="py-3 px-4 font-medium">Target</th>
                <th className="py-3 px-5 font-medium">Safe Metadata Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {logs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-ink-muted">
                    No audit records found matching your filters.
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id} className="hover:bg-surface-elevated/30 transition">
                    <td className="py-3 px-5 font-mono text-ink-muted whitespace-nowrap">
                      {new Date(log.createdAt).toLocaleString([], {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                      })}
                    </td>

                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5 font-semibold text-ink">
                        <ShieldCheck className="size-3.5 text-primary" />
                        <span>{log.actor?.name || "System"}</span>
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <ActionBadge action={log.action} />
                    </td>

                    <td className="py-3 px-4">
                      <span className="inline-flex items-center rounded bg-surface-elevated px-1.5 py-0.5 text-[10px] font-mono text-ink uppercase">
                        {log.targetType}
                      </span>
                    </td>

                    <td className="py-3 px-5 font-mono text-[11px] text-ink-muted max-w-xs truncate">
                      {Object.keys(log.metadata).length > 0 ? (
                        <span title={JSON.stringify(log.metadata, null, 2)}>
                          {JSON.stringify(log.metadata)}
                        </span>
                      ) : (
                        <span className="text-ink-muted/50">—</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-line px-5 py-3 text-xs text-ink-muted">
            <span>
              Page <strong className="text-ink">{currentPage}</strong> of{" "}
              <strong className="text-ink">{totalPages}</strong> ({totalCount} total audit entries)
            </span>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage <= 1}
                onClick={() => applyFilters({ page: currentPage - 1 })}
                className="h-8 rounded-lg border-line px-2 text-xs"
              >
                <ChevronLeft className="size-3.5 mr-1" />
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage >= totalPages}
                onClick={() => applyFilters({ page: currentPage + 1 })}
                className="h-8 rounded-lg border-line px-2 text-xs"
              >
                Next
                <ChevronRight className="size-3.5 ml-1" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
