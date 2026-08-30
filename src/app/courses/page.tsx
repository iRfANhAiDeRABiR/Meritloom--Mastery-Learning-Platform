import type { Metadata } from "next";
import { CatalogControls } from "@/components/courses/catalog-controls";
import { CatalogPagination } from "@/components/courses/catalog-pagination";
import { CategoryFilterChips } from "@/components/courses/category-filter-chips";
import { CourseCatalogHero } from "@/components/courses/course-catalog-hero";
import { CourseEmptyState } from "@/components/courses/course-empty-state";
import { CourseGrid } from "@/components/courses/course-grid";
import { SiteFooter } from "@/components/landing/site-footer";
import { SiteHeader } from "@/components/landing/site-header";
import { getCurrentUser } from "@/lib/auth";
import { getCatalogCategories, getCatalogCourses } from "@/lib/queries";
import type { CatalogSearchParams } from "@/lib/types";

export const metadata: Metadata = {
  title: "Courses — Free Course Library",
  description:
    "Explore free, structured courses designed to help you understand concepts and build practical skills.",
  openGraph: {
    title: "Courses — Free Course Library | Meritloom",
    description:
      "Explore free, structured courses designed to help you understand concepts and build practical skills.",
  },
};

interface CoursesPageProps {
  searchParams: Promise<CatalogSearchParams>;
}

/**
 * Meritloom Course Catalog Page — Page 2.
 * Route: /courses
 *
 * Implements Figma Frame 3:58:
 * - Header with Courses marked active & ThemeToggle
 * - Dark catalog hero with live debounced search
 * - Category filter chips
 * - Catalog controls (result count, difficulty filter, sort, mobile filter sheet)
 * - 3-column responsive course grid with category-based gradient cover fallbacks
 * - Server pagination preserving URL search params
 * - Polished empty and error states
 */
export default async function CoursesPage({ searchParams }: CoursesPageProps) {
  const resolvedParams = await searchParams;

  // Run user session lookup, category list, and catalog query in parallel
  const [user, categories, catalogResult] = await Promise.all([
    getCurrentUser(),
    getCatalogCategories(),
    getCatalogCourses(resolvedParams, 9),
  ]);

  const { courses, totalCount, page, totalPages, error } = catalogResult;

  const hasActiveFilters = Boolean(
    resolvedParams.q ||
      (resolvedParams.category && resolvedParams.category !== "all") ||
      (resolvedParams.level && resolvedParams.level !== "all") ||
      (resolvedParams.sort && resolvedParams.sort !== "newest"),
  );

  return (
    <div className="flex min-h-dvh flex-col bg-background text-ink transition-colors">
      <SiteHeader user={user} />

      <main id="main" className="flex-1">
        {/* Dark Catalog Hero Area */}
        <CourseCatalogHero />

        {/* Catalog Body */}
        <section
          id="catalog-results"
          aria-labelledby="catalog-content-heading"
          className="section-py pt-8 sm:pt-10"
        >
          <div className="container-page flex flex-col gap-6">
            <h2 id="catalog-content-heading" className="sr-only">
              Available Courses List
            </h2>

            {/* Category Filter Chips */}
            <CategoryFilterChips categories={categories} />

            {/* Catalog Control Bar (Count, Difficulty, Sort, Mobile Sheet) */}
            <CatalogControls
              totalCount={totalCount}
              categories={categories}
            />

            {/* Results Grid / Empty States */}
            <div className="pt-4">
              {error ? (
                <CourseEmptyState type="error" error={error} />
              ) : courses.length > 0 ? (
                <div className="flex flex-col gap-10">
                  <CourseGrid courses={courses} />
                  <CatalogPagination
                    currentPage={page}
                    totalPages={totalPages}
                  />
                </div>
              ) : hasActiveFilters ? (
                <CourseEmptyState type="no-results" />
              ) : (
                <CourseEmptyState type="empty-catalog" />
              )}
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}

