"use client";

import * as React from "react";
import {
  Loader2,
  Plus,
  Save,
  Trash2,
  Video,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  updateLessonAction,
  updateLessonObjectivesAction,
  updateLessonResourcesAction,
} from "@/lib/actions/admin";
import { extractVideoId } from "@/lib/utils/youtube-importer";
import type { AdminLessonDetail } from "@/lib/types";

interface VideoLessonEditorProps {
  lesson: AdminLessonDetail;
  courseId: string;
  onUpdated: () => void;
}

export function VideoLessonEditor({ lesson, courseId, onUpdated }: VideoLessonEditorProps) {
  const [title, setTitle] = React.useState(lesson.title);
  const [slug, setSlug] = React.useState(lesson.slug);
  const [summary, setSummary] = React.useState(lesson.summary || "");
  const [videoInput, setVideoInput] = React.useState(
    lesson.youtubeVideoId ? `https://www.youtube.com/watch?v=${lesson.youtubeVideoId}` : lesson.videoUrl || "",
  );
  const [youtubeVideoId, setYoutubeVideoId] = React.useState(lesson.youtubeVideoId || "");
  const [keyTakeaway, setKeyTakeaway] = React.useState(lesson.keyTakeaway || "");
  const [sourceChannel, setSourceChannel] = React.useState(lesson.sourceChannel || "W3Schools.com");
  const [estimatedMinutes, setEstimatedMinutes] = React.useState(lesson.estimatedMinutes || 5);
  const [isPreview, setIsPreview] = React.useState(lesson.isPreview);
  const [isBonus, setIsBonus] = React.useState(lesson.isBonus);
  const [isPublished, setIsPublished] = React.useState(lesson.isPublished);

  // Objectives & Resources state
  const [objectives, setObjectives] = React.useState<string[]>(
    lesson.objectives.map((o) => o.text),
  );
  const [resources] = React.useState<{ label: string; resourceType: string; url?: string }[]>(
    lesson.resources.map((r) => ({ label: r.label, resourceType: r.resourceType, url: r.url || undefined })),
  );

  const [isSaving, setIsSaving] = React.useState(false);
  const [msg, setMsg] = React.useState<{ type: "success" | "error"; text: string } | null>(null);

  // Auto-extract YouTube video ID on input change
  const handleVideoInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setVideoInput(val);
    const extracted = extractVideoId(val);
    if (extracted) {
      setYoutubeVideoId(extracted);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSaving) return;
    setIsSaving(true);
    setMsg(null);

    try {
      const vId = extractVideoId(videoInput) || youtubeVideoId;

      const [lessonRes] = await Promise.all([
        updateLessonAction(lesson.id, courseId, {
          title,
          slug,
          summary,
          lessonType: "video",
          videoUrl: vId ? `https://www.youtube.com/watch?v=${vId}` : null,
          videoProvider: "youtube",
          youtubeVideoId: vId || null,
          sourceChannel: sourceChannel || null,
          keyTakeaway: keyTakeaway || null,
          estimatedMinutes,
          isPreview,
          isBonus,
          isPublished,
        }),
        updateLessonObjectivesAction(lesson.id, courseId, objectives),
        updateLessonResourcesAction(lesson.id, courseId, resources),
      ]);

      if (!lessonRes.success) {
        setMsg({ type: "error", text: lessonRes.error || "Failed to save lesson." });
      } else {
        setMsg({ type: "success", text: "Video lesson saved." });
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

      {/* Basic fields */}
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

      {/* YouTube Video Details */}
      <div className="rounded-2xl border border-line bg-surface-elevated/30 p-4 space-y-4">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-ink">
          <Video className="h-4 w-4 text-rose-500" />
          <span>YouTube Video Source</span>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-xs font-semibold text-ink-muted">
              YouTube URL or Video ID
            </label>
            <input
              type="text"
              value={videoInput}
              onChange={handleVideoInputChange}
              placeholder="https://www.youtube.com/watch?v=AGDDdsiZ0Ko"
              className="mt-1 h-9 w-full rounded-xl border border-line bg-surface px-3 text-xs font-mono text-ink focus:border-primary focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-ink-muted">
              Source Attribution / Channel
            </label>
            <input
              type="text"
              value={sourceChannel}
              onChange={(e) => setSourceChannel(e.target.value)}
              placeholder="W3Schools.com"
              className="mt-1 h-9 w-full rounded-xl border border-line bg-surface px-3 text-xs text-ink focus:border-primary focus:outline-none"
            />
          </div>
        </div>

        {/* Live Video Preview (youtube-nocookie.com) */}
        {youtubeVideoId && (
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-ink-muted">
              Video Player Preview
            </label>
            <div className="aspect-video w-full max-w-md overflow-hidden rounded-xl border border-line bg-black shadow-inner">
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${youtubeVideoId}`}
                title="Video Preview"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="h-full w-full border-0"
              />
            </div>
          </div>
        )}
      </div>

      {/* Summary & Takeaway */}
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
          Key Takeaway
        </label>
        <input
          type="text"
          value={keyTakeaway}
          onChange={(e) => setKeyTakeaway(e.target.value)}
          placeholder="Main concept or rule learners must remember"
          className="mt-1.5 h-10 w-full rounded-xl border border-line bg-surface px-3 text-xs text-ink focus:border-primary focus:outline-none"
        />
      </div>

      {/* Duration & Toggles */}
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
          <span>Bonus Lesson</span>
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

      {/* Learning Objectives */}
      <div className="space-y-3 rounded-xl border border-line bg-surface p-4">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold uppercase tracking-wider text-ink">
            Lesson Learning Objectives
          </label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setObjectives([...objectives, ""])}
            className="rounded-lg border-line text-[11px] font-semibold"
          >
            <Plus className="mr-1 h-3 w-3" />
            <span>Add Objective</span>
          </Button>
        </div>

        {objectives.map((obj, i) => (
          <div key={i} className="flex items-center gap-2">
            <span className="text-xs font-bold text-ink-muted shrink-0 w-4">{i + 1}.</span>
            <input
              type="text"
              value={obj}
              onChange={(e) => {
                const next = [...objectives];
                next[i] = e.target.value;
                setObjectives(next);
              }}
              placeholder="e.g. Understand the difference between block and inline tags"
              className="h-8 flex-1 rounded-lg border border-line bg-surface-elevated px-2.5 text-xs text-ink focus:border-primary focus:outline-none"
            />
            <button
              type="button"
              onClick={() => setObjectives(objectives.filter((_, idx) => idx !== i))}
              className="p-1 text-rose-500 hover:bg-rose-500/10 rounded"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
      </div>

      {/* Save Button */}
      <div className="flex justify-end pt-2">
        <Button
          type="submit"
          disabled={isSaving}
          className="rounded-xl bg-primary px-6 font-semibold text-white shadow-sm hover:bg-primary/90"
        >
          {isSaving ? <Loader2 className="mr-1.5 h-4 w-4 animate-spin" /> : <Save className="mr-1.5 h-4 w-4" />}
          <span>Save Video Lesson</span>
        </Button>
      </div>
    </form>
  );
}
