"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  Award,
  BookOpen,
  CheckCircle2,
  GraduationCap,
  HelpCircle,
  Search,
  Shield,
  ShieldAlert,
  User,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { updateLearnerRoleAction } from "@/lib/actions/admin";
import { notify } from "@/lib/notifications/toast";
import type { AdminLearnerListItem } from "@/lib/types";

interface LearnersViewProps {
  initialLearners: AdminLearnerListItem[];
  searchQuery: string;
  selectedRole: string;
}

export function LearnersView({
  initialLearners,
  searchQuery,
  selectedRole,
}: LearnersViewProps) {
  const router = useRouter();
  const [learners, setLearners] = React.useState<AdminLearnerListItem[]>(initialLearners);
  const [prevInitial, setPrevInitial] = React.useState(initialLearners);

  if (prevInitial !== initialLearners) {
    setPrevInitial(initialLearners);
    setLearners(initialLearners);
  }

  const [q, setQ] = React.useState(searchQuery);
  const [roleFilter, setRoleFilter] = React.useState(selectedRole);
  const [isUpdating, setIsUpdating] = React.useState<string | null>(null);

  const applyFilters = (newQ = q, newRole = roleFilter) => {
    const params = new URLSearchParams();
    if (newQ.trim()) params.set("q", newQ.trim());
    if (newRole !== "all") params.set("role", newRole);
    router.push(`/admin/learners?${params.toString()}`);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    applyFilters(q, roleFilter);
  };

  const handleRoleToggle = async (learner: AdminLearnerListItem) => {
    const targetRole = learner.role === "admin" ? "learner" : "admin";
    const confirmMsg =
      targetRole === "admin"
        ? `Grant administrator privileges to ${learner.fullName || "this user"}?`
        : `Revoke administrator privileges from ${learner.fullName || "this user"}?`;

    if (!window.confirm(confirmMsg)) return;

    setIsUpdating(learner.id);
    try {
      const res = await updateLearnerRoleAction(learner.id, targetRole);
      if (res.success) {
        setLearners((prev) =>
          prev.map((l) => (l.id === learner.id ? { ...l, role: targetRole } : l)),
        );
        notify.success({ title: `Role updated to ${targetRole}` });
      } else {
        notify.error({ title: res.error || "Failed to update role" });
      }
    } finally {
      setIsUpdating(null);
    }
  };

  const totalEnrollments = learners.reduce((acc, l) => acc + l.enrollmentCount, 0);
  const totalCompletedLessons = learners.reduce((acc, l) => acc + l.completedLessonsCount, 0);
  const totalQuizAttempts = learners.reduce((acc, l) => acc + l.quizAttemptsCount, 0);

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl">
            Learners & Platform Users
          </h1>
          <p className="mt-1 text-sm text-ink-muted">
            Monitor registered accounts, course enrollments, lesson completions, and quiz engagement.
          </p>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-2xl border border-line bg-surface p-5 shadow-sm">
          <div className="flex items-center gap-2 text-xs font-semibold text-ink-muted">
            <Users className="h-4 w-4 text-primary" />
            <span>Total Registered</span>
          </div>
          <div className="mt-2 font-display text-3xl font-bold text-ink">
            {learners.length}
          </div>
        </div>

        <div className="rounded-2xl border border-line bg-surface p-5 shadow-sm">
          <div className="flex items-center gap-2 text-xs font-semibold text-ink-muted">
            <GraduationCap className="h-4 w-4 text-blue-500" />
            <span>Course Enrollments</span>
          </div>
          <div className="mt-2 font-display text-3xl font-bold text-ink">
            {totalEnrollments}
          </div>
        </div>

        <div className="rounded-2xl border border-line bg-surface p-5 shadow-sm">
          <div className="flex items-center gap-2 text-xs font-semibold text-ink-muted">
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            <span>Lessons Completed</span>
          </div>
          <div className="mt-2 font-display text-3xl font-bold text-ink">
            {totalCompletedLessons}
          </div>
        </div>

        <div className="rounded-2xl border border-line bg-surface p-5 shadow-sm">
          <div className="flex items-center gap-2 text-xs font-semibold text-ink-muted">
            <Award className="h-4 w-4 text-amber-500" />
            <span>Quiz Attempts</span>
          </div>
          <div className="mt-2 font-display text-3xl font-bold text-ink">
            {totalQuizAttempts}
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col gap-3 rounded-2xl border border-line bg-surface p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <form onSubmit={handleSearchSubmit} className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" />
          <input
            type="text"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by learner name..."
            className="h-10 w-full rounded-xl border border-line bg-surface-elevated pl-10 pr-4 text-xs text-ink placeholder:text-ink-muted focus:border-primary focus:outline-none"
          />
        </form>

        <div className="flex items-center gap-2">
          <select
            value={roleFilter}
            onChange={(e) => {
              setRoleFilter(e.target.value);
              applyFilters(q, e.target.value);
            }}
            className="h-10 rounded-xl border border-line bg-surface-elevated px-3 text-xs font-medium text-ink focus:border-primary focus:outline-none"
          >
            <option value="all">All Roles</option>
            <option value="learner">Learners Only</option>
            <option value="admin">Administrators</option>
          </select>
        </div>
      </div>

      {/* Learners Table */}
      <div className="overflow-hidden rounded-2xl border border-line bg-surface shadow-sm">
        {learners.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center">
            <Users className="h-12 w-12 text-ink-muted opacity-40" />
            <h3 className="mt-3 font-display text-base font-bold text-ink">No Learners Found</h3>
            <p className="mt-1 text-xs text-ink-muted">
              No learner records matched your filter or search query.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-line bg-surface-elevated/50 font-bold uppercase tracking-wider text-ink-muted">
                <tr>
                  <th className="px-5 py-3.5">Learner Profile</th>
                  <th className="px-5 py-3.5">Role</th>
                  <th className="px-5 py-3.5 text-center">Enrolled Courses</th>
                  <th className="px-5 py-3.5 text-center">Completed Lessons</th>
                  <th className="px-5 py-3.5 text-center">Quiz Attempts</th>
                  <th className="px-5 py-3.5">Registered</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {learners.map((learner) => (
                  <tr key={learner.id} className="transition hover:bg-surface-elevated/40">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 font-bold text-primary">
                          {learner.fullName
                            ? learner.fullName.slice(0, 2).toUpperCase()
                            : "U"}
                        </div>
                        <div>
                          <p className="font-semibold text-sm text-ink">
                            {learner.fullName || "Anonymous Learner"}
                          </p>
                          <p className="font-mono text-[11px] text-ink-muted">
                            ID: {learner.id.slice(0, 8)}...
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      {learner.role === "admin" ? (
                        <Badge className="border-primary/20 bg-primary/10 text-primary text-[11px] font-bold">
                          <Shield className="mr-1 h-3 w-3" />
                          Admin
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="border-line text-ink-muted text-[11px]">
                          Learner
                        </Badge>
                      )}
                    </td>

                    <td className="px-5 py-4 text-center">
                      <span className="font-semibold text-ink">{learner.enrollmentCount}</span>
                      {learner.enrolledCourseTitles.length > 0 && (
                        <p className="mt-0.5 max-w-[180px] truncate text-[10px] text-ink-muted mx-auto" title={learner.enrolledCourseTitles.join(", ")}>
                          {learner.enrolledCourseTitles.join(", ")}
                        </p>
                      )}
                    </td>

                    <td className="px-5 py-4 text-center">
                      <span className="font-semibold text-ink">{learner.completedLessonsCount}</span>
                    </td>

                    <td className="px-5 py-4 text-center">
                      <span className="font-semibold text-ink">{learner.quizAttemptsCount}</span>
                    </td>

                    <td className="px-5 py-4 text-ink-muted">
                      {new Date(learner.createdAt).toLocaleDateString()}
                    </td>

                    <td className="px-5 py-4 text-right">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        disabled={isUpdating === learner.id}
                        onClick={() => handleRoleToggle(learner)}
                        className="rounded-xl border-line text-[11px] font-semibold text-ink-muted hover:text-ink"
                      >
                        {learner.role === "admin" ? "Demote to Learner" : "Make Admin"}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

