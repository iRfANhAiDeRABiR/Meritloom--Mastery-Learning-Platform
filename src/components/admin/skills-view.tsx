"use client";

import * as React from "react";
import { Loader2, Plus, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { createSkillAction } from "@/lib/actions/admin";
import { generateSlug } from "@/lib/utils/youtube-importer";

interface SkillsViewProps {
  skills: { id: string; name: string; slug: string; description: string | null; courseCount: number }[];
}

export function SkillsView({ skills }: SkillsViewProps) {
  const [showModal, setShowModal] = React.useState(false);
  const [name, setName] = React.useState("");
  const [slug, setSlug] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setName(val);
    setSlug(generateSlug(val));
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const res = await createSkillAction({ name, slug, description });
      if (res.success) {
        setShowModal(false);
        setName("");
        setSlug("");
        setDescription("");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl">
            Skills
          </h1>
          <p className="mt-1 text-sm text-ink-muted">
            Manage granular technical skills and competencies attached to courses.
          </p>
        </div>
        <Button
          type="button"
          onClick={() => setShowModal(true)}
          className="rounded-xl bg-primary px-4 py-2 font-semibold text-white shadow-sm hover:bg-primary/90"
        >
          <Plus className="mr-1.5 h-4 w-4" />
          <span>New Skill</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {skills.map((skill) => (
          <div
            key={skill.id}
            className="flex items-start justify-between rounded-2xl border border-line bg-surface p-5 shadow-sm"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary shrink-0" />
                <h3 className="font-display text-sm font-bold text-ink">{skill.name}</h3>
              </div>
              <p className="font-mono text-[11px] text-ink-muted">/{skill.slug}</p>
              {skill.description && (
                <p className="text-xs text-ink-muted line-clamp-2 pt-1">{skill.description}</p>
              )}
            </div>
            <Badge variant="outline" className="border-line text-[10px] shrink-0">
              {skill.courseCount} {skill.courseCount === 1 ? "course" : "courses"}
            </Badge>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-line bg-surface p-6 shadow-2xl">
            <h3 className="font-display text-lg font-bold text-ink">Add Skill</h3>
            <form onSubmit={handleCreate} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-ink-muted">
                  Skill Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={handleNameChange}
                  placeholder="e.g. DOM Manipulation"
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
                  placeholder="dom-manipulation"
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
                  placeholder="Skill explanation..."
                  className="mt-1.5 w-full rounded-xl border border-line bg-surface-elevated p-3 text-xs text-ink focus:border-primary focus:outline-none"
                />
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
                  {isSubmitting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Create Skill"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
