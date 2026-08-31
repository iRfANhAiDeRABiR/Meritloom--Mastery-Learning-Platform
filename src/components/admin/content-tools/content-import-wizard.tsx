"use client";

import * as React from "react";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  FileUp,
  Loader2,
  PackageOpen,
  Route,
  Upload,
  X,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  executeImportAction,
  validateAndPrepareImportAction,
} from "@/lib/actions/admin-content-transfer";
import type {
  ImportPreviewSummary,
  ImportResultSummary,
} from "@/lib/admin/content-transfer/types";

interface ContentImportWizardProps {
  onClose: () => void;
  onSuccess: () => void;
}

export function ContentImportWizard({
  onClose,
  onSuccess,
}: ContentImportWizardProps) {
  const [step, setStep] = React.useState<1 | 2 | 3 | 4>(1);
  const [fileContent, setFileContent] = React.useState<string | null>(null);
  const [fileName, setFileName] = React.useState<string | null>(null);
  const [fileSize, setFileSize] = React.useState<number | null>(null);

  const [isValidating, setIsValidating] = React.useState(false);
  const [validationError, setValidationError] = React.useState<string | null>(null);
  const [validationDetails, setValidationDetails] = React.useState<string[]>([]);
  const [previewSummary, setPreviewSummary] = React.useState<ImportPreviewSummary | null>(null);

  // Strategy options
  const [strategy, setStrategy] = React.useState<"safe_merge" | "create_only">("safe_merge");
  const [newEntitiesDraft, setNewEntitiesDraft] = React.useState(true);
  const [preservePublication, setPreservePublication] = React.useState(true);

  // Import execution state
  const [isImporting, setIsImporting] = React.useState(false);
  const [importError, setImportError] = React.useState<string | null>(null);
  const [importResult, setImportResult] = React.useState<ImportResultSummary | null>(null);

  // File Upload Handler
  const handleFileSelect = (file: File) => {
    if (!file.name.endsWith(".json")) {
      setValidationError("Please select a valid .json Meritloom content backup file.");
      return;
    }
    setFileName(file.name);
    setFileSize(file.size);
    setValidationError(null);
    setValidationDetails([]);

    const reader = new FileReader();
    reader.onload = async (e) => {
      const text = e.target?.result as string;
      setFileContent(text);
      await runValidationAndPreview(text);
    };
    reader.readAsText(file);
  };

  const runValidationAndPreview = async (jsonText: string) => {
    setIsValidating(true);
    setValidationError(null);
    setValidationDetails([]);

    try {
      const res = await validateAndPrepareImportAction(jsonText);
      if (!res.success) {
        setValidationError(res.error || "Validation failed.");
        setValidationDetails(res.details || []);
      } else if (res.preview) {
        setPreviewSummary(res.preview);
        setStep(2);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Validation failed.";
      setValidationError(msg);
    } finally {
      setIsValidating(false);
    }
  };

  const handleExecuteImport = async () => {
    if (!fileContent || isImporting) return;

    setIsImporting(true);
    setImportError(null);

    try {
      const res = await executeImportAction(fileContent, {
        strategy,
        newEntitiesDraft,
        preservePublication,
      });

      if (!res.success || !res.result) {
        setImportError(res.error || "Failed to execute import.");
      } else {
        setImportResult(res.result);
        setStep(4);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Import failed.";
      setImportError(msg);
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="flex max-h-[90vh] w-full max-w-3xl flex-col rounded-3xl border border-line bg-surface shadow-2xl overflow-hidden">
        {/* Top Stepper Header */}
        <div className="border-b border-line p-6 bg-surface">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <PackageOpen className="h-5 w-5" />
              </div>
              <div>
                <h2 className="font-display text-lg font-bold text-ink">
                  Import Content Package
                </h2>
                <p className="text-xs text-ink-muted">
                  Safely validate and restore course curriculum and Learning Paths.
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

          {/* Step Badges */}
          <div className="mt-6 flex items-center justify-between border-t border-line pt-4 text-xs font-semibold">
            {[
              { num: 1, label: "Upload" },
              { num: 2, label: "Validate" },
              { num: 3, label: "Review Diff" },
              { num: 4, label: "Import" },
            ].map((st, i) => (
              <div key={st.num} className="flex items-center gap-2">
                <span
                  className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
                    step >= st.num
                      ? "bg-primary text-white"
                      : "bg-surface-elevated text-ink-muted"
                  }`}
                >
                  {st.num}
                </span>
                <span className={step >= st.num ? "text-ink" : "text-ink-muted"}>
                  {st.label}
                </span>
                {i < 3 && <div className="h-[1px] w-6 sm:w-16 bg-line" />}
              </div>
            ))}
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* STEP 1: Upload */}
          {step === 1 && (
            <div className="space-y-6">
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  if (e.dataTransfer.files?.[0]) {
                    handleFileSelect(e.dataTransfer.files[0]);
                  }
                }}
                className="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-line bg-surface-elevated/20 p-12 text-center transition hover:border-primary/40"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <Upload className="h-6 w-6" />
                </div>
                <h3 className="mt-4 font-display text-base font-bold text-ink">
                  Drop Meritloom JSON export here
                </h3>
                <p className="mt-1 text-xs text-ink-muted max-w-sm">
                  Upload a previously exported Meritloom content backup file (.json, max 10MB).
                </p>

                <div className="mt-6">
                  <label className="cursor-pointer rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-primary/90">
                    <span>Browse File</span>
                    <input
                      type="file"
                      accept=".json"
                      onChange={(e) => {
                        if (e.target.files?.[0]) {
                          handleFileSelect(e.target.files[0]);
                        }
                      }}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {isValidating && (
                <div className="flex items-center justify-center gap-2 p-4 text-xs font-semibold text-primary">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Validating backup structure...</span>
                </div>
              )}

              {validationError && (
                <div className="rounded-2xl border border-rose-500/20 bg-rose-500/10 p-4 text-xs space-y-2">
                  <div className="flex items-center gap-2 font-bold text-rose-600 dark:text-rose-400">
                    <XCircle className="h-4 w-4" />
                    <span>{validationError}</span>
                  </div>
                  {validationDetails.length > 0 && (
                    <ul className="list-disc pl-5 space-y-1 text-[11px] text-rose-600/90 dark:text-rose-400/90">
                      {validationDetails.map((d, i) => (
                        <li key={i}>{d}</li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>
          )}

          {/* STEP 2: Validate Summary */}
          {step === 2 && previewSummary && (
            <div className="space-y-6">
              <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                  <div>
                    <h4 className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                      Valid Meritloom Backup Package
                    </h4>
                    <p className="text-[11px] text-ink-muted">
                      {fileName} ({(Number(fileSize) / 1024).toFixed(1)} KB)
                    </p>
                  </div>
                </div>
                <Badge className="bg-emerald-500 text-white text-[10px]">
                  Schema v1
                </Badge>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="rounded-2xl border border-line bg-surface p-4 text-center">
                  <span className="font-display text-xl font-bold text-ink">
                    {previewSummary.counts.newCourses + previewSummary.counts.updatedCourses}
                  </span>
                  <p className="text-[11px] text-ink-muted">Courses</p>
                </div>
                <div className="rounded-2xl border border-line bg-surface p-4 text-center">
                  <span className="font-display text-xl font-bold text-ink">
                    {previewSummary.counts.newModules + previewSummary.counts.updatedModules}
                  </span>
                  <p className="text-[11px] text-ink-muted">Modules</p>
                </div>
                <div className="rounded-2xl border border-line bg-surface p-4 text-center">
                  <span className="font-display text-xl font-bold text-ink">
                    {previewSummary.counts.newLessons + previewSummary.counts.updatedLessons}
                  </span>
                  <p className="text-[11px] text-ink-muted">Lessons</p>
                </div>
                <div className="rounded-2xl border border-line bg-surface p-4 text-center">
                  <span className="font-display text-xl font-bold text-ink">
                    {previewSummary.counts.newPaths + previewSummary.counts.updatedPaths}
                  </span>
                  <p className="text-[11px] text-ink-muted">Learning Paths</p>
                </div>
              </div>

              <div className="rounded-2xl border border-line bg-surface-elevated/20 p-4 text-xs text-ink space-y-2">
                <span className="font-bold">Next: Review Changes</span>
                <p className="text-ink-muted text-[11px] leading-relaxed">
                  Click continue to review which courses and lessons will be created or updated. No database changes have been made yet.
                </p>
              </div>
            </div>
          )}

          {/* STEP 3: Review / Diff & Strategy */}
          {step === 3 && previewSummary && (
            <div className="space-y-6">
              {/* Strategy Selector */}
              <div className="space-y-3">
                <label className="block text-xs font-bold uppercase tracking-wider text-ink-muted">
                  Import Strategy
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setStrategy("safe_merge")}
                    className={`flex flex-col text-left rounded-2xl border p-4 transition ${
                      strategy === "safe_merge"
                        ? "border-primary bg-primary/5 ring-1 ring-primary"
                        : "border-line bg-surface hover:border-primary/40"
                    }`}
                  >
                    <span className="font-display text-xs font-bold text-ink">Safe Merge (Recommended)</span>
                    <span className="mt-1 text-[11px] text-ink-muted leading-relaxed">
                      Updates existing content without changing IDs; preserves all learner enrollments and progress.
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setStrategy("create_only")}
                    className={`flex flex-col text-left rounded-2xl border p-4 transition ${
                      strategy === "create_only"
                        ? "border-primary bg-primary/5 ring-1 ring-primary"
                        : "border-line bg-surface hover:border-primary/40"
                    }`}
                  >
                    <span className="font-display text-xs font-bold text-ink">Create Only</span>
                    <span className="mt-1 text-[11px] text-ink-muted leading-relaxed">
                      Only imports new courses or paths; skips any entities that already exist in the database.
                    </span>
                  </button>
                </div>
              </div>

              {/* Publication Settings */}
              <div className="rounded-2xl border border-line bg-surface p-4 space-y-2 text-xs">
                <label className="flex items-center gap-2 font-semibold text-ink cursor-pointer">
                  <input
                    type="checkbox"
                    checked={preservePublication}
                    onChange={(e) => setPreservePublication(e.target.checked)}
                    className="rounded border-line text-primary focus:ring-primary h-4 w-4"
                  />
                  <span>Preserve current publication status of existing courses</span>
                </label>
                <label className="flex items-center gap-2 font-semibold text-ink cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newEntitiesDraft}
                    onChange={(e) => setNewEntitiesDraft(e.target.checked)}
                    className="rounded border-line text-primary focus:ring-primary h-4 w-4"
                  />
                  <span>Import new courses as Draft (recommended for review before publishing)</span>
                </label>
              </div>

              {/* Diff Tree */}
              <div className="space-y-3">
                <label className="block text-xs font-bold uppercase tracking-wider text-ink-muted">
                  Planned Changes ({previewSummary.courses.length} courses, {previewSummary.learningPaths.length} paths)
                </label>
                <div className="rounded-2xl border border-line bg-surface divide-y divide-line overflow-hidden">
                  {previewSummary.courses.map((c) => (
                    <div key={c.slug} className="p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <BookOpen className="h-4 w-4 text-primary" />
                          <span className="text-xs font-bold text-ink">{c.title}</span>
                          <span className="font-mono text-[10px] text-ink-muted">/{c.slug}</span>
                        </div>
                        <Badge
                          variant="outline"
                          className={`text-[10px] uppercase font-bold ${
                            c.type === "new"
                              ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                              : "border-primary/30 bg-primary/10 text-primary"
                          }`}
                        >
                          {c.type === "new" ? "Will Create" : "Will Update"}
                        </Badge>
                      </div>

                      <div className="pl-6 text-[11px] text-ink-muted space-y-1">
                        <p>{c.modules.length} modules, {c.modules.reduce((acc, m) => acc + m.lessons.length, 0)} lessons</p>
                      </div>
                    </div>
                  ))}

                  {previewSummary.learningPaths.map((p) => (
                    <div key={p.slug} className="p-4 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Route className="h-4 w-4 text-purple-500" />
                        <span className="text-xs font-bold text-ink">{p.title}</span>
                        <span className="font-mono text-[10px] text-ink-muted">/{p.slug}</span>
                      </div>
                      <Badge
                        variant="outline"
                        className={`text-[10px] uppercase font-bold ${
                          p.type === "new"
                            ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                            : "border-primary/30 bg-primary/10 text-primary"
                        }`}
                      >
                        {p.type === "new" ? "Will Create" : "Will Update"}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>

              {importError && (
                <div className="rounded-2xl border border-rose-500/20 bg-rose-500/10 p-4 text-xs font-semibold text-rose-600 dark:text-rose-400">
                  {importError}
                </div>
              )}
            </div>
          )}

          {/* STEP 4: Success Result */}
          {step === 4 && importResult && (
            <div className="space-y-6 text-center py-6">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-3xl bg-emerald-500/10 text-emerald-500">
                <CheckCircle2 className="h-8 w-8" />
              </div>
              <div>
                <h3 className="font-display text-xl font-bold text-ink">
                  Content Imported Successfully
                </h3>
                <p className="mt-1 text-xs text-ink-muted">
                  All course definitions and Learning Paths have been safely restored.
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-lg mx-auto text-left">
                <div className="rounded-2xl border border-line bg-surface p-3 text-xs">
                  <span className="text-ink-muted">Courses:</span>
                  <p className="font-bold text-ink">
                    +{importResult.createdCourses} new, {importResult.updatedCourses} updated
                  </p>
                </div>
                <div className="rounded-2xl border border-line bg-surface p-3 text-xs">
                  <span className="text-ink-muted">Modules:</span>
                  <p className="font-bold text-ink">
                    +{importResult.createdModules} new, {importResult.updatedModules} updated
                  </p>
                </div>
                <div className="rounded-2xl border border-line bg-surface p-3 text-xs">
                  <span className="text-ink-muted">Lessons:</span>
                  <p className="font-bold text-ink">
                    +{importResult.createdLessons} new, {importResult.updatedLessons} updated
                  </p>
                </div>
                <div className="rounded-2xl border border-line bg-surface p-3 text-xs">
                  <span className="text-ink-muted">Learning Paths:</span>
                  <p className="font-bold text-ink">
                    +{importResult.createdPaths} new, {importResult.updatedPaths} updated
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation */}
        <div className="flex items-center justify-between border-t border-line p-6 bg-surface-elevated/10">
          <div>
            {step > 1 && step < 4 && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setStep((s) => (s - 1) as 1 | 2 | 3)}
                className="rounded-xl border-line text-xs font-semibold"
              >
                <ArrowLeft className="mr-1.5 h-3.5 w-3.5" />
                <span>Back</span>
              </Button>
            )}
          </div>

          <div className="flex items-center gap-2">
            {step === 2 && (
              <Button
                type="button"
                onClick={() => setStep(3)}
                className="rounded-xl bg-primary px-5 text-xs font-semibold text-white shadow-sm hover:bg-primary/90"
              >
                <span>Review Changes</span>
                <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
              </Button>
            )}

            {step === 3 && (
              <Button
                type="button"
                disabled={isImporting}
                onClick={handleExecuteImport}
                className="rounded-xl bg-primary px-5 text-xs font-semibold text-white shadow-sm hover:bg-primary/90"
              >
                {isImporting ? (
                  <>
                    <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                    <span>Importing Content...</span>
                  </>
                ) : (
                  <>
                    <FileUp className="mr-1.5 h-3.5 w-3.5" />
                    <span>Confirm & Execute Import</span>
                  </>
                )}
              </Button>
            )}

            {step === 4 && (
              <Button
                type="button"
                onClick={() => {
                  onSuccess();
                  onClose();
                }}
                className="rounded-xl bg-primary px-5 text-xs font-semibold text-white shadow-sm hover:bg-primary/90"
              >
                <span>Done</span>
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
