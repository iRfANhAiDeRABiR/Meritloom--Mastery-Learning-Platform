"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  AlertOctagon,
  Ban,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  EllipsisVertical,
  RotateCcw,
  Search,
  Shield,
  UserCog,
  UserRound,
  Users,
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
import {
  changeUserRoleAction,
  reactivateUserAction,
  suspendUserAction,
} from "@/lib/actions/users";
import type { AdminUserSummary, UserRole } from "@/lib/types/staff";

interface UsersTableViewProps {
  users: AdminUserSummary[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
  searchQuery?: string;
  roleFilter?: string;
  statusFilter?: string;
}

function RoleBadge({ role }: { role: UserRole }) {
  switch (role) {
    case "admin":
      return (
        <span className="inline-flex items-center gap-1 rounded-md bg-purple-500/10 px-2 py-0.5 text-[11px] font-bold text-purple-600 dark:text-purple-400">
          <Shield className="size-3" />
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
    default:
      return (
        <span className="inline-flex items-center rounded-md bg-surface-elevated px-2 py-0.5 text-[11px] font-medium text-ink-muted">
          Learner
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

export function UsersTableView({
  users,
  totalCount,
  currentPage,
  totalPages,
  searchQuery = "",
  roleFilter = "all",
  statusFilter = "all",
}: UsersTableViewProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Local Search Input
  const [search, setSearch] = React.useState(searchQuery);

  // Dialog States
  const [targetUser, setTargetUser] = React.useState<AdminUserSummary | null>(null);
  const [isSuspendDialogOpen, setIsSuspendDialogOpen] = React.useState(false);
  const [suspensionReason, setSuspensionReason] = React.useState("");
  const [isReactivateDialogOpen, setIsReactivateDialogOpen] = React.useState(false);
  const [isRoleDialogOpen, setIsRoleDialogOpen] = React.useState(false);
  const [selectedRole, setSelectedRole] = React.useState<UserRole>("learner");
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const updateFilters = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, val]) => {
      if (val === null || val === "" || val === "all") {
        params.delete(key);
      } else {
        params.set(key, val);
      }
    });
    // Reset page to 1 on filter changes
    if (!updates.page) params.delete("page");
    router.replace(`/admin/users?${params.toString()}`);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilters({ q: search.trim() || null });
  };

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(newPage));
    router.replace(`/admin/users?${params.toString()}`);
  };

  // Actions
  const handleSuspendSubmit = async () => {
    if (!targetUser) return;
    setIsSubmitting(true);
    toast("Suspending user account...", { id: "suspend-user-action" });

    try {
      const res = await suspendUserAction(targetUser.id, suspensionReason);
      if (res.success) {
        toast.success(`Account for ${targetUser.fullName} has been suspended.`, { id: "suspend-user-action" });
        setIsSuspendDialogOpen(false);
        setSuspensionReason("");
        router.refresh();
      } else {
        toast.error(res.error || "Failed to suspend account", { id: "suspend-user-action" });
      }
    } catch {
      toast.error("Failed to suspend account", { id: "suspend-user-action" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReactivateSubmit = async () => {
    if (!targetUser) return;
    setIsSubmitting(true);
    toast("Reactivating user account...", { id: "reactivate-user-action" });

    try {
      const res = await reactivateUserAction(targetUser.id);
      if (res.success) {
        toast.success(`Account for ${targetUser.fullName} is now active.`, { id: "reactivate-user-action" });
        setIsReactivateDialogOpen(false);
        router.refresh();
      } else {
        toast.error(res.error || "Failed to reactivate account", { id: "reactivate-user-action" });
      }
    } catch {
      toast.error("Failed to reactivate account", { id: "reactivate-user-action" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRoleChangeSubmit = async () => {
    if (!targetUser) return;
    setIsSubmitting(true);
    toast("Updating user role...", { id: "role-user-action" });

    try {
      const res = await changeUserRoleAction(targetUser.id, selectedRole);
      if (res.success) {
        toast.success(`Role for ${targetUser.fullName} updated to ${selectedRole}.`, { id: "role-user-action" });
        setIsRoleDialogOpen(false);
        router.refresh();
      } else {
        toast.error(res.error || "Failed to update role", { id: "role-user-action" });
      }
    } catch {
      toast.error("Failed to update role", { id: "role-user-action" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Users className="size-5" />
            </div>
            <h1 className="font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl">
              User Management
            </h1>
          </div>
          <p className="mt-1 text-sm text-ink-muted">
            Inspect learner accounts, monitor progress, manage staff roles, and suspend/reactivate access.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold text-ink-muted">
          <span className="rounded-xl border border-line bg-surface px-3 py-2">
            Total Accounts: <strong className="text-ink">{totalCount}</strong>
          </span>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col gap-3 rounded-2xl border border-line bg-surface p-3 shadow-xs sm:flex-row sm:items-center sm:justify-between">
        {/* Status Segmented Buttons (44px height) */}
        <div
          role="tablist"
          aria-label="User status filter"
          className="flex flex-wrap items-center gap-1.5"
        >
          {[
            { id: "all", label: "All Users" },
            { id: "active", label: "Active" },
            { id: "suspended", label: "Suspended" },
          ].map((tab) => {
            const isActive = statusFilter === tab.id;
            return (
              <button
                key={tab.id}
                role="tab"
                type="button"
                aria-selected={isActive}
                onClick={() => updateFilters({ status: tab.id })}
                className={`flex h-11 min-h-[44px] cursor-pointer items-center rounded-xl px-4 text-xs sm:text-sm font-semibold transition-all duration-150 ${
                  isActive
                    ? "bg-primary/10 text-primary border border-primary/25 shadow-xs font-bold"
                    : "text-ink-muted hover:text-ink hover:bg-surface-elevated/60"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Search & Role Filter */}
        <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center">
          <select
            value={roleFilter}
            onChange={(e) => updateFilters({ role: e.target.value })}
            className="h-11 min-h-[44px] min-w-[150px] cursor-pointer rounded-xl border border-line bg-surface px-3.5 text-xs font-semibold text-ink outline-none focus:border-primary"
          >
            <option value="all">All Roles</option>
            <option value="learner">Learners</option>
            <option value="instructor">Instructors</option>
            <option value="sub_admin">Sub-Admins</option>
            <option value="admin">Admins</option>
          </select>

          <form onSubmit={handleSearchSubmit} className="relative min-w-[240px]">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-ink-muted" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-11 min-h-[44px] w-full rounded-xl border border-line bg-surface pl-10 pr-3.5 text-xs text-ink placeholder:text-ink-muted outline-none focus:border-primary"
            />
          </form>
        </div>
      </div>

      {/* Users Table */}
      <div className="rounded-2xl border border-line bg-surface shadow-xs overflow-x-auto">
        <table className="w-full text-left text-xs text-ink border-collapse">
          <thead>
            <tr className="border-b border-line bg-surface-elevated/40 text-[11px] font-bold uppercase tracking-wider text-ink-muted">
              <th className="py-3.5 pl-5 pr-3">User</th>
              <th className="py-3.5 px-3">Role</th>
              <th className="py-3.5 px-3">Status</th>
              <th className="py-3.5 px-3 text-center">Enrolled</th>
              <th className="py-3.5 px-3 text-center">Completed</th>
              <th className="py-3.5 px-3">Joined</th>
              <th className="py-3.5 pl-3 pr-5 text-center w-20">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {users.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-ink-muted">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Users className="size-8 text-ink-muted/60" />
                    <p className="font-semibold text-sm">No users matched your filters.</p>
                    <p className="text-xs">Try adjusting your search keyword or role filter.</p>
                  </div>
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr
                  key={user.id}
                  className="transition hover:bg-surface-elevated/30"
                >
                  {/* User Profile Cell */}
                  <td className="py-3.5 pl-5 pr-3">
                    <div className="flex items-center gap-3">
                      <Avatar
                        src={user.avatarUrl}
                        name={user.fullName}
                        className="size-9 shrink-0 text-xs font-bold"
                      />
                      <div className="min-w-0">
                        <Link
                          href={`/admin/users/${user.id}`}
                          className="font-display font-bold text-ink hover:text-primary transition truncate block"
                        >
                          {user.fullName}
                        </Link>
                        <span className="text-[11px] text-ink-muted truncate block">
                          {user.email || "No email"}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Role Cell */}
                  <td className="py-3.5 px-3 whitespace-nowrap">
                    <RoleBadge role={user.role} />
                  </td>

                  {/* Status Cell */}
                  <td className="py-3.5 px-3 whitespace-nowrap">
                    <StatusBadge status={user.accountStatus} />
                  </td>

                  {/* Enrolled Courses */}
                  <td className="py-3.5 px-3 text-center font-semibold text-ink">
                    {user.enrolledCoursesCount}
                  </td>

                  {/* Completed Courses */}
                  <td className="py-3.5 px-3 text-center font-semibold text-emerald-600 dark:text-emerald-400">
                    {user.completedCoursesCount}
                  </td>

                  {/* Joined Date */}
                  <td className="py-3.5 px-3 whitespace-nowrap text-ink-muted">
                    {new Date(user.createdAt).toLocaleDateString([], {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </td>

                  {/* Actions Column (40x40px hit area with portaled menu) */}
                  <td className="py-3.5 pl-3 pr-5 text-center">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button
                          type="button"
                          aria-label={`Actions for ${user.fullName}`}
                          className="inline-flex size-10 min-w-10 min-h-10 items-center justify-center rounded-xl text-ink-muted transition hover:bg-surface-elevated hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary cursor-pointer"
                        >
                          <EllipsisVertical className="size-4.5" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" sideOffset={6} className="w-56">
                        <DropdownMenuItem asChild>
                          <Link href={`/admin/users/${user.id}`} className="flex items-center gap-2.5">
                            <UserRound className="size-4 text-ink-muted" />
                            <span>View Full Profile</span>
                          </Link>
                        </DropdownMenuItem>

                        {user.role !== "admin" && (
                          <DropdownMenuItem
                            onSelect={() => {
                              setTargetUser(user);
                              setSelectedRole(user.role);
                              setIsRoleDialogOpen(true);
                            }}
                            className="flex items-center gap-2.5"
                          >
                            <UserCog className="size-4 text-ink-muted" />
                            <span>Change Role</span>
                          </DropdownMenuItem>
                        )}

                        {user.role !== "admin" && (
                          <>
                            <DropdownMenuSeparator />

                            {user.accountStatus === "active" ? (
                              <DropdownMenuItem
                                destructive
                                onSelect={() => {
                                  setTargetUser(user);
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
                                  setTargetUser(user);
                                  setIsReactivateDialogOpen(true);
                                }}
                                className="flex items-center gap-2.5 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10 focus:bg-emerald-500/10 focus:text-emerald-600"
                              >
                                <RotateCcw className="size-4" />
                                <span>Reactivate Account</span>
                              </DropdownMenuItem>
                            )}
                          </>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between rounded-2xl border border-line bg-surface p-3 shadow-xs">
          <p className="text-xs text-ink-muted">
            Showing Page <strong className="text-ink">{currentPage}</strong> of{" "}
            <strong className="text-ink">{totalPages}</strong> ({totalCount} total users)
          </p>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage <= 1}
              onClick={() => handlePageChange(currentPage - 1)}
              className="h-10 min-h-[40px] rounded-xl text-xs gap-1 cursor-pointer"
            >
              <ChevronLeft className="size-4" />
              <span>Previous</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage >= totalPages}
              onClick={() => handlePageChange(currentPage + 1)}
              className="h-10 min-h-[40px] rounded-xl text-xs gap-1 cursor-pointer"
            >
              <span>Next</span>
              <ChevronRight className="size-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Role Change Dialog */}
      <Dialog open={isRoleDialogOpen} onOpenChange={setIsRoleDialogOpen}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary mb-2">
              <UserCog className="size-5" />
            </div>
            <DialogTitle>Change Role for {targetUser?.fullName}</DialogTitle>
            <DialogDescription className="text-xs text-ink-muted leading-relaxed">
              Updating a user&apos;s role changes their platform capabilities and permission access.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-2">
            <label className="text-xs font-semibold text-ink">Select New Role</label>
            <div className="grid grid-cols-1 gap-2">
              {[
                { role: "learner" as UserRole, title: "Learner", desc: "Standard student with course enrollment and progress tracking." },
                { role: "instructor" as UserRole, title: "Instructor", desc: "Can manage and edit assigned courses and curriculums." },
                { role: "sub_admin" as UserRole, title: "Sub-Admin", desc: "Delegated administrator with configurable granular permissions." },
              ].map((item) => (
                <label
                  key={item.role}
                  className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3 transition ${
                    selectedRole === item.role
                      ? "border-primary bg-primary/5 text-ink"
                      : "border-line bg-surface-elevated/20 text-ink-muted hover:border-line-hover"
                  }`}
                >
                  <input
                    type="radio"
                    name="role-select"
                    checked={selectedRole === item.role}
                    onChange={() => setSelectedRole(item.role)}
                    className="mt-0.5 text-primary"
                  />
                  <div>
                    <span className="text-xs font-bold text-ink block">{item.title}</span>
                    <span className="text-[11px] text-ink-muted block mt-0.5">{item.desc}</span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setIsRoleDialogOpen(false)}
              className="h-11 min-h-[44px] rounded-xl text-xs"
            >
              Cancel
            </Button>
            <Button
              type="button"
              disabled={isSubmitting}
              onClick={handleRoleChangeSubmit}
              className="h-11 min-h-[44px] rounded-xl bg-primary font-semibold text-white hover:bg-primary/90 text-xs cursor-pointer"
            >
              {isSubmitting ? "Updating..." : "Update Role"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Suspend Confirmation Dialog */}
      <Dialog open={isSuspendDialogOpen} onOpenChange={setIsSuspendDialogOpen}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <div className="flex size-10 items-center justify-center rounded-xl bg-rose-500/10 text-rose-500 mb-2">
              <AlertOctagon className="size-5" />
            </div>
            <DialogTitle>Suspend Account: {targetUser?.fullName}?</DialogTitle>
            <DialogDescription className="text-xs text-ink-muted leading-relaxed">
              This user will be prevented from accessing learning content, quizzes, and notes until reactivated. Their learning history will remain completely safe and intact.
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
              placeholder="e.g. Terms violation, requested hold..."
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
            <DialogTitle>Reactivate Account: {targetUser?.fullName}?</DialogTitle>
            <DialogDescription className="text-xs text-ink-muted leading-relaxed">
              This account will be restored to active status, allowing the learner to resume all courses, notes, and quiz submissions immediately.
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
              {isSubmitting ? "Reactivating..." : "Reactivate Account"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
