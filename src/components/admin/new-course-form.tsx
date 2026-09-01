"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createCourseAction } from "@/lib/actions/admin";
import { generateSlug } from "@/lib/utils/youtube-importer";
import type { AdminInstructorDetail, Category, CourseDifficulty } from "@/lib/types";

interface NewCourseFormProps {
  categories: Category[];
  instructors?: AdminInstructorDetail[];
}

export function NewCourseForm({ categories, instructors = [] }: NewCourseFormProps) {
  const router = useRouter();
  const [title, setTitle] = React.useState("");
  const [slug, setSlug] = React.useState("");
  const [summary, setSummary] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [categoryId, setCategoryId] = React.useState(categories[0]?.id || "");
  const [instructorProfileId, setInstructorProfileId] = React.useState("");
  const [difficulty, setDifficulty] = React.useState<CourseDifficulty>("beginner");
  const [language, setLanguage] = React.useState("English");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setTitle(val);
    setSlug(generateSlug(val));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setError(null);
    setIsSubmitting(true);

    try {
      const res = await createCourseAction({
        title,
        slug,
        summary,
        description,
        categoryId: categoryId || null,
        instructorProfileId: instructorProfileId || null,
        difficulty,
        language,
      });

      if (!res.success || !res.data) {
        setError(res.error || "Failed to create course.");
        setIsSubmitting(false);
        return;
      }

      router.push(`/admin/courses/${res.data.courseId}`);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "An unexpected error occurred.";
      setError(message);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-center gap-3">
        <Button asChild variant="outline" size="sm" className="rounded-xl border-line text-xs font-semibold">
          <Link href="/admin/courses">
            <ArrowLeft className="mr-1.5 h-3.5 w-3.5" />
            <span>Back to courses</span>
          </Link>
        </Button>
      </div>

      <div className="rounded-2xl border border-line bg-surface p-6 shadow-sm md:p-8">
        <div className="border-b border-line pb-4">
          <h1 className="font-display text-2xl font-bold tracking-tight text-ink">
            Create New Course
          </h1>
          <p className="mt-1 text-sm text-ink-muted">
            Set up the basic course details. You can add modules, video playlists, and lessons right after.
          </p>
        </div>

        {error && (
          <div className="mt-4 rounded-xl border border-rose-500/20 bg-rose-500/10 p-3.5 text-xs font-semibold text-rose-600 dark:text-rose-400">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-ink-muted">
              Course Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={handleTitleChange}
              placeholder="e.g. JavaScript Fundamentals"
              className="mt-1.5 h-11 w-full rounded-xl border border-line bg-surface-elevated px-3.5 text-sm text-ink placeholder:text-ink-muted focus:border-primary focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-ink-muted">
              URL Slug *
            </label>
            <input
              type="text"
              required
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="javascript-fundamentals"
              className="mt-1.5 h-11 w-full rounded-xl border border-line bg-surface-elevated px-3.5 text-sm font-mono text-ink placeholder:text-ink-muted focus:border-primary focus:outline-none"
            />
            <p className="mt-1 text-xs text-ink-muted">
              Route: /courses/{slug || "..."}
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-ink-muted">
              Short Summary
            </label>
            <textarea
              rows={2}
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="A concise overview of what learners will accomplish in this course."
              className="mt-1.5 w-full rounded-xl border border-line bg-surface-elevated p-3.5 text-sm text-ink placeholder:text-ink-muted focus:border-primary focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-ink-muted">
              Full Description
            </label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detailed syllabus introduction and learning goals..."
              className="mt-1.5 w-full rounded-xl border border-line bg-surface-elevated p-3.5 text-sm text-ink placeholder:text-ink-muted focus:border-primary focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-ink-muted">
                Category
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="mt-1.5 h-11 w-full rounded-xl border border-line bg-surface-elevated px-3 text-sm text-ink focus:border-primary focus:outline-none"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-ink-muted">
                Instructor
              </label>
              <select
                value={instructorProfileId}
                onChange={(e) => setInstructorProfileId(e.target.value)}
                className="mt-1.5 h-11 w-full rounded-xl border border-line bg-surface-elevated px-3 text-sm text-ink focus:border-primary focus:outline-none"
              >
                <option value="">None (Standard)</option>
                {instructors.map((i) => (
                  <option key={i.id} value={i.id}>
                    {i.displayName}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-ink-muted">
                Difficulty
              </label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as CourseDifficulty)}
                className="mt-1.5 h-11 w-full rounded-xl border border-line bg-surface-elevated px-3 text-sm text-ink focus:border-primary focus:outline-none"
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-ink-muted">
                Language
              </label>
              <input
                type="text"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="mt-1.5 h-11 w-full rounded-xl border border-line bg-surface-elevated px-3 text-sm text-ink focus:border-primary focus:outline-none"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 border-t border-line pt-5">
            <Button asChild variant="outline" className="rounded-xl border-line text-xs font-semibold">
              <Link href="/admin/courses">Cancel</Link>
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !title || !slug}
              className="rounded-xl bg-primary px-6 font-semibold text-white hover:bg-primary/90"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  <span>Creating Draft...</span>
                </>
              ) : (
                <span>Create & Continue</span>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
