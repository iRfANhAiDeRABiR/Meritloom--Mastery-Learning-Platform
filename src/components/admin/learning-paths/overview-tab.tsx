"use client";

import * as React from "react";
import { Loader2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { updateLearningPathOverviewAction } from "@/lib/actions/admin-learning-paths";
import { generateSlug } from "@/lib/utils/youtube-importer";
import type { AdminLearningPathDetail, CourseDifficulty } from "@/lib/types";

interface OverviewTabProps {
  path: AdminLearningPathDetail;
  onRefresh: () => void;
}

export function OverviewTab({ path, onRefresh }: OverviewTabProps) {
  const [title, setTitle] = React.useState(path.title);
  const [slug, setSlug] = React.useState(path.slug);
  const [subtitle, setSubtitle] = React.useState(path.subtitle || "");
  const [summary, setSummary] = React.useState(path.summary || "");
  const [description, setDescription] = React.useState(path.description || "");
  const [difficulty, setDifficulty] = React.useState<CourseDifficulty>(path.difficulty);
  const [coverImageUrl] = React.useState(path.coverImageUrl || "");
  const [isSaving, setIsSaving] = React.useState(false);
  const [msg, setMsg] = React.useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || isSaving) return;

    setIsSaving(true);
    setMsg(null);

    try {
      const res = await updateLearningPathOverviewAction(path.id, {
        title: title.trim(),
        slug: slug.trim() || generateSlug(title),
        subtitle: subtitle.trim(),
        summary: summary.trim(),
        description: description.trim(),
        difficulty,
        coverImageUrl: coverImageUrl.trim() || null,
      });

      if (!res.success) {
        setMsg({ type: "error", text: res.error || "Failed to save changes." });
      } else {
        setMsg({ type: "success", text: "Learning Path overview saved successfully." });
        onRefresh();
      }
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : "Failed to save changes.";
      setMsg({ type: "error", text: errorMsg });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="rounded-3xl border border-line bg-surface p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-line pb-4">
          <div>
            <h2 className="font-display text-base font-bold text-ink">
              Path Overview & Metadata
            </h2>
            <p className="text-xs text-ink-muted">
              Configure titles, search summaries, and difficulty level.
            </p>
          </div>
          <Button
            type="submit"
            disabled={isSaving}
            size="sm"
            className="rounded-xl bg-primary text-xs font-semibold text-white shadow-sm hover:bg-primary/90"
          >
            {isSaving ? (
              <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
            ) : (
              <Save className="mr-1.5 h-3.5 w-3.5" />
            )}
            <span>Save Changes</span>
          </Button>
        </div>

        {msg && (
          <div
            className={`rounded-xl p-3.5 text-xs font-semibold ${
              msg.type === "success"
                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                : "bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20"
            }`}
          >
            {msg.text}
          </div>
        )}

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-ink-muted">
              Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1.5 h-10 w-full rounded-xl border border-line bg-surface-elevated px-3 text-xs text-ink focus:border-primary focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-ink-muted">
              URL Slug *
            </label>
            <input
              type="text"
              required
              value={slug}
              onChange={(e) => setSlug(generateSlug(e.target.value))}
              className="mt-1.5 h-10 w-full rounded-xl border border-line bg-surface-elevated px-3 font-mono text-xs text-ink focus:border-primary focus:outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-ink-muted">
              Difficulty *
            </label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value as CourseDifficulty)}
              className="mt-1.5 h-10 w-full rounded-xl border border-line bg-surface-elevated px-3 text-xs text-ink focus:border-primary focus:outline-none"
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-ink-muted">
              Subtitle (Hero headline)
            </label>
            <input
              type="text"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              placeholder="e.g. Build the core skills you need to create modern interactive websites."
              className="mt-1.5 h-10 w-full rounded-xl border border-line bg-surface-elevated px-3 text-xs text-ink focus:border-primary focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-ink-muted">
            Summary (Card preview)
          </label>
          <textarea
            rows={2}
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            className="mt-1.5 w-full rounded-xl border border-line bg-surface-elevated p-3 text-xs text-ink focus:border-primary focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-ink-muted">
            Full Description
          </label>
          <textarea
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1.5 w-full rounded-xl border border-line bg-surface-elevated p-3 text-xs text-ink focus:border-primary focus:outline-none"
          />
        </div>
      </div>
    </form>
  );
}
