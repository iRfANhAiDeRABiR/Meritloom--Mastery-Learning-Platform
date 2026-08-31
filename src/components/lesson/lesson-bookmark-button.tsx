"use client";

import * as React from "react";
import { Bookmark, BookmarkCheck, Loader2 } from "lucide-react";
import { toggleLessonBookmarkAction } from "@/lib/actions/notes-and-bookmarks";
import { notify } from "@/lib/notifications/toast";
import { cn } from "@/lib/utils";

interface LessonBookmarkButtonProps {
  lessonId: string;
  initialIsBookmarked?: boolean;
  className?: string;
}

export function LessonBookmarkButton({
  lessonId,
  initialIsBookmarked = false,
  className,
}: LessonBookmarkButtonProps) {
  const [isBookmarked, setIsBookmarked] = React.useState(initialIsBookmarked);
  const [isPending, setIsPending] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);

  const handleToggleBookmark = async () => {
    if (isPending) return;

    // Optimistic toggle
    const previousState = isBookmarked;
    setIsBookmarked(!previousState);
    setIsPending(true);
    setErrorMsg(null);

    try {
      const res = await toggleLessonBookmarkAction(lessonId);
      if (!res.success) {
        // Rollback on error
        setIsBookmarked(previousState);
        const title = res.error || "We couldn't update this bookmark.";
        setErrorMsg(title);
        notify.error({ title });
      } else {
        setIsBookmarked(res.isBookmarked);
        notify.success({
          title: res.isBookmarked ? "Bookmarked" : "Bookmark removed",
        });
      }
    } catch {
      setIsBookmarked(previousState);
      setErrorMsg("We couldn't update this bookmark.");
      notify.error({ title: "We couldn't update this bookmark." });
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="relative inline-flex items-center">
      <button
        type="button"
        onClick={handleToggleBookmark}
        disabled={isPending}
        aria-pressed={isBookmarked}
        aria-label={isBookmarked ? "Remove bookmark" : "Bookmark lesson"}
        title={isBookmarked ? "Remove bookmark" : "Bookmark lesson"}
        className={cn(
          "inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-bold transition-all cursor-pointer shadow-xs",
          isBookmarked
            ? "border-primary/40 bg-primary/10 text-primary hover:bg-primary/15"
            : "border-line bg-surface text-ink-muted hover:border-primary/40 hover:text-ink",
          className,
        )}
      >
        {isPending ? (
          <Loader2 className="size-3.5 animate-spin" aria-hidden="true" />
        ) : isBookmarked ? (
          <BookmarkCheck className="size-3.5 fill-primary text-primary" aria-hidden="true" />
        ) : (
          <Bookmark className="size-3.5" aria-hidden="true" />
        )}
        <span>{isBookmarked ? "Bookmarked" : "Bookmark"}</span>
      </button>

      {errorMsg && (
        <span className="absolute -bottom-6 left-0 text-[10px] text-rose-500 whitespace-nowrap">
          {errorMsg}
        </span>
      )}
    </div>
  );
}
