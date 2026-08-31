"use client";

import * as React from "react";
import { Loader2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { updateCourseOverviewAction } from "@/lib/actions/admin";
import type { AdminCourseDetail, Category, CourseDifficulty } from "@/lib/types";

interface OverviewTabProps {
  course: AdminCourseDetail;
  categories: Category[];
}

export function OverviewTab({ course, categories }: OverviewTabProps) {
  const [title, setTitle] = React.useState(course.title);
  const [slug, setSlug] = React.useState(course.slug);
  const [summary, setSummary] = React.useState(course.summary || "");
  const [description, setDescription] = React.useState(course.description || "");
  const [categoryId, setCategoryId] = React.useState(course.categoryId || "");
  const [difficulty, setDifficulty] = React.useState<CourseDifficulty>(course.difficulty);
  const [language, setLanguage] = React.useState(course.language || "English");
  const [coverImageUrl, setCoverImageUrl] = React.useState(course.coverImageUrl || "");
  const [isSaving, setIsSaving] = React.useState(false);
  const [msg, setMsg] = React.useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSaving) return;
    setIsSaving(true);
    setMsg(null);

    try {
      const res = await updateCourseOverviewAction(course.id, {
        title,
        slug,
        summary,
        description,
        categoryId: categoryId || null,
        difficulty,
        language,
        coverImageUrl: coverImageUrl || null,
      });

      if (!res.success) {
        setMsg({ type: "error", text: res.error || "Failed to update course." });
      } else {
        setMsg({ type: "success", text: "Course overview saved successfully." });
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "An error occurred.";
      setMsg({ type: "error", text: msg });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSave} className="space-y-6">
      {msg && (
        <div
          className={`rounded-xl p-3.5 text-xs font-semibold ${
            msg.type === "success"
              ? "border border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
              : "border border-rose-500/20 bg-rose-500/10 text-rose-600 dark:text-rose-400"
          }`}
        >
          {msg.text}
        </div>
      )}

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-ink-muted">
            Course Title *
          </label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1.5 h-11 w-full rounded-xl border border-line bg-surface-elevated px-3.5 text-sm text-ink focus:border-primary focus:outline-none"
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
            onChange={(e) => setSlug(e.target.value)}
            className="mt-1.5 h-11 w-full rounded-xl border border-line bg-surface-elevated px-3.5 text-sm font-mono text-ink focus:border-primary focus:outline-none"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-ink-muted">
          Short Summary
        </label>
        <textarea
          rows={2}
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          placeholder="Brief description shown on course discovery cards."
          className="mt-1.5 w-full rounded-xl border border-line bg-surface-elevated p-3.5 text-sm text-ink focus:border-primary focus:outline-none"
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
          placeholder="Detailed syllabus overview shown on Course Details page."
          className="mt-1.5 w-full rounded-xl border border-line bg-surface-elevated p-3.5 text-sm text-ink focus:border-primary focus:outline-none"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-ink-muted">
            Category
          </label>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="mt-1.5 h-11 w-full rounded-xl border border-line bg-surface-elevated px-3 text-sm text-ink focus:border-primary focus:outline-none"
          >
            <option value="">None</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-ink-muted">
            Difficulty
          </label>
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value as CourseDifficulty)}
            className="mt-1.5 h-11 w-full rounded-xl border border-line bg-surface-elevated px-3 text-sm text-ink focus:border-primary focus:outline-none"
          >
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-ink-muted">
            Language
          </label>
          <input
            type="text"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="mt-1.5 h-11 w-full rounded-xl border border-line bg-surface-elevated px-3 text-sm text-ink focus:border-primary focus:outline-none"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-ink-muted">
          Cover Image / Theme Accent
        </label>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          {["html", "css", "javascript", "default"].map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => setCoverImageUrl(preset === "default" ? "" : `preset:${preset}`)}
              className={`rounded-lg border px-3 py-1.5 text-xs font-semibold uppercase transition ${
                coverImageUrl === `preset:${preset}` || (preset === "default" && !coverImageUrl)
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-line bg-surface-elevated text-ink-muted hover:text-ink"
              }`}
            >
              {preset} Theme
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-end border-t border-line pt-4">
        <Button
          type="submit"
          disabled={isSaving}
          className="rounded-xl bg-primary px-6 font-semibold text-white shadow-sm hover:bg-primary/90"
        >
          {isSaving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              <span>Saving...</span>
            </>
          ) : (
            <>
              <Save className="mr-1.5 h-4 w-4" />
              <span>Save Changes</span>
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
