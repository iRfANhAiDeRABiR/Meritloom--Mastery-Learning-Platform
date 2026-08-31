"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowRight,
  BookOpen,
  Bookmark,
  Compass,
  Filter,
  Search,
  StickyNote,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { LessonNoteCard } from "@/components/notes/lesson-note-card";
import { BookmarkedLessonCard } from "@/components/notes/bookmarked-lesson-card";
import type {
  LearnerLessonBookmarkItem,
  LearnerLessonNoteItem,
  MyNotesPageData,
} from "@/lib/types";

interface MyNotesViewProps {
  data: MyNotesPageData;
}

export function MyNotesView({ data }: MyNotesViewProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentView = searchParams.get("view") === "bookmarked" ? "bookmarked" : "notes";
  const [activeTab, setActiveTab] = React.useState<"notes" | "bookmarked">(currentView);
  const [searchQuery, setSearchQuery] = React.useState(searchParams.get("q") || "");
  const [selectedCourseSlug, setSelectedCourseSlug] = React.useState<string>("all");
  const [sortBy, setSortBy] = React.useState<"recent" | "title">("recent");

  const [bookmarksState, setBookmarksState] = React.useState<LearnerLessonBookmarkItem[]>(
    data.bookmarks,
  );

  const handleTabChange = (tab: "notes" | "bookmarked") => {
    setActiveTab(tab);
    const params = new URLSearchParams(searchParams.toString());
    if (tab === "bookmarked") {
      params.set("view", "bookmarked");
    } else {
      params.delete("view");
    }
    router.push(`/learn/notes?${params.toString()}`);
  };

  const handleRemoveBookmark = (lessonId: string) => {
    setBookmarksState((prev) => prev.filter((b) => b.lessonId !== lessonId));
  };

  // Filter Notes
  const filteredNotes = React.useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return data.notes.filter((n) => {
      const matchesSearch =
        !q ||
        n.content.toLowerCase().includes(q) ||
        n.lessonTitle.toLowerCase().includes(q) ||
        n.courseTitle.toLowerCase().includes(q) ||
        n.moduleTitle.toLowerCase().includes(q);

      const matchesCourse = selectedCourseSlug === "all" || n.courseSlug === selectedCourseSlug;

      return matchesSearch && matchesCourse;
    });
  }, [data.notes, searchQuery, selectedCourseSlug]);

  // Filter Bookmarks
  const filteredBookmarks = React.useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return bookmarksState.filter((b) => {
      const matchesSearch =
        !q ||
        b.lessonTitle.toLowerCase().includes(q) ||
        b.courseTitle.toLowerCase().includes(q) ||
        b.moduleTitle.toLowerCase().includes(q);

      const matchesCourse = selectedCourseSlug === "all" || b.courseSlug === selectedCourseSlug;

      return matchesSearch && matchesCourse;
    });
  }, [bookmarksState, searchQuery, selectedCourseSlug]);

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl">
            My notes & bookmarks
          </h1>
          <p className="mt-1 text-sm text-ink-muted">
            Review private study notes and bookmarked lessons from across your courses.
          </p>
        </div>

        <Button asChild className="rounded-xl bg-primary px-4 py-2 font-semibold text-white shadow-sm hover:bg-primary/90">
          <Link href="/learn/courses">
            <BookOpen className="mr-1.5 h-4 w-4" />
            <span>Continue learning</span>
          </Link>
        </Button>
      </div>

      {/* Tabs & Filters Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Tab Switcher */}
        <div className="flex items-center gap-1 rounded-2xl border border-line bg-surface p-1">
          <button
            type="button"
            onClick={() => handleTabChange("notes")}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition ${
              activeTab === "notes"
                ? "bg-primary text-white shadow-sm shadow-primary/25"
                : "text-ink-muted hover:text-ink"
            }`}
          >
            <StickyNote className="h-3.5 w-3.5" />
            <span>All notes</span>
            <span
              className={`rounded-full px-1.5 py-0.2 text-[10px] font-extrabold ${
                activeTab === "notes" ? "bg-white/20 text-white" : "bg-surface-elevated text-ink-muted"
              }`}
            >
              {data.notes.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => handleTabChange("bookmarked")}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition ${
              activeTab === "bookmarked"
                ? "bg-primary text-white shadow-sm shadow-primary/25"
                : "text-ink-muted hover:text-ink"
            }`}
          >
            <Bookmark className="h-3.5 w-3.5" />
            <span>Bookmarked</span>
            <span
              className={`rounded-full px-1.5 py-0.2 text-[10px] font-extrabold ${
                activeTab === "bookmarked" ? "bg-white/20 text-white" : "bg-surface-elevated text-ink-muted"
              }`}
            >
              {bookmarksState.length}
            </span>
          </button>
        </div>

        {/* Search & Course Filter */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-ink-muted" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={activeTab === "notes" ? "Search your notes..." : "Search bookmarks..."}
              className="h-10 w-full rounded-xl border border-line bg-surface pl-9 pr-3 text-xs text-ink placeholder:text-ink-muted focus:border-primary focus:outline-none"
            />
          </div>

          {data.availableCourses.length > 1 && (
            <select
              value={selectedCourseSlug}
              onChange={(e) => setSelectedCourseSlug(e.target.value)}
              className="h-10 rounded-xl border border-line bg-surface px-3 text-xs font-semibold text-ink focus:border-primary focus:outline-none"
            >
              <option value="all">All courses</option>
              {data.availableCourses.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.title}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      {/* Main Grid View */}
      {activeTab === "notes" ? (
        filteredNotes.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-line bg-surface p-12 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <StickyNote className="h-6 w-6" />
            </div>
            <h3 className="mt-4 font-display text-lg font-bold text-ink">
              {searchQuery ? "No matching notes found" : "Your notes will appear here"}
            </h3>
            <p className="mt-1.5 max-w-sm text-xs text-ink-muted">
              {searchQuery
                ? "Try searching for a different keyword or filter by all courses."
                : "Write notes while learning and Meritloom will keep them organized by lesson."}
            </p>
            {!searchQuery && (
              <Button asChild size="sm" className="mt-6 rounded-xl bg-primary text-xs font-semibold text-white">
                <Link href="/courses">
                  <Compass className="mr-1.5 h-3.5 w-3.5" />
                  <span>Explore courses</span>
                </Link>
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {filteredNotes.map((note) => (
              <LessonNoteCard key={note.id} note={note} />
            ))}
          </div>
        )
      ) : (
        filteredBookmarks.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-line bg-surface p-12 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Bookmark className="h-6 w-6" />
            </div>
            <h3 className="mt-4 font-display text-lg font-bold text-ink">
              {searchQuery ? "No matching bookmarks found" : "No bookmarked lessons yet"}
            </h3>
            <p className="mt-1.5 max-w-sm text-xs text-ink-muted">
              {searchQuery
                ? "Try searching for a different lesson title or course name."
                : "Bookmark important lessons so you can return to them quickly."}
            </p>
            {!searchQuery && (
              <Button asChild size="sm" className="mt-6 rounded-xl bg-primary text-xs font-semibold text-white">
                <Link href="/learn/courses">
                  <BookOpen className="mr-1.5 h-3.5 w-3.5" />
                  <span>Go to My Learning</span>
                </Link>
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {filteredBookmarks.map((bookmark) => (
              <BookmarkedLessonCard
                key={bookmark.id}
                bookmark={bookmark}
                onRemove={handleRemoveBookmark}
              />
            ))}
          </div>
        )
      )}
    </div>
  );
}
