"use client";

import * as React from "react";
import { Check, Loader2, Lock, StickyNote, Trash2, XCircle } from "lucide-react";
import { deleteLessonNoteAction, saveLessonNoteAction } from "@/lib/actions/notes-and-bookmarks";
import { Button } from "@/components/ui/button";
import { notify } from "@/lib/notifications/toast";
import { cn } from "@/lib/utils";

interface LessonNotesEditorProps {
  lessonId: string;
  lessonTitle: string;
  courseTitle: string;
  moduleTitle: string;
  initialContent?: string;
  onNoteCountChange?: (hasNote: boolean) => void;
  className?: string;
}

export function LessonNotesEditor({
  lessonId,
  lessonTitle,
  courseTitle,
  moduleTitle,
  initialContent = "",
  onNoteCountChange,
  className,
}: LessonNotesEditorProps) {
  const [content, setContent] = React.useState(initialContent);
  const [saveStatus, setSaveStatus] = React.useState<"idle" | "saving" | "saved" | "error">("idle");
  const [showDeleteModal, setShowDeleteModal] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState(false);

  const debounceTimerRef = React.useRef<NodeJS.Timeout | null>(null);
  const lastSavedContentRef = React.useRef(initialContent);

  const performSave = React.useCallback(async (textToSave: string) => {
    if (textToSave === lastSavedContentRef.current) {
      setSaveStatus("saved");
      return;
    }

    setSaveStatus("saving");
    try {
      const res = await saveLessonNoteAction(lessonId, textToSave);
      if (res.success) {
        lastSavedContentRef.current = textToSave;
        setSaveStatus("saved");
        onNoteCountChange?.(Boolean(textToSave.trim()));
      } else {
        setSaveStatus("error");
        notify.error({ title: res.error || "Could not save note." });
      }
    } catch {
      setSaveStatus("error");
      notify.error({ title: "Could not save note." });
    }
  }, [lessonId, onNoteCountChange]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    if (val.length > 10000) return;
    setContent(val);
    setSaveStatus("saving");

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      performSave(val);
    }, 800);
  };

  const handleBlur = () => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    performSave(content);
  };

  const handleDeleteNote = async () => {
    if (isDeleting) return;
    setIsDeleting(true);
    try {
      const res = await deleteLessonNoteAction(lessonId);
      if (res.success) {
        setContent("");
        lastSavedContentRef.current = "";
        setSaveStatus("idle");
        onNoteCountChange?.(false);
        setShowDeleteModal(false);
        notify.success({ title: "Note deleted" });
      } else {
        notify.error({ title: res.error || "Could not delete note." });
      }
    } catch {
      notify.error({ title: "Could not delete note." });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-3 rounded-[16px] border border-line bg-card p-4 shadow-soft min-w-0", className)}>
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-line pb-2.5">
        <div className="flex items-center gap-2">
          <StickyNote className="size-4 text-primary shrink-0" aria-hidden="true" />
          <h2 className="text-xs font-bold uppercase tracking-wider text-ink truncate">
            Lesson notes
          </h2>
        </div>

        {/* Save Status & Privacy */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 text-[11px] font-semibold" aria-live="polite">
            {saveStatus === "saving" && (
              <span className="flex items-center gap-1 text-ink-muted">
                <Loader2 className="size-3 animate-spin text-primary" />
                <span>Saving...</span>
              </span>
            )}
            {saveStatus === "saved" && (
              <span className="flex items-center gap-1 text-emerald-500">
                <Check className="size-3" />
                <span>Saved</span>
              </span>
            )}
            {saveStatus === "error" && (
              <span className="flex items-center gap-1 text-rose-500">
                <XCircle className="size-3" />
                <span>Couldn&apos;t save</span>
              </span>
            )}
          </div>

          <div className="h-3 w-[1px] bg-line" />

          <span
            className="flex items-center gap-1 text-[10px] font-semibold text-ink-muted"
            title="Only your Meritloom account can access this note."
          >
            <Lock className="size-3" aria-hidden="true" />
            <span className="hidden sm:inline">Private</span>
          </span>
        </div>
      </div>

      {/* Lesson context pill */}
      <div className="text-[11px] text-ink-muted truncate">
        <span className="font-semibold text-ink">{courseTitle}</span> • {moduleTitle} • {lessonTitle}
      </div>

      {/* Editor Textarea */}
      <div className="relative">
        <label htmlFor={`lesson-notes-input-${lessonId}`} className="sr-only">
          Your notes for {lessonTitle}
        </label>
        <textarea
          id={`lesson-notes-input-${lessonId}`}
          rows={10}
          value={content}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Write down key takeaways, questions, code snippets, or ideas you want to remember..."
          className="w-full rounded-xl border border-line bg-surface p-3 text-xs leading-relaxed text-ink placeholder:text-ink-muted focus:border-primary focus:outline-none transition resize-none font-sans"
        />
        <div className="flex items-center justify-between pt-1.5 text-[10px] text-ink-muted">
          <span>{content.length} / 10,000 characters</span>
          {Boolean(content.trim()) && (
            <button
              type="button"
              onClick={() => setShowDeleteModal(true)}
              className="text-rose-500 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Trash2 className="size-3" />
              <span>Delete note</span>
            </button>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-3xl border border-line bg-surface p-6 shadow-2xl space-y-4">
            <h3 className="font-display text-base font-bold text-ink">
              Delete this lesson note?
            </h3>
            <p className="text-xs text-ink-muted leading-relaxed">
              Are you sure you want to delete your note for <strong className="text-ink">&quot;{lessonTitle}&quot;</strong>? This cannot be undone. Bookmarks and course progress remain untouched.
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowDeleteModal(false)}
                className="rounded-xl border-line text-xs font-semibold"
              >
                Cancel
              </Button>
              <Button
                type="button"
                disabled={isDeleting}
                onClick={handleDeleteNote}
                size="sm"
                className="rounded-xl bg-rose-600 text-xs font-semibold text-white hover:bg-rose-700"
              >
                {isDeleting ? "Deleting..." : "Delete Note"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
