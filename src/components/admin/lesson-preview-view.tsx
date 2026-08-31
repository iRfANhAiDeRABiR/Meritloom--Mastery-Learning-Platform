"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { AdminCourseDetail, AdminLessonDetail } from "@/lib/types";

interface LessonPreviewViewProps {
  course: AdminCourseDetail;
  lesson: AdminLessonDetail;
}

export function LessonPreviewView({ course, lesson }: LessonPreviewViewProps) {
  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Top Banner Notice */}
      <div className="flex items-center justify-between rounded-2xl border border-primary/30 bg-primary/10 p-4 text-xs">
        <div className="flex items-center gap-2 font-semibold text-primary">
          <Eye className="h-4 w-4" />
          <span>Admin Lesson Preview — {lesson.title}</span>
        </div>
        <Button asChild size="sm" variant="outline" className="rounded-xl border-primary/40 text-xs font-semibold">
          <Link href={`/admin/courses/${course.id}`}>
            <ArrowLeft className="mr-1.5 h-3.5 w-3.5" />
            <span>Back to Editor</span>
          </Link>
        </Button>
      </div>

      {/* Lesson Title Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="border-line font-mono text-[10px]">
            {course.title}
          </Badge>
          <span className="text-xs text-ink-muted">•</span>
          <span className="text-xs text-ink-muted">{lesson.estimatedMinutes || 5} min read</span>
        </div>
        <h1 className="font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl">
          {lesson.title}
        </h1>
        {lesson.summary && <p className="text-sm text-ink-muted">{lesson.summary}</p>}
      </div>

      {/* Video Player (if video lesson) */}
      {lesson.youtubeVideoId && (
        <div className="space-y-3">
          <div className="aspect-video w-full overflow-hidden rounded-3xl border border-line bg-black shadow-2xl">
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${lesson.youtubeVideoId}?rel=0`}
              title={lesson.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="h-full w-full border-0"
            />
          </div>
          {lesson.sourceChannel && (
            <div className="flex items-center justify-between text-xs text-ink-muted">
              <span>Source Channel: <strong className="text-ink">{lesson.sourceChannel}</strong></span>
              {lesson.videoUrl && (
                <a href={lesson.videoUrl} target="_blank" rel="noreferrer" className="text-primary hover:underline">
                  Watch on YouTube
                </a>
              )}
            </div>
          )}
        </div>
      )}

      {/* Lesson Body Content (if article) */}
      {lesson.content && (
        <div className="rounded-2xl border border-line bg-surface p-6 text-sm text-ink prose dark:prose-invert max-w-none">
          <pre className="whitespace-pre-wrap font-sans">
            {typeof lesson.content === "string" ? lesson.content : lesson.content.body || JSON.stringify(lesson.content, null, 2)}
          </pre>
        </div>
      )}

      {/* Key Takeaway Callout */}
      {lesson.keyTakeaway && (
        <div className="rounded-2xl border border-primary/20 bg-primary/5 p-5">
          <h3 className="font-display text-xs font-bold uppercase tracking-wider text-primary">
            Key Takeaway
          </h3>
          <p className="mt-1 text-sm font-semibold text-ink">{lesson.keyTakeaway}</p>
        </div>
      )}

      {/* Learning Objectives */}
      {lesson.objectives.length > 0 && (
        <div className="rounded-2xl border border-line bg-surface p-5 space-y-3">
          <h3 className="font-display text-sm font-bold text-ink">Lesson Objectives</h3>
          <div className="space-y-2">
            {lesson.objectives.map((obj) => (
              <div key={obj.id} className="flex items-center gap-2 text-xs text-ink">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                <span>{obj.text}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
