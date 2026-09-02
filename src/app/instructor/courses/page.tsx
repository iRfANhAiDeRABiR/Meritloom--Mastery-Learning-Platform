import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, GraduationCap } from "lucide-react";

import { InstructorCourseCard } from "@/components/instructor/instructor-course-card";
import { requireInstructorSession } from "@/lib/auth/rbac";
import { getInstructorCourses } from "@/lib/queries/instructor";
import { routes } from "@/lib/routes";

export const metadata: Metadata = {
  title: "My Courses | Instructor Studio | Meritloom",
  robots: {
    index: false,
    follow: false,
  },
};

export const dynamic = "force-dynamic";

export default async function InstructorCoursesPage() {
  const session = await requireInstructorSession();
  const courses = await getInstructorCourses(session.user.id);

  return (
    <div className="flex flex-col gap-8 pb-12">
      {/* Top Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-line/60 pb-6">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <Link
              href="/instructor"
              className="grid size-8 place-items-center rounded-lg border border-line bg-card text-muted hover:text-ink hover:border-primary/40 transition-colors"
              title="Return to Instructor Overview"
            >
              <ArrowLeft className="size-4" />
            </Link>
            <h1 className="text-2xl font-bold tracking-tight text-ink sm:text-3xl">
              My Assigned Courses
            </h1>
          </div>
          <p className="text-sm text-muted">
            All courses assigned to your instructor profile for curriculum authoring and assessment management.
          </p>
        </div>
      </div>

      {/* Course List */}
      {courses.length === 0 ? (
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
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <InstructorCourseCard key={course.id} course={course} />
          ))}
        </div>
      )}
    </div>
  );
}

