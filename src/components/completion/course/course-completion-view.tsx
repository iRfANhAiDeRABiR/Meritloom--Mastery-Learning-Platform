import * as React from "react";
import Link from "next/link";
import {
  ArrowRight,
  Bookmark,
  BookOpen,
  Check,
  CheckCircle2,
  Clock,
  Code2,
  ExternalLink,
  FileQuestion,
  FileText,
  GraduationCap,
  Layers,
  Lightbulb,
  Lock,
  Play,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { CourseCompletionData } from "@/lib/completion/types";

// ============================================================================
// 1. HERO COMPONENT
// ============================================================================
export function CourseCompletionHero({ data }: { data: CourseCompletionData }) {
  const getCourseTheme = () => {
    if (data.courseSlug.includes("html")) {
      return {
        bg: "from-amber-500/10 via-amber-500/5 to-transparent",
        badge: "border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400",
        accent: "text-amber-500",
        border: "border-amber-500/20",
      };
    }
    if (data.courseSlug.includes("css")) {
      return {
        bg: "from-cyan-500/10 via-cyan-500/5 to-transparent",
        badge: "border-cyan-500/30 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400",
        accent: "text-cyan-500",
        border: "border-cyan-500/20",
      };
    }
    if (data.courseSlug.includes("javascript")) {
      return {
        bg: "from-yellow-500/10 via-yellow-500/5 to-transparent",
        badge: "border-yellow-500/30 bg-yellow-500/10 text-yellow-600 dark:text-yellow-400",
        accent: "text-yellow-500",
        border: "border-yellow-500/20",
      };
    }
    return {
      bg: "from-primary/10 via-primary/5 to-transparent",
      badge: "border-primary/30 bg-primary/10 text-primary",
      accent: "text-primary",
      border: "border-primary/20",
    };
  };

  const theme = getCourseTheme();

  return (
    <div className={`relative overflow-hidden rounded-3xl border border-line bg-gradient-to-b ${theme.bg} p-6 sm:p-10 shadow-sm`}>
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-4 max-w-2xl">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline" className={`font-mono text-xs uppercase font-bold tracking-wider ${theme.badge}`}>
              <Check className="mr-1 h-3.5 w-3.5" />
              Course Complete
            </Badge>
            {data.completedAt && (
              <span className="text-xs text-ink-muted">
                Completed on {new Date(data.completedAt).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}
              </span>
            )}
          </div>

          <h1 className="font-display text-2xl font-bold tracking-tight text-ink sm:text-4xl">
            You completed {data.courseTitle}
          </h1>

          <p className="text-sm sm:text-base leading-relaxed text-ink-muted">
            You worked through the full curriculum, including lessons, practice activities, and Knowledge Checks.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Button asChild size="lg" className="rounded-xl bg-primary font-semibold text-white shadow-sm hover:bg-primary/90">
              <Link href={data.nextStep.href}>
                <span>{data.nextStep.ctaText}</span>
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="rounded-xl border-line font-semibold text-ink hover:bg-surface-elevated">
              <Link href={`/learn/courses/${data.courseSlug}`}>
                <RotateCcw className="mr-2 h-4 w-4 text-ink-muted" />
                <span>Review Course</span>
              </Link>
            </Button>
          </div>
        </div>

        {/* Minimalist Visual Module Roadmap Checklist */}
        <div className="rounded-2xl border border-line bg-surface/80 p-4 sm:p-5 backdrop-blur-sm shadow-sm space-y-2.5 min-w-[260px]">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-ink-muted pb-1 border-b border-line">
            <span>Course Progress</span>
            <span className="text-emerald-500 font-mono">100%</span>
          </div>
          <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
            {data.moduleSummaries.map((mod, idx) => (
              <div key={mod.id || idx} className="flex items-center justify-between gap-3 text-xs">
                <span className="text-ink truncate font-medium max-w-[180px]">
                  {idx + 1}. {mod.title}
                </span>
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
// 2. METRICS COMPONENT
// ============================================================================
export function CourseCompletionMetrics({ data }: { data: CourseCompletionData }) {
  const estimatedHours = Math.round((data.estimatedMinutes / 60) * 10) / 10;

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
      <div className="rounded-2xl border border-line bg-surface p-4 space-y-1 shadow-xs">
        <div className="flex items-center gap-1.5 text-xs text-ink-muted">
          <Layers className="h-4 w-4 text-primary" />
          <span>Modules</span>
        </div>
        <p className="font-display text-2xl font-bold text-ink">
          {data.completedModules} <span className="text-xs font-normal text-ink-muted">/ {data.totalModules}</span>
        </p>
        <p className="text-[11px] text-ink-muted">100% completed</p>
      </div>

      <div className="rounded-2xl border border-line bg-surface p-4 space-y-1 shadow-xs">
        <div className="flex items-center gap-1.5 text-xs text-ink-muted">
          <BookOpen className="h-4 w-4 text-emerald-500" />
          <span>Activities</span>
        </div>
        <p className="font-display text-2xl font-bold text-ink">
          {data.completedRequiredLessons}
        </p>
        <p className="text-[11px] text-ink-muted">Required lessons</p>
      </div>

      <div className="rounded-2xl border border-line bg-surface p-4 space-y-1 shadow-xs">
        <div className="flex items-center gap-1.5 text-xs text-ink-muted">
          <Code2 className="h-4 w-4 text-blue-500" />
          <span>Practice Tasks</span>
        </div>
        <p className="font-display text-2xl font-bold text-ink">
          {data.completedPractices > 0 ? data.completedPractices : data.totalPractices}
        </p>
        <p className="text-[11px] text-ink-muted">Hands-on exercises</p>
      </div>

      <div className="rounded-2xl border border-line bg-surface p-4 space-y-1 shadow-xs">
        <div className="flex items-center gap-1.5 text-xs text-ink-muted">
          <FileQuestion className="h-4 w-4 text-purple-500" />
          <span>Knowledge Checks</span>
        </div>
        <p className="font-display text-2xl font-bold text-ink">
          {data.completedKnowledgeChecks}
        </p>
        <p className="text-[11px] text-ink-muted">Module checkpoints</p>
      </div>

      <div className="rounded-2xl border border-line bg-surface p-4 space-y-1 shadow-xs">
        <div className="flex items-center gap-1.5 text-xs text-ink-muted">
          <Bookmark className="h-4 w-4 text-amber-500" />
          <span>Bookmarks & Notes</span>
        </div>
        <p className="font-display text-2xl font-bold text-ink">
          {data.notesCount + data.bookmarksCount}
        </p>
        <p className="text-[11px] text-ink-muted">
          {data.notesCount} notes • {data.bookmarksCount} saved
        </p>
      </div>

      <div className="rounded-2xl border border-line bg-surface p-4 space-y-1 shadow-xs">
        <div className="flex items-center gap-1.5 text-xs text-ink-muted">
          <Clock className="h-4 w-4 text-ink-muted" />
          <span>Content Length</span>
        </div>
        <p className="font-display text-2xl font-bold text-ink">
          ~{estimatedHours}h
        </p>
        <p className="text-[11px] text-ink-muted">Estimated course length</p>
      </div>
    </div>
  );
}

// ============================================================================
// 3. WHERE TO GO NEXT COMPONENT
// ============================================================================
export function CourseNextStep({ data }: { data: CourseCompletionData }) {
  const next = data.nextStep;

  return (
    <div className="rounded-3xl border border-primary/30 bg-primary/5 p-6 sm:p-8 space-y-4 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Badge className="bg-primary text-white font-mono text-[10px] uppercase font-bold tracking-wider">
            Where to go next
          </Badge>
          {next.pathTitle && (
            <span className="text-xs font-semibold text-primary">
              Part of {next.pathTitle}
            </span>
          )}
        </div>
        {next.status && (
          <Badge variant="outline" className="border-line bg-surface text-xs font-mono">
            {next.status === "in_progress" ? "In Progress" : next.status === "completed" ? "Completed" : "Next Up"}
          </Badge>
        )}
      </div>

      <div className="space-y-1.5">
        <h3 className="font-display text-xl sm:text-2xl font-bold text-ink">
          {next.title}
        </h3>
        <p className="text-sm text-ink-muted leading-relaxed max-w-3xl">
          {next.description}
        </p>
      </div>

      <div className="pt-2">
        <Button asChild size="lg" className="rounded-xl bg-primary font-semibold text-white shadow-sm hover:bg-primary/90">
          <Link href={next.href}>
            <span>{next.ctaText}</span>
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
}

// ============================================================================
// 4. WHAT YOU COVERED (OUTCOMES)
// ============================================================================
export function CompletionOutcomes({ data }: { data: CourseCompletionData }) {
  if (!data.learningOutcomes || data.learningOutcomes.length === 0) return null;

  return (
    <div className="rounded-3xl border border-line bg-surface p-6 sm:p-8 space-y-4 shadow-sm">
      <div className="space-y-1">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-ink-muted">
          <Sparkles className="h-4 w-4 text-primary" />
          <span>Skills & Concepts</span>
        </div>
        <h2 className="font-display text-lg sm:text-xl font-bold text-ink">
          What you covered in this course
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
        {data.learningOutcomes.map((outcome, idx) => (
          <div key={idx} className="flex items-start gap-3 rounded-2xl border border-line bg-surface-elevated/40 p-4">
            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 mt-0.5">
              <Check className="h-3.5 w-3.5" />
            </div>
            <p className="text-xs sm:text-sm font-medium text-ink leading-relaxed">
              {outcome}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// 5. COURSE JOURNEY REVIEW
// ============================================================================
export function CourseJourneyReview({ data }: { data: CourseCompletionData }) {
  return (
    <div className="rounded-3xl border border-line bg-surface p-6 sm:p-8 space-y-6 shadow-sm">
      <div className="space-y-1">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-ink-muted">
          <Layers className="h-4 w-4 text-primary" />
          <span>Curriculum Breakdown</span>
        </div>
        <h2 className="font-display text-lg sm:text-xl font-bold text-ink">
          Course journey
        </h2>
      </div>

      <div className="space-y-3">
        {data.moduleSummaries.filter((m) => !m.isBonus).map((mod, idx) => (
          <div
            key={mod.id || idx}
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-2xl border border-line bg-surface-elevated/20 p-4 transition hover:border-line-hover"
          >
            <div className="flex items-start gap-3.5">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono text-xs font-bold">
                {idx + 1 < 10 ? `0${idx + 1}` : idx + 1}
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <h3 className="font-display text-sm font-bold text-ink">
                    {mod.title}
                  </h3>
                  <Badge variant="outline" className="border-emerald-500/30 bg-emerald-500/10 text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
                    Completed
                  </Badge>
                </div>
                <p className="text-xs text-ink-muted">
                  {mod.lessonCount} lessons • {mod.practiceCount > 0 ? `${mod.practiceCount} practice • ` : ""}{mod.quizCount > 0 ? "1 Knowledge Check" : "instructional"}
                </p>
              </div>
            </div>

            <Button asChild variant="outline" size="sm" className="rounded-xl border-line text-xs font-semibold hover:border-primary/40 shrink-0">
              <Link href={`/learn/courses/${data.courseSlug}/lessons/${mod.firstLessonSlug || ""}`}>
                <span>View module</span>
                <ArrowRight className="ml-1.5 h-3.5 w-3.5 text-ink-muted" />
              </Link>
            </Button>
          </div>
        ))}
      </div>

      {/* Optional Bonus Content */}
      {data.bonusLessons.length > 0 && (
        <div className="rounded-2xl border border-purple-500/20 bg-purple-500/5 p-4 sm:p-5 space-y-3 mt-4">
          <div className="flex items-center gap-2">
            <Badge className="bg-purple-500/20 text-purple-700 dark:text-purple-300 font-mono text-[10px] uppercase font-bold">
              Optional Bonus Content
            </Badge>
          </div>
          {data.bonusLessons.map((b) => (
            <div key={b.id} className="flex items-center justify-between gap-4">
              <div className="space-y-0.5">
                <p className="text-xs font-bold text-ink">{b.title}</p>
                <p className="text-[11px] text-ink-muted">Behind-the-scenes & bonus videos (does not block course completion)</p>
              </div>
              <Button asChild variant="outline" size="sm" className="rounded-xl border-line text-xs">
                <Link href={`/learn/courses/${data.courseSlug}/lessons/${b.slug}`}>
                  <Play className="mr-1.5 h-3.5 w-3.5 text-purple-500" />
                  <span>View bonus</span>
                </Link>
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ============================================================================
// 6. KNOWLEDGE CHECK REVIEW
// ============================================================================
export function KnowledgeCheckReview({ data }: { data: CourseCompletionData }) {
  if (!data.quizReviews || data.quizReviews.length === 0) return null;

  return (
    <div className="rounded-3xl border border-line bg-surface p-6 sm:p-8 space-y-6 shadow-sm">
      <div className="space-y-1">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-ink-muted">
          <FileQuestion className="h-4 w-4 text-purple-500" />
          <span>Checkpoint Self-Assessment</span>
        </div>
        <h2 className="font-display text-lg sm:text-xl font-bold text-ink">
          Knowledge Check review
        </h2>
        <p className="text-xs text-ink-muted">
          Review your checkpoint responses. Unlimited retries are always available.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {data.quizReviews.map((qr) => {
          const attempt = qr.latestAttempt;
          const score = attempt ? `${attempt.correctCount} / ${attempt.totalQuestions}` : "Completed";

          let scoreBadgeColor = "border-line bg-surface-elevated text-ink";
          if (attempt) {
            const pct = attempt.correctCount / attempt.totalQuestions;
            if (pct >= 0.8) scoreBadgeColor = "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300";
            else if (pct >= 0.5) scoreBadgeColor = "border-purple-500/30 bg-purple-500/10 text-purple-700 dark:text-purple-300";
            else scoreBadgeColor = "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300";
          }

          return (
            <div
              key={qr.moduleId}
              className="flex flex-col justify-between gap-3 rounded-2xl border border-line bg-surface-elevated/30 p-4"
            >
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase font-mono text-ink-muted">
                  Module {qr.modulePosition} Checkpoint
                </span>
                <h3 className="font-display text-xs sm:text-sm font-bold text-ink">
                  {qr.quizTitle}
                </h3>
              </div>

              <div className="flex items-center justify-between pt-1">
                <Badge variant="outline" className={`font-mono text-xs font-semibold ${scoreBadgeColor}`}>
                  Latest attempt: {score}
                </Badge>

                <Button asChild variant="ghost" size="sm" className="h-8 text-xs text-primary font-semibold hover:bg-primary/10">
                  <Link href={`/learn/courses/${data.courseSlug}/lessons/${qr.lessonSlug}`}>
                    <span>Retest</span>
                    <ArrowRight className="ml-1 h-3 w-3" />
                  </Link>
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ============================================================================
// 7. TOPICS TO REVISIT
// ============================================================================
export function TopicsToRevisit({ data }: { data: CourseCompletionData }) {
  const hasTopics = data.topicsToReview && data.topicsToReview.length > 0;

  return (
    <div className="rounded-3xl border border-line bg-surface p-6 sm:p-8 space-y-4 shadow-sm">
      <div className="space-y-1">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-ink-muted">
          <Lightbulb className="h-4 w-4 text-amber-500" />
          <span>Recommended Review</span>
        </div>
        <h2 className="font-display text-lg sm:text-xl font-bold text-ink">
          Topics you may want to revisit
        </h2>
      </div>

      {hasTopics ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          {data.topicsToReview.map((item, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between gap-3 rounded-2xl border border-line bg-surface-elevated/40 p-4"
            >
              <div className="space-y-0.5">
                <p className="text-xs font-bold text-ink">{item.topic}</p>
                <p className="text-[11px] text-ink-muted">Worth a quick brush-up</p>
              </div>

              {item.recommendedLessonSlug ? (
                <Button asChild variant="outline" size="sm" className="rounded-xl border-line text-xs font-semibold">
                  <Link href={`/learn/courses/${data.courseSlug}/lessons/${item.recommendedLessonSlug}`}>
                    <span>Review</span>
                  </Link>
                </Button>
              ) : (
                <Button asChild variant="outline" size="sm" className="rounded-xl border-line text-xs font-semibold">
                  <Link href={`/learn/courses/${data.courseSlug}`}>
                    <span>Review</span>
                  </Link>
                </Button>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-line bg-surface-elevated/20 p-6 text-center text-xs text-ink-muted space-y-1">
          <CheckCircle2 className="mx-auto h-6 w-6 text-emerald-500/80 mb-1" />
          <p className="font-bold text-ink">Nothing specific to review right now</p>
          <p>You demonstrated solid understanding across all checkpoints. You can still revisit any lesson whenever you want.</p>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// 8. NOTES & BOOKMARKS
// ============================================================================
export function CompletionNotesBookmarks({ data }: { data: CourseCompletionData }) {
  const hasNotes = data.recentNotes && data.recentNotes.length > 0;
  const hasBookmarks = data.recentBookmarks && data.recentBookmarks.length > 0;

  if (!hasNotes && !hasBookmarks) return null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Notes Column */}
      {hasNotes && (
        <div className="rounded-3xl border border-line bg-surface p-6 sm:p-8 space-y-4 shadow-sm flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-ink-muted">
                <FileText className="h-4 w-4 text-primary" />
                <span>Your Notes ({data.notesCount})</span>
              </div>
              <Button asChild variant="ghost" size="sm" className="text-xs text-primary font-semibold">
                <Link href="/learn/notes">View all notes</Link>
              </Button>
            </div>

            <div className="space-y-2.5">
              {data.recentNotes.map((note) => (
                <div key={note.id} className="rounded-2xl border border-line bg-surface-elevated/40 p-3.5 space-y-1">
                  <div className="flex items-center justify-between text-[11px] text-ink-muted">
                    <span className="font-semibold text-ink truncate">{note.lessonTitle}</span>
                    <Link href={`/learn/courses/${data.courseSlug}/lessons/${note.lessonSlug}`} className="text-primary hover:underline">
                      Open
                    </Link>
                  </div>
                  <p className="text-xs text-ink-muted line-clamp-2">{note.content}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Bookmarks Column */}
      {hasBookmarks && (
        <div className="rounded-3xl border border-line bg-surface p-6 sm:p-8 space-y-4 shadow-sm flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-ink-muted">
                <Bookmark className="h-4 w-4 text-amber-500" />
                <span>Saved Lessons ({data.bookmarksCount})</span>
              </div>
              <Button asChild variant="ghost" size="sm" className="text-xs text-primary font-semibold">
                <Link href="/learn/notes">View all bookmarks</Link>
              </Button>
            </div>

            <div className="space-y-2.5">
              {data.recentBookmarks.map((b) => (
                <div key={b.id} className="flex items-center justify-between rounded-2xl border border-line bg-surface-elevated/40 p-3.5">
                  <div className="space-y-0.5">
                    <p className="text-xs font-bold text-ink">{b.lessonTitle}</p>
                    {b.moduleTitle && <p className="text-[11px] text-ink-muted">{b.moduleTitle}</p>}
                  </div>
                  <Button asChild variant="outline" size="sm" className="rounded-xl border-line text-xs">
                    <Link href={`/learn/courses/${data.courseSlug}/lessons/${b.lessonSlug}`}>
                      <span>Open</span>
                    </Link>
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// 9. UNIFIED COURSE COMPLETION VIEW
// ============================================================================
export function CourseCompletionView({ data }: { data: CourseCompletionData }) {
  return (
    <div className="mx-auto max-w-5xl space-y-8 pb-16">
      {/* 1. Hero */}
      <CourseCompletionHero data={data} />

      {/* 2. Next Step (Near top on mobile for actionable navigation) */}
      <CourseNextStep data={data} />

      {/* 3. Real Metrics */}
      <CourseCompletionMetrics data={data} />

      {/* 4. What you covered */}
      <CompletionOutcomes data={data} />

      {/* 5. Course Journey */}
      <CourseJourneyReview data={data} />

      {/* 6. Knowledge Check Review */}
      <KnowledgeCheckReview data={data} />

      {/* 7. Topics to Revisit */}
      <TopicsToRevisit data={data} />

      {/* 8. Notes & Bookmarks */}
      <CompletionNotesBookmarks data={data} />

      {/* 9. Bottom Course Review CTA */}
      <div className="flex flex-col items-center justify-center rounded-3xl border border-line bg-surface p-8 text-center space-y-3">
        <p className="text-sm font-bold text-ink">Want to revisit this course again?</p>
        <p className="text-xs text-ink-muted max-w-md">
          Completing a course never locks it. You can reopen any lesson, edit practice files, or re-test your knowledge anytime.
        </p>
        <Button asChild variant="outline" size="lg" className="rounded-xl border-line font-semibold text-xs mt-2">
          <Link href={`/learn/courses/${data.courseSlug}`}>
            <RotateCcw className="mr-2 h-4 w-4 text-ink-muted" />
            <span>Review Full Course</span>
          </Link>
        </Button>
      </div>
    </div>
  );
}
