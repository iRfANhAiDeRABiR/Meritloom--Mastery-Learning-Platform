"use client";

import * as React from "react";
import { Layers, Loader2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { createCategoryAction } from "@/lib/actions/admin";
import { generateSlug } from "@/lib/utils/youtube-importer";
import type { Category } from "@/lib/types";

interface CategoriesViewProps {
  categories: Category[];
}

export function CategoriesView({ categories }: CategoriesViewProps) {
  const [showModal, setShowModal] = React.useState(false);
  const [name, setName] = React.useState("");
  const [slug, setSlug] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [iconName, setIconName] = React.useState("Layers");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setName(val);
    setSlug(generateSlug(val));
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || isSubmitting) return;

    setIsSubmitting(true);
    setError(null);
    try {
      const res = await createCategoryAction({
        name,
        slug,
        description,
        iconName,
      });

      if (!res.success) {
        setError(res.error || "Failed to create category.");
      } else {
        setShowModal(false);
        setName("");
        setSlug("");
        setDescription("");
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to create category.";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl">
            Categories
          </h1>
          <p className="mt-1 text-sm text-ink-muted">
            Manage course topics and taxonomy displayed on the discovery catalog.
          </p>
        </div>
        <Button
          type="button"
          onClick={() => setShowModal(true)}
          className="rounded-xl bg-primary px-4 py-2 font-semibold text-white shadow-sm hover:bg-primary/90"
        >
          <Plus className="mr-1.5 h-4 w-4" />
          <span>New Category</span>
        </Button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-line bg-surface shadow-sm">
        <div className="divide-y divide-line">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Layers className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-display text-base font-bold text-ink">{cat.name}</h3>
                    <Badge variant="outline" className="border-line font-mono text-[10px]">
                      /{cat.slug}
                    </Badge>
                  </div>
                  <p className="text-xs text-ink-muted">{cat.description || "No description provided."}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 text-xs text-ink-muted">
                <span className="font-semibold text-ink">
                  {cat.courseCount ?? 0} published courses
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-line bg-surface p-6 shadow-2xl">
            <h3 className="font-display text-lg font-bold text-ink">Add Category</h3>
            {error && (
              <div className="mt-3 rounded-xl border border-rose-500/20 bg-rose-500/10 p-3 text-xs font-semibold text-rose-600 dark:text-rose-400">
                {error}
              </div>
            )}
            <form onSubmit={handleCreate} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-ink-muted">
                  Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={handleNameChange}
                  placeholder="e.g. Data Science"
                  className="mt-1.5 h-10 w-full rounded-xl border border-line bg-surface-elevated px-3 text-xs text-ink focus:border-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-ink-muted">
                  Slug *
                </label>
                <input
                  type="text"
                  required
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="data-science"
                  className="mt-1.5 h-10 w-full rounded-xl border border-line bg-surface-elevated px-3 font-mono text-xs text-ink focus:border-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-ink-muted">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Topic summary..."
                  className="mt-1.5 w-full rounded-xl border border-line bg-surface-elevated p-3 text-xs text-ink focus:border-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-ink-muted">
                  Icon
                </label>
                <select
                  value={iconName}
                  onChange={(e) => setIconName(e.target.value)}
                  className="mt-1.5 h-10 w-full rounded-xl border border-line bg-surface-elevated px-3 text-xs text-ink focus:border-primary focus:outline-none"
                >
                  <option value="Layers">Layers</option>
                  <option value="Code2">Code2</option>
                  <option value="Database">Database</option>
                  <option value="Palette">Palette</option>
                  <option value="Calculator">Calculator</option>
                  <option value="BriefcaseBusiness">BriefcaseBusiness</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowModal(false)}
                  className="rounded-xl border-line text-xs font-semibold"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting || !name.trim()}
                  size="sm"
                  className="rounded-xl bg-primary text-xs font-semibold text-white"
                >
                  {isSubmitting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Create Category"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
