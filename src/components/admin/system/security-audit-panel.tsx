"use client";

import * as React from "react";
import { CheckCircle2, Lock, RefreshCw, ShieldAlert, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { runSecurityAuditAction } from "@/lib/actions/system-health";
import type { SecurityAuditResult } from "@/lib/system-health/types";

interface SecurityAuditPanelProps {
  security: SecurityAuditResult;
}

const RLS_TABLES = [
  { table: "profiles", rls: "Enabled", privacy: "User-isolated via auth.uid()", status: "Protected" },
  { table: "course_enrollments", rls: "Enabled", privacy: "User-isolated via user_id", status: "Protected" },
  { table: "lesson_progress", rls: "Enabled", privacy: "User-isolated via user_id", status: "Protected" },
  { table: "lesson_notes", rls: "Enabled", privacy: "User-isolated via user_id", status: "Protected" },
  { table: "lesson_bookmarks", rls: "Enabled", privacy: "User-isolated via user_id", status: "Protected" },
  { table: "lesson_practice_drafts", rls: "Enabled", privacy: "User-isolated via user_id", status: "Protected" },
  { table: "practice_question_correct_options", rls: "Enabled", privacy: "Admin/Service-role only", status: "Protected" },
  { table: "support_messages", rls: "Enabled", privacy: "Submit/Admin only", status: "Protected" },
  { table: "system_performance_metrics", rls: "Enabled", privacy: "Admin/Service-role only", status: "Protected" },
];

export function SecurityAuditPanel({ security: initialSecurity }: SecurityAuditPanelProps) {
  const [security, setSecurity] = React.useState<SecurityAuditResult>(initialSecurity);
  const [isRunningAudit, setIsRunningAudit] = React.useState(false);

  const handleRunSecurityAudit = async () => {
    setIsRunningAudit(true);
    toast("Running security & RLS audit...", { id: "sec-audit" });
    try {
      const res = await runSecurityAuditAction();
      if (res.success && res.result) {
        setSecurity(res.result);
        if (res.result.criticalCount === 0 && res.result.warningCount === 0) {
          toast.success("Security audit complete — all 5 security gates verified.", { id: "sec-audit" });
        } else {
          toast.warning(
            `Security audit complete — ${res.result.criticalCount + res.result.warningCount} item(s) flagged.`,
            { id: "sec-audit" },
          );
        }
      } else {
        toast.error(res.error || "Security audit failed", { id: "sec-audit" });
      }
    } catch {
      toast.error("Failed to run security audit", { id: "sec-audit" });
    } finally {
      setIsRunningAudit(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Security Status Header */}
      <div className="rounded-2xl border border-line bg-surface p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="size-5 text-purple-500" />
              <h2 className="font-display text-base font-bold text-ink">
                Platform Security & Access Isolation
              </h2>
            </div>
            <p className="text-xs text-ink-muted mt-0.5">
              Live checks verifying RLS rules, correct answer secrecy, sandboxed learner code, and client secret hygiene.
            </p>
          </div>

          <Button
            onClick={handleRunSecurityAudit}
            disabled={isRunningAudit}
            variant="outline"
            className="rounded-xl border-line text-xs font-semibold self-start sm:self-auto"
          >
            <RefreshCw className={`mr-1.5 size-3.5 ${isRunningAudit ? "animate-spin text-primary" : "text-ink-muted"}`} />
            <span>{isRunningAudit ? "Auditing..." : "Run Security Checks"}</span>
          </Button>
        </div>

        {/* Security Checks List */}
        <div className="space-y-3">
          {security.checks.map((c, idx) => (
            <div
              key={idx}
              className="flex items-start justify-between gap-3 rounded-xl border border-line/60 bg-surface-elevated/30 p-3.5 text-xs"
            >
              <div className="flex items-start gap-2.5">
                {c.passed ? (
                  <CheckCircle2 className="size-4 shrink-0 text-emerald-500 mt-0.5" />
                ) : (
                  <ShieldAlert className="size-4 shrink-0 text-rose-500 mt-0.5" />
                )}
                <div>
                  <div className="font-semibold text-ink">{c.name}</div>
                  <p className="text-ink-muted mt-0.5 leading-relaxed">{c.description}</p>
                  {c.detail && (
                    <p className={`mt-1 font-medium ${c.passed ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600"}`}>
                      {c.detail}
                    </p>
                  )}
                </div>
              </div>

              <span
                className={`rounded-md px-2 py-0.5 text-[11px] font-bold shrink-0 ${
                  c.passed
                    ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                    : "bg-rose-500/10 text-rose-600 dark:text-rose-400"
                }`}
              >
                {c.passed ? "PASSED" : "FAILED"}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* RLS Table Privacy Summary */}
      <div className="rounded-2xl border border-line bg-surface p-5 shadow-xs">
        <div className="flex items-center gap-2 mb-4">
          <Lock className="size-4 text-primary" />
          <h3 className="font-display text-base font-bold text-ink">
            Row Level Security (RLS) Matrix
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-line text-ink-muted font-semibold">
                <th className="pb-2.5 font-medium">Table</th>
                <th className="pb-2.5 font-medium">RLS Policy</th>
                <th className="pb-2.5 font-medium">Expected Privacy Isolation</th>
                <th className="pb-2.5 font-medium text-right">Access Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {RLS_TABLES.map((t, idx) => (
                <tr key={idx} className="hover:bg-surface-elevated/40 transition">
                  <td className="py-2.5 font-mono font-medium text-ink pr-4">
                    {t.table}
                  </td>
                  <td className="py-2.5 text-emerald-600 dark:text-emerald-400 font-semibold">
                    {t.rls}
                  </td>
                  <td className="py-2.5 text-ink-muted">
                    {t.privacy}
                  </td>
                  <td className="py-2.5 text-right font-semibold text-ink">
                    <span className="inline-flex items-center rounded-md bg-emerald-500/10 px-2 py-0.5 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                      {t.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
