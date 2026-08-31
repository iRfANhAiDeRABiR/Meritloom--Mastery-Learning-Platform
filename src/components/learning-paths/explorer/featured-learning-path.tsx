"use client";

import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Clock,
  Code2,
  Braces,
  Palette,
  Rocket,
  Sparkles,
  Star,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { LearnerProfile, LearningPathDetail } from "@/lib/types";

interface FeaturedLearningPathProps {
  path: LearningPathDetail;
  user: LearnerProfile | null;
}

export function FeaturedLearningPath({ path, user }: FeaturedLearningPathProps) {
  const learnerProgress = path.learnerProgress;
  const isCompleted = learnerProgress?.pathStatus === "completed";
  const isInProgress = learnerProgress?.pathStatus === "in_progress";

  const totalMinutes = path.estimatedMinutes || 305;
  const hours = Math.round((totalMinutes / 60) * 10) / 10;

  // Determine dynamic CTA button
  let primaryLabel = "View learning path";
  const primaryHref = `/learning-paths/${path.slug}`;

  if (user) {
    if (isCompleted) {
      primaryLabel = "Review path";
    } else if (isInProgress) {
      primaryLabel = "Continue learning";
    } else {
      primaryLabel = "Start learning path";
    }
  }

  return (
    <section aria-labelledby="featured-path-heading" className="section-py bg-surface/50 transition-colors">
      <div className="container-page">
        <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-primary">
              <Star className="size-3.5 fill-primary text-primary" aria-hidden="true" />
              <span>Flagship Path</span>
            </div>
            <h2 id="featured-path-heading" className="heading-2 mt-2 text-ink">
              Start with the foundations
            </h2>
          </div>

          <p className="max-w-md text-sm text-muted">
            The recommended starting point for aspiring frontend developers.
          </p>
        </div>

        {/* Big Featured Path Card */}
        <div className="mt-8 relative overflow-hidden rounded-[26px] border border-primary/30 bg-gradient-to-br from-card via-card to-primary/5 p-6 sm:p-10 shadow-lift transition-all hover:border-primary/50">
          {/* Ambient Lighting Accents */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-24 -top-24 size-80 rounded-full bg-primary/10 blur-3xl"
          />

          <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            {/* Left Content Area */}
            <div className="flex flex-col items-start gap-5">
              <div className="flex flex-wrap items-center gap-2.5">
                <Badge
                  variant="default"
                  className="border border-primary/30 bg-primary/10 text-primary font-bold px-3 py-1 text-xs"
                >
                  <Sparkles className="size-3.5" aria-hidden="true" />
                  <span>BEGINNER PATH</span>
                </Badge>

                {user && (
                  <>
                    {isCompleted ? (
                      <Badge
                        variant="outline"
                        className="border-mint-ink/30 bg-mint/50 dark:bg-mint/20 text-mint-ink font-bold px-2.5 py-1 text-xs"
                      >
                        <CheckCircle2 className="size-3.5" aria-hidden="true" />
                        <span>Path completed</span>
                      </Badge>
                    ) : isInProgress ? (
                      <Badge
                        variant="outline"
                        className="border-primary/30 bg-primary/15 text-primary font-semibold px-2.5 py-1 text-xs"
                      >
                        <span className="size-1.5 rounded-full bg-primary animate-pulse" />
                        <span>
                          {learnerProgress?.completedCourses ?? 0} of {learnerProgress?.totalCourses ?? 3} courses completed
                        </span>
                      </Badge>
                    ) : (
                      <Badge
                        variant="outline"
                        className="border-line bg-surface text-muted text-xs font-medium px-2.5 py-1"
                      >
                        <span>Not started</span>
                      </Badge>
                    )}
                  </>
                )}
              </div>

              <div>
                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-ink">
                  {path.title}
                </h3>
                <p className="mt-3 text-base sm:text-lg leading-relaxed text-muted">
                  {path.description}
                </p>
              </div>

              {/* Course Technology Chips */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-2.5 py-1 text-xs font-bold text-amber-500">
                  HTML5
                </span>
                <span className="rounded-lg border border-cyan-500/30 bg-cyan-500/10 px-2.5 py-1 text-xs font-bold text-cyan-500">
                  CSS3
                </span>
                <span className="rounded-lg border border-amber-400/30 bg-amber-400/10 px-2.5 py-1 text-xs font-bold text-amber-400">
                  JavaScript
                </span>
                <span className="rounded-lg border border-primary/30 bg-primary/10 px-2.5 py-1 text-xs font-bold text-primary">
                  Final Portfolio Project
                </span>
              </div>

              {/* Metadata row */}
              <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-muted pt-1">
                <span className="inline-flex items-center gap-1.5">
                  <BookOpen className="size-4 text-primary" aria-hidden="true" />
                  <span>{path.courseCount} Courses + Project</span>
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Clock className="size-4 text-[#8B5CF6]" aria-hidden="true" />
                  <span>~{hours}h study</span>
                </span>
                <span className="rounded-full bg-mint/50 dark:bg-mint/20 px-2.5 py-0.5 text-mint-ink font-bold">
                  100% Free
                </span>
              </div>

              {/* CTA Row */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Button
                  asChild
                  size="lg"
                  className="gap-2 font-bold shadow-lift hover:-translate-y-0.5 transition-transform"
                >
                  <Link href={primaryHref}>
                    <span>{primaryLabel}</span>
                    <ArrowRight className="size-4" aria-hidden="true" />
                  </Link>
                </Button>

                {!user && (
                  <Button
                    asChild
                    variant="outline"
                    size="lg"
                    className="hover:-translate-y-0.5 transition-transform"
                  >
                    <Link href="/courses/html-fundamentals">
                      <span>Start learning free</span>
                    </Link>
                  </Button>
                )}
              </div>
            </div>

            {/* Right Mini Connected Roadmap Visual */}
            <div className="flex flex-col justify-center rounded-2xl border border-line/80 bg-background/80 p-5 sm:p-6 shadow-soft">
              <div className="flex items-center justify-between border-b border-line/60 pb-3 mb-5">
                <span className="text-xs font-extrabold uppercase tracking-wider text-muted">
                  Path Roadmap Preview
                </span>
                <span className="text-[11px] font-bold text-primary">
                  4 Milestones
                </span>
              </div>

              <div className="space-y-3.5">
                {/* HTML */}
                <div className="flex items-center justify-between rounded-xl border border-line bg-card p-3 shadow-xs">
                  <div className="flex items-center gap-3">
                    <div className="grid size-8 place-items-center rounded-lg bg-amber-500/15 text-amber-500">
                      <Code2 className="size-4" aria-hidden="true" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-ink">1. HTML Fundamentals</p>
                      <p className="text-[10px] text-muted">23 lessons · 110 min</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded">
                    Foundations
                  </span>
                </div>

                {/* CSS */}
                <div className="flex items-center justify-between rounded-xl border border-line bg-card p-3 shadow-xs">
                  <div className="flex items-center gap-3">
                    <div className="grid size-8 place-items-center rounded-lg bg-cyan-500/15 text-cyan-500">
                      <Palette className="size-4" aria-hidden="true" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-ink">2. CSS Fundamentals</p>
                      <p className="text-[10px] text-muted">18 lessons · 90 min</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-cyan-500 bg-cyan-500/10 px-2 py-0.5 rounded">
                    Layout & Style
                  </span>
                </div>

                {/* JS */}
                <div className="flex items-center justify-between rounded-xl border border-line bg-card p-3 shadow-xs">
                  <div className="flex items-center gap-3">
                    <div className="grid size-8 place-items-center rounded-lg bg-amber-400/15 text-amber-500">
                      <Braces className="size-4" aria-hidden="true" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-ink">3. JavaScript Fundamentals</p>
                      <p className="text-[10px] text-muted">17 lessons · 105 min</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-amber-500 bg-amber-400/10 px-2 py-0.5 rounded">
                    Interactivity
                  </span>
                </div>

                {/* Project */}
                <div className="flex items-center justify-between rounded-xl border border-primary/30 bg-primary/10 p-3 shadow-xs">
                  <div className="flex items-center gap-3">
                    <div className="grid size-8 place-items-center rounded-lg bg-primary text-white">
                      <Rocket className="size-4 text-amber-300" aria-hidden="true" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-ink">4. Interactive Website</p>
                      <p className="text-[10px] text-muted">Capstone project · 30 min</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-primary bg-lavender px-2 py-0.5 rounded">
                    Project
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
