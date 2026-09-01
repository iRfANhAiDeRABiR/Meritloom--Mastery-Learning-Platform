"use client";

import * as React from "react";
import {
  BookOpen,
  Edit2,
  Globe,
  Loader2,
  Plus,
  Trash2,
  UserCheck,
  Users,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  createInstructorAction,
  deleteInstructorAction,
  updateInstructorAction,
} from "@/lib/actions/admin";
import { notify } from "@/lib/notifications/toast";
import type { AdminInstructorDetail } from "@/lib/types";

interface InstructorsViewProps {
  initialInstructors: AdminInstructorDetail[];
}

export function InstructorsView({ initialInstructors }: InstructorsViewProps) {
  const [instructors, setInstructors] = React.useState<AdminInstructorDetail[]>(initialInstructors);
  const [editingInstructor, setEditingInstructor] = React.useState<AdminInstructorDetail | null>(null);
  const [showModal, setShowModal] = React.useState(false);

  // Form state
  const [displayName, setDisplayName] = React.useState("");
  const [title, setTitle] = React.useState("");
  const [bio, setBio] = React.useState("");
  const [avatarUrl, setAvatarUrl] = React.useState("");
  const [isPublished, setIsPublished] = React.useState(true);
  const [isSaving, setIsSaving] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const openNewModal = () => {
    setEditingInstructor(null);
    setDisplayName("");
    setTitle("");
    setBio("");
    setAvatarUrl("");
    setIsPublished(true);
    setError(null);
    setShowModal(true);
  };

  const openEditModal = (inst: AdminInstructorDetail) => {
    setEditingInstructor(inst);
    setDisplayName(inst.displayName);
    setTitle(inst.title || "");
    setBio(inst.bio || "");
    setAvatarUrl(inst.avatarUrl || "");
    setIsPublished(inst.isPublished);
    setError(null);
    setShowModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSaving || !displayName.trim()) return;

    setIsSaving(true);
    setError(null);

    try {
      if (editingInstructor) {
        const res = await updateInstructorAction(editingInstructor.id, {
          displayName: displayName.trim(),
          title: title.trim() || undefined,
          bio: bio.trim() || undefined,
          avatarUrl: avatarUrl.trim() || undefined,
          isPublished,
        });

        if (!res.success) {
          setError(res.error || "Failed to update instructor.");
          return;
        }

        setInstructors((prev) =>
          prev.map((item) =>
            item.id === editingInstructor.id
              ? {
                  ...item,
                  displayName: displayName.trim(),
                  title: title.trim() || null,
                  bio: bio.trim() || null,
                  avatarUrl: avatarUrl.trim() || null,
                  isPublished,
                }
              : item,
          ),
        );
        notify.success({ title: "Instructor profile updated" });
      } else {
        const res = await createInstructorAction({
          displayName: displayName.trim(),
          title: title.trim() || undefined,
          bio: bio.trim() || undefined,
          avatarUrl: avatarUrl.trim() || undefined,
          isPublished,
        });

        if (!res.success || !res.data) {
          setError(res.error || "Failed to create instructor.");
          return;
        }

        setInstructors((prev) => [
          ...prev,
          {
            id: res.data!.id,
            profileId: null,
            displayName: displayName.trim(),
            title: title.trim() || null,
            bio: bio.trim() || null,
            avatarUrl: avatarUrl.trim() || null,
            isPublished,
            courseCount: 0,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        ]);
        notify.success({ title: "Instructor profile created" });
      }

      setShowModal(false);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "An error occurred.";
      setError(msg);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete instructor "${name}"?`)) return;

    try {
      const res = await deleteInstructorAction(id);
      if (res.success) {
        setInstructors((prev) => prev.filter((i) => i.id !== id));
        notify.success({ title: "Instructor deleted" });
      } else {
        notify.error({ title: res.error || "Failed to delete instructor" });
      }
    } catch {
      notify.error({ title: "Failed to delete instructor" });
    }
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl">
            Instructors & Content Partners
          </h1>
          <p className="mt-1 text-sm text-ink-muted">
            Manage public instructor profiles and organizations linked to courses and video series.
          </p>
        </div>
        <Button onClick={openNewModal} className="rounded-xl bg-primary px-4 py-2 font-semibold text-white shadow-sm hover:bg-primary/90">
          <Plus className="mr-1.5 h-4 w-4" />
          <span>New Instructor</span>
        </Button>
      </div>

      {/* Instructors Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {instructors.map((inst) => (
          <div
            key={inst.id}
            className="flex flex-col justify-between rounded-2xl border border-line bg-surface p-5 shadow-sm transition hover:border-primary/40"
          >
            <div>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 font-bold text-primary">
                    {inst.displayName.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-display text-base font-bold text-ink">
                      {inst.displayName}
                    </h3>
                    <p className="text-xs text-ink-muted">{inst.title || "Content Creator"}</p>
                  </div>
                </div>

                {inst.isPublished ? (
                  <Badge className="border-emerald-500/20 bg-emerald-500/10 text-[10px] text-emerald-600 dark:text-emerald-400">
                    Active
                  </Badge>
                ) : (
                  <Badge variant="outline" className="border-line text-[10px] text-ink-muted">
                    Draft
                  </Badge>
                )}
              </div>

              {inst.bio && (
                <p className="mt-3 line-clamp-3 text-xs leading-relaxed text-ink-muted">
                  {inst.bio}
                </p>
              )}
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-line pt-3 text-xs text-ink-muted">
              <span className="flex items-center gap-1.5 font-medium">
                <BookOpen className="h-3.5 w-3.5 text-primary" />
                {inst.courseCount || 0} courses
              </span>

              <div className="flex items-center gap-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => openEditModal(inst)}
                  className="h-8 rounded-lg px-2.5 text-xs text-ink hover:bg-surface-elevated"
                >
                  <Edit2 className="mr-1 h-3.5 w-3.5 text-ink-muted" />
                  <span>Edit</span>
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(inst.id, inst.displayName)}
                  className="h-8 rounded-lg px-2 text-xs text-rose-600 hover:bg-rose-500/10 dark:text-rose-400"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl border border-line bg-surface p-6 shadow-xl">
            <div className="flex items-center justify-between border-b border-line pb-3">
              <h2 className="font-display text-lg font-bold text-ink">
                {editingInstructor ? "Edit Instructor" : "New Instructor Profile"}
              </h2>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="rounded-lg p-1 text-ink-muted hover:bg-surface-elevated hover:text-ink"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {error && (
              <div className="mt-4 rounded-xl border border-rose-500/20 bg-rose-500/10 p-3 text-xs font-semibold text-rose-600 dark:text-rose-400">
                {error}
              </div>
            )}

            <form onSubmit={handleSave} className="mt-4 space-y-4 text-xs">
              <div>
                <label className="block font-bold uppercase tracking-wider text-ink-muted text-[10px]">
                  Instructor / Organization Name *
                </label>
                <input
                  type="text"
                  required
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="e.g. W3Schools.com or Dr. Jane Doe"
                  className="mt-1 h-10 w-full rounded-xl border border-line bg-surface-elevated px-3 text-xs text-ink focus:border-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider text-ink-muted text-[10px]">
                  Professional Title / Role
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Web Learning Platform or Senior Engineer"
                  className="mt-1 h-10 w-full rounded-xl border border-line bg-surface-elevated px-3 text-xs text-ink focus:border-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider text-ink-muted text-[10px]">
                  Biography / Summary
                </label>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Short description of the instructor's background..."
                  className="mt-1 w-full rounded-xl border border-line bg-surface-elevated p-3 text-xs text-ink focus:border-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider text-ink-muted text-[10px]">
                  Avatar / Logo Image URL
                </label>
                <input
                  type="url"
                  value={avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                  placeholder="https://..."
                  className="mt-1 h-10 w-full rounded-xl border border-line bg-surface-elevated px-3 text-xs text-ink focus:border-primary focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="is_pub"
                  checked={isPublished}
                  onChange={(e) => setIsPublished(e.target.checked)}
                  className="h-4 w-4 rounded border-line text-primary focus:ring-primary"
                />
                <label htmlFor="is_pub" className="font-semibold text-ink cursor-pointer">
                  Publish instructor profile (visible on public course pages)
                </label>
              </div>

              <div className="flex justify-end gap-2 border-t border-line pt-4">
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
                  disabled={isSaving || !displayName.trim()}
                  size="sm"
                  className="rounded-xl bg-primary text-xs font-semibold text-white"
                >
                  {isSaving && <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />}
                  <span>{editingInstructor ? "Save Changes" : "Create Instructor"}</span>
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

