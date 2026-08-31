"use client";

import * as React from "react";
import {
  CheckSquare,
  Download,
  ExternalLink,
  Loader2,
  Square,
  Video,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { importYouTubePlaylistAction } from "@/lib/actions/admin";
import { fetchYouTubePlaylist } from "@/lib/utils/youtube-importer";
import type { AdminCourseDetail, YouTubePlaylistItemParsed } from "@/lib/types";

interface PlaylistImportModalProps {
  course: AdminCourseDetail;
  targetModuleId?: string | null;
  onClose: () => void;
  onSuccess: () => void;
}

export function PlaylistImportModal({
  course,
  targetModuleId: initialModuleId,
  onClose,
  onSuccess,
}: PlaylistImportModalProps) {
  const [playlistUrl, setPlaylistUrl] = React.useState("");
  const [isFetching, setIsFetching] = React.useState(false);
  const [fetchError, setFetchError] = React.useState<string | null>(null);
  const [playlistResult, setPlaylistResult] = React.useState<{
    playlistTitle?: string;
    channelTitle?: string;
    items: YouTubePlaylistItemParsed[];
  } | null>(null);

  const [selectedItems, setSelectedItems] = React.useState<Set<number>>(new Set());
  const [bonusItems, setBonusItems] = React.useState<Set<number>>(new Set());
  const [destinationMode, setDestinationMode] = React.useState<"existing" | "new">(
    course.modules.length > 0 ? "existing" : "new",
  );
  const [selectedModuleId, setSelectedModuleId] = React.useState<string>(
    initialModuleId || course.modules[0]?.id || "",
  );
  const [newModuleTitle, setNewModuleTitle] = React.useState("W3Schools Playlist");
  const [isImporting, setIsImporting] = React.useState(false);
  const [importError, setImportError] = React.useState<string | null>(null);

  // Existing video IDs in course to detect duplicates
  const existingVideoIds = React.useMemo(() => {
    const ids = new Set<string>();
    course.modules.forEach((m) => {
      m.lessons.forEach((l) => {
        if (l.youtubeVideoId) ids.add(l.youtubeVideoId);
      });
    });
    return ids;
  }, [course]);

  const handleFetch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!playlistUrl.trim() || isFetching) return;

    setIsFetching(true);
    setFetchError(null);
    setPlaylistResult(null);

    try {
      const res = await fetchYouTubePlaylist(playlistUrl, existingVideoIds);
      if (!res.success || res.items.length === 0) {
        setFetchError(res.error || "No videos found in this playlist.");
        return;
      }

      setPlaylistResult(res);
      // Select all non-duplicate items by default
      const selected = new Set<number>();
      res.items.forEach((item, idx) => {
        if (!item.isAlreadyImported) selected.add(idx);
      });
      setSelectedItems(selected);
      if (res.playlistTitle) {
        setNewModuleTitle(res.playlistTitle);
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Operation failed.";
      setFetchError(message);
    } finally {
      setIsFetching(false);
    }
  };

  const toggleSelectAll = () => {
    if (!playlistResult) return;
    if (selectedItems.size === playlistResult.items.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(playlistResult.items.map((_, i) => i)));
    }
  };

  const handleImport = async () => {
    if (!playlistResult || isImporting) return;
    setIsImporting(true);
    setImportError(null);

    const itemsToImport = playlistResult.items
      .filter((_, idx) => selectedItems.has(idx))
      .map((item, idx) => ({
        ...item,
        isBonus: bonusItems.has(idx),
      }));

    if (itemsToImport.length === 0) {
      setImportError("Please select at least one video to import.");
      setIsImporting(false);
      return;
    }

    try {
      const targetMod = destinationMode === "existing" ? selectedModuleId : null;
      const newMod = destinationMode === "new" ? newModuleTitle : null;

      const res = await importYouTubePlaylistAction(
        course.id,
        targetMod,
        newMod,
        itemsToImport,
      );

      if (!res.success) {
        setImportError(res.error || "Failed to import playlist.");
      } else {
        onSuccess();
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Operation failed.";
      setImportError(message);
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="flex max-h-[90vh] w-full max-w-3xl flex-col rounded-2xl border border-line bg-surface shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-line px-6 py-4">
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400">
              <Video className="h-5 w-5" />
            </span>
            <div>
              <h2 className="font-display text-lg font-bold text-ink">Import YouTube Playlist</h2>
              <p className="text-xs text-ink-muted">Quickly batch import video lessons with attribution</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-ink-muted hover:bg-surface-elevated hover:text-ink"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Preset Buttons */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-ink-muted">
              Quick Pre-Indexed Playlists
            </label>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setPlaylistUrl("PLP9IO4UYNF0VdAajP_5pYG-jG2JRrG72s")}
                className="rounded-lg border border-line bg-surface-elevated px-3 py-1.5 text-xs font-semibold text-ink hover:border-primary/40"
              >
                HTML (23 videos)
              </button>
              <button
                type="button"
                onClick={() => setPlaylistUrl("PLP9IO4UYNF0UCaUSF3XNZ1U9f01E5h5PM")}
                className="rounded-lg border border-line bg-surface-elevated px-3 py-1.5 text-xs font-semibold text-ink hover:border-primary/40"
              >
                CSS (18 videos)
              </button>
              <button
                type="button"
                onClick={() => setPlaylistUrl("PLP9IO4UYNF0WWmZpE3W33vVPRl2GvjEqz")}
                className="rounded-lg border border-line bg-surface-elevated px-3 py-1.5 text-xs font-semibold text-ink hover:border-primary/40"
              >
                JavaScript (17 videos)
              </button>
            </div>
          </div>

          {/* Search Form */}
          <form onSubmit={handleFetch} className="space-y-3">
            <label className="block text-xs font-bold uppercase tracking-wider text-ink-muted">
              YouTube Playlist URL or Playlist ID *
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                required
                value={playlistUrl}
                onChange={(e) => setPlaylistUrl(e.target.value)}
                placeholder="https://www.youtube.com/playlist?list=PLP9IO4UYNF0..."
                className="h-11 flex-1 rounded-xl border border-line bg-surface-elevated px-3.5 text-sm text-ink focus:border-primary focus:outline-none font-mono"
              />
              <Button
                type="submit"
                disabled={isFetching || !playlistUrl.trim()}
                className="rounded-xl bg-primary px-5 font-semibold text-white hover:bg-primary/90 shrink-0"
              >
                {isFetching ? <Loader2 className="mr-1.5 h-4 w-4 animate-spin" /> : <Download className="mr-1.5 h-4 w-4" />}
                <span>Fetch Videos</span>
              </Button>
            </div>
          </form>

          {fetchError && (
            <div className="rounded-xl border border-rose-500/20 bg-rose-500/10 p-3.5 text-xs font-semibold text-rose-600 dark:text-rose-400">
              {fetchError}
            </div>
          )}

          {importError && (
            <div className="rounded-xl border border-rose-500/20 bg-rose-500/10 p-3.5 text-xs font-semibold text-rose-600 dark:text-rose-400">
              {importError}
            </div>
          )}

          {/* Review Playlist Table */}
          {playlistResult && (
            <div className="space-y-4 pt-2">
              <div className="flex items-center justify-between rounded-xl border border-line bg-surface-elevated/40 p-3">
                <div>
                  <h3 className="text-sm font-bold text-ink">{playlistResult.playlistTitle}</h3>
                  <p className="text-xs text-ink-muted">
                    Channel: {playlistResult.channelTitle} • {playlistResult.items.length} videos found
                  </p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={toggleSelectAll}
                  className="rounded-lg border-line text-xs font-semibold"
                >
                  {selectedItems.size === playlistResult.items.length ? "Deselect All" : "Select All"}
                </Button>
              </div>

              {/* Destination Module */}
              <div className="rounded-xl border border-line bg-surface p-4 space-y-3">
                <label className="block text-xs font-bold uppercase tracking-wider text-ink-muted">
                  Import Destination
                </label>
                <div className="flex flex-wrap items-center gap-4">
                  {course.modules.length > 0 && (
                    <label className="flex items-center gap-2 text-xs font-semibold text-ink cursor-pointer">
                      <input
                        type="radio"
                        name="destMode"
                        checked={destinationMode === "existing"}
                        onChange={() => setDestinationMode("existing")}
                        className="text-primary focus:ring-primary"
                      />
                      <span>Add into existing module:</span>
                    </label>
                  )}
                  {destinationMode === "existing" && course.modules.length > 0 && (
                    <select
                      value={selectedModuleId}
                      onChange={(e) => setSelectedModuleId(e.target.value)}
                      className="h-9 rounded-lg border border-line bg-surface-elevated px-2.5 text-xs text-ink focus:border-primary focus:outline-none"
                    >
                      {course.modules.map((m) => (
                        <option key={m.id} value={m.id}>
                          {m.title} ({m.lessons.length} lessons)
                        </option>
                      ))}
                    </select>
                  )}

                  <label className="flex items-center gap-2 text-xs font-semibold text-ink cursor-pointer">
                    <input
                      type="radio"
                      name="destMode"
                      checked={destinationMode === "new"}
                      onChange={() => setDestinationMode("new")}
                      className="text-primary focus:ring-primary"
                    />
                    <span>Create new module:</span>
                  </label>
                  {destinationMode === "new" && (
                    <input
                      type="text"
                      value={newModuleTitle}
                      onChange={(e) => setNewModuleTitle(e.target.value)}
                      placeholder="Module Title..."
                      className="h-9 flex-1 min-w-[180px] rounded-lg border border-line bg-surface-elevated px-3 text-xs text-ink focus:border-primary focus:outline-none"
                    />
                  )}
                </div>
              </div>

              {/* Video Items List */}
              <div className="max-h-64 overflow-y-auto rounded-xl border border-line divide-y divide-line bg-surface">
                {playlistResult.items.map((item, idx) => {
                  const isSelected = selectedItems.has(idx);
                  const isBonus = bonusItems.has(idx);

                  return (
                    <div
                      key={item.videoId}
                      className={`flex items-center justify-between p-3 text-xs ${
                        item.isAlreadyImported ? "bg-surface-elevated/40 opacity-60" : ""
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0 flex-1 pr-3">
                        <button
                          type="button"
                          onClick={() => {
                            const next = new Set(selectedItems);
                            if (next.has(idx)) next.delete(idx);
                            else next.add(idx);
                            setSelectedItems(next);
                          }}
                          className="shrink-0 text-ink-muted hover:text-primary"
                        >
                          {isSelected ? (
                            <CheckSquare className="h-4 w-4 text-primary" />
                          ) : (
                            <Square className="h-4 w-4" />
                          )}
                        </button>
                        <span className="font-mono text-ink-muted shrink-0 w-6">#{item.position}</span>
                        <div className="min-w-0">
                          <p className="font-semibold text-ink truncate">{item.cleanTitle}</p>
                          <p className="text-[11px] text-ink-muted font-mono">{item.videoId} • {item.durationMinutes} mins</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        {item.isAlreadyImported ? (
                          <span className="rounded bg-line px-2 py-0.5 text-[10px] font-semibold text-ink-muted">
                            Already imported
                          </span>
                        ) : (
                          <label className="flex items-center gap-1.5 text-[11px] text-ink-muted cursor-pointer">
                            <input
                              type="checkbox"
                              checked={isBonus}
                              onChange={(e) => {
                                const next = new Set(bonusItems);
                                if (e.target.checked) next.add(idx);
                                else next.delete(idx);
                                setBonusItems(next);
                              }}
                              className="rounded border-line text-primary focus:ring-primary"
                            />
                            <span>Bonus</span>
                          </label>
                        )}

                        <a
                          href={item.videoUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-ink-muted hover:text-primary"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-line px-6 py-4">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="rounded-xl border-line text-xs font-semibold"
          >
            Cancel
          </Button>

          {playlistResult && (
            <Button
              type="button"
              onClick={handleImport}
              disabled={isImporting || selectedItems.size === 0}
              className="rounded-xl bg-primary px-6 text-xs font-semibold text-white shadow-sm hover:bg-primary/90"
            >
              {isImporting ? (
                <>
                  <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
                  <span>Importing {selectedItems.size} Lessons...</span>
                </>
              ) : (
                <>
                  <Download className="mr-1.5 h-4 w-4" />
                  <span>Import Selected ({selectedItems.size})</span>
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
