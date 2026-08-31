"use client";

import * as React from "react";
import { ArrowDown, ArrowUp, Loader2, Plus, Save, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  updateCourseOutcomesAction,
  updateCoursePrerequisitesAction,
} from "@/lib/actions/admin";
import type { AdminCourseDetail } from "@/lib/types";

interface OutcomesTabProps {
  course: AdminCourseDetail;
}

export function OutcomesTab({ course }: OutcomesTabProps) {
  const [outcomes, setOutcomes] = React.useState<string[]>(
    course.learningOutcomes.map((o) => o.outcomeText),
  );
  const [prereqs, setPrereqs] = React.useState<string[]>(
    course.prerequisites.map((p) => p.prerequisiteText),
  );
  const [isSavingOutcomes, setIsSavingOutcomes] = React.useState(false);
  const [isSavingPrereqs, setIsSavingPrereqs] = React.useState(false);
  const [msg, setMsg] = React.useState<string | null>(null);

  const handleSaveOutcomes = async () => {
    setIsSavingOutcomes(true);
    setMsg(null);
    try {
      const res = await updateCourseOutcomesAction(course.id, outcomes);
      if (res.success) setMsg("Learning outcomes saved.");
    } finally {
      setIsSavingOutcomes(false);
    }
  };

  const handleSavePrereqs = async () => {
    setIsSavingPrereqs(true);
    setMsg(null);
    try {
      const res = await updateCoursePrerequisitesAction(course.id, prereqs);
      if (res.success) setMsg("Prerequisites saved.");
    } finally {
      setIsSavingPrereqs(false);
    }
  };

  return (
    <div className="space-y-8">
      {msg && (
        <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-3 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
          {msg}
        </div>
      )}

      {/* Learning Outcomes Section */}
      <div className="space-y-4 rounded-2xl border border-line bg-surface-elevated/20 p-5">
        <div className="flex items-center justify-between border-b border-line pb-3">
          <div>
            <h2 className="font-display text-base font-bold text-ink">
              What You&apos;ll Learn (Outcomes)
            </h2>
            <p className="text-xs text-ink-muted">
              Key competencies learners gain upon completing this course.
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setOutcomes([...outcomes, ""])}
            className="rounded-xl border-line text-xs font-semibold"
          >
            <Plus className="mr-1 h-3.5 w-3.5" />
            <span>Add Outcome</span>
          </Button>
        </div>

        {outcomes.length === 0 ? (
          <p className="py-4 text-center text-xs text-ink-muted">
            No outcomes listed yet. Add what learners will be able to do.
          </p>
        ) : (
          <div className="space-y-2.5">
            {outcomes.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-surface-elevated text-xs font-bold text-ink-muted">
                  {idx + 1}
                </span>
                <input
                  type="text"
                  value={item}
                  onChange={(e) => {
                    const next = [...outcomes];
                    next[idx] = e.target.value;
                    setOutcomes(next);
                  }}
                  placeholder="e.g. Build semantic, accessible HTML web pages"
                  className="h-10 flex-1 rounded-xl border border-line bg-surface px-3 text-xs text-ink focus:border-primary focus:outline-none"
                />
                <button
                  type="button"
                  disabled={idx === 0}
                  onClick={() => {
                    const next = [...outcomes];
                    const temp = next[idx - 1];
                    next[idx - 1] = next[idx];
                    next[idx] = temp;
                    setOutcomes(next);
                  }}
                  className="rounded-lg p-1.5 text-ink-muted hover:bg-surface hover:text-ink disabled:opacity-30"
                >
                  <ArrowUp className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  disabled={idx === outcomes.length - 1}
                  onClick={() => {
                    const next = [...outcomes];
                    const temp = next[idx + 1];
                    next[idx + 1] = next[idx];
                    next[idx] = temp;
                    setOutcomes(next);
                  }}
                  className="rounded-lg p-1.5 text-ink-muted hover:bg-surface hover:text-ink disabled:opacity-30"
                >
                  <ArrowDown className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setOutcomes(outcomes.filter((_, i) => i !== idx))}
                  className="rounded-lg p-1.5 text-rose-500 hover:bg-rose-500/10"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-end pt-2">
          <Button
            type="button"
            onClick={handleSaveOutcomes}
            disabled={isSavingOutcomes}
            size="sm"
            className="rounded-xl bg-primary text-xs font-semibold text-white hover:bg-primary/90"
          >
            {isSavingOutcomes ? (
              <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
            ) : (
              <Save className="mr-1.5 h-3.5 w-3.5" />
            )}
            <span>Save Outcomes</span>
          </Button>
        </div>
      </div>

      {/* Prerequisites Section */}
      <div className="space-y-4 rounded-2xl border border-line bg-surface-elevated/20 p-5">
        <div className="flex items-center justify-between border-b border-line pb-3">
          <div>
            <h2 className="font-display text-base font-bold text-ink">
              Prerequisites (Informational)
            </h2>
            <p className="text-xs text-ink-muted">
              Recommended background knowledge or foundational courses.
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setPrereqs([...prereqs, ""])}
            className="rounded-xl border-line text-xs font-semibold"
          >
            <Plus className="mr-1 h-3.5 w-3.5" />
            <span>Add Prerequisite</span>
          </Button>
        </div>

        {prereqs.length === 0 ? (
          <p className="py-4 text-center text-xs text-ink-muted">
            No prerequisites. Learners can jump straight into this course!
          </p>
        ) : (
          <div className="space-y-2.5">
            {prereqs.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-surface-elevated text-xs font-bold text-ink-muted">
                  {idx + 1}
                </span>
                <input
                  type="text"
                  value={item}
                  onChange={(e) => {
                    const next = [...prereqs];
                    next[idx] = e.target.value;
                    setPrereqs(next);
                  }}
                  placeholder="e.g. Basic familiarity with web browsers and text editors"
                  className="h-10 flex-1 rounded-xl border border-line bg-surface px-3 text-xs text-ink focus:border-primary focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setPrereqs(prereqs.filter((_, i) => i !== idx))}
                  className="rounded-lg p-1.5 text-rose-500 hover:bg-rose-500/10"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-end pt-2">
          <Button
            type="button"
            onClick={handleSavePrereqs}
            disabled={isSavingPrereqs}
            size="sm"
            className="rounded-xl bg-primary text-xs font-semibold text-white hover:bg-primary/90"
          >
            {isSavingPrereqs ? (
              <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
            ) : (
              <Save className="mr-1.5 h-3.5 w-3.5" />
            )}
            <span>Save Prerequisites</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
