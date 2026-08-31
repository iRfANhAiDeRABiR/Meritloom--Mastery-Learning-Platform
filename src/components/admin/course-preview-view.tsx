"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeft, BookOpen, CheckCircle2, Clock, Eye, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CourseCover } from "@/components/courses/course-cover";
import type { AdminCourseDetail } from "@/lib/types";

interface CoursePreviewViewProps {
  course: AdminCourseDetail;
}

export function CoursePreviewView({ course }: CoursePreviewViewProps) {
  const totalLessons = course.modules.reduce((acc, m) => acc + m.lessons.length, 0);

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      {/* Top Banner Notice */}
      <div className="flex items-center justify-between rounded-2xl border border-primary/30 bg-primary/10 p-4 text-xs">
        <div className="flex items-center gap-2 font-semibold text-primary">
          <Eye className="h-4 w-4" />
          <span>Admin Draft Preview Mode — This course is rendered with real curriculum data.</span>
        </div>
        <Button asChild size="sm" variant="outline" className="rounded-xl border-primary/40 text-xs font-semibold">
          <Link href={`/admin/courses/${course.id}`}>
            <ArrowLeft className="mr-1.5 h-3.5 w-3.5" />
            <span>Back to Editor</span>
          </Link>
        </Button>
      </div>

      {/* Hero Section */}
      <div className="rounded-3xl border border-line bg-surface p-8 shadow-sm">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="md:col-span-2 space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              {course.categoryName && (
                <Badge variant="outline" className="border-line text-xs font-semibold">
                  {course.categoryName}
                </Badge>
              )}
              <Badge className="bg-primary/10 text-primary border-primary/20 text-xs font-semibold">
                100% Free
              </Badge>
              <Badge variant="outline" className="border-line capitalize text-xs">
                {course.difficulty}
              </Badge>
            </div>

            <h1 className="font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
              {course.title}
            </h1>

            <p className="text-base text-ink-muted leading-relaxed">
              {course.summary || course.description}
            </p>

            <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-ink-muted pt-2">
              <span className="flex items-center gap-1.5">
                <BookOpen className="h-4 w-4 text-primary" />
                {totalLessons} lessons
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-primary" />
                {course.estimatedMinutes || 0} minutes
              </span>
            </div>
          </div>

          <div className="h-48 md:h-auto overflow-hidden rounded-2xl border border-line shadow-sm">
            <CourseCover src={course.coverImageUrl} title={course.title} categorySlug={course.categorySlug} className="h-full w-full" />
          </div>
        </div>
      </div>

      {/* What you'll learn */}
      {course.learningOutcomes.length > 0 && (
        <div className="rounded-3xl border border-line bg-surface p-6 shadow-sm">
          <h2 className="font-display text-lg font-bold text-ink">What You&apos;ll Learn</h2>
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {course.learningOutcomes.map((outcome) => (
              <div key={outcome.id} className="flex items-start gap-2.5 text-xs text-ink">
                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>{outcome.outcomeText}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Syllabus / Curriculum */}
      <div className="space-y-4">
        <h2 className="font-display text-xl font-bold text-ink">Course Syllabus</h2>
        <div className="space-y-4">
          {course.modules.map((mod, mIdx) => (
            <div
              key={mod.id}
              className="overflow-hidden rounded-2xl border border-line bg-surface shadow-sm"
            >
              <div className="bg-surface-elevated/40 p-4 border-b border-line">
                <h3 className="font-display text-sm font-bold text-ink">
                  Module {mIdx + 1}: {mod.title}
                </h3>
                {mod.description && (
                  <p className="mt-0.5 text-xs text-ink-muted">{mod.description}</p>
                )}
              </div>
              <div className="divide-y divide-line">
                {mod.lessons.map((lesson) => (
                  <div
                    key={lesson.id}
                    className="flex items-center justify-between p-3.5 text-xs hover:bg-surface-elevated/20"
                  >
                    <div className="flex items-center gap-3">
                      <Video className="h-4 w-4 text-primary shrink-0" />
                      <span className="font-semibold text-ink">{lesson.title}</span>
                      {lesson.isBonus && (
                        <span className="rounded bg-purple-500/10 px-1.5 py-0.5 text-[9px] font-bold text-purple-600 dark:text-purple-400">
                          BONUS
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-ink-muted">
                      <span>{lesson.estimatedMinutes}m</span>
                      <Button asChild size="sm" variant="outline" className="rounded-lg border-line text-[11px] font-semibold">
                        <Link href={`/admin/courses/${course.id}/preview/lessons/${lesson.slug}`}>
                          Preview
                        </Link>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
