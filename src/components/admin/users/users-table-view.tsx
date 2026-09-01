"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  AlertOctagon,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  Search,
  Shield,
  UserCheck,
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
import { changeUserRoleAction, reactivateUserAction, suspendUserAction } from "@/lib/actions/users";
import type { AdminUserSummary, UserRole } from "@/lib/types/staff";

interface UsersTableViewProps {
  initialUsers: AdminUserSummary[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
}

function RoleBadge({ role }: { role: UserRole }) {
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
    default:
      return (
        <span className="inline-flex items-center rounded-md bg-surface-elevated px-2 py-0.5 text-[11px] font-semibold text-ink-muted">
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
  initialUsers,
  totalCount,
  currentPage,
  totalPages,
}: UsersTableViewProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [searchQuery, setSearchQuery] = React.useState(searchParams.get("q") || "");
  const [selectedRole, setSelectedRole] = React.useState(searchParams.get("role") || "all");
  const [selectedStatus, setSelectedStatus] = React.useState(searchParams.get("status") || "all");

  // Dialog States
  const [targetUser, setTargetUser] = React.useState<AdminUserSummary | null>(null);
  const [isSuspendDialogOpen, setIsSuspendDialogOpen] = React.useState(false);
  const [suspensionReason, setSuspensionReason] = React.useState("");
  const [isReactivateDialogOpen, setIsReactivateDialogOpen] = React.useState(false);
  const [isRoleDialogOpen, setIsRoleDialogOpen] = React.useState(false);
  const [selectedNewRole, setSelectedNewRole] = React.useState<UserRole>("learner");
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const applyFilters = (newParams: { q?: string; role?: string; status?: string; page?: number }) => {
    const params = new URLSearchParams(searchParams.toString());
    if (newParams.q !== undefined) {
      if (newParams.q) params.set("q", newParams.q);
      else params.delete("q");
    }
    if (newParams.role !== undefined) {
      if (newParams.role !== "all") params.set("role", newParams.role);
      else params.delete("role");
    }
    if (newParams.status !== undefined) {
      if (newParams.status !== "all") params.set("status", newParams.status);
      else params.delete("status");
    }
    if (newParams.page !== undefined) {
      if (newParams.page > 1) params.set("page", String(newParams.page));
      else params.delete("page");
    } else {
      params.delete("page"); // Reset page on filter change
    }

    router.replace(`/admin/users?${params.toString()}`);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    applyFilters({ q: searchQuery });
  };

  const handleSuspendSubmit = async () => {
    if (!targetUser) return;
    setIsSubmitting(true);
    toast("Suspending account...", { id: "suspend-action" });

    try {
      const res = await suspendUserAction(targetUser.id, suspensionReason);
      if (res.success) {
        toast.success(`Account for ${targetUser.fullName} has been suspended.`, { id: "suspend-action" });
        setIsSuspendDialogOpen(false);
        setSuspensionReason("");
        router.refresh();
      } else {
        toast.error(res.error || "Failed to suspend user", { id: "suspend-action" });
      }
    } catch {
      toast.error("Failed to suspend user", { id: "suspend-action" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReactivateSubmit = async () => {
    if (!targetUser) return;
    setIsSubmitting(true);
    toast("Reactivating account...", { id: "reactivate-action" });

    try {
      const res = await reactivateUserAction(targetUser.id);
      if (res.success) {
        toast.success(`Account for ${targetUser.fullName} is now active.`, { id: "reactivate-action" });
        setIsReactivateDialogOpen(false);
        router.refresh();
      } else {
        toast.error(res.error || "Failed to reactivate user", { id: "reactivate-action" });
      }
    } catch {
      toast.error("Failed to reactivate user", { id: "reactivate-action" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRoleChangeSubmit = async () => {
    if (!targetUser) return;
    setIsSubmitting(true);
    toast("Updating role...", { id: "role-action" });

    try {
      const res = await changeUserRoleAction(targetUser.id, selectedNewRole);
      if (res.success) {
        toast.success(`Role for ${targetUser.fullName} updated to ${selectedNewRole}.`, { id: "role-action" });
        setIsRoleDialogOpen(false);
        router.refresh();
      } else {
        toast.error(res.error || "Failed to change user role", { id: "role-action" });
      }
    } catch {
      toast.error("Failed to change user role", { id: "role-action" });
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
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Users className="size-4.5" />
            </div>
            <h1 className="font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl">
              User Management
            </h1>
          </div>
          <p className="mt-1 text-sm text-ink-muted">
            Inspect learner accounts, assign roles, enforce policy suspensions, and view learning progress.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button asChild variant="outline" className="rounded-xl border-line text-xs font-semibold">
            <Link href="/admin/staff">
              <Shield className="mr-1.5 size-3.5 text-primary" />
              <span>Manage Staff</span>
            </Link>
          </Button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-line bg-surface p-4 shadow-xs">
        {/* Status Pills */}
        <div className="flex items-center gap-1 rounded-xl bg-surface-elevated p-1">
          {[
            { id: "all", label: "All Users" },
            { id: "active", label: "Active" },
            { id: "suspended", label: "Suspended" },
          ].map((st) => (
            <button
              key={st.id}
              type="button"
              onClick={() => {
                setSelectedStatus(st.id);
                applyFilters({ status: st.id });
              }}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                selectedStatus === st.id
                  ? "bg-surface text-ink shadow-xs"
                  : "text-ink-muted hover:text-ink"
              }`}
            >
              {st.label}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Role Filter */}
          <div className="flex items-center gap-1.5 rounded-xl border border-line bg-surface px-2.5 py-1.5 text-xs text-ink-muted shadow-xs">
            <span>Role:</span>
            <select
              value={selectedRole}
              onChange={(e) => {
                setSelectedRole(e.target.value);
                applyFilters({ role: e.target.value });
              }}
              className="bg-transparent font-semibold text-ink outline-none cursor-pointer"
            >
              <option value="all">All Roles</option>
              <option value="learner">Learner</option>
              <option value="instructor">Instructor</option>
              <option value="sub_admin">Sub-Admin</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          {/* Search Form */}
          <form onSubmit={handleSearchSubmit} className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-ink-muted" />
            <input
              type="search"
              placeholder="Search by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-line bg-surface-elevated/60 pl-8 pr-3 py-1.5 text-xs text-ink placeholder:text-ink-muted outline-none focus:border-primary"
            />
          </form>
        </div>
      </div>

      {/* Users Table */}
      <div className="rounded-2xl border border-line bg-surface shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-line bg-surface-elevated/40 text-ink-muted font-semibold">
                <th className="py-3 px-5 font-medium">User</th>
                <th className="py-3 px-4 font-medium">Role</th>
                <th className="py-3 px-4 font-medium">Account Status</th>
                <th className="py-3 px-4 font-medium text-right">Enrolled</th>
                <th className="py-3 px-4 font-medium text-right">Completed</th>
                <th className="py-3 px-4 font-medium text-right">Joined</th>
                <th className="py-3 px-5 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {initialUsers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-ink-muted">
                    No users found matching your search criteria.
                  </td>
                </tr>
              ) : (
                initialUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-surface-elevated/30 transition">
                    <td className="py-3.5 px-5">
                      <div className="flex items-center gap-3">
                        <Avatar
                          src={user.avatarUrl}
                          name={user.fullName}
                          className="size-8 text-[11px]"
                        />
                        <div>
                          <Link
                            href={`/admin/users/${user.id}`}
                            className="font-semibold text-ink hover:text-primary transition"
                          >
                            {user.fullName}
                          </Link>
                          {user.role === "instructor" && user.assignedCoursesCount > 0 && (
                            <p className="text-[11px] text-ink-muted">
                              {user.assignedCoursesCount} assigned course(s)
                            </p>
                          )}
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <RoleBadge role={user.role} />
                    </td>

                    <td className="py-3.5 px-4">
                      <StatusBadge status={user.accountStatus} />
                    </td>

                    <td className="py-3.5 px-4 text-right font-medium text-ink">
                      {user.enrolledCoursesCount}
                    </td>

                    <td className="py-3.5 px-4 text-right font-medium text-ink">
                      {user.completedCoursesCount}
                    </td>

                    <td className="py-3.5 px-4 text-right text-ink-muted">
                      {new Date(user.createdAt).toLocaleDateString([], {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </td>

                    <td className="py-3.5 px-5 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="size-8 p-0 rounded-lg">
                            <MoreVertical className="size-4 text-ink-muted" />
                            <span className="sr-only">Actions</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-44 rounded-xl text-xs">
                          <DropdownMenuItem asChild>
                            <Link href={`/admin/users/${user.id}`}>
                              View Full Profile
                            </Link>
                          </DropdownMenuItem>

                          {user.role !== "admin" && (
                            <>
                              <DropdownMenuItem
                                onClick={() => {
                                  setTargetUser(user);
                                  setSelectedNewRole(user.role);
                                  setIsRoleDialogOpen(true);
                                }}
                              >
                                Change Role
                              </DropdownMenuItem>

                              <DropdownMenuSeparator />

                              {user.accountStatus === "active" ? (
                                <DropdownMenuItem
                                  onClick={() => {
                                    setTargetUser(user);
                                    setIsSuspendDialogOpen(true);
                                  }}
                                  className="text-rose-600 focus:text-rose-600"
                                >
                                  Suspend Account
                                </DropdownMenuItem>
                              ) : (
                                <DropdownMenuItem
                                  onClick={() => {
                                    setTargetUser(user);
                                    setIsReactivateDialogOpen(true);
                                  }}
                                  className="text-emerald-600 focus:text-emerald-600"
                                >
                                  Reactivate Account
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

        {/* Pagination Bar */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-line px-5 py-3 text-xs text-ink-muted">
            <span>
              Showing Page <strong className="text-ink">{currentPage}</strong> of{" "}
              <strong className="text-ink">{totalPages}</strong> ({totalCount} total accounts)
            </span>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage <= 1}
                onClick={() => applyFilters({ page: currentPage - 1 })}
                className="h-8 rounded-lg border-line px-2 text-xs"
              >
                <ChevronLeft className="size-3.5 mr-1" />
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage >= totalPages}
                onClick={() => applyFilters({ page: currentPage + 1 })}
                className="h-8 rounded-lg border-line px-2 text-xs"
              >
                Next
                <ChevronRight className="size-3.5 ml-1" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Suspend Confirmation Dialog */}
      <Dialog open={isSuspendDialogOpen} onOpenChange={setIsSuspendDialogOpen}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <div className="flex size-10 items-center justify-center rounded-xl bg-rose-500/10 text-rose-500 mb-2">
              <AlertOctagon className="size-5" />
            </div>
            <DialogTitle>Suspend Account: {targetUser?.fullName}?</DialogTitle>
            <DialogDescription className="text-xs text-ink-muted leading-relaxed">
              The user will be immediately blocked from accessing private learner courses, quizzes, and notes until reactivated. Existing learning progress is preserved.
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
              placeholder="e.g. Terms of service violation, repeated abuse..."
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
            <DialogTitle>Reactivate Account: {targetUser?.fullName}?</DialogTitle>
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
            <DialogTitle>Change Role for {targetUser?.fullName}</DialogTitle>
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
