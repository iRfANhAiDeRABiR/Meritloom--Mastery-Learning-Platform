import { Badge } from "@/components/ui/badge";
import { CourseSearch } from "@/components/courses/course-search";

/**
 * Course Catalog Dark Hero Area — Figma Frame 3:58.
 * Preserves the dark, spacious visual language with "Free course library" badge,
 * large heading, supporting copy, and prominent live search.
 */
export function CourseCatalogHero() {
  return (
    <section
      aria-labelledby="catalog-hero-heading"
      className="relative overflow-hidden bg-[#0B1020] py-16 text-white sm:py-20 lg:py-24"
    >
      {/* Decorative ambient gradients */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-28 left-1/2 h-[420px] w-[860px] -translate-x-1/2 rounded-full bg-primary/20 blur-[100px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-32 right-1/4 h-[320px] w-[500px] rounded-full bg-mint/10 blur-[90px]"
      />

      <div className="container-page relative flex flex-col items-center text-center">
        {/* Badge: Free course library */}
        <Badge
          variant="default"
          className="gap-2 border border-primary/30 bg-primary/20 px-3.5 py-1.5 text-xs font-bold text-white shadow-soft"
        >
          <span
            className="size-2 rounded-full bg-mint-ink dark:bg-mint"
            aria-hidden="true"
          />
          Free course library
        </Badge>

        {/* Heading: Find a course worth completing */}
        <h1
          id="catalog-hero-heading"
          className="mt-6 text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-[3.5rem] lg:leading-[1.12]"
        >
          Find a course <span className="text-primary">worth completing</span>
        </h1>

        {/* Supporting text */}
        <p className="lead-text mt-4 max-w-2xl text-white/80 sm:text-lg">
          Explore free, structured courses designed to help you understand
          concepts and build practical skills.
        </p>

        {/* Prominent Search Field */}
        <div className="mt-8 w-full max-w-2xl">
          <CourseSearch />
        </div>
      </div>
    </section>
  );
}

