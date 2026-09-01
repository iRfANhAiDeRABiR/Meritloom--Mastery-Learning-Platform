"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  AlertOctagon,
  ArrowLeft,
  BookOpen,
  Bookmark,
  CheckCircle2,
  FileText,
  KeyRound,
  UserCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { changeUserRoleAction, reactivateUserAction, suspendUserAction } from "@/lib/actions/users";
import type { AdminUserDetail, UserRole } from "@/lib/types/staff";

interface UserDetailViewProps {
  user: AdminUserDetail;
}

export function UserDetailView({ user }: UserDetailViewProps) {
  const router = useRouter();

  const [isSuspendDialogOpen, setIsSuspendDialogOpen] = React.useState(false);
  const [suspensionReason, setSuspensionReason] = React.useState("");
  const [isReactivateDialogOpen, setIsReactivateDialogOpen] = React.useState(false);
  const [isRoleDialogOpen, setIsRoleDialogOpen] = React.useState(false);
  const [selectedNewRole, setSelectedNewRole] = React.useState<UserRole>(user.role);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleSuspendSubmit = async () => {
    setIsSubmitting(true);
    toast("Suspending account...", { id: "suspend-user-action" });

    try {
      const res = await suspendUserAction(user.id, suspensionReason);
      if (res.success) {
        toast.success(`Account for ${user.fullName} has been suspended.`, { id: "suspend-user-action" });
        setIsSuspendDialogOpen(false);
        setSuspensionReason("");
        router.refresh();
      } else {
        toast.error(res.error || "Failed to suspend user", { id: "suspend-user-action" });
      }
    } catch {
      toast.error("Failed to suspend user", { id: "suspend-user-action" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReactivateSubmit = async () => {
    setIsSubmitting(true);
    toast("Reactivating account...", { id: "reactivate-user-action" });

    try {
      const res = await reactivateUserAction(user.id);
      if (res.success) {
        toast.success(`Account for ${user.fullName} is now active.`, { id: "reactivate-user-action" });
        setIsReactivateDialogOpen(false);
        router.refresh();
      } else {
        toast.error(res.error || "Failed to reactivate user", { id: "reactivate-user-action" });
      }
    } catch {
      toast.error("Failed to reactivate user", { id: "reactivate-user-action" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRoleChangeSubmit = async () => {
    setIsSubmitting(true);
    toast("Updating role...", { id: "role-change-action" });

    try {
      const res = await changeUserRoleAction(user.id, selectedNewRole);
      if (res.success) {
        toast.success(`Role for ${user.fullName} updated to ${selectedNewRole}.`, { id: "role-change-action" });
        setIsRoleDialogOpen(false);
        router.refresh();
      } else {
        toast.error(res.error || "Failed to change user role", { id: "role-change-action" });
      }
    } catch {
      toast.error("Failed to change user role", { id: "role-change-action" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      {/* Back Link */}
      <div>
        <Button asChild variant="ghost" size="sm" className="rounded-xl text-xs text-ink-muted">
          <Link href="/admin/users">
            <ArrowLeft className="mr-1.5 size-3.5" />
            <span>Back to Users</span>
          </Link>
        </Button>
      </div>

      {/* Suspension Alert Banner if Suspended */}
      {user.accountStatus === "suspended" && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-rose-500/30 bg-rose-500/10 p-5 shadow-xs">
          <div className="flex items-start gap-3">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-rose-500 text-white shadow-xs">
              <AlertOctagon className="size-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display font-bold text-rose-700 dark:text-rose-300">
                  Account Currently Suspended
                </span>
              </div>
              <p className="text-xs text-ink-muted mt-1">
                Reason: <strong className="text-ink">{user.suspensionReason || "Administrative policy violation"}</strong>
                {user.suspendedAt && (
                  <span>
                    {" "}· Suspended on {new Date(user.suspendedAt).toLocaleDateString()}
                  </span>
                )}
                {user.suspendedBy && <span> by {user.suspendedBy.name}</span>}
              </p>
            </div>
          </div>

          <Button
            onClick={() => setIsReactivateDialogOpen(true)}
            className="rounded-xl bg-emerald-600 font-semibold text-white hover:bg-emerald-700 text-xs shadow-xs"
          >
            <CheckCircle2 className="mr-1.5 size-3.5" />
            <span>Reactivate Account</span>
          </Button>
        </div>
      )}

      {/* User Header Profile Card */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-line bg-surface p-6 shadow-xs">
        <div className="flex items-center gap-4">
          <Avatar
            src={user.avatarUrl}
            name={user.fullName}
            className="size-16 text-lg"
          />
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="font-display text-xl font-bold text-ink sm:text-2xl">
                {user.fullName}
              </h1>
              <span className="rounded-md bg-purple-500/10 px-2 py-0.5 text-xs font-bold text-purple-600 dark:text-purple-400 capitalize">
                {user.role}
              </span>
              <span
                className={`rounded-md px-2 py-0.5 text-xs font-semibold ${
                  user.accountStatus === "active"
                    ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                    : "bg-rose-500/10 text-rose-600 dark:text-rose-400"
                }`}
              >
                {user.accountStatus === "active" ? "Active" : "Suspended"}
              </span>
            </div>
            <p className="mt-1 text-xs text-ink-muted">
              Account created on{" "}
              {new Date(user.createdAt).toLocaleDateString([], {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </p>
          </div>
        </div>

        {/* Header Action Buttons */}
        {user.role !== "admin" && (
          <div className="flex flex-wrap items-center gap-2">
            <Button
              onClick={() => {
                setSelectedNewRole(user.role);
                setIsRoleDialogOpen(true);
              }}
              variant="outline"
              className="rounded-xl border-line text-xs font-semibold shadow-xs"
            >
              <UserCheck className="mr-1.5 size-3.5 text-ink-muted" />
              <span>Change Role</span>
            </Button>

            {user.accountStatus === "active" ? (
              <Button
                onClick={() => setIsSuspendDialogOpen(true)}
                variant="outline"
                className="rounded-xl border-rose-500/30 text-xs font-semibold text-rose-600 hover:bg-rose-500/10 shadow-xs"
              >
                <AlertOctagon className="mr-1.5 size-3.5" />
                <span>Suspend</span>
              </Button>
            ) : (
              <Button
                onClick={() => setIsReactivateDialogOpen(true)}
                className="rounded-xl bg-emerald-600 font-semibold text-white hover:bg-emerald-700 text-xs shadow-xs"
              >
                <CheckCircle2 className="mr-1.5 size-3.5" />
                <span>Reactivate</span>
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Learning Stats Grid */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
        <div className="rounded-2xl border border-line bg-surface p-4 shadow-xs">
          <div className="flex items-center gap-1.5 text-xs font-medium text-ink-muted">
            <BookOpen className="size-3.5 text-primary" />
            <span>Enrolled</span>
          </div>
          <div className="mt-2 text-2xl font-bold text-ink">{user.stats.enrolledCount}</div>
        </div>

        <div className="rounded-2xl border border-line bg-surface p-4 shadow-xs">
          <div className="flex items-center gap-1.5 text-xs font-medium text-ink-muted">
            <CheckCircle2 className="size-3.5 text-emerald-500" />
            <span>Completed</span>
          </div>
          <div className="mt-2 text-2xl font-bold text-ink">{user.stats.completedCount}</div>
        </div>

        <div className="rounded-2xl border border-line bg-surface p-4 shadow-xs">
          <div className="flex items-center gap-1.5 text-xs font-medium text-ink-muted">
            <Bookmark className="size-3.5 text-blue-500" />
            <span>Saved Courses</span>
          </div>
          <div className="mt-2 text-2xl font-bold text-ink">{user.stats.savedCount}</div>
        </div>

        <div className="rounded-2xl border border-line bg-surface p-4 shadow-xs">
          <div className="flex items-center gap-1.5 text-xs font-medium text-ink-muted">
            <FileText className="size-3.5 text-amber-500" />
            <span>Lesson Notes</span>
          </div>
          <div className="mt-2 text-2xl font-bold text-ink">{user.stats.notesCount}</div>
        </div>

        <div className="rounded-2xl border border-line bg-surface p-4 shadow-xs">
          <div className="flex items-center gap-1.5 text-xs font-medium text-ink-muted">
            <Bookmark className="size-3.5 text-purple-500" />
            <span>Bookmarks</span>
          </div>
          <div className="mt-2 text-2xl font-bold text-ink">{user.stats.bookmarksCount}</div>
        </div>
      </div>

      {/* Enrolled Courses Table */}
      <div className="rounded-2xl border border-line bg-surface p-5 shadow-xs">
        <div className="mb-4">
          <h2 className="font-display text-base font-bold text-ink">
            Enrolled Courses & Progress
          </h2>
          <p className="text-xs text-ink-muted mt-0.5">
            Overview of courses currently in progress or completed by this learner.
          </p>
        </div>

        {user.enrollments.length === 0 ? (
          <div className="py-8 text-center text-xs text-ink-muted">
            No course enrollments on record yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-line text-ink-muted font-semibold">
                  <th className="pb-2.5 font-medium">Course</th>
                  <th className="pb-2.5 font-medium text-center">Status</th>
                  <th className="pb-2.5 font-medium text-right">Progress</th>
                  <th className="pb-2.5 font-medium text-right">Enrolled At</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {user.enrollments.map((e, idx) => (
                  <tr key={idx} className="hover:bg-surface-elevated/30 transition">
                    <td className="py-3 font-semibold text-ink">
                      <Link href={`/courses/${e.courseSlug}`} className="hover:text-primary transition">
                        {e.courseTitle}
                      </Link>
                    </td>
                    <td className="py-3 text-center">
                      <span
                        className={`inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-bold ${
                          e.status === "completed"
                            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                            : "bg-primary/10 text-primary"
                        }`}
                      >
                        {e.status === "completed" ? "Completed" : "In Progress"}
                      </span>
                    </td>
                    <td className="py-3 text-right font-medium text-ink">
                      {e.progressPercent}%
                    </td>
                    <td className="py-3 text-right text-ink-muted">
                      {new Date(e.enrolledAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Assigned Courses (if Instructor) */}
      {user.role === "instructor" && (
        <div className="rounded-2xl border border-line bg-surface p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-display text-base font-bold text-ink">
                Assigned Teaching Courses
              </h2>
              <p className="text-xs text-ink-muted mt-0.5">
                Courses this instructor is authorized to edit and manage.
              </p>
            </div>

            <Button asChild variant="outline" size="sm" className="rounded-xl border-line text-xs font-semibold">
              <Link href={`/admin/staff/${user.id}`}>
                <span>Edit Course Assignments</span>
              </Link>
            </Button>
          </div>

          {user.assignedCourses.length === 0 ? (
            <div className="py-8 text-center text-xs text-ink-muted">
              No courses assigned to this instructor yet.
            </div>
          ) : (
            <ul className="divide-y divide-line">
              {user.assignedCourses.map((c, idx) => (
                <li key={idx} className="flex items-center justify-between py-3">
                  <div>
                    <span className="font-semibold text-ink">{c.courseTitle}</span>
                    <p className="text-[11px] font-mono text-ink-muted">/courses/{c.courseSlug}</p>
                  </div>
                  <Button asChild variant="ghost" size="sm" className="text-xs h-7 text-primary">
                    <Link href={`/admin/courses/${c.courseId}`}>Edit Course</Link>
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Permissions Matrix (if Sub-Admin) */}
      {user.role === "sub_admin" && (
        <div className="rounded-2xl border border-line bg-surface p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="flex items-center gap-2">
                <KeyRound className="size-4 text-amber-500" />
                <h2 className="font-display text-base font-bold text-ink">
                  Sub-Admin Staff Permissions
                </h2>
              </div>
              <p className="text-xs text-ink-muted mt-0.5">
                {user.permissions.length} granular administrative permission(s) granted.
              </p>
            </div>

            <Button asChild variant="outline" size="sm" className="rounded-xl border-line text-xs font-semibold">
              <Link href={`/admin/staff/${user.id}`}>
                <span>Edit Permissions</span>
              </Link>
            </Button>
          </div>

          {user.permissions.length === 0 ? (
            <div className="py-6 text-center text-xs text-ink-muted">
              No staff permissions assigned yet.
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {user.permissions.map((p) => (
                <span
                  key={p}
                  className="rounded-lg border border-line bg-surface-elevated px-2.5 py-1 font-mono text-xs font-semibold text-ink"
                >
                  {p}
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Suspend Confirmation Dialog */}
      <Dialog open={isSuspendDialogOpen} onOpenChange={setIsSuspendDialogOpen}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <div className="flex size-10 items-center justify-center rounded-xl bg-rose-500/10 text-rose-500 mb-2">
              <AlertOctagon className="size-5" />
            </div>
            <DialogTitle>Suspend Account: {user.fullName}?</DialogTitle>
            <DialogDescription className="text-xs text-ink-muted leading-relaxed">
              The user will lose access to learner dashboards, private courses, and quiz tools until reactivated.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2 py-2">
            <label className="text-xs font-semibold text-ink">
              Internal Suspension Reason (Optional)
            </label>
            <textarea
              rows={3}
              value={suspensionReason}
              onChange={(e) => setSuspensionReason(e.target.value)}
              placeholder="e.g. Terms of service violation, account misuse..."
              className="w-full rounded-xl border border-line bg-surface-elevated/40 p-3 text-xs text-ink placeholder:text-ink-muted outline-none focus:border-rose-500"
            />
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setIsSuspendDialogOpen(false)}
              className="rounded-xl text-xs"
            >
              Cancel
            </Button>
            <Button
              type="button"
              disabled={isSubmitting}
              onClick={handleSuspendSubmit}
              className="rounded-xl bg-rose-600 font-semibold text-white hover:bg-rose-700 text-xs"
            >
              {isSubmitting ? "Suspending..." : "Confirm Suspension"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reactivate Confirmation Dialog */}
      <Dialog open={isReactivateDialogOpen} onOpenChange={setIsReactivateDialogOpen}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500 mb-2">
              <CheckCircle2 className="size-5" />
            </div>
            <DialogTitle>Reactivate Account: {user.fullName}?</DialogTitle>
            <DialogDescription className="text-xs text-ink-muted leading-relaxed">
              This account will be restored to active status, allowing the user to sign in and resume course learning.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setIsReactivateDialogOpen(false)}
              className="rounded-xl text-xs"
            >
              Cancel
            </Button>
            <Button
              type="button"
              disabled={isSubmitting}
              onClick={handleReactivateSubmit}
              className="rounded-xl bg-emerald-600 font-semibold text-white hover:bg-emerald-700 text-xs"
            >
              {isSubmitting ? "Reactivating..." : "Reactivate Account"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Change Role Dialog */}
      <Dialog open={isRoleDialogOpen} onOpenChange={setIsRoleDialogOpen}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <div className="flex size-10 items-center justify-center rounded-xl bg-purple-500/10 text-purple-500 mb-2">
              <UserCheck className="size-5" />
            </div>
            <DialogTitle>Change Role for {user.fullName}</DialogTitle>
            <DialogDescription className="text-xs text-ink-muted">
              Select the administrative authority level for this account.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-2">
            {[
              { id: "learner", label: "Learner", desc: "Regular student with enrollment and learning features" },
              { id: "instructor", label: "Instructor", desc: "Can manage and edit assigned course curriculums" },
              { id: "sub_admin", label: "Sub-Admin", desc: "Delegated administrative permissions (users, content, QA)" },
            ].map((r) => (
              <label
                key={r.id}
                className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3 text-xs transition ${
                  selectedNewRole === r.id
                    ? "border-primary bg-primary/5"
                    : "border-line hover:border-line-hover"
                }`}
              >
                <input
                  type="radio"
                  name="roleSelection"
                  value={r.id}
                  checked={selectedNewRole === r.id}
                  onChange={(e) => setSelectedNewRole(e.target.value as UserRole)}
                  className="mt-0.5 text-primary"
                />
                <div>
                  <span className="font-semibold text-ink">{r.label}</span>
                  <p className="text-ink-muted mt-0.5">{r.desc}</p>
                </div>
              </label>
            ))}
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setIsRoleDialogOpen(false)}
              className="rounded-xl text-xs"
            >
              Cancel
            </Button>
            <Button
              type="button"
              disabled={isSubmitting}
              onClick={handleRoleChangeSubmit}
              className="rounded-xl bg-primary font-semibold text-white hover:bg-primary/90 text-xs"
            >
              {isSubmitting ? "Saving..." : "Save Role"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
