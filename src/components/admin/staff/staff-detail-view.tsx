"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  BookOpen,
  KeyRound,
  Shield,
  UserMinus,
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
import {
  assignInstructorCoursesAction,
  changeUserRoleAction,
  updateStaffPermissionsAction,
} from "@/lib/actions/users";
import {
  ALL_STAFF_PERMISSIONS,
  PERMISSION_PRESETS,
  type AdminUserDetail,
  type StaffPermission,
} from "@/lib/types/staff";

interface StaffDetailViewProps {
  staff: AdminUserDetail;
  availableCourses: {
    id: string;
    title: string;
    slug: string;
    isPublished: boolean;
  }[];
}

export function StaffDetailView({ staff, availableCourses }: StaffDetailViewProps) {
  const router = useRouter();

  // Course Assignments state
  const [assignedCourseIds, setAssignedCourseIds] = React.useState<string[]>(
    staff.assignedCourses.map((c) => c.courseId),
  );
  const [isSavingCourses, setIsSavingCourses] = React.useState(false);

  // Sub-Admin Permissions state
  const [selectedPermissions, setSelectedPermissions] = React.useState<StaffPermission[]>(
    staff.permissions,
  );
  const [selectedPreset, setSelectedPreset] = React.useState<string>("custom");
  const [isSavingPermissions, setIsSavingPermissions] = React.useState(false);

  // Remove Staff Access Dialog
  const [isRemoveStaffDialogOpen, setIsRemoveStaffDialogOpen] = React.useState(false);
  const [isDemoting, setIsDemoting] = React.useState(false);

  const handleToggleCourse = (courseId: string) => {
    setAssignedCourseIds((prev) =>
      prev.includes(courseId) ? prev.filter((id) => id !== courseId) : [...prev, courseId],
    );
  };

  const handleSaveCourses = async () => {
    setIsSavingCourses(true);
    toast("Saving course assignments...", { id: "save-courses-action" });

    try {
      const res = await assignInstructorCoursesAction(staff.id, assignedCourseIds);
      if (res.success) {
        toast.success("Instructor course assignments saved.", { id: "save-courses-action" });
        router.refresh();
      } else {
        toast.error(res.error || "Failed to save assignments", { id: "save-courses-action" });
      }
    } catch {
      toast.error("Failed to save assignments", { id: "save-courses-action" });
    } finally {
      setIsSavingCourses(false);
    }
  };

  const handlePresetSelect = (presetKey: string) => {
    setSelectedPreset(presetKey);
    if (presetKey !== "custom" && PERMISSION_PRESETS[presetKey]) {
      setSelectedPermissions(PERMISSION_PRESETS[presetKey].permissions);
    }
  };

  const handleTogglePermission = (permId: StaffPermission) => {
    setSelectedPreset("custom");
    setSelectedPermissions((prev) =>
      prev.includes(permId) ? prev.filter((p) => p !== permId) : [...prev, permId],
    );
  };

  const handleSavePermissions = async () => {
    setIsSavingPermissions(true);
    toast("Saving staff permissions...", { id: "save-perms-action" });

    try {
      const res = await updateStaffPermissionsAction(staff.id, selectedPermissions);
      if (res.success) {
        toast.success("Sub-admin permissions updated.", { id: "save-perms-action" });
        router.refresh();
      } else {
        toast.error(res.error || "Failed to update permissions", { id: "save-perms-action" });
      }
    } catch {
      toast.error("Failed to update permissions", { id: "save-perms-action" });
    } finally {
      setIsSavingPermissions(false);
    }
  };

  const handleRemoveStaffAccess = async () => {
    setIsDemoting(true);
    toast("Removing staff privileges...", { id: "demote-action" });

    try {
      const res = await changeUserRoleAction(staff.id, "learner");
      if (res.success) {
        toast.success(`${staff.fullName} is now a regular learner.`, { id: "demote-action" });
        setIsRemoveStaffDialogOpen(false);
        router.push("/admin/staff");
      } else {
        toast.error(res.error || "Failed to remove staff access", { id: "demote-action" });
      }
    } catch {
      toast.error("Failed to remove staff access", { id: "demote-action" });
    } finally {
      setIsDemoting(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      {/* Back Link */}
      <div>
        <Button asChild variant="ghost" size="sm" className="rounded-xl text-xs text-ink-muted">
          <Link href="/admin/staff">
            <ArrowLeft className="mr-1.5 size-3.5" />
            <span>Back to Staff List</span>
          </Link>
        </Button>
      </div>

      {/* Staff Header Card */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-line bg-surface p-6 shadow-xs">
        <div className="flex items-center gap-4">
          <Avatar
            src={staff.avatarUrl}
            name={staff.fullName}
            className="size-16 text-lg"
          />
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="font-display text-xl font-bold text-ink sm:text-2xl">
                {staff.fullName}
              </h1>
              <span className="rounded-md bg-purple-500/10 px-2 py-0.5 text-xs font-bold text-purple-600 dark:text-purple-400 capitalize">
                {staff.role}
              </span>
              <span
                className={`rounded-md px-2 py-0.5 text-xs font-semibold ${
                  staff.accountStatus === "active"
                    ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                    : "bg-rose-500/10 text-rose-600 dark:text-rose-400"
                }`}
              >
                {staff.accountStatus}
              </span>
            </div>
            <p className="mt-1 text-xs text-ink-muted">
              Staff member since{" "}
              {new Date(staff.createdAt).toLocaleDateString([], {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </p>
          </div>
        </div>

        {staff.role !== "admin" && (
          <div className="flex items-center gap-2">
            <Button
              onClick={() => setIsRemoveStaffDialogOpen(true)}
              variant="outline"
              className="h-11 min-h-[44px] rounded-xl border-rose-500/30 px-4 text-xs font-semibold text-rose-600 hover:bg-rose-500/10 shadow-xs cursor-pointer"
            >
              <UserMinus className="mr-1.5 size-4" />
              <span>Remove Staff Access</span>
            </Button>
          </div>
        )}
      </div>

      {/* Course Assignments Configuration (for Instructors) */}
      {staff.role === "instructor" && (
        <div className="rounded-2xl border border-line bg-surface p-6 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-line pb-4">
            <div>
              <div className="flex items-center gap-2">
                <BookOpen className="size-4 text-blue-500" />
                <h2 className="font-display text-base font-bold text-ink">
                  Assigned Teaching Courses
                </h2>
              </div>
              <p className="text-xs text-ink-muted mt-0.5">
                Instructors are granted curriculum editing permissions exclusively for assigned courses.
              </p>
            </div>

            <Button
              disabled={isSavingCourses}
              onClick={handleSaveCourses}
              className="h-11 min-h-[44px] rounded-xl bg-primary px-5 font-semibold text-white hover:bg-primary/90 text-xs shadow-xs cursor-pointer"
            >
              {isSavingCourses ? "Saving..." : "Save Course Assignments"}
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {availableCourses.map((c) => {
              const isChecked = assignedCourseIds.includes(c.id);
              return (
                <label
                  key={c.id}
                  className={`flex cursor-pointer items-start justify-between rounded-xl border p-3.5 text-xs transition ${
                    isChecked
                      ? "border-primary bg-primary/5 text-ink shadow-2xs"
                      : "border-line text-ink-muted hover:border-line-hover"
                  }`}
                >
                  <div className="flex-1 pr-2">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-ink">{c.title}</span>
                      {c.isPublished ? (
                        <span className="rounded bg-emerald-500/10 px-1.5 py-0.2 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                          Published
                        </span>
                      ) : (
                        <span className="rounded bg-amber-500/10 px-1.5 py-0.2 text-[10px] font-bold text-amber-600 dark:text-amber-400">
                          Draft
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] font-mono text-ink-muted mt-0.5">
                      /courses/{c.slug}
                    </p>
                  </div>

                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => handleToggleCourse(c.id)}
                    className="mt-0.5 rounded border-line text-primary focus:ring-0"
                  />
                </label>
              );
            })}
          </div>
        </div>
      )}

      {/* Sub-Admin Permissions Configuration */}
      {staff.role === "sub_admin" && (
        <div className="rounded-2xl border border-line bg-surface p-6 shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-line pb-4">
            <div>
              <div className="flex items-center gap-2">
                <KeyRound className="size-4 text-amber-500" />
                <h2 className="font-display text-base font-bold text-ink">
                  Delegated Sub-Admin Permissions
                </h2>
              </div>
              <p className="text-xs text-ink-muted mt-0.5">
                Grant explicit capabilities. Sensitive permissions require explicit selection.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <select
                value={selectedPreset}
                onChange={(e) => handlePresetSelect(e.target.value)}
                className="h-11 min-h-[44px] cursor-pointer rounded-xl border border-line bg-surface px-3.5 text-xs font-semibold text-ink shadow-xs outline-none focus:border-primary"
              >
                <option value="content_manager">Preset: Content Manager</option>
                <option value="user_support">Preset: User Support</option>
                <option value="content_and_users">Preset: Content + Users</option>
                <option value="full_sub_admin">Preset: Full Sub-Admin</option>
                <option value="custom">Custom Permissions</option>
              </select>

              <Button
                disabled={isSavingPermissions}
                onClick={handleSavePermissions}
                className="h-11 min-h-[44px] rounded-xl bg-primary px-5 font-semibold text-white hover:bg-primary/90 text-xs shadow-xs cursor-pointer"
              >
                {isSavingPermissions ? "Saving..." : "Save Permissions"}
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {ALL_STAFF_PERMISSIONS.map((perm) => {
              const isChecked = selectedPermissions.includes(perm.id);
              return (
                <label
                  key={perm.id}
                  className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3.5 text-xs transition ${
                    isChecked
                      ? "border-primary bg-primary/5 text-ink shadow-2xs"
                      : "border-line text-ink-muted hover:border-line-hover"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => handleTogglePermission(perm.id)}
                    className="mt-0.5 rounded border-line text-primary focus:ring-0"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 font-semibold">
                      <span>{perm.label}</span>
                      {perm.isSensitive && (
                        <span className="rounded bg-rose-500/10 px-1.5 py-0.2 text-[10px] font-bold text-rose-500">
                          Sensitive
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-ink-muted mt-0.5">{perm.description}</p>
                    <p className="text-[10px] font-mono text-ink-muted/80 mt-1">{perm.id}</p>
                  </div>
                </label>
              );
            })}
          </div>
        </div>
      )}

      {/* Root Admin Info Banner */}
      {staff.role === "admin" && (
        <div className="rounded-2xl border border-purple-500/30 bg-purple-500/5 p-6 text-center">
          <Shield className="mx-auto size-8 text-purple-600 mb-2" />
          <h3 className="font-display text-base font-bold text-ink">Root Administrator</h3>
          <p className="text-xs text-ink-muted max-w-md mx-auto mt-1">
            This account possesses root administrative authority across all platform systems, content, users, and security settings.
          </p>
        </div>
      )}

      {/* Remove Staff Dialog */}
      <Dialog open={isRemoveStaffDialogOpen} onOpenChange={setIsRemoveStaffDialogOpen}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <div className="flex size-10 items-center justify-center rounded-xl bg-rose-500/10 text-rose-500 mb-2">
              <UserMinus className="size-5" />
            </div>
            <DialogTitle>Remove Staff Access for {staff.fullName}?</DialogTitle>
            <DialogDescription className="text-xs text-ink-muted leading-relaxed">
              This will convert the user back to a regular Learner. They will lose access to instructor tools and administrative dashboards, while keeping their personal enrollment and learning history intact.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setIsRemoveStaffDialogOpen(false)}
              className="h-11 min-h-[44px] rounded-xl text-xs"
            >
              Cancel
            </Button>
            <Button
              type="button"
              disabled={isDemoting}
              onClick={handleRemoveStaffAccess}
              className="h-11 min-h-[44px] rounded-xl bg-rose-600 font-semibold text-white hover:bg-rose-700 text-xs cursor-pointer"
            >
              {isDemoting ? "Removing..." : "Confirm Remove Staff Access"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
