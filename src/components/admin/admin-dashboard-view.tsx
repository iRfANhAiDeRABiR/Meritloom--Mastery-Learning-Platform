"use client";

import Link from "next/link";
import {
  BookOpen,
  CheckCircle2,
  Clock,
  Eye,
  FileEdit,
  Layers,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { AdminDashboardMetrics } from "@/lib/types";

interface AdminDashboardViewProps {
  metrics: AdminDashboardMetrics;
}

export function AdminDashboardView({ metrics }: AdminDashboardViewProps) {
  return (
    <div className="mx-auto max-w-6xl space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl">
            Content Overview
          </h1>
          <p className="mt-1 text-sm text-ink-muted">
            Manage Meritloom courses, modules, lessons, and learning outcomes.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button asChild className="rounded-xl bg-primary px-4 py-2 font-semibold text-white shadow-sm hover:bg-primary/90">
            <Link href="/admin/courses/new">
              <Plus className="mr-1.5 h-4 w-4" />
              <span>New Course</span>
            </Link>
          </Button>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-2xl border border-line bg-surface p-5 shadow-sm">
          <div className="flex items-center gap-2 text-xs font-semibold text-ink-muted">
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            <span>Published Courses</span>
          </div>
          <div className="mt-2 font-display text-3xl font-bold text-ink">
            {metrics.publishedCoursesCount}
          </div>
        </div>

        <div className="rounded-2xl border border-line bg-surface p-5 shadow-sm">
          <div className="flex items-center gap-2 text-xs font-semibold text-ink-muted">
            <FileEdit className="h-4 w-4 text-amber-500" />
            <span>Draft Courses</span>
          </div>
          <div className="mt-2 font-display text-3xl font-bold text-ink">
            {metrics.draftCoursesCount}
          </div>
        </div>

        <div className="rounded-2xl border border-line bg-surface p-5 shadow-sm">
          <div className="flex items-center gap-2 text-xs font-semibold text-ink-muted">
            <BookOpen className="h-4 w-4 text-primary" />
            <span>Published Lessons</span>
          </div>
          <div className="mt-2 font-display text-3xl font-bold text-ink">
            {metrics.publishedLessonsCount}
          </div>
        </div>

        <div className="rounded-2xl border border-line bg-surface p-5 shadow-sm">
          <div className="flex items-center gap-2 text-xs font-semibold text-ink-muted">
            <Layers className="h-4 w-4 text-blue-500" />
            <span>Categories</span>
          </div>
          <div className="mt-2 font-display text-3xl font-bold text-ink">
            {metrics.categoriesCount}
          </div>
        </div>
      </div>

      {/* Recently Updated Courses */}
      <div className="rounded-2xl border border-line bg-surface p-6 shadow-sm">
        <div className="flex items-center justify-between border-b border-line pb-4">
          <div>
            <h2 className="font-display text-lg font-bold text-ink">Recently Updated Courses</h2>
            <p className="text-xs text-ink-muted">Quick access to recent learning content</p>
          </div>
          <Button asChild variant="outline" size="sm" className="rounded-xl border-line text-xs font-semibold">
            <Link href="/admin/courses">View all courses</Link>
          </Button>
        </div>

        {metrics.recentCourses.length === 0 ? (
          <div className="py-12 text-center text-sm text-ink-muted">
            No courses created yet. Click &quot;New Course&quot; to create your first course.
          </div>
        ) : (
          <div className="divide-y divide-line">
            {metrics.recentCourses.map((course) => (
              <div
                key={course.id}
                className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/admin/courses/${course.id}`}
                      className="font-display text-base font-semibold text-ink hover:text-primary"
                    >
                      {course.title}
                    </Link>
                    {course.isPublished ? (
                      <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 text-[10px]">
                        Published
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[10px]">
                        Draft
                      </Badge>
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-ink-muted">
                    {course.categoryName && <span>{course.categoryName}</span>}
                    <span>•</span>
                    <span>{course.moduleCount} modules</span>
                    <span>•</span>
                    <span>{course.lessonCount} lessons</span>
                    <span>•</span>
                    <span className="inline-flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      Updated {new Date(course.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button asChild variant="outline" size="sm" className="rounded-xl border-line text-xs font-semibold">
                    <Link href={`/admin/courses/${course.id}/preview`}>
                      <Eye className="mr-1.5 h-3.5 w-3.5 text-ink-muted" />
                      <span>Preview</span>
                    </Link>
                  </Button>
                  <Button asChild size="sm" className="rounded-xl bg-primary text-xs font-semibold text-white hover:bg-primary/90">
                    <Link href={`/admin/courses/${course.id}`}>
                      <FileEdit className="mr-1.5 h-3.5 w-3.5" />
                      <span>Edit</span>
                    </Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
