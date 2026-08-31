"use client";

import * as React from "react";
import { Check, Loader2, Plus, Save, Search, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createSkillAction, updateCourseSkillsAction } from "@/lib/actions/admin";
import { generateSlug } from "@/lib/utils/youtube-importer";
import type { AdminCourseDetail } from "@/lib/types";

interface SkillsTabProps {
  course: AdminCourseDetail;
  allSkills: { id: string; name: string; slug: string }[];
}

export function SkillsTab({ course, allSkills }: SkillsTabProps) {
  const [selectedSkillIds, setSelectedSkillIds] = React.useState<Set<string>>(
    new Set(course.skills.map((s) => s.id)),
  );
  const [search, setSearch] = React.useState("");
  const [isSaving, setIsSaving] = React.useState(false);
  const [msg, setMsg] = React.useState<string | null>(null);

  // New Skill Modal state
  const [showNewModal, setShowNewModal] = React.useState(false);
  const [newSkillName, setNewSkillName] = React.useState("");
  const [isCreating, setIsCreating] = React.useState(false);

  const toggleSkill = (id: string) => {
    const next = new Set(selectedSkillIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedSkillIds(next);
  };

  const handleSave = async () => {
    setIsSaving(true);
    setMsg(null);
    try {
      const res = await updateCourseSkillsAction(course.id, Array.from(selectedSkillIds));
      if (res.success) setMsg("Skills updated successfully.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCreateSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkillName.trim() || isCreating) return;

    setIsCreating(true);
    try {
      const res = await createSkillAction({
        name: newSkillName.trim(),
        slug: generateSlug(newSkillName),
      });

      if (res.success && res.data?.skillId) {
        setSelectedSkillIds(new Set([...Array.from(selectedSkillIds), res.data.skillId]));
        setShowNewModal(false);
        setNewSkillName("");
      }
    } finally {
      setIsCreating(false);
    }
  };

  const filteredSkills = allSkills.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      {msg && (
        <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-3 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
          {msg}
        </div>
      )}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-display text-base font-bold text-ink">Course Skills</h2>
          <p className="text-xs text-ink-muted">
            Attach relevant technical skills tagged to this course.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setShowNewModal(true)}
            className="rounded-xl border-line text-xs font-semibold"
          >
            <Plus className="mr-1 h-3.5 w-3.5" />
            <span>New Skill</span>
          </Button>
          <Button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            size="sm"
            className="rounded-xl bg-primary text-xs font-semibold text-white hover:bg-primary/90"
          >
            {isSaving ? (
              <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
            ) : (
              <Save className="mr-1.5 h-3.5 w-3.5" />
            )}
            <span>Save Skills</span>
          </Button>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Filter skills..."
          className="h-10 w-full rounded-xl border border-line bg-surface-elevated pl-9 pr-4 text-xs text-ink focus:border-primary focus:outline-none"
        />
      </div>

      {/* Skills Grid */}
      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 md:grid-cols-4">
        {filteredSkills.map((skill) => {
          const isSelected = selectedSkillIds.has(skill.id);
          return (
            <button
              key={skill.id}
              type="button"
              onClick={() => toggleSkill(skill.id)}
              className={`flex items-center justify-between rounded-xl border p-3 text-left transition ${
                isSelected
                  ? "border-primary bg-primary/10 text-primary font-semibold"
                  : "border-line bg-surface text-ink hover:border-primary/40"
              }`}
            >
              <div className="flex items-center gap-2 truncate">
                <Sparkles className={`h-3.5 w-3.5 shrink-0 ${isSelected ? "text-primary" : "text-ink-muted"}`} />
                <span className="text-xs truncate">{skill.name}</span>
              </div>
              {isSelected && <Check className="h-4 w-4 shrink-0 text-primary" />}
            </button>
          );
        })}
      </div>

      {/* New Skill Modal */}
      {showNewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl border border-line bg-surface p-6 shadow-2xl">
            <h3 className="font-display text-base font-bold text-ink">Create New Skill</h3>
            <p className="mt-1 text-xs text-ink-muted">Add a global skill tag to the platform.</p>
            <form onSubmit={handleCreateSkill} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-ink-muted">
                  Skill Name *
                </label>
                <input
                  type="text"
                  required
                  value={newSkillName}
                  onChange={(e) => setNewSkillName(e.target.value)}
                  placeholder="e.g. Asynchronous JavaScript"
                  className="mt-1.5 h-10 w-full rounded-xl border border-line bg-surface-elevated px-3 text-xs text-ink focus:border-primary focus:outline-none"
                />
              </div>
              <div className="flex items-center justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowNewModal(false)}
                  className="rounded-xl border-line text-xs font-semibold"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isCreating || !newSkillName.trim()}
                  size="sm"
                  className="rounded-xl bg-primary text-xs font-semibold text-white"
                >
                  {isCreating ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Create Skill"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
