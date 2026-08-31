"use client";

import * as React from "react";
import Link from "next/link";
import {
  ArrowRight,
  Download,
  FileDown,
  FileUp,
  ShieldCheck,
  Upload,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ContentExportDialog } from "@/components/admin/content-tools/content-export-dialog";
import { ContentImportWizard } from "@/components/admin/content-tools/content-import-wizard";

export function ContentToolsView() {
  const [showExportModal, setShowExportModal] = React.useState(false);
  const [showImportModal, setShowImportModal] = React.useState(false);

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl">
          Content Tools & Backup
        </h1>
        <p className="mt-1 text-sm text-ink-muted">
          Back up, move, and restore Meritloom course curriculum and Learning Paths without touching learner data.
        </p>
      </div>

      {/* Safety Callout */}
      <div className="rounded-3xl border border-primary/20 bg-primary/5 p-6 flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary text-white shadow-sm shadow-primary/30">
          <ShieldCheck className="h-6 w-6" />
        </div>
        <div className="space-y-1">
          <h3 className="font-display text-sm font-bold text-ink">
            Learner Data Is Never Included
          </h3>
          <p className="text-xs text-ink-muted leading-relaxed">
            Content tools operate exclusively on course definitions, lesson content, and Learning Path roadmaps. User accounts, enrollments, lesson progress, saved courses, and quiz attempts remain 100% untouched.
          </p>
        </div>
      </div>

      {/* 3 Main Action Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {/* Export Card */}
        <div className="flex flex-col justify-between rounded-3xl border border-line bg-surface p-6 sm:p-8 shadow-sm transition hover:border-primary/40">
          <div className="space-y-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Download className="h-6 w-6" />
            </div>
            <h2 className="font-display text-lg font-bold text-ink">
              Export Content
            </h2>
            <p className="text-xs text-ink-muted leading-relaxed">
              Download courses, lessons, quizzes, and Learning Paths as a structured, portable JSON backup package.
            </p>
          </div>

          <div className="pt-6">
            <Button
              type="button"
              onClick={() => setShowExportModal(true)}
              className="w-full rounded-xl bg-primary py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-primary/90"
            >
              <FileDown className="mr-1.5 h-4 w-4" />
              <span>Create Export</span>
            </Button>
          </div>
        </div>

        {/* Import Card */}
        <div className="flex flex-col justify-between rounded-3xl border border-line bg-surface p-6 sm:p-8 shadow-sm transition hover:border-primary/40">
          <div className="space-y-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <Upload className="h-6 w-6" />
            </div>
            <h2 className="font-display text-lg font-bold text-ink">
              Import Content
            </h2>
            <p className="text-xs text-ink-muted leading-relaxed">
              Validate and safely merge a previous Meritloom JSON export. Preview exact changes before applying updates.
            </p>
          </div>

          <div className="pt-6">
            <Button
              type="button"
              onClick={() => setShowImportModal(true)}
              variant="outline"
              className="w-full rounded-xl border-line py-2.5 text-xs font-semibold text-ink hover:border-emerald-500/40 hover:text-emerald-600"
            >
              <FileUp className="mr-1.5 h-4 w-4" />
              <span>Import JSON Backup</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Quick Links Card */}
      <div className="rounded-3xl border border-line bg-surface p-6 shadow-sm">
        <h3 className="font-display text-sm font-bold text-ink">
          Content Quality & Course Management
        </h3>
        <p className="mt-1 text-xs text-ink-muted">
          After importing new courses, verify curriculum structures and published status.
        </p>

        <div className="mt-4 flex flex-wrap gap-3">
          <Button asChild variant="outline" size="sm" className="rounded-xl border-line text-xs font-semibold">
            <Link href="/admin/courses">
              <span>View All Courses</span>
              <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="sm" className="rounded-xl border-line text-xs font-semibold">
            <Link href="/admin/learning-paths">
              <span>Manage Learning Paths</span>
              <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
            </Link>
          </Button>
        </div>
      </div>

      {/* Modals */}
      {showExportModal && (
        <ContentExportDialog onClose={() => setShowExportModal(false)} />
      )}

      {showImportModal && (
        <ContentImportWizard
          onClose={() => setShowImportModal(false)}
          onSuccess={() => {
            // refresh or notify
          }}
        />
      )}
    </div>
  );
}
