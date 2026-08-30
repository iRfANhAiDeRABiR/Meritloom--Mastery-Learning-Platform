"use client";

import * as React from "react";
import { Play } from "lucide-react";

interface LessonVideoPlayerProps {
  videoUrl: string | null;
  title: string;
}

export function LessonVideoPlayer({ videoUrl, title }: LessonVideoPlayerProps) {
  const videoRef = React.useRef<HTMLVideoElement>(null);

  const handleStartPlay = () => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  };

  return (
    <div className="relative w-full overflow-hidden rounded-[16px] sm:rounded-[18px] bg-[#0A0E1A] shadow-soft border border-line aspect-video group">
      {videoUrl ? (
        <video
          ref={videoRef}
          src={videoUrl}
          controls
          playsInline
          className="h-full w-full object-cover"
          title={title}
        />
      ) : (
        <div className="relative flex h-full w-full flex-col items-center justify-center p-6 text-center select-none overflow-hidden">
          {/* Subtle Ambient Radial Glow */}
          <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 size-72 rounded-full bg-primary/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 left-1/2 -translate-x-1/2 size-72 rounded-full bg-[#19B99A]/15 blur-3xl" />

          {/* Interactive Play Preview Button */}
          <button
            type="button"
            onClick={handleStartPlay}
            aria-label={`Play lesson: ${title}`}
            className="group/btn relative grid size-16 sm:size-20 place-items-center rounded-full bg-gradient-to-tr from-primary to-[#8F74FF] text-white shadow-soft transition-all duration-300 hover:scale-108 hover:shadow-[0_0_24px_rgba(124,92,255,0.5)] cursor-pointer"
          >
            <Play className="size-7 sm:size-8 fill-current ml-1 transition-transform group-hover/btn:scale-110" aria-hidden="true" />
            <span className="absolute inset-0 rounded-full animate-ping opacity-20 bg-primary" />
          </button>

          {/* Lesson Video Title & Status */}
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
  );
}
