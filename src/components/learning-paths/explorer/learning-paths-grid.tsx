"use client";

import * as React from "react";
import { Code2, Database, Layers, Sparkles } from "lucide-react";
import { LearningPathCard } from "./learning-path-card";
import { Badge } from "@/components/ui/badge";
import type { LearnerProfile, LearningPathDetail } from "@/lib/types";

interface LearningPathsGridProps {
  paths: LearningPathDetail[];
  user: LearnerProfile | null;
}

export function LearningPathsGrid({ paths, user }: LearningPathsGridProps) {
  return (
    <section id="paths" aria-labelledby="paths-grid-heading" className="section-py transition-colors">
      <div className="container-page">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center">
          <Badge
            variant="default"
            className="gap-1.5 border border-primary/20 bg-primary/10 text-primary font-bold px-3 py-1 text-xs"
          >
            <Layers className="size-3.5" aria-hidden="true" />
            <span>DISCOVERY CATALOG</span>
          </Badge>

          <h2 id="paths-grid-heading" className="heading-2 mt-3 text-ink">
            Explore Learning Paths
          </h2>
          <p className="lead-text mt-3 max-w-lg text-muted text-base sm:text-lg">
            Choose a guided journey based on what you want to learn.
          </p>
        </div>

        {/* 1. Published Paths Grid */}
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {paths.map((path) => (
            <LearningPathCard key={path.id} path={path} user={user} />
          ))}
        </div>

        {/* 2. Coming Soon Paths Section */}
        <div className="mt-20 border-t border-line/70 pt-16">
          <div className="flex flex-col items-center text-center">
            <span className="text-xs font-extrabold uppercase tracking-wider text-muted">
              Roadmap in development
            </span>
            <h3 className="heading-3 mt-2 text-ink">
              Coming Soon
            </h3>
            <p className="mt-2 text-sm text-muted max-w-md">
              We are curating more comprehensive learning paths to support your journey.
            </p>
          </div>

          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {/* Future Path 1: Frontend Developer */}
            <div className="relative flex flex-col rounded-[22px] border border-dashed border-line bg-surface/40 p-6 opacity-75 select-none">
              <div className="flex items-center justify-between">
                <span className="grid size-10 place-items-center rounded-xl bg-primary/10 text-primary">
                  <Code2 className="size-5" aria-hidden="true" />
                </span>
                <Badge variant="outline" className="border-line bg-card text-muted text-[10px] font-bold">
                  COMING SOON
                </Badge>
              </div>
              <h4 className="mt-4 text-lg font-bold text-ink">Frontend Developer</h4>
              <p className="mt-1.5 text-xs text-muted leading-relaxed">
                Take your foundations further with modern component architectures, state management, and real production patterns.
              </p>
              <div className="mt-4 flex items-center gap-2 text-[11px] font-semibold text-muted">
                <span>React</span>
                <span>•</span>
                <span>TypeScript</span>
                <span>•</span>
                <span>Next.js</span>
              </div>
            </div>

            {/* Future Path 2: Programming Foundations */}
            <div className="relative flex flex-col rounded-[22px] border border-dashed border-line bg-surface/40 p-6 opacity-75 select-none">
              <div className="flex items-center justify-between">
                <span className="grid size-10 place-items-center rounded-xl bg-amber-500/10 text-amber-500">
                  <Sparkles className="size-5" aria-hidden="true" />
                </span>
                <Badge variant="outline" className="border-line bg-card text-muted text-[10px] font-bold">
                  COMING SOON
                </Badge>
              </div>
              <h4 className="mt-4 text-lg font-bold text-ink">Programming Foundations</h4>
              <p className="mt-1.5 text-xs text-muted leading-relaxed">
                Core computational thinking, data structures, algorithms, and practical problem-solving concepts.
              </p>
              <div className="mt-4 flex items-center gap-2 text-[11px] font-semibold text-muted">
                <span>Logic</span>
                <span>•</span>
                <span>Algorithms</span>
                <span>•</span>
                <span>Problem Solving</span>
              </div>
            </div>

            {/* Future Path 3: Data Fundamentals */}
            <div className="relative flex flex-col rounded-[22px] border border-dashed border-line bg-surface/40 p-6 opacity-75 select-none">
              <div className="flex items-center justify-between">
                <span className="grid size-10 place-items-center rounded-xl bg-cyan-500/10 text-cyan-500">
                  <Database className="size-5" aria-hidden="true" />
                </span>
                <Badge variant="outline" className="border-line bg-card text-muted text-[10px] font-bold">
                  COMING SOON
                </Badge>
              </div>
              <h4 className="mt-4 text-lg font-bold text-ink">Data & Backend Fundamentals</h4>
              <p className="mt-1.5 text-xs text-muted leading-relaxed">
                Relational schemas, SQL queries, RESTful API design, and cloud backend foundations.
              </p>
              <div className="mt-4 flex items-center gap-2 text-[11px] font-semibold text-muted">
                <span>SQL</span>
                <span>•</span>
                <span>APIs</span>
                <span>•</span>
                <span>Databases</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
