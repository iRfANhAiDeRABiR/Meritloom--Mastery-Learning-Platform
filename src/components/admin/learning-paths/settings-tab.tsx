"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  AlertTriangle,
  CheckCircle2,
  Globe,
  Loader2,
  Trash2,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  deleteDraftLearningPathAction,
  publishLearningPathAction,
  unpublishLearningPathAction,
} from "@/lib/actions/admin-learning-paths";
import type { AdminLearningPathDetail } from "@/lib/types";

interface SettingsTabProps {
  path: AdminLearningPathDetail;
  onRefresh: () => void;
}

export function SettingsTab({ path, onRefresh }: SettingsTabProps) {
  const router = useRouter();

  const [isPublishing, setIsPublishing] = React.useState(false);
  const [isUnpublishing, setIsUnpublishing] = React.useState(false);
  const [showDeleteModal, setShowDeleteModal] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [actionError, setActionError] = React.useState<string | null>(null);

  // Path Health Checks
  const hasTitle = Boolean(path.title?.trim());
  const hasSummary = Boolean(path.summary?.trim());
    const courseCount = path.items.filter((i) => i.itemType === "course").length;
  const hasSteps = path.items.length > 0;
  const hasProject = path.items.some((i) => i.itemType === "project");
  const draftCourses = path.items.filter(
    (i) => i.itemType === "course" && i.course && !i.course.isPublished,
  );
  const allCoursesPublished = draftCourses.length === 0;

  const handlePublish = async () => {
    if (!confirm(`Publish "${path.title}"? Once published, it will be discoverable on /learning-paths.`)) return;

    setIsPublishing(true);
    setActionError(null);
    try {
      const res = await publishLearningPathAction(path.id);
      if (!res.success) {
        setActionError(res.error || "Failed to publish.");
      } else {
        onRefresh();
      }
    } finally {
      setIsPublishing(false);
    }
  };

  const handleUnpublish = async () => {
    if (!confirm(`Unpublish "${path.title}"? It will be removed from public discovery.`)) return;

    setIsUnpublishing(true);
    setActionError(null);
    try {
      const res = await unpublishLearningPathAction(path.id);
      if (!res.success) {
        setActionError(res.error || "Failed to unpublish.");
      } else {
        onRefresh();
      }
    } finally {
      setIsUnpublishing(false);
    }
  };

  const handleDelete = async () => {
    if (isDeleting) return;
    setIsDeleting(true);
    setActionError(null);
    try {
      const res = await deleteDraftLearningPathAction(path.id);
      if (!res.success) {
        setActionError(res.error || "Failed to delete.");
        setIsDeleting(false);
      } else {
        router.push("/admin/learning-paths");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to delete.";
      setActionError(msg);
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {actionError && (
        <div className="rounded-xl border border-rose-500/20 bg-rose-500/10 p-4 text-xs font-semibold text-rose-600 dark:text-rose-400">
          {actionError}
        </div>
      )}

      {/* Path Health Checklist */}
      <div className="rounded-3xl border border-line bg-surface p-6 sm:p-8 shadow-sm">
        <h2 className="font-display text-base font-bold text-ink">Path Health & Readiness</h2>
        <p className="mt-1 text-xs text-ink-muted">
          Readiness checks before publishing this Learning Path.
        </p>

        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="flex items-center gap-2.5 text-xs text-ink">
            {hasTitle ? (
              <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
            ) : (
              <XCircle className="h-4 w-4 text-rose-500 shrink-0" />
            )}
            <span>Path Title & Slug Configured</span>
          </div>

          <div className="flex items-center gap-2.5 text-xs text-ink">
            {hasSummary ? (
              <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
            ) : (
              <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0" />
            )}
            <span>Summary & Description Provided</span>
          </div>

          <div className="flex items-center gap-2.5 text-xs text-ink">
            {hasSteps ? (
              <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
            ) : (
              <XCircle className="h-4 w-4 text-rose-500 shrink-0" />
            )}
            <span>Contains At Least One Step ({path.items.length} steps)</span>
          </div>

          <div className="flex items-center gap-2.5 text-xs text-ink">
            {courseCount > 0 ? (
              <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
            ) : (
              <XCircle className="h-4 w-4 text-rose-500 shrink-0" />
            )}
            <span>Contains Course Steps ({courseCount} courses)</span>
          </div>

          <div className="flex items-center gap-2.5 text-xs text-ink">
            {allCoursesPublished ? (
              <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
            ) : (
              <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0" />
            )}
            <span>
              {allCoursesPublished
                ? "All Courses Are Published"
                : `${draftCourses.length} Course(s) Still in Draft`}
            </span>
          </div>

          <div className="flex items-center gap-2.5 text-xs text-ink">
            {hasProject ? (
              <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
            ) : (
              <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0" />
            )}
            <span>{hasProject ? "Final Project Milestone Configured" : "No Final Project (Optional)"}</span>
          </div>
        </div>
      </div>

      {/* Publication Controls */}
      <div className="rounded-3xl border border-line bg-surface p-6 sm:p-8 shadow-sm">
        <h2 className="font-display text-base font-bold text-ink">Publication Status</h2>
        <p className="mt-1 text-xs text-ink-muted">
          Control visibility of this Learning Path on Meritloom&apos;s public discovery catalog.
        </p>

        <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-t border-line pt-6">
          <div>
            <p className="text-xs font-bold text-ink">
              Current Status:{" "}
              <span className={path.isPublished ? "text-emerald-500" : "text-amber-500"}>
                {path.isPublished ? "Published" : "Draft"}
              </span>
            </p>
            <p className="mt-0.5 text-xs text-ink-muted">
              {path.isPublished
                ? "This learning journey is live on /learning-paths."
                : "This path is hidden from learners and only visible in admin."}
            </p>
          </div>

          {path.isPublished ? (
            <Button
              type="button"
              disabled={isUnpublishing}
              onClick={handleUnpublish}
              variant="outline"
              size="sm"
              className="rounded-xl border-line text-xs font-semibold"
            >
              {isUnpublishing ? <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" /> : null}
              <span>Unpublish Path</span>
            </Button>
          ) : (
            <Button
              type="button"
              disabled={isPublishing || !hasSteps}
              onClick={handlePublish}
              size="sm"
              className="rounded-xl bg-primary text-xs font-semibold text-white shadow-sm hover:bg-primary/90"
            >
              {isPublishing ? <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" /> : <Globe className="mr-1.5 h-3.5 w-3.5" />}
              <span>Publish Learning Path</span>
            </Button>
          )}
        </div>
      </div>

      {/* Danger Zone */}
      {!path.isPublished && (
        <div className="rounded-3xl border border-rose-500/20 bg-rose-500/5 p-6 sm:p-8">
          <h2 className="font-display text-base font-bold text-rose-600 dark:text-rose-400">
            Danger Zone
          </h2>
          <p className="mt-1 text-xs text-ink-muted">
            Deleting this draft Learning Path will remove the path configuration and step definitions. Connected courses are not deleted.
          </p>

          <div className="mt-4 flex justify-end">
            <Button
              type="button"
              onClick={() => setShowDeleteModal(true)}
              variant="outline"
              size="sm"
              className="rounded-xl border-rose-500/30 text-xs font-semibold text-rose-600 hover:bg-rose-500/10 dark:text-rose-400"
            >
              <Trash2 className="mr-1.5 h-3.5 w-3.5" />
              <span>Delete Draft Path</span>
            </Button>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl border border-line bg-surface p-6 shadow-2xl space-y-4">
            <h3 className="font-display text-lg font-bold text-ink">
              Delete Draft Learning Path?
            </h3>
            <p className="text-xs text-ink-muted leading-relaxed">
              Are you sure you want to delete <strong className="text-ink">&quot;{path.title}&quot;</strong>? This action cannot be undone. Courses inside will remain untouched.
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
                onClick={handleDelete}
                size="sm"
                className="rounded-xl bg-rose-600 text-xs font-semibold text-white hover:bg-rose-700"
              >
                {isDeleting ? "Deleting..." : "Delete Learning Path"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
