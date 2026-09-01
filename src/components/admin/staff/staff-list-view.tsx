"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  AlertOctagon,
  ArrowRight,
  Ban,
  BookOpen,
  CheckCircle2,
  EllipsisVertical,
  KeyRound,
  Settings2,
  ShieldCheck,
  UserCheck,
  UserPlus,
  UserRound,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { reactivateUserAction, suspendUserAction } from "@/lib/actions/users";
import { StaffInviteModal } from "./staff-invite-modal";
import type { StaffMemberListItem } from "@/lib/types/staff";

interface StaffListViewProps {
  staffMembers: StaffMemberListItem[];
  availableCourses: {
    id: string;
    title: string;
    slug: string;
  }[];
  activeTab: "all" | "sub_admins" | "instructors";
}

function RoleBadge({ role }: { role: "instructor" | "sub_admin" | "admin" }) {
  switch (role) {
    case "admin":
      return (
        <span className="inline-flex items-center rounded-md bg-purple-500/10 px-2 py-0.5 text-[11px] font-bold text-purple-600 dark:text-purple-400">
          Admin
        </span>
      );
    case "sub_admin":
      return (
        <span className="inline-flex items-center rounded-md bg-amber-500/10 px-2 py-0.5 text-[11px] font-bold text-amber-600 dark:text-amber-400">
          Sub-Admin
        </span>
      );
    case "instructor":
      return (
        <span className="inline-flex items-center rounded-md bg-blue-500/10 px-2 py-0.5 text-[11px] font-bold text-blue-600 dark:text-blue-400">
          Instructor
        </span>
      );
  }
}

function StatusBadge({ status }: { status: "active" | "suspended" }) {
  if (status === "suspended") {
    return (
      <span className="inline-flex items-center gap-1 rounded-md bg-rose-500/10 px-2 py-0.5 text-[11px] font-bold text-rose-600 dark:text-rose-400">
        <span className="size-1.5 rounded-full bg-rose-500" />
        Suspended
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 rounded-md bg-emerald-500/10 px-2 py-0.5 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
      <span className="size-1.5 rounded-full bg-emerald-500" />
      Active
    </span>
  );
}

export function StaffListView({
  staffMembers,
  availableCourses,
  activeTab,
}: StaffListViewProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Dialog States
  const [targetStaff, setTargetStaff] = React.useState<StaffMemberListItem | null>(null);
  const [isSuspendDialogOpen, setIsSuspendDialogOpen] = React.useState(false);
  const [suspensionReason, setSuspensionReason] = React.useState("");
  const [isReactivateDialogOpen, setIsReactivateDialogOpen] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleTabChange = (tab: "all" | "sub_admins" | "instructors") => {
    const params = new URLSearchParams(searchParams.toString());
    if (tab === "all") params.delete("tab");
    else params.set("tab", tab);
    router.replace(`/admin/staff?${params.toString()}`);
  };

  const handleSuspendSubmit = async () => {
    if (!targetStaff) return;
    setIsSubmitting(true);
    toast("Suspending staff account...", { id: "suspend-staff-action" });

    try {
      const res = await suspendUserAction(targetStaff.id, suspensionReason);
      if (res.success) {
        toast.success(`Account for ${targetStaff.fullName} has been suspended.`, { id: "suspend-staff-action" });
        setIsSuspendDialogOpen(false);
        setSuspensionReason("");
        router.refresh();
      } else {
        toast.error(res.error || "Failed to suspend staff account", { id: "suspend-staff-action" });
      }
    } catch {
      toast.error("Failed to suspend staff account", { id: "suspend-staff-action" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReactivateSubmit = async () => {
    if (!targetStaff) return;
    setIsSubmitting(true);
    toast("Reactivating staff account...", { id: "reactivate-staff-action" });

    try {
      const res = await reactivateUserAction(targetStaff.id);
      if (res.success) {
        toast.success(`Account for ${targetStaff.fullName} is now active.`, { id: "reactivate-staff-action" });
        setIsReactivateDialogOpen(false);
        router.refresh();
      } else {
        toast.error(res.error || "Failed to reactivate staff account", { id: "reactivate-staff-action" });
      }
    } catch {
      toast.error("Failed to reactivate staff account", { id: "reactivate-staff-action" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const subAdminCount = staffMembers.filter((s) => s.role === "sub_admin" || s.role === "admin").length;
  const instructorCount = staffMembers.filter((s) => s.role === "instructor").length;

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <ShieldCheck className="size-5" />
            </div>
            <h1 className="font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl">
              Staff & Role Management
            </h1>
          </div>
          <p className="mt-1 text-sm text-ink-muted">
            Manage course instructors, configure delegated sub-admin permissions, and invite team members.
          </p>
        </div>

        <StaffInviteModal availableCourses={availableCourses}>
          <Button className="h-11 min-h-[44px] rounded-xl bg-primary px-5 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-primary/90 cursor-pointer">
            <UserPlus className="mr-2 size-4.5" />
            <span>Invite Staff</span>
          </Button>
        </StaffInviteModal>
      </div>

      {/* Segmented Navigation Tabs */}
      <div
        role="tablist"
        aria-label="Staff roles filter"
        className="flex flex-wrap items-center gap-2 rounded-2xl border border-line bg-surface p-1.5 shadow-xs"
      >
        {[
          { id: "all", label: "All Staff", count: staffMembers.length },
          { id: "sub_admins", label: "Sub-Admins", count: subAdminCount },
          { id: "instructors", label: "Instructors", count: instructorCount },
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              role="tab"
              type="button"
              aria-selected={isActive}
              onClick={() => handleTabChange(tab.id as "all" | "sub_admins" | "instructors")}
              className={`flex h-11 min-h-[44px] cursor-pointer items-center gap-2.5 rounded-xl px-4 sm:px-5 text-xs sm:text-sm font-semibold transition-all duration-150 ${
                isActive
                  ? "bg-primary/10 text-primary border border-primary/25 shadow-xs font-bold"
                  : "text-ink-muted hover:text-ink hover:bg-surface-elevated/60"
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[11px] font-bold ${
                  isActive
                    ? "bg-primary text-white"
                    : "bg-surface-elevated text-ink-muted"
                }`}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Staff Cards Grid */}
      {staffMembers.length === 0 ? (
        <div className="rounded-2xl border border-line bg-surface p-12 text-center shadow-xs">
          <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-surface-elevated text-ink-muted mb-3">
            <ShieldCheck className="size-6" />
          </div>
          <h3 className="font-display text-base font-bold text-ink">No staff members found</h3>
          <p className="text-xs text-ink-muted mt-1 max-w-sm mx-auto">
            Invite instructors to author curriculum or sub-admins to assist with user support and content QA.
          </p>
          <div className="mt-4">
            <StaffInviteModal availableCourses={availableCourses}>
              <Button size="sm" className="h-10 min-h-[40px] rounded-xl text-xs font-semibold px-4 cursor-pointer">
                <UserPlus className="mr-1.5 size-4" />
                <span>Invite First Staff Member</span>
              </Button>
            </StaffInviteModal>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {staffMembers.map((staff) => (
            <div
              key={staff.id}
              className="flex flex-col justify-between rounded-2xl border border-line bg-surface p-5 shadow-xs transition hover:border-line-hover"
            >
              <div>
                {/* Card Header: Avatar, Name, Badges & Action Menu */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <Avatar
                      src={staff.avatarUrl}
                      name={staff.fullName}
                      className="size-12 shrink-0 text-sm font-bold"
                    />
                    <div className="min-w-0">
                      <Link
                        href={`/admin/staff/${staff.id}`}
                        className="font-display font-bold text-ink hover:text-primary transition text-sm sm:text-base truncate block"
                      >
                        {staff.fullName}
                      </Link>
                      <div className="flex flex-wrap items-center gap-1.5 mt-1">
                        <RoleBadge role={staff.role} />
                        <StatusBadge status={staff.accountStatus} />
                      </div>
                    </div>
                  </div>

                  {/* Three-dot Action Menu (40x40px hit area) */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button
                        type="button"
                        aria-label={`Staff actions for ${staff.fullName}`}
                        className="flex size-10 min-w-10 min-h-10 items-center justify-center rounded-xl text-ink-muted transition hover:bg-surface-elevated hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary cursor-pointer"
                      >
                        <EllipsisVertical className="size-4.5" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" sideOffset={6} className="w-56">
                      <DropdownMenuItem asChild>
                        <Link href={`/admin/users/${staff.id}`} className="flex items-center gap-2.5">
                          <UserRound className="size-4 text-ink-muted" />
                          <span>View User Profile</span>
                        </Link>
                      </DropdownMenuItem>

                      <DropdownMenuItem asChild>
                        <Link href={`/admin/staff/${staff.id}`} className="flex items-center gap-2.5">
                          <Settings2 className="size-4 text-ink-muted" />
                          <span>Configure Staff</span>
                        </Link>
                      </DropdownMenuItem>

                      {staff.role !== "admin" && (
                        <>
                          <DropdownMenuSeparator />

                          {staff.accountStatus === "active" ? (
                            <DropdownMenuItem
                              destructive
                              onSelect={() => {
                                setTargetStaff(staff);
                                setIsSuspendDialogOpen(true);
                              }}
                              className="flex items-center gap-2.5"
                            >
                              <Ban className="size-4" />
                              <span>Suspend Account</span>
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem
                              onSelect={() => {
                                setTargetStaff(staff);
                                setIsReactivateDialogOpen(true);
                              }}
                              className="flex items-center gap-2.5 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10 focus:bg-emerald-500/10 focus:text-emerald-600"
                            >
                              <CheckCircle2 className="size-4" />
                              <span>Reactivate Account</span>
                            </DropdownMenuItem>
                          )}
                        </>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Divider */}
                <div className="my-4 h-px bg-line" />

                {/* Role Details Summary */}
                <div className="space-y-2 text-xs">
                  {staff.role === "instructor" ? (
                    <div className="flex items-start gap-2.5 text-ink-muted">
                      <BookOpen className="size-4 text-blue-500 mt-0.5 shrink-0" />
                      <div>
                        <span className="font-semibold text-ink">
                          {staff.assignedCourses.length} assigned course(s)
                        </span>
                        {staff.assignedCourses.length > 0 ? (
                          <p className="text-[11px] text-ink-muted mt-0.5 line-clamp-2">
                            {staff.assignedCourses.map((c) => c.title).join(", ")}
                          </p>
                        ) : (
                          <p className="text-[11px] text-ink-muted/80 mt-0.5">
                            No courses assigned yet
                          </p>
                        )}
                      </div>
                    </div>
                  ) : staff.role === "sub_admin" ? (
                    <div className="flex items-start gap-2.5 text-ink-muted">
                      <KeyRound className="size-4 text-amber-500 mt-0.5 shrink-0" />
                      <div>
                        <span className="font-semibold text-ink">
                          {staff.permissions.length} active permission(s)
                        </span>
                        <p className="text-[11px] text-ink-muted mt-0.5">
                          Delegated Sub-Administrator
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start gap-2.5 text-ink-muted">
                      <UserCheck className="size-4 text-purple-500 mt-0.5 shrink-0" />
                      <div>
                        <span className="font-semibold text-ink">Root Administrator</span>
                        <p className="text-[11px] text-ink-muted mt-0.5">Full Platform Authority</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Card Footer: Joined Date & Configure Action Button */}
              <div>
                <div className="my-4 h-px bg-line" />

                <div className="flex items-center justify-between">
                  <span className="text-xs text-ink-muted">
                    Joined {new Date(staff.createdAt).toLocaleDateString([], { month: "short", year: "numeric" })}
                  </span>

                  <Button
                    asChild
                    variant="ghost"
                    size="sm"
                    className="h-10 min-h-[40px] rounded-xl px-3.5 text-xs font-semibold text-primary hover:bg-primary/10 hover:text-primary transition cursor-pointer"
                  >
                    <Link href={`/admin/staff/${staff.id}`} className="flex items-center gap-1.5">
                      <span>Configure</span>
                      <ArrowRight className="size-3.5" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Suspend Confirmation Dialog */}
      <Dialog open={isSuspendDialogOpen} onOpenChange={setIsSuspendDialogOpen}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <div className="flex size-10 items-center justify-center rounded-xl bg-rose-500/10 text-rose-500 mb-2">
              <AlertOctagon className="size-5" />
            </div>
            <DialogTitle>Suspend Staff Account: {targetStaff?.fullName}?</DialogTitle>
            <DialogDescription className="text-xs text-ink-muted leading-relaxed">
              This staff member will immediately lose access to curriculum editing, permissions, and learner dashboards. Their role configuration and course assignments will remain preserved for future reactivation.
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
              placeholder="e.g. Policy violation, temporary leave..."
              className="w-full rounded-xl border border-line bg-surface-elevated/40 p-3 text-xs text-ink placeholder:text-ink-muted outline-none focus:border-rose-500"
            />
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setIsSuspendDialogOpen(false)}
              className="h-11 min-h-[44px] rounded-xl text-xs"
            >
              Cancel
            </Button>
            <Button
              type="button"
              disabled={isSubmitting}
              onClick={handleSuspendSubmit}
              className="h-11 min-h-[44px] rounded-xl bg-rose-600 font-semibold text-white hover:bg-rose-700 text-xs cursor-pointer"
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
            <DialogTitle>Reactivate Staff Account: {targetStaff?.fullName}?</DialogTitle>
            <DialogDescription className="text-xs text-ink-muted leading-relaxed">
              This account will be restored to active status, restoring their previous staff permissions and course authoring capabilities.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setIsReactivateDialogOpen(false)}
              className="h-11 min-h-[44px] rounded-xl text-xs"
            >
              Cancel
            </Button>
            <Button
              type="button"
              disabled={isSubmitting}
              onClick={handleReactivateSubmit}
              className="h-11 min-h-[44px] rounded-xl bg-emerald-600 font-semibold text-white hover:bg-emerald-700 text-xs cursor-pointer"
            >
              {isSubmitting ? "Reactivating..." : "Reactivate Staff Account"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
