"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2, Route } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createLearningPathAction } from "@/lib/actions/admin-learning-paths";
import { generateSlug } from "@/lib/utils/youtube-importer";
import type { CourseDifficulty } from "@/lib/types";

export function NewLearningPathForm() {
  const router = useRouter();

  const [title, setTitle] = React.useState("");
  const [slug, setSlug] = React.useState("");
  const [isSlugManuallyEdited, setIsSlugManuallyEdited] = React.useState(false);
  const [summary, setSummary] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [difficulty, setDifficulty] = React.useState<CourseDifficulty>("beginner");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setTitle(val);
    if (!isSlugManuallyEdited) {
      setSlug(generateSlug(val));
    }
  };

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsSlugManuallyEdited(true);
    setSlug(generateSlug(e.target.value));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || isSubmitting) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const res = await createLearningPathAction({
        title: title.trim(),
        slug: slug.trim() || generateSlug(title),
        summary: summary.trim(),
        description: description.trim(),
        difficulty,
      });

      if (!res.success) {
        setError(res.error || "Failed to create learning path.");
      } else if (res.pathId) {
        router.push(`/admin/learning-paths/${res.pathId}`);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "An unexpected error occurred.";
      setError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {/* Top Back link */}
      <div>
        <Button asChild variant="outline" size="sm" className="rounded-xl border-line text-xs font-semibold">
          <Link href="/admin/learning-paths">
            <ArrowLeft className="mr-1.5 h-3.5 w-3.5" />
            <span>Back to Learning Paths</span>
          </Link>
        </Button>
      </div>

      {/* Main card */}
      <div className="rounded-3xl border border-line bg-surface p-6 sm:p-8 shadow-sm">
        <div className="flex items-center gap-3 border-b border-line pb-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Route className="h-6 w-6" />
          </div>
          <div>
            <h1 className="font-display text-xl font-bold tracking-tight text-ink sm:text-2xl">
              Create New Learning Path
            </h1>
            <p className="mt-0.5 text-xs text-ink-muted">
              Paths are created as draft journeys. You can add course steps, project milestones, and preview before publishing.
            </p>
          </div>
        </div>

        {error && (
          <div className="mt-6 rounded-xl border border-rose-500/20 bg-rose-500/10 p-4 text-xs font-semibold text-rose-600 dark:text-rose-400">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-ink-muted">
              Path Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={handleTitleChange}
              placeholder="e.g. Web Development Foundations"
              className="mt-1.5 h-11 w-full rounded-xl border border-line bg-surface-elevated px-3 text-sm text-ink focus:border-primary focus:outline-none"
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
              onChange={handleSlugChange}
              placeholder="web-development-foundations"
              className="mt-1.5 h-10 w-full rounded-xl border border-line bg-surface-elevated px-3 font-mono text-xs text-ink focus:border-primary focus:outline-none"
            />
            <p className="mt-1 text-[11px] text-ink-muted">
              Public URL will be: <strong className="text-ink font-mono">/learning-paths/{slug || "..."}</strong>
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-ink-muted">
                Difficulty Level *
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
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-ink-muted">
              Summary (Short pitch)
            </label>
            <textarea
              rows={2}
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="Master frontend foundations through a clear sequence of free courses and hands-on practice."
              className="mt-1.5 w-full rounded-xl border border-line bg-surface-elevated p-3 text-xs text-ink focus:border-primary focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-ink-muted">
              Description (Detailed overview)
            </label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Follow a guided sequence through HTML, CSS, and JavaScript. Practice what you learn and build a complete final project..."
              className="mt-1.5 w-full rounded-xl border border-line bg-surface-elevated p-3 text-xs text-ink focus:border-primary focus:outline-none"
            />
          </div>

          <div className="flex items-center justify-end gap-3 border-t border-line pt-6">
            <Button
              asChild
              type="button"
              variant="outline"
              className="rounded-xl border-line text-xs font-semibold"
            >
              <Link href="/admin/learning-paths">Cancel</Link>
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !title.trim()}
              className="rounded-xl bg-primary px-5 text-xs font-semibold text-white shadow-sm hover:bg-primary/90"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                  <span>Creating Path...</span>
                </>
              ) : (
                <span>Create & Configure Steps</span>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
