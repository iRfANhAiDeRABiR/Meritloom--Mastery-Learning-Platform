"use client";

import * as React from "react";
import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  Eye,
  FileEdit,
  FolderTree,
  Globe,
  Settings,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { OverviewTab } from "@/components/admin/course-editor/overview-tab";
import { ContentTabView } from "@/components/admin/course-editor/content-tab/content-tab-view";
import { OutcomesTab } from "@/components/admin/course-editor/outcomes-tab";
import { SkillsTab } from "@/components/admin/course-editor/skills-tab";
import { SettingsTab } from "@/components/admin/course-editor/settings-tab";
import type { AdminCourseDetail, AdminInstructorDetail, Category } from "@/lib/types";

interface CourseEditorShellProps {
  course: AdminCourseDetail;
  categories: Category[];
  allSkills: { id: string; name: string; slug: string }[];
  instructors?: AdminInstructorDetail[];
}

export function CourseEditorShell({
  course,
  categories,
  allSkills,
  instructors = [],
}: CourseEditorShellProps) {
  const [activeTab, setActiveTab] = React.useState<
    "overview" | "content" | "outcomes" | "skills" | "settings"
  >("content");

  const totalLessons = course.modules.reduce((acc, m) => acc + m.lessons.length, 0);
  const bonusLessons = course.modules.reduce(
    (acc, m) => acc + m.lessons.filter((l) => l.isBonus).length,
    0,
  );
  const requiredLessons = totalLessons - bonusLessons;

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      {/* Top Breadcrumb & Status Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Button asChild variant="outline" size="sm" className="rounded-xl border-line text-xs font-semibold">
            <Link href="/admin/courses">
              <ArrowLeft className="mr-1.5 h-3.5 w-3.5" />
              <span>All Courses</span>
            </Link>
          </Button>

          <div className="h-4 w-[1px] bg-line" />

          {course.isPublished ? (
            <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 text-xs font-semibold">
              PUBLISHED
            </Badge>
          ) : (
            <Badge variant="outline" className="border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-semibold">
              DRAFT
            </Badge>
          )}

          {course.learningPathSlug && (
            <Badge variant="outline" className="border-purple-500/30 bg-purple-500/10 text-purple-600 dark:text-purple-400 text-xs">
              Path: {course.learningPathName}
            </Badge>
          )}
        </div>

        <div className="flex items-center gap-2">
          {course.isPublished && (
            <Button asChild variant="outline" size="sm" className="rounded-xl border-line text-xs font-semibold">
              <Link href={`/courses/${course.slug}`} target="_blank">
                <Globe className="mr-1.5 h-3.5 w-3.5 text-ink-muted" />
                <span>View Public Page</span>
              </Link>
            </Button>
          )}

          <Button asChild variant="outline" size="sm" className="rounded-xl border-line text-xs font-semibold">
            <Link href={`/admin/courses/${course.id}/preview`}>
              <Eye className="mr-1.5 h-3.5 w-3.5 text-ink-muted" />
              <span>Preview Course</span>
            </Link>
          </Button>
        </div>
      </div>

      {/* Course Title Header */}
      <div className="rounded-2xl border border-line bg-surface p-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl">
              {course.title}
            </h1>
            <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-ink-muted">
              {course.categoryName && <span className="font-semibold text-ink">{course.categoryName}</span>}
              <span>•</span>
              <span className="capitalize">{course.difficulty}</span>
              <span>•</span>
              <span>{course.modules.length} modules</span>
              <span>•</span>
              <span>{requiredLessons} required lessons {bonusLessons > 0 ? `(${bonusLessons} bonus)` : ""}</span>
              <span>•</span>
              <span className="inline-flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {course.estimatedMinutes || 0} mins
              </span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mt-6 flex flex-wrap gap-1 border-t border-line pt-4">
          {[
            { id: "content", label: "Curriculum & Lessons", icon: FolderTree },
            { id: "overview", label: "Overview & Metadata", icon: FileEdit },
            { id: "outcomes", label: "Outcomes & Prerequisites", icon: CheckCircle2 },
            { id: "skills", label: "Skills", icon: Sparkles },
            { id: "settings", label: "Health & Publishing", icon: Settings },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(
                  tab.id as "overview" | "content" | "outcomes" | "skills" | "settings",
                )}
                className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition ${
                  isActive
                    ? "bg-primary text-white shadow-sm shadow-primary/25"
                    : "text-ink-muted hover:bg-surface-elevated hover:text-ink"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Tab View */}
      <div>
        {activeTab === "content" && <ContentTabView course={course} />}
        {activeTab === "overview" && (
          <OverviewTab course={course} categories={categories} instructors={instructors} />
        )}
        {activeTab === "outcomes" && <OutcomesTab course={course} />}
        {activeTab === "skills" && <SkillsTab course={course} allSkills={allSkills} />}
        {activeTab === "settings" && <SettingsTab course={course} />}
      </div>
    </div>
  );
}
