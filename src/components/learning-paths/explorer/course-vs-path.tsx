"use client";

import Link from "next/link";
import { ArrowRight, BookOpen, Route } from "lucide-react";
import { Button } from "@/components/ui/button";
import { routes } from "@/lib/routes";

export function CourseVsPath() {
  const handleScrollToPaths = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const elem = document.getElementById("paths");
    if (elem) {
      elem.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section aria-labelledby="comparison-heading" className="section-py transition-colors">
      <div className="container-page">
        <div className="flex flex-col items-center text-center">
          <h2 id="comparison-heading" className="heading-2 text-ink">
            Course or Learning Path?
          </h2>
          <p className="lead-text mt-3 max-w-md text-muted text-base sm:text-lg">
            Choose the approach that matches your current learning objective.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 max-w-4xl mx-auto">
          {/* Card 1: Course */}
          <div className="flex flex-col rounded-[24px] border border-line bg-card p-6 sm:p-8 shadow-soft transition-all duration-200 hover:-translate-y-1 hover:shadow-lift">
            <div className="flex items-center gap-3">
              <span className="grid size-12 place-items-center rounded-[14px] bg-lavender text-primary shadow-xs">
                <BookOpen className="size-6" aria-hidden="true" />
              </span>
              <div>
                <span className="text-xs font-extrabold uppercase tracking-wider text-muted">
                  Single Subject
                </span>
                <h3 className="text-xl font-bold text-ink">Course</h3>
              </div>
            </div>

            <div className="mt-4 rounded-lg bg-surface px-3 py-1.5 text-xs font-semibold text-muted">
              e.g. CSS Fundamentals
            </div>

            <p className="mt-4 text-sm leading-relaxed text-muted">
              Choose a single topic when you already know exactly what you want to learn or want to brush up on specific skills.
            </p>

            <div className="flex-1" />

            <div className="mt-8 pt-4 border-t border-line">
              <Button asChild variant="outline" className="w-full gap-2 font-bold">
                <Link href={routes.courses.index}>
                  <span>Browse courses</span>
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
              </Button>
            </div>
          </div>

          {/* Card 2: Learning Path */}
          <div className="flex flex-col rounded-[24px] border border-primary/40 bg-gradient-to-br from-card via-card to-primary/10 p-6 sm:p-8 shadow-soft transition-all duration-200 hover:-translate-y-1 hover:shadow-lift ring-1 ring-primary/20">
            <div className="flex items-center gap-3">
              <span className="grid size-12 place-items-center rounded-[14px] bg-primary text-white shadow-xs">
                <Route className="size-6 text-mint" aria-hidden="true" />
              </span>
              <div>
                <span className="text-xs font-extrabold uppercase tracking-wider text-primary">
                  Structured Journey
                </span>
                <h3 className="text-xl font-bold text-ink">Learning Path</h3>
              </div>
            </div>

            <div className="mt-4 rounded-lg bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary">
              e.g. Web Development Foundations
            </div>

            <p className="mt-4 text-sm leading-relaxed text-muted">
              Choose a guided sequence when you want a clear journey across several related skills from step one through a capstone project.
            </p>

            <div className="flex-1" />

            <div className="mt-8 pt-4 border-t border-line">
              <Button asChild className="w-full gap-2 font-bold shadow-soft">
                <a href="#paths" onClick={handleScrollToPaths}>
                  <span>Explore paths</span>
                  <ArrowRight className="size-4" aria-hidden="true" />
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
