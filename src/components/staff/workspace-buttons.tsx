import Link from "next/link";
import { ExternalLink, GraduationCap, ShieldCheck } from "lucide-react";
import { routes } from "@/lib/routes";
import type { ActiveWorkspace, AvailableWorkspaces } from "@/lib/types/staff";

interface WorkspaceButtonsProps {
  workspaces: AvailableWorkspaces;
  currentWorkspace: ActiveWorkspace;
}

export function WorkspaceButtons({
  workspaces,
  currentWorkspace,
}: WorkspaceButtonsProps) {
  return (
    <div className="hidden md:flex items-center gap-2">
      {/* Admin Studio Button (if inside Instructor or Learner workspace and authorized for Admin) */}
      {workspaces.admin && currentWorkspace !== "admin" && (
        <Link
          href="/admin"
          className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-purple-500/30 bg-purple-500/10 px-3 text-xs font-bold text-purple-300 transition-all hover:bg-purple-500/20 hover:text-white shadow-xs"
          title="Switch to Admin Studio"
        >
          <ShieldCheck className="size-3.5 text-purple-400" aria-hidden="true" />
          <span>Admin Studio</span>
        </Link>
      )}

      {/* Instructor Studio Button (if authorized for Instructor and not currently in Instructor) */}
      {workspaces.instructor && currentWorkspace !== "instructor" && (
        <Link
          href="/instructor"
          className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-cyan-500/30 bg-cyan-500/10 px-3 text-xs font-bold text-cyan-300 transition-all hover:bg-cyan-500/20 hover:text-white shadow-xs"
          title="Switch to Instructor Studio"
        >
          <GraduationCap className="size-3.5 text-cyan-400" aria-hidden="true" />
          <span>Instructor Studio</span>
        </Link>
      )}

      {/* Learner Home Button (if currently in Admin or Instructor workspace) */}
      {currentWorkspace !== "learner" && (
        <Link
          href={routes.learn}
          className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-line bg-surface px-3 text-xs font-semibold text-ink transition-all hover:border-primary/40 hover:text-primary shadow-xs"
          title="Go to personal learning dashboard"
        >
          <GraduationCap className="size-3.5 text-primary" aria-hidden="true" />
          <span>Learner Home</span>
        </Link>
      )}

      {/* View Public Site Button */}
      <Link
        href="/"
        target="_blank"
        rel="noopener noreferrer"
        className="hidden lg:inline-flex h-9 items-center gap-1.5 rounded-xl border border-line bg-surface px-3 text-xs font-semibold text-ink-muted transition-all hover:border-primary/40 hover:text-ink shadow-xs"
        title="View public website (opens in new tab)"
      >
        <span>View site</span>
        <ExternalLink className="size-3.5 text-ink-muted" aria-hidden="true" />
      </Link>
    </div>
  );
}

