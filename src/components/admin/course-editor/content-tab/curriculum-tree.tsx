"use client";

import * as React from "react";
import {
  AlertCircle,
  ArrowDown,
  ArrowUp,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Code2,
  FileQuestion,
  FileText,
  FolderPlus,
  HelpCircle,
  Loader2,
  Plus,
  Sparkles,
  Trash2,
  Video,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  createLessonAction,
  createModuleAction,
  createModuleKnowledgeCheckAction,
  deleteLessonAction,
  deleteModuleAction,
  reorderLessonsAction,
  reorderModulesAction,
} from "@/lib/actions/admin";
import { generateSlug } from "@/lib/utils/youtube-importer";
import { isKnowledgeCheckLesson, type AdminCourseDetail, type AdminLessonDetail, type AdminModuleDetail } from "@/lib/types";

interface CurriculumTreeProps {
  course: AdminCourseDetail;
  selectedLessonId: string | null;
  selectedModuleId: string | null;
  onSelectLesson: (lesson: AdminLessonDetail) => void;
  onSelectModule: (module: AdminModuleDetail) => void;
  onOpenPlaylistImport: (moduleId?: string) => void;
  onRefresh: () => void;
}

export function CurriculumTree({
  course,
  selectedLessonId,
  selectedModuleId,
  onSelectLesson,
  onSelectModule,
  onOpenPlaylistImport,
  onRefresh,
}: CurriculumTreeProps) {
  const [expandedModules, setExpandedModules] = React.useState<Set<string>>(
    new Set(course.modules.map((m) => m.id)),
  );

  // New Module Modal
  const [showNewModuleModal, setShowNewModuleModal] = React.useState(false);
  const [newModTitle, setNewModTitle] = React.useState("");
  const [isCreatingMod, setIsCreatingMod] = React.useState(false);
  const [creatingQuizModId, setCreatingQuizModId] = React.useState<string | null>(null);

  // New Lesson Modal
  const [newLessonModalModuleId, setNewLessonModalModuleId] = React.useState<string | null>(null);
  const [newLessonTitle, setNewLessonTitle] = React.useState("");
  const [newLessonType, setNewLessonType] = React.useState<
    "video" | "article" | "practice" | "knowledge_check"
  >("video");
  const [isCreatingLesson, setIsCreatingLesson] = React.useState(false);

  const toggleExpand = (modId: string) => {
    const next = new Set(expandedModules);
    if (next.has(modId)) next.delete(modId);
    else next.add(modId);
    setExpandedModules(next);
  };

  const handleCreateModule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newModTitle.trim() || isCreatingMod) return;

    setIsCreatingMod(true);
    try {
      const res = await createModuleAction(course.id, {
        title: newModTitle.trim(),
      });
      if (res.success) {
        setShowNewModuleModal(false);
        setNewModTitle("");
        onRefresh();
      }
    } finally {
      setIsCreatingMod(false);
    }
  };

  const handleCreateLesson = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLessonModalModuleId || !newLessonTitle.trim() || isCreatingLesson) return;

    setIsCreatingLesson(true);
    try {
      const res = await createLessonAction(newLessonModalModuleId, course.id, {
        title: newLessonTitle.trim(),
        slug: generateSlug(newLessonTitle),
        lessonType: newLessonType,
      });

      if (res.success) {
        setNewLessonModalModuleId(null);
        setNewLessonTitle("");
        onRefresh();
      }
    } finally {
      setIsCreatingLesson(false);
    }
  };

  const handleMoveModule = async (idx: number, direction: "up" | "down") => {
    const modules = [...course.modules];
    const targetIdx = direction === "up" ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= modules.length) return;

    const temp = modules[idx];
    modules[idx] = modules[targetIdx];
    modules[targetIdx] = temp;

    await reorderModulesAction(course.id, modules.map((m) => m.id));
    onRefresh();
  };

  const handleMoveLesson = async (mod: AdminModuleDetail, idx: number, direction: "up" | "down") => {
    const lessons = [...mod.lessons];
    const targetIdx = direction === "up" ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= lessons.length) return;

    const temp = lessons[idx];
    lessons[idx] = lessons[targetIdx];
    lessons[targetIdx] = temp;

    await reorderLessonsAction(mod.id, course.id, lessons.map((l) => l.id));
    onRefresh();
  };

  const handleDeleteModule = async (mod: AdminModuleDetail) => {
    if (!confirm(`Delete module "${mod.title}" and all ${mod.lessons.length} lessons inside it?`)) return;
    await deleteModuleAction(mod.id, course.id);
    onRefresh();
  };

  const handleDeleteLesson = async (lesson: AdminLessonDetail) => {
    if (!confirm(`Delete lesson "${lesson.title}"?`)) return;
    await deleteLessonAction(lesson.id, course.id);
    onRefresh();
  };

  const handleQuickAddKnowledgeCheck = async (mod: AdminModuleDetail) => {
    if (creatingQuizModId) return;
    const existing = mod.lessons.find((l) => isKnowledgeCheckLesson(l.lessonType));
    if (existing) {
      onSelectLesson(existing);
      return;
    }

    setCreatingQuizModId(mod.id);
    try {
      const res = await createModuleKnowledgeCheckAction(mod.id, course.id);
      if (res.success && res.lessonId) {
        onRefresh();
      } else if (res.error) {
        alert(res.error);
      }
    } finally {
      setCreatingQuizModId(null);
    }
  };

  const getLessonIcon = (type: string) => {
    switch (type) {
      case "video":
        return <Video className="h-3.5 w-3.5 text-rose-500 shrink-0" />;
      case "knowledge_check":
      case "quiz":
        return <FileQuestion className="h-3.5 w-3.5 text-purple-500 shrink-0" />;
      case "practice":
      case "exercise":
        return <Code2 className="h-3.5 w-3.5 text-amber-500 shrink-0" />;
      default:
        return <FileText className="h-3.5 w-3.5 text-blue-500 shrink-0" />;
    }
  };

  return (
    <div className="space-y-4">
      {/* Action buttons */}
      <div className="flex items-center gap-2">
        <Button
          type="button"
          size="sm"
          onClick={() => setShowNewModuleModal(true)}
          className="flex-1 rounded-xl bg-primary text-xs font-semibold text-white hover:bg-primary/90"
        >
          <FolderPlus className="mr-1.5 h-3.5 w-3.5" />
          <span>Add Module</span>
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => onOpenPlaylistImport()}
          className="rounded-xl border-line text-xs font-semibold hover:border-primary/40"
        >
          <Video className="mr-1.5 h-3.5 w-3.5 text-rose-500" />
          <span>Import Playlist</span>
        </Button>
      </div>

      {/* Module Tree */}
      {course.modules.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-line p-8 text-center text-xs text-ink-muted">
          No modules created yet. Add a module or import a YouTube playlist to get started.
        </div>
      ) : (
        <div className="space-y-3">
          {course.modules.map((mod, modIdx) => {
            const isExpanded = expandedModules.has(mod.id);
            const isModSelected = selectedModuleId === mod.id && !selectedLessonId;
            const kcLesson = mod.lessons.find((l) => isKnowledgeCheckLesson(l.lessonType));
            const questionCount = kcLesson?.quiz?.questions.length || 5;

            return (
              <div
                key={mod.id}
                className="overflow-hidden rounded-2xl border border-line bg-surface shadow-sm"
              >
                {/* Module Header */}
                <div
                  className={`flex flex-col gap-2 p-3 transition ${
                    isModSelected ? "bg-primary/10 border-l-4 border-l-primary" : "bg-surface-elevated/40 hover:bg-surface-elevated/70"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      <button
                        type="button"
                        onClick={() => toggleExpand(mod.id)}
                        className="p-0.5 text-ink-muted hover:text-ink"
                      >
                        {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                      </button>
                      <button
                        type="button"
                        onClick={() => onSelectModule(mod)}
                        className="text-left font-display text-xs font-bold text-ink hover:text-primary truncate"
                      >
                        <span>Module {modIdx + 1}: {mod.title}</span>
                      </button>
                      <Badge variant="outline" className="text-[10px] border-line px-1.5 py-0">
                        {mod.lessons.length}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        disabled={modIdx === 0}
                        onClick={() => handleMoveModule(modIdx, "up")}
                        className="p-1 text-ink-muted hover:text-ink disabled:opacity-20"
                        title="Move Module Up"
                      >
                        <ArrowUp className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        disabled={modIdx === course.modules.length - 1}
                        onClick={() => handleMoveModule(modIdx, "down")}
                        className="p-1 text-ink-muted hover:text-ink disabled:opacity-20"
                        title="Move Module Down"
                      >
                        <ArrowDown className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setNewLessonModalModuleId(mod.id)}
                        className="p-1 text-primary hover:bg-primary/10 rounded"
                        title="Add Lesson to this Module"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteModule(mod)}
                        className="p-1 text-rose-500 hover:bg-rose-500/10 rounded"
                        title="Delete Module"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Knowledge Check Status Bar */}
                  <div className="flex items-center justify-between border-t border-line/50 pt-2 text-[11px]">
                    <div className="flex items-center gap-1.5">
                      {kcLesson ? (
                        <button
                          type="button"
                          onClick={() => onSelectLesson(kcLesson)}
                          className="inline-flex items-center gap-1 rounded-md bg-emerald-500/10 px-2 py-0.5 font-semibold text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20 transition"
                          title="Click to edit Knowledge Check"
                        >
                          <CheckCircle2 className="h-3 w-3" />
                          <span>Knowledge Check ({questionCount} Qs)</span>
                        </button>
                      ) : mod.title.toLowerCase().includes("bonus") || mod.lessons.some((l) => l.isBonus) ? (
                        <span className="inline-flex items-center gap-1 rounded-md bg-purple-500/10 px-2 py-0.5 font-semibold text-purple-600 dark:text-purple-400">
                          <Sparkles className="h-3 w-3" />
                          <span>Bonus (Quiz Exempt)</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-md bg-amber-500/10 px-2 py-0.5 font-semibold text-amber-600 dark:text-amber-400">
                          <AlertCircle className="h-3 w-3" />
                          <span>Check Missing</span>
                        </span>
                      )}
                    </div>

                    {!kcLesson && !mod.title.toLowerCase().includes("bonus") && (
                      <button
                        type="button"
                        disabled={creatingQuizModId === mod.id}
                        onClick={() => handleQuickAddKnowledgeCheck(mod)}
                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-primary hover:underline disabled:opacity-50"
                      >
                        {creatingQuizModId === mod.id ? (
                          <>
                            <Loader2 className="h-3 w-3 animate-spin" />
                            <span>Adding...</span>
                          </>
                        ) : (
                          <>
                            <Plus className="h-3 w-3" />
                            <span>+ Add Knowledge Check</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>

                {/* Lessons in Module */}
                {isExpanded && (
                  <div className="divide-y divide-line/60 bg-surface">
                    {mod.lessons.length === 0 ? (
                      <div className="p-4 text-center text-[11px] text-ink-muted">
                        No lessons in this module. Click + above to add one.
                      </div>
                    ) : (
                      mod.lessons.map((lesson, lIdx) => {
                        const isSelected = selectedLessonId === lesson.id;

                        return (
                          <div
                            key={lesson.id}
                            className={`flex items-center justify-between px-3 py-2 text-xs transition ${
                              isSelected
                                ? "bg-primary/15 font-semibold text-primary"
                                : "hover:bg-surface-elevated/40 text-ink"
                            }`}
                          >
                            <button
                              type="button"
                              onClick={() => onSelectLesson(lesson)}
                              className="flex items-center gap-2.5 min-w-0 flex-1 text-left"
                            >
                              {getLessonIcon(lesson.lessonType)}
                              <span className="truncate">{lesson.title}</span>
                              {lesson.isBonus && (
                                <span className="rounded bg-purple-500/10 px-1.5 py-0.2 text-[9px] font-bold text-purple-600 dark:text-purple-400">
                                  BONUS
                                </span>
                              )}
                              {!lesson.isPublished && (
                                <span className="rounded bg-amber-500/10 px-1.5 py-0.2 text-[9px] font-bold text-amber-600 dark:text-amber-400">
                                  DRAFT
                                </span>
                              )}
                            </button>

                            <div className="flex items-center gap-1 shrink-0">
                              <button
                                type="button"
                                disabled={lIdx === 0}
                                onClick={() => handleMoveLesson(mod, lIdx, "up")}
                                className="p-1 text-ink-muted hover:text-ink disabled:opacity-20"
                                title="Move Lesson Up"
                              >
                                <ArrowUp className="h-3 w-3" />
                              </button>
                              <button
                                type="button"
                                disabled={lIdx === mod.lessons.length - 1}
                                onClick={() => handleMoveLesson(mod, lIdx, "down")}
                                className="p-1 text-ink-muted hover:text-ink disabled:opacity-20"
                                title="Move Lesson Down"
                              >
                                <ArrowDown className="h-3 w-3" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteLesson(lesson)}
                                className="p-1 text-rose-500 hover:bg-rose-500/10 rounded"
                                title="Delete Lesson"
                              >
                                <Trash2 className="h-3 w-3" />
                              </button>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* New Module Modal */}
      {showNewModuleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl border border-line bg-surface p-6 shadow-2xl">
            <h3 className="font-display text-base font-bold text-ink">Add New Module</h3>
            <form onSubmit={handleCreateModule} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-ink-muted">
                  Module Title *
                </label>
                <input
                  type="text"
                  required
                  value={newModTitle}
                  onChange={(e) => setNewModTitle(e.target.value)}
                  placeholder="e.g. Getting Started with HTML"
                  className="mt-1.5 h-10 w-full rounded-xl border border-line bg-surface-elevated px-3 text-xs text-ink focus:border-primary focus:outline-none"
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowNewModuleModal(false)}
                  className="rounded-xl border-line text-xs font-semibold"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isCreatingMod || !newModTitle.trim()}
                  size="sm"
                  className="rounded-xl bg-primary text-xs font-semibold text-white"
                >
                  {isCreatingMod ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Create Module"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* New Lesson Modal */}
      {newLessonModalModuleId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl border border-line bg-surface p-6 shadow-2xl">
            <h3 className="font-display text-base font-bold text-ink">Add New Lesson</h3>
            <form onSubmit={handleCreateLesson} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-ink-muted">
                  Lesson Type
                </label>
                <select
                  value={newLessonType}
                  onChange={(e) => setNewLessonType(
                    e.target.value as "video" | "article" | "practice" | "knowledge_check",
                  )}
                  className="mt-1.5 h-10 w-full rounded-xl border border-line bg-surface-elevated px-3 text-xs text-ink focus:border-primary focus:outline-none"
                >
                  <option value="video">Video Lesson (YouTube)</option>
                  <option value="article">Article / Reading</option>
                  <option value="practice">Practice Exercise</option>
                  <option value="knowledge_check">Knowledge Check (Quiz)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-ink-muted">
                  Lesson Title *
                </label>
                <input
                  type="text"
                  required
                  value={newLessonTitle}
                  onChange={(e) => setNewLessonTitle(e.target.value)}
                  placeholder="e.g. HTML Headings"
                  className="mt-1.5 h-10 w-full rounded-xl border border-line bg-surface-elevated px-3 text-xs text-ink focus:border-primary focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setNewLessonModalModuleId(null)}
                  className="rounded-xl border-line text-xs font-semibold"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isCreatingLesson || !newLessonTitle.trim()}
                  size="sm"
                  className="rounded-xl bg-primary text-xs font-semibold text-white"
                >
                  {isCreatingLesson ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Create Lesson"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
