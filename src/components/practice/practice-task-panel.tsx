"use client";

import * as React from "react";
import { CheckCircle2, ChevronDown, ChevronUp, Circle, Clock, Lightbulb, Sparkles } from "lucide-react";
import type { PracticeConfig } from "@/lib/practice/types";
import { Badge } from "@/components/ui/badge";

interface PracticeTaskPanelProps {
  config: PracticeConfig;
  passedCheckIds: Set<string>;
}

export function PracticeTaskPanel({ config, passedCheckIds }: PracticeTaskPanelProps) {
  const [showHints, setShowHints] = React.useState(false);
  const [showExpected, setShowExpected] = React.useState(false);

  return (
    <div className="rounded-3xl border border-line bg-surface p-5 sm:p-6 shadow-sm space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line pb-4">
        <div className="flex items-center gap-2">
          <Badge className="bg-primary text-white text-xs font-bold px-2.5 py-0.5">
            Practice
          </Badge>
          <span className="font-display text-base sm:text-lg font-bold text-ink">
            Your Task
          </span>
        </div>

        {config.estimatedMinutes && (
          <span className="flex items-center gap-1 text-xs text-ink-muted font-medium">
            <Clock className="h-3.5 w-3.5 text-primary" />
            <span>{config.estimatedMinutes} min</span>
          </span>
        )}
      </div>

      {/* Instructions */}
      <p className="text-xs sm:text-sm leading-relaxed text-ink/90 font-sans">
        {config.instructions}
      </p>

      {/* Requirements Checklist */}
      {config.requirements.length > 0 && (
        <div className="space-y-2 pt-2 border-t border-line/60">
          <span className="text-xs font-bold uppercase tracking-wider text-ink-muted block">
            Requirements Checklist
          </span>
          <div className="space-y-1.5">
            {config.requirements.map((req) => {
              const isPassed = passedCheckIds.has(req.id);
              return (
                <div
                  key={req.id}
                  className="flex items-start gap-2 text-xs leading-relaxed text-ink/90"
                >
                  {isPassed ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                  ) : (
                    <Circle className="h-4 w-4 text-ink-muted/50 shrink-0 mt-0.5" />
                  )}
                  <span className={isPassed ? "text-ink font-semibold" : "text-ink/80"}>
                    {req.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Hints & Expected Accordion */}
      <div className="flex flex-col gap-2 pt-2">
        {config.hints && config.hints.length > 0 && (
          <div className="rounded-2xl border border-line bg-surface-elevated/20 overflow-hidden">
            <button
              type="button"
              onClick={() => setShowHints(!showHints)}
              className="flex w-full items-center justify-between p-3 text-xs font-bold text-ink hover:text-primary transition"
            >
              <div className="flex items-center gap-1.5 text-amber-500">
                <Lightbulb className="h-4 w-4" />
                <span>Need a hint? ({config.hints.length})</span>
              </div>
              {showHints ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>
            {showHints && (
              <div className="p-3 pt-0 space-y-2 border-t border-line/40 text-xs text-ink-muted">
                {config.hints.map((h, i) => (
                  <div key={i} className="flex items-start gap-2 bg-surface p-2.5 rounded-xl border border-line/50">
                    <span className="font-bold text-amber-500">#{i + 1}</span>
                    <p className="leading-relaxed text-ink/90">{h}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {config.expectedPreviewDescription && (
          <div className="rounded-2xl border border-line bg-surface-elevated/20 overflow-hidden">
            <button
              type="button"
              onClick={() => setShowExpected(!showExpected)}
              className="flex w-full items-center justify-between p-3 text-xs font-bold text-ink hover:text-primary transition"
            >
              <div className="flex items-center gap-1.5 text-primary">
                <Sparkles className="h-4 w-4" />
                <span>What you&apos;re building</span>
              </div>
              {showExpected ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>
            {showExpected && (
              <div className="p-3 pt-0 border-t border-line/40 text-xs text-ink/90 leading-relaxed bg-surface rounded-b-xl">
                {config.expectedPreviewDescription}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
