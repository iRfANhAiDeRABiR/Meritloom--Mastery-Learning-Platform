"use client";

import * as React from "react";
import { ExternalLink, Play, VideoOff } from "lucide-react";

export interface LessonVideoPlayerProps {
  videoId?: string | null;
  videoUrl?: string | null;
  title: string;
  sourceChannel?: string | null;
  sourceUrl?: string | null;
}

/**
 * Helper to safely extract YouTube video ID and optional start timestamp.
 * Supports standard watch URLs, share links, embed URLs, and timestamp queries.
 */
function parseYouTubeUrl(urlOrId: string | null): {
  videoId: string;
  startSeconds: number | null;
} | null {
  if (!urlOrId) return null;
  const trimmed = urlOrId.trim();

  // If raw 11-char valid YouTube ID
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return { videoId: trimmed, startSeconds: null };
  }

  try {
    const parsed = new URL(
      trimmed.startsWith("http") ? trimmed : `https://${trimmed}`,
    );
    const host = parsed.hostname.toLowerCase();

    // Validate allowed YouTube hostnames
    if (
      host === "www.youtube.com" ||
      host === "youtube.com" ||
      host === "m.youtube.com" ||
      host === "www.youtube-nocookie.com" ||
      host === "youtube-nocookie.com" ||
      host === "youtu.be"
    ) {
      let videoId: string | null = null;
      let startSeconds: number | null = null;

      if (host === "youtu.be") {
        videoId = parsed.pathname.slice(1);
      } else if (parsed.pathname.startsWith("/embed/")) {
        videoId = parsed.pathname.slice(7);
      } else {
        videoId = parsed.searchParams.get("v");
      }

      // Parse timestamp
      const timeParam =
        parsed.searchParams.get("t") || parsed.searchParams.get("start");
      if (timeParam) {
        startSeconds = parseTimestampToSeconds(timeParam);
      }

      if (videoId && /^[a-zA-Z0-9_-]{11}$/.test(videoId)) {
        return { videoId, startSeconds };
      }
    }
  } catch {
    // Ignore invalid URL parse
  }

  return null;
}

function parseTimestampToSeconds(timeStr: string): number | null {
  if (!timeStr) return null;
  if (/^\d+$/.test(timeStr)) {
    return parseInt(timeStr, 10);
  }
  let total = 0;
  const hoursMatch = timeStr.match(/(\d+)\s*h/i);
  const minsMatch = timeStr.match(/(\d+)\s*m/i);
  const secsMatch = timeStr.match(/(\d+)\s*s/i);

  if (hoursMatch) total += parseInt(hoursMatch[1], 10) * 3600;
  if (minsMatch) total += parseInt(minsMatch[1], 10) * 60;
  if (secsMatch) total += parseInt(secsMatch[1], 10);

  return total > 0 ? total : null;
}

export function LessonVideoPlayer({
  videoId,
  videoUrl,
  title,
  sourceChannel,
  sourceUrl,
}: LessonVideoPlayerProps) {
  const [hasError, setHasError] = React.useState(false);
  const videoRef = React.useRef<HTMLVideoElement>(null);

  const youtubeData = React.useMemo(() => {
    if (videoId && /^[a-zA-Z0-9_-]{11}$/.test(videoId)) {
      return { videoId, startSeconds: null };
    }
    return parseYouTubeUrl(videoUrl ?? null);
  }, [videoId, videoUrl]);

  const handleStartPlay = () => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  };

  // Build privacy-enhanced YouTube embed src without autoplay
  const youtubeEmbedSrc = React.useMemo(() => {
    if (!youtubeData) return null;
    let src = `https://www.youtube-nocookie.com/embed/${youtubeData.videoId}?rel=0&modestbranding=1`;
    if (youtubeData.startSeconds) {
      src += `&start=${youtubeData.startSeconds}`;
    }
    return src;
  }, [youtubeData]);

  const channelName = sourceChannel || "W3Schools.com";
  const originalUrl =
    sourceUrl ||
    (youtubeData
      ? `https://www.youtube.com/watch?v=${youtubeData.videoId}${
          youtubeData.startSeconds ? `&t=${youtubeData.startSeconds}s` : ""
        }`
      : null);

  return (
    <div className="flex flex-col gap-2.5 w-full">
      <div className="relative w-full overflow-hidden rounded-[16px] sm:rounded-[18px] bg-[#0A0E1A] shadow-soft border border-line aspect-video group">
        {hasError ? (
          /* Error / Unavailable fallback */
          <div className="flex h-full w-full flex-col items-center justify-center p-6 text-center text-muted gap-2">
            <VideoOff className="size-8 text-muted" aria-hidden="true" />
            <p className="text-xs font-semibold text-white/90">
              This video is currently unavailable.
            </p>
            <p className="text-[11px] text-muted max-w-xs">
              Please check your internet connection or continue reading the lesson summary and objectives below.
            </p>
          </div>
        ) : youtubeEmbedSrc ? (
          /* YouTube Privacy-Enhanced Iframe Player */
          <iframe
            src={youtubeEmbedSrc}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="h-full w-full border-0"
            onError={() => setHasError(true)}
          />
        ) : videoUrl ? (
          /* Native HTML5 Video */
          <video
            ref={videoRef}
            src={videoUrl}
            controls
            playsInline
            className="h-full w-full object-cover"
            title={title}
            onError={() => setHasError(true)}
          />
        ) : (
          /* Interactive Placeholder */
          <div className="relative flex h-full w-full flex-col items-center justify-center p-6 text-center select-none overflow-hidden">
            <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 size-72 rounded-full bg-primary/20 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-24 left-1/2 -translate-x-1/2 size-72 rounded-full bg-[#19B99A]/15 blur-3xl" />

            <button
              type="button"
              onClick={handleStartPlay}
              aria-label={`Play lesson: ${title}`}
              className="group/btn relative grid size-16 sm:size-20 place-items-center rounded-full bg-gradient-to-tr from-primary to-[#8F74FF] text-white shadow-soft transition-all duration-300 hover:scale-108 hover:shadow-[0_0_24px_rgba(124,92,255,0.5)] cursor-pointer"
            >
              <Play
                className="size-7 sm:size-8 fill-current ml-1 transition-transform group-hover/btn:scale-110"
                aria-hidden="true"
              />
              <span className="absolute inset-0 rounded-full animate-ping opacity-20 bg-primary" />
            </button>

            <div className="relative z-10 mt-4 flex flex-col items-center gap-1 max-w-md">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-white/70">
                Interactive Lesson Video
              </span>
              <p className="text-xs sm:text-sm font-semibold text-white/90 line-clamp-1">
                {title}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Creator Attribution Row */}
      {youtubeData && (
        <div className="flex items-center justify-between px-1 text-[11px] text-muted">
          <span className="truncate">
            Video by <strong className="font-semibold text-ink">{channelName}</strong>
          </span>
          {originalUrl && (
            <a
              href={originalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-bold text-primary hover:underline shrink-0 ml-2"
            >
              <span>Watch on YouTube</span>
              <ExternalLink className="size-3" aria-hidden="true" />
            </a>
          )}
        </div>
      )}
    </div>
  );
}

export const YouTubeLessonPlayer = LessonVideoPlayer;
