"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  BookOpen,
  KeyRound,
  MoreVertical,
  ShieldCheck,
  UserCheck,
  UserPlus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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

export function StaffListView({
  staffMembers,
  availableCourses,
  activeTab,
}: StaffListViewProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleTabChange = (tab: "all" | "sub_admins" | "instructors") => {
    const params = new URLSearchParams(searchParams.toString());
    if (tab === "all") params.delete("tab");
    else params.set("tab", tab);
    router.replace(`/admin/staff?${params.toString()}`);
  };

  const subAdminCount = staffMembers.filter((s) => s.role === "sub_admin" || s.role === "admin").length;
  const instructorCount = staffMembers.filter((s) => s.role === "instructor").length;

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <ShieldCheck className="size-4.5" />
            </div>
            <h1 className="font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl">
              Staff & Role Management
            </h1>
          </div>
          <p className="mt-1 text-sm text-ink-muted">
            Manage course instructors, configure delegated sub-admin permissions, and invite new staff.
          </p>
        </div>

        <StaffInviteModal availableCourses={availableCourses}>
          <Button className="rounded-xl bg-primary font-semibold text-white shadow-xs hover:bg-primary/90 text-xs">
            <UserPlus className="mr-1.5 size-3.5" />
            <span>Invite Staff</span>
          </Button>
        </StaffInviteModal>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-line pb-3">
        {[
          { id: "all", label: "All Staff", count: staffMembers.length },
          { id: "sub_admins", label: "Sub-Admins", count: subAdminCount },
          { id: "instructors", label: "Instructors", count: instructorCount },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => handleTabChange(tab.id as "all" | "sub_admins" | "instructors")}
            className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-semibold transition ${
              activeTab === tab.id
                ? "bg-surface-elevated text-ink shadow-2xs"
                : "text-ink-muted hover:text-ink"
            }`}
          >
            <span>{tab.label}</span>
            <span className="rounded-md bg-surface px-1.5 py-0.2 text-[10px] font-bold text-ink-muted">
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Staff Grid */}
      {staffMembers.length === 0 ? (
        <div className="rounded-2xl border border-line bg-surface p-12 text-center">
          <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-surface-elevated text-ink-muted mb-3">
            <ShieldCheck className="size-6" />
          </div>
          <h3 className="font-display text-base font-bold text-ink">No staff members found</h3>
          <p className="text-xs text-ink-muted mt-1 max-w-sm mx-auto">
            Invite instructors to author curriculum or sub-admins to assist with user support and content QA.
          </p>
          <div className="mt-4">
            <StaffInviteModal availableCourses={availableCourses}>
              <Button size="sm" className="rounded-xl text-xs font-semibold">
                <UserPlus className="mr-1.5 size-3.5" />
                <span>Invite First Staff Member</span>
              </Button>
            </StaffInviteModal>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {staffMembers.map((staff) => (
            <div
              key={staff.id}
              className="flex flex-col justify-between rounded-2xl border border-line bg-surface p-5 shadow-xs hover:border-line-hover transition"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar
                      src={staff.avatarUrl}
                      name={staff.fullName}
                      className="size-11 text-sm"
                    />
                    <div>
                      <Link
                        href={`/admin/staff/${staff.id}`}
                        className="font-semibold text-ink hover:text-primary transition text-sm"
                      >
                        {staff.fullName}
                      </Link>
                      <div className="flex items-center gap-1.5 mt-1">
                        <RoleBadge role={staff.role} />
                        <span
                          className={`rounded-md px-1.5 py-0.2 text-[10px] font-semibold ${
                            staff.accountStatus === "active"
                              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                              : "bg-rose-500/10 text-rose-600 dark:text-rose-400"
                          }`}
                        >
                          {staff.accountStatus}
                        </span>
                      </div>
                    </div>
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="size-8 p-0 rounded-lg">
                        <MoreVertical className="size-4 text-ink-muted" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-40 rounded-xl text-xs">
                      <DropdownMenuItem asChild>
                        <Link href={`/admin/staff/${staff.id}`}>
                          Manage Staff
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href={`/admin/users/${staff.id}`}>
                          View User Profile
                        </Link>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Subsystem Details Summary */}
                <div className="mt-4 pt-3 border-t border-line space-y-2 text-xs">
                  {staff.role === "instructor" ? (
                    <div className="flex items-start gap-2 text-ink-muted">
                      <BookOpen className="size-3.5 text-blue-500 mt-0.5 shrink-0" />
                      <div>
                        <span className="font-semibold text-ink">
                          {staff.assignedCourses.length} assigned course(s)
                        </span>
                        {staff.assignedCourses.length > 0 && (
                          <p className="text-[11px] text-ink-muted truncate max-w-[220px]">
                            {staff.assignedCourses.map((c) => c.title).join(", ")}
                          </p>
                        )}
                      </div>
                    </div>
                  ) : staff.role === "sub_admin" ? (
                    <div className="flex items-start gap-2 text-ink-muted">
                      <KeyRound className="size-3.5 text-amber-500 mt-0.5 shrink-0" />
                      <div>
                        <span className="font-semibold text-ink">
                          {staff.permissions.length} active permission(s)
                        </span>
                        <p className="text-[11px] text-ink-muted">
                          Delegated Sub-Administrator
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start gap-2 text-ink-muted">
                      <UserCheck className="size-3.5 text-purple-500 mt-0.5 shrink-0" />
                      <div>
                        <span className="font-semibold text-ink">Root Administrator</span>
                        <p className="text-[11px] text-ink-muted">Full Platform Authority</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-line flex items-center justify-between">
                <span className="text-[11px] text-ink-muted">
                  Joined {new Date(staff.createdAt).toLocaleDateString([], { month: "short", year: "numeric" })}
                </span>

                <Button asChild variant="ghost" size="sm" className="h-7 text-xs font-semibold text-primary">
                  <Link href={`/admin/staff/${staff.id}`}>
                    Configure &rarr;
                  </Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
