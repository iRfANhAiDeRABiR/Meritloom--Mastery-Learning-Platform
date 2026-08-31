"use client";

import * as React from "react";
import Link from "next/link";
import {
  BookOpen,
  ChartNoAxesColumnIncreasing,
  CheckCircle2,
  Code2,
  PlayCircle,
  Route,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { routes } from "@/lib/routes";

const TABS = [
  { id: "courses", label: "Courses", icon: BookOpen },
  { id: "lessons", label: "Lessons", icon: PlayCircle },
  { id: "practice", label: "Practice", icon: Code2 },
  { id: "progress", label: "Progress", icon: ChartNoAxesColumnIncreasing },
  { id: "paths", label: "Learning Paths", icon: Route },
] as const;

type TabId = (typeof TABS)[number]["id"];

export function ProductExperienceTabs() {
  const [activeTab, setActiveTab] = React.useState<TabId>("courses");

  return (
    <section aria-labelledby="experience-heading" className="section-py transition-colors">
      <div className="container-page">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center">
          <Badge
            variant="default"
            className="border border-primary/20 bg-primary/10 text-primary font-bold px-3 py-1 text-xs"
          >
            INTERACTIVE PREVIEW
          </Badge>
          <h2 id="experience-heading" className="heading-2 mt-3 text-ink">
            Everything you need to keep learning
          </h2>
          <p className="lead-text mt-3 max-w-xl text-muted text-base sm:text-lg">
            Meritloom brings courses, lessons, practice, progress, and guided paths into one simple learning space.
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="mt-10 flex items-center justify-center">
          <div
            role="tablist"
            aria-label="Product Features"
            className="flex items-center gap-1.5 overflow-x-auto rounded-full border border-line bg-card p-1.5 shadow-soft max-w-full"
          >
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  role="tab"
                  id={`tab-${tab.id}`}
                  aria-selected={isActive}
                  aria-controls={`panel-${tab.id}`}
                  tabIndex={isActive ? 0 : -1}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "flex items-center gap-2 rounded-full px-4 py-2 text-xs sm:text-sm font-bold transition-all duration-200 whitespace-nowrap",
                    isActive
                      ? "bg-primary text-white shadow-soft"
                      : "text-muted hover:bg-surface hover:text-ink",
                  )}
                >
                  <Icon className="size-4" aria-hidden="true" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content Panel */}
        <div className="mt-8 max-w-4xl mx-auto">
          {/* 1. COURSES PANEL */}
          {activeTab === "courses" && (
            <div
              role="tabpanel"
              id="panel-courses"
              aria-labelledby="tab-courses"
              className="rounded-[26px] border border-line bg-card p-6 sm:p-10 shadow-lift animate-fade-in"
            >
              <div className="grid gap-8 md:grid-cols-2 items-center">
                <div>
                  <Badge variant="default" className="bg-primary/10 text-primary border-primary/20 text-xs font-bold">
                    Single Subject
                  </Badge>
                  <h3 className="heading-3 mt-3 text-ink">CSS Fundamentals</h3>
                  <p className="mt-2 text-sm text-muted leading-relaxed">
                    Each course contains organized modules, concise videos, key takeaways, and practical checkpoints to build solid foundational knowledge.
                  </p>
                  <div className="mt-4 flex items-center gap-3 text-xs font-semibold text-muted">
                    <span>18 Lessons</span>
                    <span>•</span>
                    <span>Beginner</span>
                    <span>•</span>
                    <span className="text-mint-ink font-bold">100% Free</span>
                  </div>
                  <div className="mt-6">
                    <Button asChild size="sm" className="font-bold">
                      <Link href="/courses/css-fundamentals">View course</Link>
                    </Button>
                  </div>
                </div>

                <div className="rounded-2xl border border-line bg-surface p-5 shadow-xs">
                  <div className="flex items-center justify-between border-b border-line pb-3">
                    <span className="text-xs font-bold text-ink">Course Outline</span>
                    <span className="text-[11px] text-muted">4 Modules</span>
                  </div>
                  <div className="mt-3 space-y-2 text-xs">
                    <div className="flex items-center justify-between p-2 rounded-lg bg-card border border-line">
                      <span>1. CSS Introduction & Selectors</span>
                      <span className="text-muted">4 lessons</span>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded-lg bg-card border border-line">
                      <span>2. Colors & Backgrounds</span>
                      <span className="text-muted">4 lessons</span>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded-lg bg-card border border-line">
                      <span>3. Box Model & Typography</span>
                      <span className="text-muted">5 lessons</span>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded-lg bg-card border border-line">
                      <span>4. Layouts & Navigation</span>
                      <span className="text-muted">5 lessons</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 2. LESSONS PANEL */}
          {activeTab === "lessons" && (
            <div
              role="tabpanel"
              id="panel-lessons"
              aria-labelledby="tab-lessons"
              className="rounded-[26px] border border-line bg-card p-6 sm:p-10 shadow-lift animate-fade-in"
            >
              <div className="grid gap-8 md:grid-cols-2 items-center">
                <div>
                  <Badge variant="default" className="bg-amber-500/10 text-amber-500 border-amber-500/20 text-xs font-bold">
                    Lesson Player
                  </Badge>
                  <h3 className="heading-3 mt-3 text-ink">Introduction to JavaScript</h3>
                  <p className="mt-2 text-sm text-muted leading-relaxed">
                    Watch concise video tutorials, read original Meritloom key takeaways, and quickly review core concepts before moving on.
                  </p>
                  <div className="mt-4 rounded-xl border border-primary/20 bg-primary/5 p-3.5 text-xs">
                    <p className="font-bold text-primary">Key Takeaway:</p>
                    <p className="text-muted mt-1">JavaScript gives websites behavior, enabling dynamic responses to user events and real-time DOM updates.</p>
                  </div>
                </div>

                <div className="rounded-2xl border border-line bg-surface p-4 shadow-xs">
                  {/* Mock Video Screen */}
                  <div className="aspect-video w-full rounded-xl bg-slate-950 flex flex-col items-center justify-center text-white relative overflow-hidden">
                    <PlayCircle className="size-12 text-white/80 hover:text-white transition-colors" />
                    <span className="mt-2 text-xs text-white/70">W3Schools Official Tutorial</span>
                  </div>
                  <div className="mt-3 flex items-center justify-between text-xs font-semibold text-muted">
                    <button className="px-3 py-1 rounded bg-card border border-line hover:text-ink">Previous</button>
                    <span>Lesson 1 of 17</span>
                    <button className="px-3 py-1 rounded bg-primary text-white font-bold">Next Lesson</button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 3. PRACTICE PANEL */}
          {activeTab === "practice" && (
            <div
              role="tabpanel"
              id="panel-practice"
              aria-labelledby="tab-practice"
              className="rounded-[26px] border border-line bg-card p-6 sm:p-10 shadow-lift animate-fade-in"
            >
              <div className="grid gap-8 md:grid-cols-2 items-center">
                <div>
                  <Badge variant="default" className="bg-cyan-500/10 text-cyan-500 border-cyan-500/20 text-xs font-bold">
                    Practice Checkpoint
                  </Badge>
                  <h3 className="heading-3 mt-3 text-ink">Hands-on Reinforcement</h3>
                  <p className="mt-2 text-sm text-muted leading-relaxed">
                    Test your understanding with checkpoint questions designed for practice. No locking, no penalties, and instant explanations.
                  </p>
                  <div className="mt-5 flex items-center gap-2 text-xs font-semibold text-muted">
                    <CheckCircle2 className="size-4 text-mint-ink" />
                    <span>Instant feedback and concept explanations</span>
                  </div>
                </div>

                <div className="rounded-2xl border border-line bg-surface p-5 shadow-xs">
                  <div className="flex items-center justify-between border-b border-line pb-3">
                    <span className="text-xs font-bold text-ink">Question Preview</span>
                    <span className="text-[11px] text-muted">Practice Checkpoint</span>
                  </div>
                  <div className="mt-4 space-y-2.5">
                    <p className="text-xs font-bold text-ink">Which keyword declares a variable that can be reassigned?</p>
                    <div className="rounded-xl border border-line bg-card p-2.5 text-xs text-muted">
                      <span>A. const</span>
                    </div>
                    <div className="rounded-xl border border-primary/50 bg-primary/10 p-2.5 text-xs font-bold text-primary flex items-center justify-between">
                      <span>B. let</span>
                      <CheckCircle2 className="size-4 text-primary" />
                    </div>
                    <div className="rounded-xl border border-line bg-card p-2.5 text-xs text-muted">
                      <span>C. static</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 4. PROGRESS PANEL */}
          {activeTab === "progress" && (
            <div
              role="tabpanel"
              id="panel-progress"
              aria-labelledby="tab-progress"
              className="rounded-[26px] border border-line bg-card p-6 sm:p-10 shadow-lift animate-fade-in"
            >
              <div className="grid gap-8 md:grid-cols-2 items-center">
                <div>
                  <Badge variant="default" className="bg-mint/30 text-mint-ink border-mint-ink/20 text-xs font-bold">
                    Progress Tracking
                  </Badge>
                  <h3 className="heading-3 mt-3 text-ink">Stay in Flow</h3>
                  <p className="mt-2 text-sm text-muted leading-relaxed">
                    Meritloom tracks completed lessons automatically so you can resume your learning immediately whenever you return.
                  </p>
                  <div className="mt-6">
                    <Button asChild size="sm" className="font-bold">
                      <Link href={routes.myLearning}>View My Learning</Link>
                    </Button>
                  </div>
                </div>

                <div className="rounded-2xl border border-line bg-surface p-5 shadow-xs space-y-3.5">
                  <div>
                    <div className="flex justify-between text-xs font-bold text-ink">
                      <span>HTML Fundamentals</span>
                      <span className="text-mint-ink">Completed ✓</span>
                    </div>
                    <div className="mt-1 h-2 w-full rounded-full bg-mint/30">
                      <div className="h-full w-full rounded-full bg-mint-ink" />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-bold text-ink">
                      <span>CSS Fundamentals</span>
                      <span className="text-primary">8 of 18 lessons</span>
                    </div>
                    <div className="mt-1 h-2 w-full rounded-full bg-line">
                      <div className="h-full w-[44%] rounded-full bg-primary" />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-bold text-ink">
                      <span>JavaScript Fundamentals</span>
                      <span className="text-muted">Not started</span>
                    </div>
                    <div className="mt-1 h-2 w-full rounded-full bg-line" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 5. LEARNING PATHS PANEL */}
          {activeTab === "paths" && (
            <div
              role="tabpanel"
              id="panel-paths"
              aria-labelledby="tab-paths"
              className="rounded-[26px] border border-line bg-card p-6 sm:p-10 shadow-lift animate-fade-in"
            >
              <div className="grid gap-8 md:grid-cols-2 items-center">
                <div>
                  <Badge variant="default" className="bg-[#8B5CF6]/10 text-[#8B5CF6] border-[#8B5CF6]/20 text-xs font-bold">
                    Guided Journey
                  </Badge>
                  <h3 className="heading-3 mt-3 text-ink">Web Development Foundations</h3>
                  <p className="mt-2 text-sm text-muted leading-relaxed">
                    Follow a recommended sequence through HTML, CSS, and JavaScript. Learn each foundation in order and build a real portfolio project.
                  </p>
                  <div className="mt-6">
                    <Button asChild size="sm" className="font-bold">
                      <Link href="/learning-paths/web-development-foundations">Explore Web Dev Path</Link>
                    </Button>
                  </div>
                </div>

                <div className="rounded-2xl border border-line bg-surface p-5 shadow-xs space-y-2.5">
                  <div className="flex items-center justify-between p-2.5 rounded-xl border border-mint-ink/30 bg-mint/20 text-xs font-bold text-mint-ink">
                    <span>1. HTML Fundamentals</span>
                    <span>Completed ✓</span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 rounded-xl border border-primary/40 bg-primary/10 text-xs font-bold text-primary">
                    <span>2. CSS Fundamentals</span>
                    <span>In progress ●</span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 rounded-xl border border-line bg-card text-xs text-muted">
                    <span>3. JavaScript Fundamentals</span>
                    <span>Upcoming ○</span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 rounded-xl border border-line bg-card text-xs text-muted">
                    <span>4. Final Project</span>
                    <span>Capstone ○</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
