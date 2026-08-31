"use client";

import * as React from "react";
import { Loader2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  updateLessonAction,
  updateLessonObjectivesAction,
} from "@/lib/actions/admin";
import type { AdminLessonDetail } from "@/lib/types";

interface ArticleLessonEditorProps {
  lesson: AdminLessonDetail;
  courseId: string;
  onUpdated: () => void;
}

export function ArticleLessonEditor({ lesson, courseId, onUpdated }: ArticleLessonEditorProps) {
  const [title, setTitle] = React.useState(lesson.title);
  const [slug, setSlug] = React.useState(lesson.slug);
  const [summary, setSummary] = React.useState(lesson.summary || "");
  const [contentBody, setContentBody] = React.useState(
    typeof lesson.content === "string"
      ? lesson.content
      : lesson.content?.body || (lesson.content ? JSON.stringify(lesson.content, null, 2) : ""),
  );
  const [keyTakeaway, setKeyTakeaway] = React.useState(lesson.keyTakeaway || "");
  const [estimatedMinutes, setEstimatedMinutes] = React.useState(lesson.estimatedMinutes || 5);
  const [isPreview, setIsPreview] = React.useState(lesson.isPreview);
  const [isBonus, setIsBonus] = React.useState(lesson.isBonus);
  const [isPublished, setIsPublished] = React.useState(lesson.isPublished);

  const [objectives] = React.useState<string[]>(
    lesson.objectives.map((o) => o.text),
  );

  const [isSaving, setIsSaving] = React.useState(false);
  const [msg, setMsg] = React.useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSaving) return;
    setIsSaving(true);
    setMsg(null);

    try {
      const [lessonRes] = await Promise.all([
        updateLessonAction(lesson.id, courseId, {
          title,
          slug,
          summary,
          lessonType: (lesson.lessonType === "quiz" ? "knowledge_check" : lesson.lessonType) as "video" | "article" | "exercise" | "practice" | "knowledge_check",
          content: { body: contentBody },
          keyTakeaway: keyTakeaway || null,
          estimatedMinutes,
          isPreview,
          isBonus,
          isPublished,
        }),
        updateLessonObjectivesAction(lesson.id, courseId, objectives),
      ]);

      if (!lessonRes.success) {
        setMsg({ type: "error", text: lessonRes.error || "Failed to save lesson." });
      } else {
        setMsg({ type: "success", text: "Lesson saved successfully." });
        onUpdated();
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to save.";
      setMsg({ type: "error", text: message });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSave} className="space-y-6">
      {msg && (
        <div
          className={`rounded-xl p-3 text-xs font-semibold ${
            msg.type === "success"
              ? "border border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
              : "border border-rose-500/20 bg-rose-500/10 text-rose-600 dark:text-rose-400"
          }`}
        >
          {msg.text}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-ink-muted">
            Lesson Title *
          </label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1.5 h-10 w-full rounded-xl border border-line bg-surface px-3 text-xs text-ink focus:border-primary focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-ink-muted">
            Lesson Slug *
          </label>
          <input
            type="text"
            required
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            className="mt-1.5 h-10 w-full rounded-xl border border-line bg-surface px-3 text-xs font-mono text-ink focus:border-primary focus:outline-none"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-ink-muted">
          Summary
        </label>
        <textarea
          rows={2}
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          placeholder="Concise overview of what this lesson covers..."
          className="mt-1.5 w-full rounded-xl border border-line bg-surface p-3 text-xs text-ink focus:border-primary focus:outline-none"
        />
      </div>

      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-ink-muted">
          Lesson Body Content (Markdown / Text)
        </label>
        <textarea
          rows={8}
          value={contentBody}
          onChange={(e) => setContentBody(e.target.value)}
          placeholder="# Introduction&#10;&#10;Explain core concept here with examples..."
          className="mt-1.5 w-full rounded-xl border border-line bg-surface p-3 font-mono text-xs text-ink focus:border-primary focus:outline-none"
        />
      </div>

      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-ink-muted">
          Key Takeaway
        </label>
        <input
          type="text"
          value={keyTakeaway}
          onChange={(e) => setKeyTakeaway(e.target.value)}
          placeholder="Main takeaway rule"
          className="mt-1.5 h-10 w-full rounded-xl border border-line bg-surface px-3 text-xs text-ink focus:border-primary focus:outline-none"
        />
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 items-center">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-ink-muted">
            Duration (Mins)
          </label>
          <input
            type="number"
            min={1}
            value={estimatedMinutes}
            onChange={(e) => setEstimatedMinutes(parseInt(e.target.value, 10) || 5)}
            className="mt-1.5 h-10 w-full rounded-xl border border-line bg-surface px-3 text-xs text-ink focus:border-primary focus:outline-none"
          />
        </div>

        <label className="flex items-center gap-2 pt-5 text-xs font-semibold text-ink cursor-pointer">
          <input
            type="checkbox"
            checked={isPreview}
            onChange={(e) => setIsPreview(e.target.checked)}
            className="rounded border-line text-primary focus:ring-primary"
          />
          <span>Free Preview</span>
        </label>

        <label className="flex items-center gap-2 pt-5 text-xs font-semibold text-ink cursor-pointer">
          <input
            type="checkbox"
            checked={isBonus}
            onChange={(e) => setIsBonus(e.target.checked)}
            className="rounded border-line text-primary focus:ring-primary"
          />
          <span>Bonus</span>
        </label>

        <label className="flex items-center gap-2 pt-5 text-xs font-semibold text-ink cursor-pointer">
          <input
            type="checkbox"
            checked={isPublished}
            onChange={(e) => setIsPublished(e.target.checked)}
            className="rounded border-line text-primary focus:ring-primary"
          />
          <span>Published</span>
        </label>
      </div>

      <div className="flex justify-end pt-2">
        <Button
          type="submit"
          disabled={isSaving}
          className="rounded-xl bg-primary px-6 font-semibold text-white shadow-sm hover:bg-primary/90"
        >
          {isSaving ? <Loader2 className="mr-1.5 h-4 w-4 animate-spin" /> : <Save className="mr-1.5 h-4 w-4" />}
          <span>Save Lesson</span>
        </Button>
      </div>
    </form>
  );
}
