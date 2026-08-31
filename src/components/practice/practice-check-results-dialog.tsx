"use client";

import * as React from "react";
import { CheckCircle2, Circle, ListChecks, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { PracticeCheckEvaluation } from "@/lib/practice/types";

interface PracticeCheckResultsDialogProps {
  evaluation: PracticeCheckEvaluation;
  onClose: () => void;
  onContinue: () => void;
}

export function PracticeCheckResultsDialog({
  evaluation,
  onClose,
  onContinue,
}: PracticeCheckResultsDialogProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-3xl border border-line bg-surface p-6 shadow-2xl space-y-5">
        <div className="flex items-center justify-between border-b border-line pb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <ListChecks className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-display text-base font-bold text-ink">
                Practice Feedback
              </h3>
              <p className="text-xs text-ink-muted">
                {evaluation.summaryMessage}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl p-1 text-ink-muted hover:bg-surface-elevated hover:text-ink"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Checks List */}
        <div className="space-y-2.5 max-h-60 overflow-y-auto">
          {evaluation.checks.map((chk) => (
            <div
              key={chk.id}
              className={`flex items-start gap-2.5 p-3 rounded-2xl border text-xs ${
                chk.passed
                  ? "border-emerald-500/20 bg-emerald-500/5 text-emerald-700 dark:text-emerald-300"
                  : "border-line bg-surface-elevated/30 text-ink"
              }`}
            >
              {chk.passed ? (
                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
              ) : (
                <Circle className="h-4 w-4 text-ink-muted/50 shrink-0 mt-0.5" />
              )}
              <div className="space-y-0.5">
                <span className="font-semibold block">{chk.label}</span>
                {chk.feedback && !chk.passed && (
                  <p className="text-[11px] text-ink-muted">{chk.feedback}</p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-end gap-2 pt-2 border-t border-line">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClose}
            className="rounded-xl border-line text-xs font-semibold"
          >
            Keep editing
          </Button>
          <Button
            type="button"
            size="sm"
            onClick={onContinue}
            className="rounded-xl bg-primary text-xs font-semibold text-white hover:bg-primary/90"
          >
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
}
