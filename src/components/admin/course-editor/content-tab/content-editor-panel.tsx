"use client";

import * as React from "react";
import Link from "next/link";
import { Eye, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import { updateModuleAction } from "@/lib/actions/admin";
import { VideoLessonEditor } from "@/components/admin/course-editor/content-tab/video-lesson-editor";
import { ArticleLessonEditor } from "@/components/admin/course-editor/content-tab/article-lesson-editor";
import { QuizEditor } from "@/components/admin/course-editor/content-tab/quiz-editor";
import type { AdminCourseDetail, AdminLessonDetail, AdminModuleDetail } from "@/lib/types";

interface ContentEditorPanelProps {
  course: AdminCourseDetail;
  selectedLesson: AdminLessonDetail | null;
  selectedModule: AdminModuleDetail | null;
  onUpdated: () => void;
}

function ModuleEditor({
  module,
  courseId,
  onUpdated,
}: {
  module: AdminModuleDetail;
  courseId: string;
  onUpdated: () => void;
}) {
  const [title, setTitle] = React.useState(module.title);
  const [desc, setDesc] = React.useState(module.description || "");
  const [isSaving, setIsSaving] = React.useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSaving) return;
    setIsSaving(true);
    try {
      await updateModuleAction(module.id, courseId, {
        title,
        description: desc,
      });
      onUpdated();
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="rounded-2xl border border-line bg-surface p-6 shadow-sm">
      <div className="border-b border-line pb-4 mb-6">
        <span className="text-xs font-bold uppercase tracking-wider text-primary">
          Module Settings
        </span>
        <h2 className="font-display text-xl font-bold text-ink">{module.title}</h2>
      </div>

      <form onSubmit={handleSave} className="space-y-4">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-ink-muted">
            Module Title *
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
            Module Description
          </label>
          <textarea
            rows={3}
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            placeholder="What this module teaches..."
            className="mt-1.5 w-full rounded-xl border border-line bg-surface-elevated p-3 text-xs text-ink focus:border-primary focus:outline-none"
          />
        </div>

        <div className="flex justify-end pt-2">
          <Button
            type="submit"
            disabled={isSaving}
            size="sm"
            className="rounded-xl bg-primary text-xs font-semibold text-white"
          >
            Save Module
          </Button>
        </div>
      </form>
    </div>
  );
}

export function ContentEditorPanel({
  course,
  selectedLesson,
  selectedModule,
  onUpdated,
}: ContentEditorPanelProps) {
  if (selectedLesson) {
    return (
      <div className="rounded-2xl border border-line bg-surface p-6 shadow-sm">
        <div className="flex items-center justify-between border-b border-line pb-4 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-primary">
                {selectedLesson.lessonType.replace("_", " ")}
              </span>
              <span className="text-ink-muted">•</span>
              <span className="text-xs text-ink-muted font-mono">{selectedLesson.slug}</span>
            </div>
            <h2 className="font-display text-xl font-bold text-ink">{selectedLesson.title}</h2>
          </div>

          <Button asChild variant="outline" size="sm" className="rounded-xl border-line text-xs font-semibold">
            <Link href={`/admin/courses/${course.id}/preview/lessons/${selectedLesson.slug}`}>
              <Eye className="mr-1.5 h-3.5 w-3.5 text-ink-muted" />
              <span>Preview Lesson</span>
            </Link>
          </Button>
        </div>

        {selectedLesson.lessonType === "video" ? (
          <VideoLessonEditor
            key={selectedLesson.id}
            lesson={selectedLesson}
            courseId={course.id}
            onUpdated={onUpdated}
          />
        ) : selectedLesson.lessonType === "knowledge_check" ? (
          <QuizEditor
            key={selectedLesson.id}
            lessonId={selectedLesson.id}
            courseId={course.id}
            initialQuiz={selectedLesson.quiz}
            onUpdated={onUpdated}
          />
        ) : (
          <ArticleLessonEditor
            key={selectedLesson.id}
            lesson={selectedLesson}
            courseId={course.id}
            onUpdated={onUpdated}
          />
        )}
      </div>
    );
  }

  if (selectedModule) {
    return (
      <ModuleEditor
        key={selectedModule.id}
        module={selectedModule}
        courseId={course.id}
        onUpdated={onUpdated}
      />
    );
  }

  return (
    <div className="flex min-h-[360px] items-center justify-center rounded-2xl border border-dashed border-line bg-surface-elevated/20 p-8 text-center">
      <div className="max-w-sm space-y-2">
        <Layers className="mx-auto h-8 w-8 text-ink-muted opacity-50" />
        <h3 className="font-display text-base font-bold text-ink">Select a Lesson or Module</h3>
        <p className="text-xs text-ink-muted">
          Click any lesson on the left to edit video links, YouTube playlists, objectives, or quiz questions.
        </p>
      </div>
    </div>
  );
}
