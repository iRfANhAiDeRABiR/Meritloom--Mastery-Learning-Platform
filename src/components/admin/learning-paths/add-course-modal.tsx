"use client";

import * as React from "react";
import { BookOpen, Check, Loader2, Plus, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { addCourseToLearningPathAction } from "@/lib/actions/admin-learning-paths";
import type { AvailableCourseForPath } from "@/lib/types";

interface AddCourseModalProps {
  pathId: string;
  existingCourseIds: Set<string>;
  availableCourses: AvailableCourseForPath[];
  onClose: () => void;
  onSuccess: () => void;
}

export function AddCourseModal({
  pathId,
  existingCourseIds,
  availableCourses,
  onClose,
  onSuccess,
}: AddCourseModalProps) {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [addingCourseId, setAddingCourseId] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  const filteredCourses = React.useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return availableCourses;
    return availableCourses.filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        c.slug.toLowerCase().includes(q) ||
        c.categoryName?.toLowerCase().includes(q),
    );
  }, [availableCourses, searchQuery]);

  const handleAddCourse = async (courseId: string) => {
    if (addingCourseId) return;
    setAddingCourseId(courseId);
    setError(null);

    try {
      const res = await addCourseToLearningPathAction(pathId, courseId, true);
      if (!res.success) {
        setError(res.error || "Failed to add course.");
      } else {
        onSuccess();
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to add course.";
      setError(msg);
    } finally {
      setAddingCourseId(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="flex max-h-[85vh] w-full max-w-2xl flex-col rounded-3xl border border-line bg-surface shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-line p-5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <BookOpen className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-display text-base font-bold text-ink">
                Add Course to Learning Path
              </h2>
              <p className="text-xs text-ink-muted">
                Select a published or draft Meritloom course to add as the next step.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-ink-muted hover:bg-surface-elevated hover:text-ink"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Search */}
        <div className="border-b border-line p-4 bg-surface-elevated/20">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-ink-muted" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search courses by title or slug..."
              className="h-10 w-full rounded-xl border border-line bg-surface pl-9 pr-3 text-xs text-ink placeholder:text-ink-muted focus:border-primary focus:outline-none"
            />
          </div>
        </div>

        {error && (
          <div className="m-4 rounded-xl border border-rose-500/20 bg-rose-500/10 p-3 text-xs font-semibold text-rose-600 dark:text-rose-400">
            {error}
          </div>
        )}

        {/* Course List */}
        <div className="flex-1 overflow-y-auto p-4 divide-y divide-line/60">
          {filteredCourses.length === 0 ? (
            <div className="p-8 text-center text-xs text-ink-muted">
              No matching courses found.
            </div>
          ) : (
            filteredCourses.map((course) => {
              const isAlreadyInPath = existingCourseIds.has(course.id);
              const isAddingThis = addingCourseId === course.id;

              return (
                <div
                  key={course.id}
                  className="flex flex-col gap-3 py-3 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="space-y-1 min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="font-display text-sm font-bold text-ink truncate">
                        {course.title}
                      </h4>
                      {course.isPublished ? (
                        <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 text-[9px] font-bold">
                          PUBLISHED
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[9px] font-bold">
                          DRAFT
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-ink-muted">
                      {course.categoryName && <span>{course.categoryName}</span>}
                      <span>•</span>
                      <span className="capitalize">{course.difficulty}</span>
                      <span>•</span>
                      <span>{course.lessonCount} lessons</span>
                    </div>
                  </div>

                  <div className="shrink-0">
                    {isAlreadyInPath ? (
                      <Badge variant="outline" className="border-line bg-surface-elevated text-ink-muted text-xs">
                        <Check className="mr-1 h-3 w-3 text-emerald-500" />
                        Already in path
                      </Badge>
                    ) : (
                      <Button
                        type="button"
                        size="sm"
                        disabled={isAddingThis || !!addingCourseId}
                        onClick={() => handleAddCourse(course.id)}
                        className="rounded-xl bg-primary text-xs font-semibold text-white hover:bg-primary/90"
                      >
                        {isAddingThis ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <>
                            <Plus className="mr-1 h-3.5 w-3.5" />
                            <span>Add Course</span>
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-line p-4 flex justify-end">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClose}
            className="rounded-xl border-line text-xs font-semibold"
          >
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}
