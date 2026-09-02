import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  BookCheck,
  BookOpen,
  CheckCircle2,
  Clock,
  FileEdit,
  GraduationCap,
  History,
  Sparkles,
} from "lucide-react";

import { InstructorCourseCard } from "@/components/instructor/instructor-course-card";
import { routes } from "@/lib/routes";
import type { InstructorDashboardData } from "@/lib/types/instructor";

interface InstructorDashboardViewProps {
  data: InstructorDashboardData;
}

function formatRelativeTime(isoString: string): string {
  try {
    const date = new Date(isoString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) {
      if (now.getDate() === date.getDate()) {
        return `Today, ${date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}`;
      }
      return "Yesterday";
    }
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;

    return date.toLocaleDateString([], { month: "short", day: "numeric" });
  } catch {
    return "Recently";
  }
}

export function InstructorDashboardView({ data }: InstructorDashboardViewProps) {
  const { user, metrics, assignedCourses, needsAttention, recentActivity } = data;
  const firstName = user.name.trim().split(/\s+/)[0] || "Instructor";

  return (
    <div className="flex flex-col gap-8 sm:gap-10 pb-12">
      {/* 1. Welcome Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-line/60 pb-6">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-ink sm:text-3xl">
              Welcome back, {firstName}
            </h1>
            <span className="rounded-md bg-cyan-500/10 border border-cyan-500/25 px-2 py-0.5 text-xs font-bold text-cyan-400">
              Instructor Studio
            </span>
          </div>
          <p className="text-sm text-muted">
            Manage your assigned courses and keep learning content ready for learners.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Link
            href="/instructor/courses"
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-xs font-bold text-white shadow-soft transition-all hover:bg-primary-hover hover:-translate-y-0.5 cursor-pointer"
          >
            <BookOpen className="size-4" aria-hidden="true" />
            <span>View my courses</span>
          </Link>
        </div>
      </div>

      {/* 2. Top Summary Metric Cards */}
      <section aria-label="Course summary metrics" className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {/* Assigned Courses */}
        <div className="flex flex-col justify-between rounded-card border border-line bg-card p-5 shadow-soft">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-muted">
              Assigned Courses
            </span>
            <span className="flex size-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <BookOpen className="size-4" aria-hidden="true" />
            </span>
          </div>
          <div className="pt-3">
            <span className="text-2xl sm:text-3xl font-bold tracking-tight text-ink">
              {metrics.assignedCoursesCount}
            </span>
          </div>
        </div>

        {/* Published Courses */}
        <div className="flex flex-col justify-between rounded-card border border-line bg-card p-5 shadow-soft">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-muted">
              Published
            </span>
            <span className="flex size-7 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
              <BookCheck className="size-4" aria-hidden="true" />
            </span>
          </div>
          <div className="pt-3">
            <span className="text-2xl sm:text-3xl font-bold tracking-tight text-ink">
              {metrics.publishedCoursesCount}
            </span>
          </div>
        </div>

        {/* Draft Lessons */}
        <div className="flex flex-col justify-between rounded-card border border-line bg-card p-5 shadow-soft">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-muted">
              Draft Lessons
            </span>
            <span className="flex size-7 items-center justify-center rounded-lg bg-amber-500/10 text-amber-400">
              <FileEdit className="size-4" aria-hidden="true" />
            </span>
          </div>
          <div className="pt-3">
            <span className="text-2xl sm:text-3xl font-bold tracking-tight text-ink">
              {metrics.draftLessonsCount}
            </span>
          </div>
        </div>

        {/* Quality Issues */}
        <div className="flex flex-col justify-between rounded-card border border-line bg-card p-5 shadow-soft">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-muted">
              Quality Warnings
            </span>
            <span className="flex size-7 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-400">
              <Sparkles className="size-4" aria-hidden="true" />
            </span>
          </div>
          <div className="pt-3">
            <span className="text-2xl sm:text-3xl font-bold tracking-tight text-ink">
              {metrics.qualityIssuesCount}
            </span>
          </div>
        </div>
      </section>

      {/* 3. Main Section: My Courses */}
      {assignedCourses.length === 0 ? (
        <section aria-label="Assigned courses" className="flex flex-col gap-4">
          <h2 className="text-lg font-bold tracking-tight text-ink sm:text-xl">
            My courses
          </h2>
          <div className="flex flex-col items-center justify-center gap-3.5 rounded-container border border-dashed border-line bg-card/60 p-8 text-center sm:p-12">
            <span className="grid size-12 place-items-center rounded-2xl bg-surface text-primary border border-line">
              <GraduationCap className="size-6" aria-hidden="true" />
            </span>
            <div className="flex flex-col gap-1 max-w-sm">
              <h3 className="text-base font-bold text-ink">
                No courses assigned yet
              </h3>
              <p className="text-xs text-muted leading-relaxed">
                An administrator can assign courses to your instructor account. Once assigned, you will be able to author lessons and quizzes here.
              </p>
            </div>
            <Link
              href={routes.learn}
              className="inline-flex items-center gap-2 rounded-xl bg-surface border border-line px-4 py-2 text-xs font-bold text-ink hover:text-primary hover:border-primary/40 transition-all cursor-pointer"
            >
              <span>Go to Learner Home</span>
              <ArrowRight className="size-3.5" aria-hidden="true" />
            </Link>
          </div>
        </section>
      ) : (
        <section aria-label="Assigned courses" className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-baseline gap-2">
              <h2 className="text-lg font-bold tracking-tight text-ink sm:text-xl">
                My courses
              </h2>
              <span className="text-xs font-medium text-muted">
                ({assignedCourses.length} assigned)
              </span>
            </div>

            <Link
              href="/instructor/courses"
              className="group flex items-center gap-1.5 text-xs font-bold text-primary hover:underline cursor-pointer"
            >
              <span>View all</span>
              <ArrowRight
                className="size-3.5 transition-transform group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </Link>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {assignedCourses.map((course) => (
              <InstructorCourseCard key={course.id} course={course} />
            ))}
          </div>
        </section>
      )}

      {/* 4. Two-Column Row: Needs Attention + Recent Activity */}
      {assignedCourses.length > 0 && (
        <section aria-label="Attention and Activity" className="grid gap-6 lg:grid-cols-2 items-stretch">
          {/* Needs Attention Card */}
          <div className="flex h-full flex-col justify-between rounded-card border border-line bg-card p-5 sm:p-6 shadow-soft">
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-amber-500">
                  <AlertTriangle className="size-3.5 text-amber-500" aria-hidden="true" />
                  Needs Attention
                </span>
                <span className="text-[10px] font-semibold text-muted">
                  Assigned content checks
                </span>
              </div>

              {needsAttention.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-line bg-surface/40 p-6 text-center">
                  <CheckCircle2 className="size-5 text-emerald-500" aria-hidden="true" />
                  <p className="text-xs text-muted font-medium">
                    All assigned content is in good health with no critical warnings.
                  </p>
                </div>
              ) : (
                <div className="flex flex-col gap-2.5">
                  {needsAttention.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-start justify-between gap-3 rounded-xl border border-line/60 bg-surface/50 p-3 text-xs transition-colors hover:bg-surface"
                    >
                      <div className="flex items-start gap-2.5 min-w-0">
                        <span className="mt-0.5 shrink-0">
                          {item.severity === "critical" ? (
                            <span className="flex size-5 items-center justify-center rounded-md bg-rose-500/15 text-rose-500">
                              <AlertTriangle className="size-3" />
                            </span>
                          ) : item.severity === "warning" ? (
                            <span className="flex size-5 items-center justify-center rounded-md bg-amber-500/15 text-amber-400">
                              <AlertTriangle className="size-3" />
                            </span>
                          ) : (
                            <span className="flex size-5 items-center justify-center rounded-md bg-cyan-500/15 text-cyan-400">
                              <Sparkles className="size-3" />
                            </span>
                          )}
                        </span>

                        <div className="flex flex-col gap-0.5 min-w-0">
                          <span className="font-semibold text-ink leading-snug">
                            {item.message}
                          </span>
                          <span className="text-[11px] text-muted truncate">
                            {item.courseTitle}
                          </span>
                        </div>
                      </div>

                      <Link
                        href={`/instructor/courses/${item.courseId}`}
                        className="shrink-0 rounded-lg border border-line bg-card px-2.5 py-1 text-[11px] font-semibold text-ink hover:text-primary hover:border-primary/40 transition-colors"
                      >
                        Edit
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="border-t border-line/60 pt-3 mt-4">
              <Link
                href="/instructor/quality"
                className="group inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline cursor-pointer"
              >
                <span>Review all content quality issues</span>
                <ArrowRight
                  className="size-3.5 transition-transform duration-200 group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
              </Link>
            </div>
          </div>

          {/* Recent Activity Card */}
          <div className="flex h-full flex-col justify-between rounded-card border border-line bg-card p-5 sm:p-6 shadow-soft">
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-muted">
                  <History className="size-3.5 text-primary" aria-hidden="true" />
                  Recent Content Activity
                </span>
                <span className="text-[10px] font-semibold text-muted">
                  Audited changes
                </span>
              </div>

              {recentActivity.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-line bg-surface/40 p-6 text-center">
                  <Clock className="size-5 text-muted/60" aria-hidden="true" />
                  <p className="text-xs text-muted font-medium">
                    Your recent content updates will appear here automatically.
                  </p>
                </div>
              ) : (
                <div className="flex flex-col gap-2.5">
                  {recentActivity.map((act) => (
                    <div
                      key={act.id}
                      className="flex items-center justify-between gap-3 rounded-xl border border-line/60 bg-surface/50 p-3 text-xs transition-colors hover:bg-surface"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="flex size-6 items-center justify-center rounded-lg bg-primary/10 text-primary shrink-0">
                          <FileEdit className="size-3" />
                        </span>
                        <div className="flex flex-col min-w-0">
                          <span className="font-bold text-ink truncate">
                            {act.targetTitle}
                          </span>
                          <span className="text-[11px] text-muted capitalize truncate">
                            {act.action.replace(/_/g, " ")} · {act.targetType}
                          </span>
                        </div>
                      </div>

                      <span className="shrink-0 text-[10px] font-medium text-muted">
                        {formatRelativeTime(act.createdAt)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="border-t border-line/60 pt-3 mt-4">
              <span className="text-[11px] text-muted">
                Audit records are preserved automatically.
              </span>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

