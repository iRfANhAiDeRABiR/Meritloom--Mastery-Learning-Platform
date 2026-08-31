"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Clock,
  Eye,
  FileEdit,
  Plus,
  Route,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { AdminLearningPathListItem } from "@/lib/types";

interface AdminLearningPathsTableProps {
  paths: AdminLearningPathListItem[];
}

export function AdminLearningPathsTable({ paths }: AdminLearningPathsTableProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentQuery = searchParams.get("q") || "";
  const currentStatus = searchParams.get("status") || "all";

  const [searchTerm, setSearchTerm] = React.useState(currentQuery);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    if (searchTerm.trim()) {
      params.set("q", searchTerm.trim());
    } else {
      params.delete("q");
    }
    router.push(`/admin/learning-paths?${params.toString()}`);
  };

  const handleStatusFilter = (status: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (status === "all") {
      params.delete("status");
    } else {
      params.set("status", status);
    }
    router.push(`/admin/learning-paths?${params.toString()}`);
  };

  const formatDuration = (mins: number) => {
    if (!mins) return "0 mins";
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    if (h === 0) return `${m}m`;
    if (m === 0) return `${h}h`;
    return `${h}h ${m}m`;
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl">
            Learning Paths
          </h1>
          <p className="mt-1 text-sm text-ink-muted">
            Manage structured, guided curriculum paths connecting multiple courses and milestone projects.
          </p>
        </div>
        <Button asChild className="rounded-xl bg-primary px-4 py-2 font-semibold text-white shadow-sm hover:bg-primary/90">
          <Link href="/admin/learning-paths/new">
            <Plus className="mr-1.5 h-4 w-4" />
            <span>New Learning Path</span>
          </Link>
        </Button>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-1.5 rounded-xl border border-line bg-surface p-1">
          {["all", "published", "draft"].map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => handleStatusFilter(st)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold capitalize transition ${
                currentStatus === st
                  ? "bg-primary text-white shadow-sm"
                  : "text-ink-muted hover:text-ink"
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        <form onSubmit={handleSearch} className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-ink-muted" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search learning paths..."
            className="h-9 w-full rounded-xl border border-line bg-surface pl-9 pr-3 text-xs text-ink placeholder:text-ink-muted focus:border-primary focus:outline-none"
          />
        </form>
      </div>

      {/* Table */}
      {paths.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-line bg-surface p-12 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Route className="h-6 w-6" />
          </div>
          <h3 className="mt-4 font-display text-lg font-bold text-ink">
            Create your first Learning Path
          </h3>
          <p className="mt-1.5 max-w-sm text-xs text-ink-muted">
            Connect related courses into a clear recommended learning journey with milestone projects.
          </p>
          <Button asChild size="sm" className="mt-6 rounded-xl bg-primary text-xs font-semibold text-white">
            <Link href="/admin/learning-paths/new">
              <Plus className="mr-1.5 h-3.5 w-3.5" />
              <span>New Learning Path</span>
            </Link>
          </Button>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-line bg-surface shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-line bg-surface-elevated/50 font-bold uppercase tracking-wider text-ink-muted">
                <tr>
                  <th className="p-4">Title & Slug</th>
                  <th className="p-4">Difficulty</th>
                  <th className="p-4">Courses & Steps</th>
                  <th className="p-4">Duration</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Updated</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {paths.map((pathItem) => (
                  <tr key={pathItem.id} className="transition hover:bg-surface-elevated/30">
                    <td className="p-4">
                      <div className="space-y-0.5">
                        <Link
                          href={`/admin/learning-paths/${pathItem.id}`}
                          className="font-display text-sm font-bold text-ink hover:text-primary transition"
                        >
                          {pathItem.title}
                        </Link>
                        <p className="font-mono text-[11px] text-ink-muted">/{pathItem.slug}</p>
                      </div>
                    </td>
                    <td className="p-4">
                      <Badge variant="outline" className="border-line capitalize text-[11px]">
                        {pathItem.difficulty}
                      </Badge>
                    </td>
                    <td className="p-4 text-ink">
                      <div className="space-y-0.5">
                        <span className="font-semibold">{pathItem.courseCount} courses</span>
                        <p className="text-[11px] text-ink-muted">{pathItem.stepCount} total steps</p>
                      </div>
                    </td>
                    <td className="p-4 text-ink-muted">
                      <span className="inline-flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatDuration(pathItem.estimatedMinutes)}
                      </span>
                    </td>
                    <td className="p-4">
                      {pathItem.isPublished ? (
                        <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 text-[10px] font-bold">
                          PUBLISHED
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[10px] font-bold">
                          DRAFT
                        </Badge>
                      )}
                    </td>
                    <td className="p-4 text-[11px] text-ink-muted whitespace-nowrap">
                      {new Date(pathItem.updatedAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          asChild
                          size="sm"
                          variant="outline"
                          className="h-8 rounded-lg border-line px-2.5 text-xs font-semibold"
                        >
                          <Link href={`/admin/learning-paths/${pathItem.id}/preview`}>
                            <Eye className="mr-1 h-3 w-3 text-ink-muted" />
                            <span>Preview</span>
                          </Link>
                        </Button>
                        <Button
                          asChild
                          size="sm"
                          className="h-8 rounded-lg bg-primary px-3 text-xs font-semibold text-white hover:bg-primary/90"
                        >
                          <Link href={`/admin/learning-paths/${pathItem.id}`}>
                            <FileEdit className="mr-1 h-3 w-3" />
                            <span>Edit</span>
                          </Link>
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
