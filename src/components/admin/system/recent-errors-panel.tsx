"use client";

import { AlertCircle, CheckCircle2 } from "lucide-react";
import type { RecentErrorItem } from "@/lib/system-health/types";

interface RecentErrorsPanelProps {
  errors: RecentErrorItem[];
}

export function RecentErrorsPanel({ errors }: RecentErrorsPanelProps) {
  if (!errors || errors.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-line bg-surface p-8 text-center shadow-xs">
        <div className="flex size-10 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500">
          <CheckCircle2 className="size-5" />
        </div>
        <h3 className="mt-3 font-display text-base font-bold text-ink">
          No Recent Application Errors
        </h3>
        <p className="mt-1 text-xs text-ink-muted">
          All requests served in this time window returned successful 2xx or 3xx responses.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-line bg-surface p-5 shadow-xs">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="font-display text-base font-bold text-ink">
            Sanitized Server & Operational Errors
          </h2>
          <p className="text-xs text-ink-muted mt-0.5">
            Grouped error categories and affected routes. Excludes raw SQL and private request bodies.
          </p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-line text-ink-muted font-semibold">
              <th className="pb-2.5 font-medium">Category</th>
              <th className="pb-2.5 font-medium">Route</th>
              <th className="pb-2.5 font-medium text-center">Status</th>
              <th className="pb-2.5 font-medium text-right">Occurrences</th>
              <th className="pb-2.5 font-medium text-right">Last Seen</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {errors.map((err) => (
              <tr key={err.id} className="hover:bg-surface-elevated/40 transition">
                <td className="py-3 font-semibold text-rose-600 dark:text-rose-400">
                  <div className="flex items-center gap-1.5">
                    <AlertCircle className="size-3.5" />
                    <span>{err.errorCategory}</span>
                  </div>
                </td>
                <td className="py-3 font-mono text-ink text-xs pr-4">
                  {err.route}
                </td>
                <td className="py-3 text-center">
                  <span className="rounded-md bg-surface-elevated px-2 py-0.5 font-mono text-[11px] font-bold text-ink">
                    {err.statusCode}
                  </span>
                </td>
                <td className="py-3 text-right font-bold text-ink">
                  {err.occurrences}
                </td>
                <td className="py-3 text-right text-ink-muted">
                  {new Date(err.lastSeenAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

