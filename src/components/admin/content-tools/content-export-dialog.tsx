"use client";

import * as React from "react";
import {
  CheckCircle2,
  Download,
  FileDown,
  Loader2,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getExportScopeDataAction } from "@/lib/actions/admin-content-transfer";

interface ContentExportDialogProps {
  onClose: () => void;
}

export function ContentExportDialog({ onClose }: ContentExportDialogProps) {
  const [scopeType, setScopeType] = React.useState<"all" | "courses" | "learning_paths">("all");
  const [selectedCourseSlugs, setSelectedCourseSlugs] = React.useState<Set<string>>(new Set());
  const [selectedPathSlugs, setSelectedPathSlugs] = React.useState<Set<string>>(new Set());
  const [includeReferencedCourses, setIncludeReferencedCourses] = React.useState(true);

  const [availableCourses, setAvailableCourses] = React.useState<{ slug: string; title: string; difficulty: string }[]>([]);
  const [availablePaths, setAvailablePaths] = React.useState<{ slug: string; title: string; difficulty: string }[]>([]);
  const [isLoadingScopeData, setIsLoadingScopeData] = React.useState(true);
  
  const [isExporting, setIsExporting] = React.useState(false);
  const [exportError, setExportError] = React.useState<string | null>(null);

  React.useEffect(() => {
    async function loadScope() {
      try {
        const data = await getExportScopeDataAction();
        setAvailableCourses(data.courses);
        setAvailablePaths(data.learningPaths);
        // Select all by default
        setSelectedCourseSlugs(new Set(data.courses.map((c) => c.slug)));
        setSelectedPathSlugs(new Set(data.learningPaths.map((p) => p.slug)));
      } finally {
        setIsLoadingScopeData(false);
      }
    }
    loadScope();
  }, []);

  const toggleCourse = (slug: string) => {
    const next = new Set(selectedCourseSlugs);
    if (next.has(slug)) next.delete(slug);
    else next.add(slug);
    setSelectedCourseSlugs(next);
  };

  const togglePath = (slug: string) => {
    const next = new Set(selectedPathSlugs);
    if (next.has(slug)) next.delete(slug);
    else next.add(slug);
    setSelectedPathSlugs(next);
  };

  const handleExportDownload = async () => {
    setIsExporting(true);
    setExportError(null);

    try {
      const payload = {
        type: scopeType,
        courseSlugs: scopeType === "courses" ? Array.from(selectedCourseSlugs) : undefined,
        learningPathSlugs: scopeType === "learning_paths" ? Array.from(selectedPathSlugs) : undefined,
        includeReferencedCourses: scopeType === "learning_paths" ? includeReferencedCourses : undefined,
      };

      const res = await fetch("/api/admin/content/export", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.error || "Failed to generate export file.");
      }

      // Download file in browser
      const blob = await res.blob();
      const contentDisposition = res.headers.get("Content-Disposition");
      let filename = "meritloom-content-export.json";
      if (contentDisposition) {
        const match = contentDisposition.match(/filename="?([^"]+)"?/);
        if (match && match[1]) filename = match[1];
      }

      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);

      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Export failed.";
      setExportError(msg);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="flex max-h-[90vh] w-full max-w-2xl flex-col rounded-3xl border border-line bg-surface shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-line p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Download className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-display text-lg font-bold text-ink">Export Content Package</h2>
              <p className="text-xs text-ink-muted">
                Create a portable, structured JSON backup of course definitions and Learning Paths.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl p-1.5 text-ink-muted hover:bg-surface-elevated hover:text-ink"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {exportError && (
          <div className="m-6 mb-0 rounded-xl border border-rose-500/20 bg-rose-500/10 p-3.5 text-xs font-semibold text-rose-600 dark:text-rose-400">
            {exportError}
          </div>
        )}

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Scope Selector */}
          <div className="space-y-3">
            <label className="block text-xs font-bold uppercase tracking-wider text-ink-muted">
              Select Export Scope
            </label>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              {[
                { id: "all", label: "All Learning Content", desc: "All courses, paths, modules, lessons & quizzes" },
                { id: "courses", label: "Selected Courses", desc: "Choose specific courses and their curriculum" },
                { id: "learning_paths", label: "Selected Paths", desc: "Choose paths and associated courses" },
              ].map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setScopeType(opt.id as "all" | "courses" | "learning_paths")}
                  className={`flex flex-col text-left rounded-2xl border p-4 transition ${
                    scopeType === opt.id
                      ? "border-primary bg-primary/5 ring-1 ring-primary"
                      : "border-line bg-surface hover:border-primary/40"
                  }`}
                >
                  <span className="font-display text-xs font-bold text-ink">{opt.label}</span>
                  <span className="mt-1 text-[11px] text-ink-muted leading-relaxed">{opt.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Scope Details Picker */}
          {isLoadingScopeData ? (
            <div className="flex items-center justify-center p-8">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : (
            <>
              {scopeType === "courses" && (
                <div className="space-y-3 rounded-2xl border border-line bg-surface-elevated/20 p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-ink">
                      Courses to Include ({selectedCourseSlugs.size} selected)
                    </span>
                  </div>
                  <div className="max-h-48 overflow-y-auto space-y-1.5 divide-y divide-line/40">
                    {availableCourses.map((c) => {
                      const isSelected = selectedCourseSlugs.has(c.slug);
                      return (
                        <label
                          key={c.slug}
                          className="flex items-center justify-between py-2 text-xs text-ink cursor-pointer hover:bg-surface-elevated/40 px-2 rounded-lg"
                        >
                          <div className="flex items-center gap-2.5">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => toggleCourse(c.slug)}
                              className="rounded border-line text-primary focus:ring-primary h-4 w-4"
                            />
                            <span className="font-semibold">{c.title}</span>
                          </div>
                          <Badge variant="outline" className="text-[10px] capitalize border-line">
                            {c.difficulty}
                          </Badge>
                        </label>
                      );
                    })}
                  </div>
                </div>
              )}

              {scopeType === "learning_paths" && (
                <div className="space-y-4 rounded-2xl border border-line bg-surface-elevated/20 p-4">
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-ink">
                      Learning Paths ({selectedPathSlugs.size} selected)
                    </span>
                    <div className="space-y-1.5">
                      {availablePaths.map((p) => {
                        const isSelected = selectedPathSlugs.has(p.slug);
                        return (
                          <label
                            key={p.slug}
                            className="flex items-center justify-between py-2 text-xs text-ink cursor-pointer hover:bg-surface-elevated/40 px-2 rounded-lg"
                          >
                            <div className="flex items-center gap-2.5">
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => togglePath(p.slug)}
                                className="rounded border-line text-primary focus:ring-primary h-4 w-4"
                              />
                              <span className="font-semibold">{p.title}</span>
                            </div>
                            <Badge variant="outline" className="text-[10px] capitalize border-line">
                              {p.difficulty}
                            </Badge>
                          </label>
                        );
                      })}
                    </div>
                  </div>

                  <label className="flex items-center gap-2 pt-2 border-t border-line text-xs font-semibold text-ink cursor-pointer">
                    <input
                      type="checkbox"
                      checked={includeReferencedCourses}
                      onChange={(e) => setIncludeReferencedCourses(e.target.checked)}
                      className="rounded border-line text-primary focus:ring-primary h-4 w-4"
                    />
                    <span>Include referenced courses in export (creates complete portable bundle)</span>
                  </label>
                </div>
              )}
            </>
          )}

          {/* Privacy Note */}
          <div className="rounded-2xl border border-line bg-surface-elevated/40 p-4 text-xs text-ink-muted space-y-1">
            <span className="font-bold text-ink flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              100% Learner Safe
            </span>
            <p className="text-[11px] leading-relaxed">
              This export contains curriculum definitions, lesson video IDs, quizzes, and learning path sequences only. No user accounts, enrollments, progress, or keys are ever exported.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 border-t border-line p-6 bg-surface-elevated/10">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="rounded-xl border-line text-xs font-semibold"
          >
            Cancel
          </Button>
          <Button
            type="button"
            disabled={isExporting}
            onClick={handleExportDownload}
            className="rounded-xl bg-primary px-5 text-xs font-semibold text-white shadow-sm hover:bg-primary/90"
          >
            {isExporting ? (
              <>
                <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                <span>Generating Export...</span>
              </>
            ) : (
              <>
                <FileDown className="mr-1.5 h-3.5 w-3.5" />
                <span>Download JSON Backup</span>
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
