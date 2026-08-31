"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  Globe,
  Loader2,
  Trash2,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  deleteDraftCourseAction,
  publishCourseAction,
  recalculateCourseDurationAction,
  unpublishCourseAction,
} from "@/lib/actions/admin";
import type { AdminCourseDetail } from "@/lib/types";

interface SettingsTabProps {
  course: AdminCourseDetail;
}

export function SettingsTab({ course }: SettingsTabProps) {
  const router = useRouter();
  const [isPublishing, setIsPublishing] = React.useState(false);
  const [isUnpublishing, setIsUnpublishing] = React.useState(false);
  const [isRecalculating, setIsRecalculating] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [msg, setMsg] = React.useState<{ type: "success" | "error"; text: string } | null>(null);

  // Health checks
  const totalLessons = course.modules.reduce((acc, m) => acc + m.lessons.length, 0);
  const publishedLessons = course.modules.reduce(
    (acc, m) => acc + m.lessons.filter((l) => l.isPublished).length,
    0,
  );
  const hasOutcomes = course.learningOutcomes.length > 0;
  const hasSummary = Boolean(course.summary);

  const handlePublish = async () => {
    setIsPublishing(true);
    setMsg(null);
    try {
      const res = await publishCourseAction(course.id);
      if (res.success) {
        setMsg({ type: "success", text: "Course is now published and publicly discoverable!" });
        router.refresh();
      } else {
        setMsg({ type: "error", text: res.error || "Failed to publish course." });
      }
    } finally {
      setIsPublishing(false);
    }
  };

  const handleUnpublish = async () => {
    setIsUnpublishing(true);
    setMsg(null);
    try {
      const res = await unpublishCourseAction(course.id);
      if (res.success) {
        setMsg({ type: "success", text: "Course has been unpublished." });
        router.refresh();
      } else {
        setMsg({ type: "error", text: res.error || "Failed to unpublish." });
      }
    } finally {
      setIsUnpublishing(false);
    }
  };

  const handleRecalculate = async () => {
    setIsRecalculating(true);
    setMsg(null);
    try {
      const res = await recalculateCourseDurationAction(course.id);
      if (res.success && res.data) {
        setMsg({ type: "success", text: `Duration recalculated: ${res.data.minutes} minutes.` });
        router.refresh();
      }
    } finally {
      setIsRecalculating(false);
    }
  };

  const handleDeleteDraft = async () => {
    if (!confirm("Are you sure you want to permanently delete this draft course? This cannot be undone.")) return;

    setIsDeleting(true);
    try {
      const res = await deleteDraftCourseAction(course.id);
      if (res.success) {
        router.push("/admin/courses");
      } else {
        setMsg({ type: "error", text: res.error || "Failed to delete course." });
        setIsDeleting(false);
      }
    } catch {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-8">
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

      {/* Course Health & Publishing Readiness */}
      <div className="rounded-2xl border border-line bg-surface-elevated/20 p-5">
        <h2 className="font-display text-base font-bold text-ink">Course Health & Readiness</h2>
        <p className="text-xs text-ink-muted">Editorial checklist before publishing to learners.</p>

        <div className="mt-4 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
          <div className="flex items-center gap-2 rounded-xl border border-line bg-surface p-3 text-xs">
            {course.title ? (
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            ) : (
              <XCircle className="h-4 w-4 text-rose-500" />
            )}
            <span className="font-semibold text-ink">Course Title: {course.title}</span>
          </div>

          <div className="flex items-center gap-2 rounded-xl border border-line bg-surface p-3 text-xs">
            {hasSummary ? (
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            ) : (
              <AlertTriangle className="h-4 w-4 text-amber-500" />
            )}
            <span className="font-semibold text-ink">
              {hasSummary ? "Summary provided" : "Missing short summary"}
            </span>
          </div>

          <div className="flex items-center gap-2 rounded-xl border border-line bg-surface p-3 text-xs">
            {course.modules.length > 0 ? (
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            ) : (
              <XCircle className="h-4 w-4 text-rose-500" />
            )}
            <span className="font-semibold text-ink">{course.modules.length} Modules configured</span>
          </div>

          <div className="flex items-center gap-2 rounded-xl border border-line bg-surface p-3 text-xs">
            {publishedLessons > 0 ? (
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            ) : (
              <XCircle className="h-4 w-4 text-rose-500" />
            )}
            <span className="font-semibold text-ink">
              {publishedLessons} of {totalLessons} Lessons published
            </span>
          </div>

          <div className="flex items-center gap-2 rounded-xl border border-line bg-surface p-3 text-xs">
            {hasOutcomes ? (
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            ) : (
              <AlertTriangle className="h-4 w-4 text-amber-500" />
            )}
            <span className="font-semibold text-ink">
              {hasOutcomes ? `${course.learningOutcomes.length} Learning outcomes` : "No outcomes defined"}
            </span>
          </div>

          <div className="flex items-center gap-2 rounded-xl border border-line bg-surface p-3 text-xs">
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            <span className="font-semibold text-ink">Estimated Duration: {course.estimatedMinutes || 0} mins</span>
          </div>
        </div>
      </div>

      {/* Publication Controls */}
      <div className="rounded-2xl border border-line bg-surface p-5 shadow-sm">
        <h2 className="font-display text-base font-bold text-ink">Publication State</h2>
        <p className="mt-1 text-xs text-ink-muted">
          Published courses appear in the catalog, search discovery, and are enrollable by learners.
        </p>

        <div className="mt-5 flex flex-wrap items-center gap-3">
          {course.isPublished ? (
            <Button
              type="button"
              onClick={handleUnpublish}
              disabled={isUnpublishing}
              variant="outline"
              className="rounded-xl border-amber-500/30 bg-amber-500/10 text-xs font-semibold text-amber-600 dark:text-amber-400 hover:bg-amber-500/20"
            >
              {isUnpublishing ? <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" /> : <Globe className="mr-1.5 h-3.5 w-3.5" />}
              <span>Unpublish Course</span>
            </Button>
          ) : (
            <Button
              type="button"
              onClick={handlePublish}
              disabled={isPublishing || publishedLessons === 0}
              className="rounded-xl bg-emerald-600 text-xs font-semibold text-white shadow-sm hover:bg-emerald-700 disabled:opacity-50"
            >
              {isPublishing ? <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" /> : <Globe className="mr-1.5 h-3.5 w-3.5" />}
              <span>Publish Course to Learners</span>
            </Button>
          )}

          <Button
            type="button"
            onClick={handleRecalculate}
            disabled={isRecalculating}
            variant="outline"
            className="rounded-xl border-line text-xs font-semibold"
          >
            {isRecalculating ? <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" /> : <Clock className="mr-1.5 h-3.5 w-3.5" />}
            <span>Recalculate Duration</span>
          </Button>
        </div>
      </div>

      {/* Danger Zone */}
      {!course.isPublished && (
        <div className="rounded-2xl border border-rose-500/20 bg-rose-500/5 p-5">
          <h3 className="font-display text-base font-bold text-rose-600 dark:text-rose-400">
            Danger Zone
          </h3>
          <p className="mt-1 text-xs text-ink-muted">
            Delete this draft course. Only draft courses without learner enrollments can be deleted.
          </p>
          <div className="mt-4">
            <Button
              type="button"
              onClick={handleDeleteDraft}
              disabled={isDeleting}
              className="rounded-xl bg-rose-600 text-xs font-semibold text-white hover:bg-rose-700"
            >
              {isDeleting ? <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" /> : <Trash2 className="mr-1.5 h-3.5 w-3.5" />}
              <span>Delete Draft Course</span>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
