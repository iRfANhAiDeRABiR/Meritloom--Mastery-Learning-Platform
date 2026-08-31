"use client";

import * as React from "react";
import { Loader2, Rocket, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { addProjectToLearningPathAction } from "@/lib/actions/admin-learning-paths";

interface AddProjectModalProps {
  pathId: string;
  onClose: () => void;
  onSuccess: () => void;
}

export function AddProjectModal({
  pathId,
  onClose,
  onSuccess,
}: AddProjectModalProps) {
  const [title, setTitle] = React.useState("Build an Interactive Personal Website");
  const [description, setDescription] = React.useState(
    "Combine HTML structure, CSS styling, and JavaScript behavior into one complete frontend project.",
  );
  const [estimatedMinutes, setEstimatedMinutes] = React.useState<number>(30);
  const [isRequired, setIsRequired] = React.useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || isSubmitting) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const res = await addProjectToLearningPathAction(pathId, {
        title: title.trim(),
        description: description.trim(),
        estimatedMinutes: Number(estimatedMinutes) || 30,
        isRequired,
      });

      if (!res.success) {
        setError(res.error || "Failed to add project milestone.");
      } else {
        onSuccess();
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to add project milestone.";
      setError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-3xl border border-line bg-surface p-6 shadow-2xl">
        <div className="flex items-center justify-between border-b border-line pb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400">
              <Rocket className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-display text-base font-bold text-ink">
                Add Final Project Milestone
              </h2>
              <p className="text-xs text-ink-muted">
                Define the hands-on capstone milestone for this Learning Path.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-ink-muted hover:bg-surface-elevated hover:text-ink"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {error && (
          <div className="mt-4 rounded-xl border border-rose-500/20 bg-rose-500/10 p-3 text-xs font-semibold text-rose-600 dark:text-rose-400">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-ink-muted">
              Project Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Build an Interactive Personal Website"
              className="mt-1.5 h-10 w-full rounded-xl border border-line bg-surface-elevated px-3 text-xs text-ink focus:border-primary focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-ink-muted">
              Description
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What learners build and practice in this milestone..."
              className="mt-1.5 w-full rounded-xl border border-line bg-surface-elevated p-3 text-xs text-ink focus:border-primary focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-ink-muted">
                Estimated Time (Minutes)
              </label>
              <input
                type="number"
                min={5}
                max={600}
                value={estimatedMinutes}
                onChange={(e) => setEstimatedMinutes(Number(e.target.value))}
                className="mt-1.5 h-10 w-full rounded-xl border border-line bg-surface-elevated px-3 text-xs text-ink focus:border-primary focus:outline-none"
              />
            </div>

            <div className="flex flex-col justify-end">
              <label className="flex items-center gap-2 text-xs font-semibold text-ink cursor-pointer pb-2.5">
                <input
                  type="checkbox"
                  checked={isRequired}
                  onChange={(e) => setIsRequired(e.target.checked)}
                  className="rounded border-line text-primary focus:ring-primary h-4 w-4"
                />
                <span>Required for Path Completion</span>
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-2 border-t border-line pt-4">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              className="rounded-xl border-line text-xs font-semibold"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !title.trim()}
              size="sm"
              className="rounded-xl bg-primary text-xs font-semibold text-white shadow-sm hover:bg-primary/90"
            >
              {isSubmitting ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                "Add Project Step"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
