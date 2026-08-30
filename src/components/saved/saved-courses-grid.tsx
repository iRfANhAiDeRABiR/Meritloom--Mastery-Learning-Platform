"use client";

import * as React from "react";
import { useRouter } from "next/navigation";

import { SavedCourseCard } from "@/components/saved/saved-course-card";
import { SavedCoursesEmptyState } from "@/components/saved/saved-courses-empty-state";
import { SavedCoursesFilters } from "@/components/saved/saved-courses-filters";
import { SavedCoursesHeader } from "@/components/saved/saved-courses-header";
import { SavedRecommendations } from "@/components/saved/saved-recommendations";
import type { SavedCoursesPageData } from "@/lib/types";

interface SavedCoursesGridProps {
  data: SavedCoursesPageData;
}

export function SavedCoursesGrid({ data }: SavedCoursesGridProps) {
  const router = useRouter();
  const {
    courses: initialCourses,
    totalSavedCount,
    categories,
    recommendations,
    query,
    selectedCategory,
    selectedDifficulty,
  } = data;

  const [removedCourseIds, setRemovedCourseIds] = React.useState<string[]>([]);

  const handleRemoveOptimistic = (courseId: string) => {
    setRemovedCourseIds((prev) => [...prev, courseId]);
  };

  const courses = initialCourses.filter((c) => !removedCourseIds.includes(c.courseId));

  const handleClearFilters = () => {
    router.replace("/learn/saved");
  };

  const hasSearchOrFilters = Boolean(
    query || (selectedCategory && selectedCategory !== "all") || (selectedDifficulty && selectedDifficulty !== "all"),
  );

  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col gap-8 pb-16">
      {/* 1. Header */}
      <SavedCoursesHeader />

      {/* 2. Filters & Search */}
      <SavedCoursesFilters
        categories={categories}
        totalResults={courses.length}
      />

      {/* 3. Course Grid or Empty State */}
      {courses.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <SavedCourseCard
              key={course.id}
              course={course}
              onRemoveOptimistic={handleRemoveOptimistic}
            />
          ))}
        </div>
      ) : (
        <SavedCoursesEmptyState
          isSearchEmpty={hasSearchOrFilters && totalSavedCount > 0}
          onClearFilters={handleClearFilters}
        />
      )}

      {/* 4. Recommendations at bottom */}
      <SavedRecommendations recommendations={recommendations} />
    </div>
  );
}
