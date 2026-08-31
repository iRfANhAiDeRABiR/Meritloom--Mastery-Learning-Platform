"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import {
  Clock,
  Eye,
  FileEdit,
  Plus,
  Search,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CourseCover } from "@/components/courses/course-cover";
import type { AdminCourseListItem, Category } from "@/lib/types";

interface AdminCoursesTableProps {
  courses: AdminCourseListItem[];
  categories: Category[];
}

export function AdminCoursesTable({ courses, categories }: AdminCoursesTableProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [searchQuery, setSearchQuery] = React.useState(searchParams.get("q") || "");
  const selectedStatus = searchParams.get("status") || "all";
  const selectedCategory = searchParams.get("category") || "all";

  const handleFilterChange = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== "all") {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.replace(`${pathname}?${params.toString()}`);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleFilterChange("q", searchQuery);
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl">
            Courses
          </h1>
          <p className="mt-1 text-sm text-ink-muted">
            Manage course curriculum, video playlists, and publication state.
          </p>
        </div>
        <Button asChild className="rounded-xl bg-primary px-4 py-2 font-semibold text-white shadow-sm hover:bg-primary/90">
          <Link href="/admin/courses/new">
            <Plus className="mr-1.5 h-4 w-4" />
            <span>New Course</span>
          </Link>
        </Button>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-col gap-3 rounded-2xl border border-line bg-surface p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by title or slug..."
            className="h-10 w-full rounded-xl border border-line bg-surface-elevated pl-9 pr-8 text-sm text-ink placeholder:text-ink-muted focus:border-primary focus:outline-none"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                handleFilterChange("q", "");
              }}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-ink-muted hover:text-ink"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </form>

        <div className="flex flex-wrap items-center gap-2">
          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => handleFilterChange("status", e.target.value)}
            className="h-10 rounded-xl border border-line bg-surface-elevated px-3 text-xs font-semibold text-ink focus:border-primary focus:outline-none"
          >
            <option value="all">All Status</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => handleFilterChange("category", e.target.value)}
            className="h-10 rounded-xl border border-line bg-surface-elevated px-3 text-xs font-semibold text-ink focus:border-primary focus:outline-none"
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Courses List */}
      <div className="overflow-hidden rounded-2xl border border-line bg-surface shadow-sm">
        {courses.length === 0 ? (
          <div className="py-16 text-center text-sm text-ink-muted">
            No courses found matching criteria.
          </div>
        ) : (
          <div className="divide-y divide-line">
            {courses.map((course) => (
              <div
                key={course.id}
                className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between transition hover:bg-surface-elevated/40"
              >
                <div className="flex items-start gap-4">
                  <div className="h-16 w-24 shrink-0 overflow-hidden rounded-xl border border-line shadow-sm">
                    <CourseCover src={course.coverImageUrl} title={course.title} categorySlug={course.categorySlug} className="h-full w-full" />
                  </div>

                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <Link
                        href={`/admin/courses/${course.id}`}
                        className="font-display text-base font-bold text-ink hover:text-primary transition"
                      >
                        {course.title}
                      </Link>
                      {course.isPublished ? (
                        <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 text-[10px]">
                          Published
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[10px]">
                          Draft
                        </Badge>
                      )}
                    </div>

                    <p className="text-xs text-ink-muted line-clamp-1">
                      {course.summary || `/${course.slug}`}
                    </p>

                    <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-ink-muted">
                      {course.categoryName && (
                        <span className="font-semibold text-ink">{course.categoryName}</span>
                      )}
                      <span>•</span>
                      <span className="capitalize">{course.difficulty}</span>
                      <span>•</span>
                      <span>{course.moduleCount} modules</span>
                      <span>•</span>
                      <span>{course.lessonCount} lessons</span>
                      <span>•</span>
                      <span className="inline-flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {new Date(course.updatedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                  <Button asChild variant="outline" size="sm" className="rounded-xl border-line text-xs font-semibold">
                    <Link href={`/admin/courses/${course.id}/preview`}>
                      <Eye className="mr-1.5 h-3.5 w-3.5 text-ink-muted" />
                      <span>Preview</span>
                    </Link>
                  </Button>
                  <Button asChild size="sm" className="rounded-xl bg-primary text-xs font-semibold text-white hover:bg-primary/90">
                    <Link href={`/admin/courses/${course.id}`}>
                      <FileEdit className="mr-1.5 h-3.5 w-3.5" />
                      <span>Manage</span>
                    </Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
