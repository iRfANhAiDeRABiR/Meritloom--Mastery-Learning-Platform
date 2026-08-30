import Link from "next/link";

import { getCategoryIcon } from "@/lib/content/category-icons";
import { SectionHeading } from "@/components/landing/section-heading";
import { routes } from "@/lib/routes";
import type { Category } from "@/lib/types";

/**
 * "Browse by category" — compact grid populated from Supabase categories with
 * their visible course counts (RLS limits these to published rows). Each tile
 * links to the category listing.
 */
export function CategoryGrid({ categories }: { categories: Category[] }) {
  if (categories.length === 0) return null;

  return (
    <section
      id="categories"
      aria-labelledby="categories-heading"
      className="section-py bg-surface"
    >
      <div className="container-page">
        <SectionHeading
          id="categories-heading"
          eyebrow="Explore"
          title="Browse by category"
          description="Pick a subject and start with a topic that matters to you."
        />

        <ul className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 lg:gap-4">
          {categories.map((category) => {
            const Icon = getCategoryIcon(category.slug);
            return (
              <li key={category.id}>
                <Link
                  href={routes.categories.detail(category.slug)}
                  className="flex h-full flex-col gap-3 rounded-[18px] border border-line bg-white p-4 shadow-soft transition-colors hover:border-primary/40 sm:p-5"
                >
                  <span className="grid size-11 place-items-center rounded-2xl bg-lavender text-primary">
                    <Icon className="size-5" aria-hidden="true" />
                  </span>
                  <span>
                    <span className="block text-sm font-bold text-ink sm:text-base">
                      {category.name}
                    </span>
                    <span className="mt-0.5 block text-xs text-muted">
                      {category.courseCount}{" "}
                      {category.courseCount === 1 ? "course" : "courses"}
                    </span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
