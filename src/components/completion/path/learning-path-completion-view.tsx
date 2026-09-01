import * as React from "react";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Braces,
  Check,
  CheckCircle2,
  Code2,
  ExternalLink,
  FileQuestion,
  GraduationCap,
  Layers,
  Palette,
  Rocket,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { LearningPathCompletionData } from "@/lib/completion/types";

// ============================================================================
// 1. HERO COMPONENT
// ============================================================================
export function PathCompletionHero({ data }: { data: LearningPathCompletionData }) {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-primary/20 bg-gradient-to-b from-primary/10 via-purple-500/5 to-transparent p-6 sm:p-10 shadow-sm">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-4 max-w-2xl">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline" className="border-primary/30 bg-primary/10 font-mono text-xs uppercase font-bold tracking-wider text-primary">
              <Check className="mr-1 h-3.5 w-3.5" />
              Learning Path Complete
            </Badge>
            {data.completedAt && (
              <span className="text-xs text-ink-muted">
                Completed on {new Date(data.completedAt).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}
              </span>
            )}
          </div>

          <h1 className="font-display text-2xl font-bold tracking-tight text-ink sm:text-4xl">
            You completed {data.pathTitle}
          </h1>

          <p className="text-sm sm:text-base leading-relaxed text-ink-muted">
            You worked from HTML structure through CSS styling and JavaScript interaction, then brought everything together in a final project.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Button asChild size="lg" className="rounded-xl bg-primary font-semibold text-white shadow-sm hover:bg-primary/90">
              <Link href="/courses">
                <span>Explore Courses</span>
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            {data.projectSummary && (
              <Button asChild variant="outline" size="lg" className="rounded-xl border-line font-semibold text-ink hover:bg-surface-elevated">
                <Link href={data.projectSummary.href}>
                  <Rocket className="mr-2 h-4 w-4 text-purple-500" />
                  <span>Review Final Project</span>
                </Link>
              </Button>
            )}
          </div>
        </div>

        {/* Multi-Accent Visual Roadmap Preview */}
        <div className="rounded-2xl border border-line bg-surface/80 p-5 backdrop-blur-sm shadow-sm space-y-3 min-w-[280px]">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-ink-muted pb-1 border-b border-line">
            <span>Path Roadmap</span>
            <span className="text-emerald-500 font-mono">100% Done</span>
          </div>
          <div className="space-y-2">
            {data.roadmapJourney.map((step, idx) => (
              <div key={step.id || idx} className="flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px] text-ink-muted">0{idx + 1}</span>
                  <span className="font-semibold text-ink truncate max-w-[170px]">{step.title}</span>
                </div>
                <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  <Check className="h-3 w-3" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// 2. PATH SUMMARY METRICS
// ============================================================================
export function PathSummaryMetrics({ data }: { data: LearningPathCompletionData }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
      <div className="rounded-2xl border border-line bg-surface p-4 space-y-1 shadow-xs">
        <div className="flex items-center gap-1.5 text-xs text-ink-muted">
          <GraduationCap className="h-4 w-4 text-primary" />
          <span>Courses</span>
        </div>
        <p className="font-display text-2xl font-bold text-ink">
          {data.completedRequiredCourses} <span className="text-xs font-normal text-ink-muted">/ {data.totalRequiredCourses}</span>
        </p>
        <p className="text-[11px] text-ink-muted">Core foundations</p>
      </div>

      <div className="rounded-2xl border border-line bg-surface p-4 space-y-1 shadow-xs">
        <div className="flex items-center gap-1.5 text-xs text-ink-muted">
          <Rocket className="h-4 w-4 text-purple-500" />
          <span>Final Project</span>
        </div>
        <p className="font-display text-2xl font-bold text-ink">
          {data.completedRequiredProjects > 0 ? "1 / 1" : "1"}
        </p>
        <p className="text-[11px] text-ink-muted">Capstone completed</p>
      </div>

      <div className="rounded-2xl border border-line bg-surface p-4 space-y-1 shadow-xs">
        <div className="flex items-center gap-1.5 text-xs text-ink-muted">
          <Layers className="h-4 w-4 text-emerald-500" />
          <span>Modules</span>
        </div>
        <p className="font-display text-2xl font-bold text-ink">
          {data.totalModulesCompleted}
        </p>
        <p className="text-[11px] text-ink-muted">Instructional modules</p>
      </div>

      <div className="rounded-2xl border border-line bg-surface p-4 space-y-1 shadow-xs">
        <div className="flex items-center gap-1.5 text-xs text-ink-muted">
          <Code2 className="h-4 w-4 text-blue-500" />
          <span>Practice Tasks</span>
        </div>
        <p className="font-display text-2xl font-bold text-ink">
          {data.totalPracticesCompleted}
        </p>
        <p className="text-[11px] text-ink-muted">Completed exercises</p>
      </div>

      <div className="rounded-2xl border border-line bg-surface p-4 space-y-1 shadow-xs">
        <div className="flex items-center gap-1.5 text-xs text-ink-muted">
          <FileQuestion className="h-4 w-4 text-amber-500" />
          <span>Knowledge Checks</span>
        </div>
        <p className="font-display text-2xl font-bold text-ink">
          {data.totalKnowledgeChecksCompleted}
        </p>
        <p className="text-[11px] text-ink-muted">Module checkpoints</p>
      </div>
    </div>
  );
}

// ============================================================================
// 3. LEARNING JOURNEY ROADMAP CARDS
// ============================================================================
export function PathCompletionJourney({ data }: { data: LearningPathCompletionData }) {
  const getStepIcon = (iconName: string, accentColor: string) => {
    switch (accentColor) {
      case "amber":
        return <Code2 className="h-5 w-5 text-amber-500" />;
      case "cyan":
        return <Palette className="h-5 w-5 text-cyan-500" />;
      case "gold":
        return <Braces className="h-5 w-5 text-yellow-500" />;
      case "purple":
      default:
        return <Rocket className="h-5 w-5 text-purple-500" />;
    }
  };

  return (
    <div className="rounded-3xl border border-line bg-surface p-6 sm:p-8 space-y-6 shadow-sm">
      <div className="space-y-1">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-ink-muted">
          <Layers className="h-4 w-4 text-primary" />
          <span>Sequential Roadmap</span>
        </div>
        <h2 className="font-display text-lg sm:text-xl font-bold text-ink">
          Your learning journey
        </h2>
      </div>

      <div className="space-y-4">
        {data.roadmapJourney.map((item, idx) => (
          <div
            key={item.id || idx}
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-2xl border border-line bg-surface-elevated/20 p-5 transition hover:border-line-hover"
          >
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-surface border border-line shadow-xs mt-0.5">
                {getStepIcon(item.iconName, item.accentColor)}
              </div>

              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-[10px] font-bold uppercase text-ink-muted">
                    {item.stepLabel}
                  </span>
                  <h3 className="font-display text-base font-bold text-ink">
                    {item.title}
                  </h3>
                  <Badge variant="outline" className="border-emerald-500/30 bg-emerald-500/10 text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
                    Completed
                  </Badge>
                </div>
                <p className="text-xs text-ink-muted leading-relaxed max-w-2xl">
                  {item.description}
                </p>
              </div>
            </div>

            <Button asChild variant="outline" size="sm" className="rounded-xl border-line text-xs font-semibold hover:border-primary/40 shrink-0">
              <Link href={item.href}>
                <span>Review</span>
                <ArrowRight className="ml-1.5 h-3.5 w-3.5 text-ink-muted" />
              </Link>
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// 4. SKILLS COVERED
// ============================================================================
export function PathSkillsSummary({ data }: { data: LearningPathCompletionData }) {
  if (!data.skillsCovered || data.skillsCovered.length === 0) return null;

  return (
    <div className="rounded-3xl border border-line bg-surface p-6 sm:p-8 space-y-4 shadow-sm">
      <div className="space-y-1">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-ink-muted">
          <Sparkles className="h-4 w-4 text-primary" />
          <span>Core Competencies</span>
        </div>
        <h2 className="font-display text-lg sm:text-xl font-bold text-ink">
          Skills you practiced
        </h2>
        <p className="text-xs text-ink-muted">
          You worked across foundational web development domains throughout this learning journey.
        </p>
      </div>

      <div className="flex flex-wrap gap-2 pt-2">
        {data.skillsCovered.map((skill, idx) => (
          <div
            key={idx}
            className="flex items-center gap-1.5 rounded-xl border border-line bg-surface-elevated/40 px-3 py-1.5 text-xs font-medium text-ink"
          >
            <Check className="h-3 w-3 text-emerald-500" />
            <span>{skill}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// 5. NEXT DIRECTION COMPONENT
// ============================================================================
export function PathNextDirection({ data }: { data: LearningPathCompletionData }) {
  const next = data.nextDirection;

  return (
    <div className="rounded-3xl border border-line bg-surface p-6 sm:p-8 space-y-4 shadow-sm">
      <div className="space-y-1">
        <h2 className="font-display text-lg sm:text-xl font-bold text-ink">
          {next.title}
        </h2>
        <p className="text-sm text-ink-muted leading-relaxed max-w-3xl">
          {next.description}
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3 pt-2">
        {next.actions.map((act, idx) => (
          <Button
            key={idx}
            asChild
            variant={act.variant === "primary" ? "default" : "outline"}
            size="lg"
            className={`rounded-xl font-semibold ${act.variant === "primary" ? "bg-primary text-white hover:bg-primary/90" : "border-line text-ink hover:bg-surface-elevated"}`}
          >
            <Link href={act.href}>
              <span>{act.label}</span>
              {act.variant === "primary" && <ArrowRight className="ml-2 h-4 w-4" />}
            </Link>
          </Button>
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// 6. UNIFIED LEARNING PATH COMPLETION VIEW
// ============================================================================
export function LearningPathCompletionView({ data }: { data: LearningPathCompletionData }) {
  return (
    <div className="mx-auto max-w-5xl space-y-8 pb-16">
      {/* 1. Hero */}
      <PathCompletionHero data={data} />

      {/* 2. Path Summary Metrics */}
      <PathSummaryMetrics data={data} />

      {/* 3. Learning Journey Roadmap */}
      <PathCompletionJourney data={data} />

      {/* 4. Skills Summary */}
      <PathSkillsSummary data={data} />

      {/* 5. Next Direction */}
      <PathNextDirection data={data} />
    </div>
  );
}
