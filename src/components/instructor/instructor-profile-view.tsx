"use client";

import * as React from "react";
import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  GraduationCap,
  Save,
} from "lucide-react";

import { Avatar } from "@/components/ui/avatar";
import { updateInstructorProfileAction } from "@/lib/actions/instructor";
import { notify } from "@/lib/notifications/toast";
import type { InstructorProfileData } from "@/lib/types/instructor";

interface InstructorProfileViewProps {
  initialProfile: InstructorProfileData;
}

export function InstructorProfileView({
  initialProfile,
}: InstructorProfileViewProps) {
  const [profile, setProfile] = React.useState(initialProfile);
  const [isPending, startTransition] = React.useTransition();
  const [isSaved, setIsSaved] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(false);

    startTransition(async () => {
      try {
        const res = await updateInstructorProfileAction({
          professionalTitle: profile.professionalTitle,
          bio: profile.bio,
          websiteUrl: profile.websiteUrl,
          githubUrl: profile.githubUrl,
          twitterUrl: profile.twitterUrl,
          linkedinUrl: profile.linkedinUrl,
        });

        if (res.success) {
          setIsSaved(true);
          notify.success({ title: "Profile updated", description: "Your instructor profile was updated successfully." });
        } else {
          notify.error({ title: "Update failed", description: res.error || "Failed to update profile." });
        }
      } catch {
        notify.error({ title: "Error", description: "An unexpected error occurred while saving profile." });
      }
    });
  };

  return (
    <div className="flex flex-col gap-8 max-w-3xl pb-12">
      {/* Top Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-line/60 pb-6">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <Link
              href="/instructor"
              className="grid size-8 place-items-center rounded-lg border border-line bg-card text-muted hover:text-ink hover:border-primary/40 transition-colors"
              title="Return to Instructor Overview"
            >
              <ArrowLeft className="size-4" />
            </Link>
            <h1 className="text-2xl font-bold tracking-tight text-ink sm:text-3xl">
              Instructor Profile
            </h1>
          </div>
          <p className="text-sm text-muted">
            Manage your educator bio and credentials displayed to learners.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        {/* Avatar & Display Name preview */}
        <div className="flex items-center gap-4 rounded-card border border-line bg-card p-6 shadow-soft">
          <Avatar
            src={profile.avatarUrl}
            name={profile.name}
            className="size-16 ring-4 ring-primary/20 shrink-0"
          />
          <div className="flex flex-col gap-1">
            <h2 className="text-lg font-bold text-ink">{profile.name}</h2>
            <p className="text-xs text-muted flex items-center gap-1.5">
              <GraduationCap className="size-3.5 text-cyan-400" />
              <span>Course Instructor</span>
            </p>
          </div>
        </div>

        {/* Form Fields */}
        <div className="flex flex-col gap-5 rounded-card border border-line bg-card p-6 shadow-soft">
          {/* Professional Title */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="professionalTitle"
              className="text-xs font-bold text-ink uppercase tracking-wider"
            >
              Professional Title
            </label>
            <input
              id="professionalTitle"
              type="text"
              value={profile.professionalTitle || ""}
              onChange={(e) =>
                setProfile((p) => ({ ...p, professionalTitle: e.target.value }))
              }
              placeholder="e.g. Senior Frontend Architect, React Specialist"
              className="h-10 rounded-xl border border-line bg-surface px-3.5 text-sm text-ink outline-hidden focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </div>

          {/* Bio */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="bio"
              className="text-xs font-bold text-ink uppercase tracking-wider"
            >
              Instructor Bio
            </label>
            <textarea
              id="bio"
              rows={4}
              value={profile.bio || ""}
              onChange={(e) =>
                setProfile((p) => ({ ...p, bio: e.target.value }))
              }
              placeholder="Share your teaching experience, technical background, and passion for web development..."
              className="rounded-xl border border-line bg-surface p-3.5 text-sm text-ink outline-hidden focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </div>

          {/* Social Links */}
          <div className="grid gap-4 sm:grid-cols-2 pt-2 border-t border-line/60">
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="websiteUrl"
                className="text-xs font-bold text-ink uppercase tracking-wider"
              >
                Personal Website / Portfolio
              </label>
              <input
                id="websiteUrl"
                type="url"
                value={profile.websiteUrl || ""}
                onChange={(e) =>
                  setProfile((p) => ({ ...p, websiteUrl: e.target.value }))
                }
                placeholder="https://yoursite.dev"
                className="h-10 rounded-xl border border-line bg-surface px-3.5 text-sm text-ink outline-hidden focus:border-primary focus:ring-1 focus:ring-primary"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="githubUrl"
                className="text-xs font-bold text-ink uppercase tracking-wider"
              >
                GitHub Profile
              </label>
              <input
                id="githubUrl"
                type="url"
                value={profile.githubUrl || ""}
                onChange={(e) =>
                  setProfile((p) => ({ ...p, githubUrl: e.target.value }))
                }
                placeholder="https://github.com/username"
                className="h-10 rounded-xl border border-line bg-surface px-3.5 text-sm text-ink outline-hidden focus:border-primary focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>
        </div>

        {/* Save CTA */}
        <div className="flex items-center justify-between">
          <div>
            {isSaved && (
              <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-500">
                <CheckCircle2 className="size-4" />
                <span>Changes saved</span>
              </span>
            )}
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-xs font-bold text-white shadow-soft hover:bg-primary-hover disabled:opacity-50 transition-all cursor-pointer"
          >
            <Save className="size-4" />
            <span>{isPending ? "Saving..." : "Save Profile"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
