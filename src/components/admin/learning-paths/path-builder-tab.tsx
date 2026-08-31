"use client";

import * as React from "react";
import {
  ArrowDown,
  ArrowUp,
  BookOpen,
  Clock,
  Rocket,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AddCourseModal } from "@/components/admin/learning-paths/add-course-modal";
import { AddProjectModal } from "@/components/admin/learning-paths/add-project-modal";
import {
  removeLearningPathItemAction,
  reorderLearningPathItemsAction,
  updateLearningPathItemAction,
} from "@/lib/actions/admin-learning-paths";
import type {
  AdminLearningPathDetail,
  AdminLearningPathItemDetail,
  AvailableCourseForPath,
} from "@/lib/types";

interface PathBuilderTabProps {
  path: AdminLearningPathDetail;
  availableCourses: AvailableCourseForPath[];
  onRefresh: () => void;
}

export function PathBuilderTab({
  path,
  availableCourses,
  onRefresh,
}: PathBuilderTabProps) {
  const [showAddCourse, setShowAddCourse] = React.useState(false);
  const [showAddProject, setShowAddProject] = React.useState(false);
  const [itemToDelete, setItemToDelete] = React.useState<AdminLearningPathItemDetail | null>(null);
  const [isDeleting, setIsDeleting] = React.useState(false);

  const existingCourseIds = React.useMemo(() => {
    return new Set(
      path.items
        .filter((i) => i.itemType === "course" && i.courseId)
        .map((i) => i.courseId as string),
    );
  }, [path.items]);

  const handleMove = async (index: number, direction: "up" | "down") => {
    const items = [...path.items];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= items.length) return;

    const temp = items[index];
    items[index] = items[targetIndex];
    items[targetIndex] = temp;

    await reorderLearningPathItemsAction(
      path.id,
      items.map((i) => i.id),
    );
    onRefresh();
  };

  const handleToggleRequired = async (item: AdminLearningPathItemDetail) => {
    await updateLearningPathItemAction(item.id, path.id, {
      isRequired: !item.isRequired,
    });
    onRefresh();
  };

  const handleDelete = async () => {
    if (!itemToDelete || isDeleting) return;
    setIsDeleting(true);
    try {
      await removeLearningPathItemAction(itemToDelete.id, path.id);
      setItemToDelete(null);
      onRefresh();
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Action Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-line bg-surface p-4 shadow-sm">
        <div>
          <h2 className="font-display text-base font-bold text-ink">
            Path Curriculum Roadmap ({path.items.length} steps)
          </h2>
          <p className="text-xs text-ink-muted">
            Order the sequential courses and project milestone. Learners progress through courses at their own pace without locking.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            size="sm"
            onClick={() => setShowAddCourse(true)}
            className="rounded-xl bg-primary text-xs font-semibold text-white hover:bg-primary/90"
          >
            <BookOpen className="mr-1.5 h-3.5 w-3.5" />
            <span>Add Course</span>
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setShowAddProject(true)}
            className="rounded-xl border-line text-xs font-semibold hover:border-purple-500/40 hover:text-purple-600"
          >
            <Rocket className="mr-1.5 h-3.5 w-3.5 text-purple-500" />
            <span>Add Project</span>
          </Button>
        </div>
      </div>

      {/* Vertical Steps List */}
      {path.items.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-line bg-surface p-12 text-center">
          <BookOpen className="mx-auto h-10 w-10 text-ink-muted opacity-40" />
          <h3 className="mt-3 font-display text-base font-bold text-ink">No Steps in Path</h3>
          <p className="mt-1 text-xs text-ink-muted max-w-sm mx-auto">
            Click &quot;Add Course&quot; above to connect your first course to this learning journey.
          </p>
        </div>
      ) : (
        <div className="relative space-y-4 pl-4 sm:pl-8 before:absolute before:left-6 sm:before:left-10 before:top-6 before:bottom-6 before:w-[2px] before:bg-line">
          {path.items.map((item, index) => {
            const isCourse = item.itemType === "course";
            const isFirst = index === 0;
            const isLast = index === path.items.length - 1;

            return (
              <div key={item.id} className="relative flex items-start gap-4">
                {/* Connecting Node */}
                <div
                  className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 text-xs font-bold ${
                    isCourse
                      ? "border-primary bg-primary text-white"
                      : "border-purple-500 bg-purple-500 text-white"
                  }`}
                >
                  {index + 1}
                </div>

                {/* Step Card */}
                <div className="flex-1 rounded-2xl border border-line bg-surface p-5 shadow-sm transition hover:border-primary/40">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="space-y-1.5 min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-primary">
                          {item.stepLabel || (isCourse ? `STEP ${index + 1}` : "FINAL PROJECT")}
                        </span>
                        <span className="text-ink-muted">•</span>
                        <Badge
                          variant="outline"
                          className={`text-[10px] uppercase font-bold ${
                            isCourse ? "border-primary/30 text-primary" : "border-purple-500/30 text-purple-600 dark:text-purple-400"
                          }`}
                        >
                          {item.itemType}
                        </Badge>

                        {isCourse && item.course && !item.course.isPublished && (
                          <Badge variant="outline" className="border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[9px] font-bold">
                            DRAFT COURSE
                          </Badge>
                        )}
                      </div>

                      <h3 className="font-display text-base font-bold text-ink">
                        {isCourse ? item.course?.title || item.title : item.title}
                      </h3>

                      <p className="text-xs text-ink-muted line-clamp-2">
                        {isCourse ? item.course?.summary || item.description : item.description}
                      </p>

                      <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-ink-muted">
                        {isCourse && item.course && (
                          <>
                            <span className="capitalize">{item.course.difficulty}</span>
                            <span>•</span>
                            <span>{item.course.lessonCount} lessons</span>
                            <span>•</span>
                          </>
                        )}
                        <span className="inline-flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {isCourse
                            ? `${item.course?.estimatedMinutes || 60}m`
                            : `${item.estimatedMinutes || 30}m`}
                        </span>
                      </div>
                    </div>

                    {/* Step Controls */}
                    <div className="flex items-center gap-2 shrink-0 border-t border-line sm:border-t-0 pt-3 sm:pt-0">
                      <button
                        type="button"
                        onClick={() => handleToggleRequired(item)}
                        className={`rounded-lg px-2.5 py-1 text-[11px] font-semibold border transition ${
                          item.isRequired
                            ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                            : "border-line bg-surface-elevated text-ink-muted"
                        }`}
                        title="Toggles whether this step counts towards completing the path"
                      >
                        {item.isRequired ? "Required" : "Optional"}
                      </button>

                      <div className="h-4 w-[1px] bg-line" />

                      <button
                        type="button"
                        disabled={isFirst}
                        onClick={() => handleMove(index, "up")}
                        className="p-1.5 text-ink-muted hover:text-ink disabled:opacity-20 rounded hover:bg-surface-elevated"
                        title="Move Up"
                      >
                        <ArrowUp className="h-4 w-4" />
                      </button>

                      <button
                        type="button"
                        disabled={isLast}
                        onClick={() => handleMove(index, "down")}
                        className="p-1.5 text-ink-muted hover:text-ink disabled:opacity-20 rounded hover:bg-surface-elevated"
                        title="Move Down"
                      >
                        <ArrowDown className="h-4 w-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => setItemToDelete(item)}
                        className="p-1.5 text-rose-500 hover:bg-rose-500/10 rounded"
                        title="Remove step from path"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Course Modal */}
      {showAddCourse && (
        <AddCourseModal
          pathId={path.id}
          existingCourseIds={existingCourseIds}
          availableCourses={availableCourses}
          onClose={() => setShowAddCourse(false)}
          onSuccess={() => {
            setShowAddCourse(false);
            onRefresh();
          }}
        />
      )}

      {/* Add Project Modal */}
      {showAddProject && (
        <AddProjectModal
          pathId={path.id}
          onClose={() => setShowAddProject(false)}
          onSuccess={() => {
            setShowAddProject(false);
            onRefresh();
          }}
        />
      )}

      {/* Delete Item Confirmation Dialog */}
      {itemToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl border border-line bg-surface p-6 shadow-2xl space-y-4">
            <h3 className="font-display text-lg font-bold text-ink">
              Remove Step from Learning Path?
            </h3>
            <p className="text-xs text-ink-muted leading-relaxed">
              Are you sure you want to remove{" "}
              <strong className="text-ink">
                &quot;{itemToDelete.course?.title || itemToDelete.title}&quot;
              </strong>{" "}
              from this Learning Path? This will NOT delete the course or learner progress.
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setItemToDelete(null)}
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
                {isDeleting ? "Removing..." : "Remove Step"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
