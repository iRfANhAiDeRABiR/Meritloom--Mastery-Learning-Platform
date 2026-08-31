"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeft, Eye, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LearningPathHero } from "@/components/learning-paths/learning-path-hero";
import { LearningPathRoadmap } from "@/components/learning-paths/learning-path-roadmap";
import { LearningPathCapabilities } from "@/components/learning-paths/learning-path-capabilities";
import { LearningPathSkills } from "@/components/learning-paths/learning-path-skills";
import type { AdminLearningPathDetail, LearningPathDetail } from "@/lib/types";

interface AdminLearningPathPreviewProps {
  path: AdminLearningPathDetail;
}

export function AdminLearningPathPreview({ path }: AdminLearningPathPreviewProps) {
  // Convert AdminLearningPathDetail into learner-facing LearningPathDetail structure for preview
  const previewPath: LearningPathDetail = {
    id: path.id,
    slug: path.slug,
    title: path.title,
    subtitle: path.subtitle || "Build structured skills with a guided sequence.",
    description: path.description || path.summary || "",
    difficulty: path.difficulty,
    estimatedMinutes: path.estimatedMinutes,
    courseCount: path.courseCount,
    isPublished: path.isPublished,
    coverImageUrl: path.coverImageUrl,
    items: path.items.map((it, idx) => {
      if (it.itemType === "course" && it.course) {
        return {
          id: it.id,
          itemType: "course" as const,
          position: it.position,
          stepNumber: idx + 1,
          stepLabel: it.stepLabel || `STEP ${idx + 1}`,
          courseId: it.course.id,
          courseSlug: it.course.slug,
          title: it.course.title,
          description: it.description || it.course.summary || "",
          iconName: "Code2" as const,
          accentColor: "amber" as const,
          difficulty: it.course.difficulty,
          lessonCount: it.course.lessonCount,
          estimatedMinutes: it.course.estimatedMinutes || 60,
          categoryName: it.course.categoryName,
          status: "not_started" as const,
        };
      } else {
        return {
          id: it.id,
          itemType: "project" as const,
          position: it.position,
          stepNumber: idx + 1,
          stepLabel: it.stepLabel || "FINAL PROJECT",
          title: it.title || "Capstone Project",
          description: it.description || "Synthesize all path skills into a final project.",
          iconName: "Rocket" as const,
          accentColor: "purple" as const,
          estimatedMinutes: it.estimatedMinutes || 30,
          outcomes: [
            "Comprehensive hands-on implementation",
            "Real-world practical portfolio project",
          ],
          status: "not_started" as const,
        };
      }
    }),
    skills: ["HTML", "CSS", "JavaScript", "Frontend Development"],
    capabilities: [
      {
        title: "Structured Curriculum",
        description: "Follow sequential milestones designed for mastery.",
        iconName: "LayoutTemplate",
      },
      {
        title: "Hands-on Practice",
        description: "Apply concepts through exercises and projects.",
        iconName: "PanelsTopLeft",
      },
    ],
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Notice */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-primary/30 bg-primary/10 p-4 text-xs">
        <div className="flex items-center gap-2 font-semibold text-primary">
          <Eye className="h-4 w-4 shrink-0" />
          <span>Admin Draft Preview Mode — This Learning Path is rendered using real database steps.</span>
        </div>
        <div className="flex items-center gap-2">
          {path.isPublished && (
            <Button asChild size="sm" variant="outline" className="rounded-xl border-primary/40 text-xs font-semibold">
              <Link href={`/learning-paths/${path.slug}`} target="_blank">
                <Globe className="mr-1.5 h-3.5 w-3.5" />
                <span>View Public Page</span>
              </Link>
            </Button>
          )}
          <Button asChild size="sm" variant="outline" className="rounded-xl border-primary/40 text-xs font-semibold">
            <Link href={`/admin/learning-paths/${path.id}`}>
              <ArrowLeft className="mr-1.5 h-3.5 w-3.5" />
              <span>Back to Editor</span>
            </Link>
          </Button>
        </div>
      </div>

      {/* Public Components Reused */}
      <LearningPathHero path={previewPath} user={null} />
      <LearningPathRoadmap path={previewPath} isAuthenticated={false} />
      <LearningPathCapabilities capabilities={previewPath.capabilities} />
      <LearningPathSkills skills={previewPath.skills} />
    </div>
  );
}
