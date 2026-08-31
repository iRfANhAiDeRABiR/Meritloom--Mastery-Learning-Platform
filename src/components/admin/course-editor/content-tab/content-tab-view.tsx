"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { CurriculumTree } from "@/components/admin/course-editor/content-tab/curriculum-tree";
import { ContentEditorPanel } from "@/components/admin/course-editor/content-tab/content-editor-panel";
import { PlaylistImportModal } from "@/components/admin/course-editor/content-tab/playlist-import-modal";
import type { AdminCourseDetail, AdminLessonDetail, AdminModuleDetail } from "@/lib/types";

interface ContentTabViewProps {
  course: AdminCourseDetail;
}

export function ContentTabView({ course }: ContentTabViewProps) {
  const router = useRouter();

  // Find first lesson to auto-select
  const firstLesson = course.modules[0]?.lessons[0] || null;
  const firstModule = course.modules[0] || null;

  const [selectedLesson, setSelectedLesson] = React.useState<AdminLessonDetail | null>(firstLesson);
  const [selectedModule, setSelectedModule] = React.useState<AdminModuleDetail | null>(
    firstLesson ? null : firstModule,
  );
  const [playlistModalOpen, setPlaylistModalOpen] = React.useState(false);
  const [playlistTargetModId, setPlaylistTargetModId] = React.useState<string | null>(null);

  const handleSelectLesson = (lesson: AdminLessonDetail) => {
    setSelectedLesson(lesson);
    setSelectedModule(null);
  };

  const handleSelectModule = (mod: AdminModuleDetail) => {
    setSelectedModule(mod);
    setSelectedLesson(null);
  };

  const handleOpenPlaylistImport = (modId?: string) => {
    setPlaylistTargetModId(modId || null);
    setPlaylistModalOpen(true);
  };

  const handleRefresh = () => {
    router.refresh();
  };

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
      {/* Left Column: Curriculum Tree */}
      <div className="lg:col-span-5 space-y-4">
        <CurriculumTree
          course={course}
          selectedLessonId={selectedLesson?.id || null}
          selectedModuleId={selectedModule?.id || null}
          onSelectLesson={handleSelectLesson}
          onSelectModule={handleSelectModule}
          onOpenPlaylistImport={handleOpenPlaylistImport}
          onRefresh={handleRefresh}
        />
      </div>

      {/* Right Column: Content Editor */}
      <div className="lg:col-span-7">
        <ContentEditorPanel
          course={course}
          selectedLesson={selectedLesson}
          selectedModule={selectedModule}
          onUpdated={handleRefresh}
        />
      </div>

      {/* Playlist Import Modal */}
      {playlistModalOpen && (
        <PlaylistImportModal
          course={course}
          targetModuleId={playlistTargetModId}
          onClose={() => setPlaylistModalOpen(false)}
          onSuccess={() => {
            setPlaylistModalOpen(false);
            handleRefresh();
          }}
        />
      )}
    </div>
  );
}
