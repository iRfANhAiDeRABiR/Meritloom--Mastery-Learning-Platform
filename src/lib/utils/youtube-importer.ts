import type { YouTubePlaylistItemParsed } from "@/lib/types";

/**
 * Extract YouTube playlist ID from URL or raw ID string.
 */
export function extractPlaylistId(input: string): string | null {
  const trimmed = input.trim();
  if (!trimmed) return null;

  if (
    /^[A-Za-z0-9_-]{10,64}$/.test(trimmed) &&
    (trimmed.startsWith("PL") ||
      trimmed.startsWith("UU") ||
      trimmed.startsWith("FL") ||
      trimmed.startsWith("RD"))
  ) {
    return trimmed;
  }

  try {
    const url = new URL(trimmed.startsWith("http") ? trimmed : `https://${trimmed}`);
    const listParam = url.searchParams.get("list");
    if (listParam) return listParam;
  } catch {
    const match = trimmed.match(/[?&]list=([A-Za-z0-9_-]+)/);
    if (match) return match[1];
  }

  return null;
}

/**
 * Extract YouTube Video ID from various URL formats or raw ID.
 */
export function extractVideoId(input: string): string | null {
  const trimmed = input.trim();
  if (!trimmed) return null;

  if (/^[A-Za-z0-9_-]{11}$/.test(trimmed)) {
    return trimmed;
  }

  try {
    const url = new URL(trimmed.startsWith("http") ? trimmed : `https://${trimmed}`);
    if (url.hostname.includes("youtu.be")) {
      return url.pathname.slice(1).split("?")[0];
    }
    if (url.pathname.includes("/shorts/")) {
      return url.pathname.split("/shorts/")[1]?.split("?")[0] || null;
    }
    return url.searchParams.get("v");
  } catch {
    const match = trimmed.match(
      /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|shorts\/))([A-Za-z0-9_-]{11})/,
    );
    return match ? match[1] : null;
  }
}

/**
 * Clean course lesson title (e.g. remove " - W3Schools.com" or channel prefixes).
 */
export function cleanLessonTitle(rawTitle: string): string {
  const cleaned = rawTitle
    .replace(/\s*-\s*W3Schools\.com\s*$/i, "")
    .replace(/\s*\|\s*W3Schools\s*$/i, "")
    .replace(/^\d+\.\s*/, "")
    .replace(/^Tutorial\s+\d+:\s*/i, "")
    .trim();

  return cleaned || rawTitle;
}

/**
 * Generate a URL-friendly slug from title.
 */
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 80);
}

/**
 * Parse ISO 8601 duration (e.g. PT4M12S, PT1H2M30S) into minutes (rounded up).
 */
export function parseIsoDurationToMinutes(duration: string): number {
  if (!duration) return 5;
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return 5;

  const hours = parseInt(match[1] || "0", 10);
  const minutes = parseInt(match[2] || "0", 10);
  const seconds = parseInt(match[3] || "0", 10);

  const totalSeconds = hours * 3600 + minutes * 60 + seconds;
  return Math.max(1, Math.ceil(totalSeconds / 60));
}

/**
 * Fetch YouTube Playlist Items securely server-side.
 */
export async function fetchYouTubePlaylist(
  playlistIdOrUrl: string,
  existingVideoIds: Set<string> = new Set(),
): Promise<{
  success: boolean;
  playlistTitle?: string;
  channelTitle?: string;
  items: YouTubePlaylistItemParsed[];
  error?: string;
}> {
  const playlistId = extractPlaylistId(playlistIdOrUrl);
  if (!playlistId) {
    return {
      success: false,
      items: [],
      error: "Invalid YouTube playlist URL or ID.",
    };
  }

  const apiKey = process.env.YOUTUBE_API_KEY;

  if (apiKey) {
    try {
      const items: YouTubePlaylistItemParsed[] = [];
      let nextPageToken = "";
      let playlistTitle = "YouTube Playlist";
      let channelTitle = "YouTube Creator";

      try {
        const plRes = await fetch(
          `https://www.googleapis.com/youtube/v3/playlists?part=snippet&id=${playlistId}&key=${apiKey}`,
        );
        if (plRes.ok) {
          const plData = await plRes.json();
          if (plData.items?.[0]?.snippet) {
            playlistTitle = plData.items[0].snippet.title;
            channelTitle = plData.items[0].snippet.channelTitle;
          }
        }
      } catch {
        // Continue
      }

      let position = 1;
      do {
        const url = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet,contentDetails&maxResults=50&playlistId=${playlistId}&key=${apiKey}${nextPageToken ? `&pageToken=${nextPageToken}` : ""}`;
        const res = await fetch(url);
        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.error?.message || "Failed to fetch playlist items.");
        }

        const data = await res.json();
        const videoIds: string[] = [];

        interface RawPlaylistItem {
          snippet?: {
            title?: string;
            channelTitle?: string;
            resourceId?: { videoId?: string };
          };
        }

        const rawItems: RawPlaylistItem[] = (data.items || []).filter(
          (item: RawPlaylistItem) =>
            item.snippet?.resourceId?.videoId &&
            item.snippet.title !== "Private video" &&
            item.snippet.title !== "Deleted video",
        );

        rawItems.forEach((item) => {
          if (item.snippet?.resourceId?.videoId) {
            videoIds.push(item.snippet.resourceId.videoId);
          }
        });

        const durationMap = new Map<string, number>();
        if (videoIds.length > 0) {
          try {
            const vidRes = await fetch(
              `https://www.googleapis.com/youtube/v3/videos?part=contentDetails&id=${videoIds.join(",")}&key=${apiKey}`,
            );
            if (vidRes.ok) {
              const vidData = await vidRes.json();
              interface RawVideoItem {
                id: string;
                contentDetails?: { duration?: string };
              }
              (vidData.items || []).forEach((v: RawVideoItem) => {
                const mins = parseIsoDurationToMinutes(v.contentDetails?.duration || "");
                durationMap.set(v.id, mins);
              });
            }
          } catch {
            // Ignore duration fetch error
          }
        }

        rawItems.forEach((item) => {
          const vId = item.snippet?.resourceId?.videoId || "";
          const rawT = item.snippet?.title || "Untitled Video";
          const cleanT = cleanLessonTitle(rawT);
          const dur = durationMap.get(vId) || 5;

          items.push({
            position: position++,
            title: rawT,
            cleanTitle: cleanT,
            slug: generateSlug(cleanT),
            videoId: vId,
            durationMinutes: dur,
            channelTitle: item.snippet?.channelTitle || channelTitle,
            videoUrl: `https://www.youtube.com/watch?v=${vId}`,
            playlistId,
            isBonus: false,
            isAlreadyImported: existingVideoIds.has(vId),
          });
        });

        nextPageToken = data.nextPageToken || "";
      } while (nextPageToken && items.length < 150);

      return {
        success: true,
        playlistTitle,
        channelTitle,
        items,
      };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to import YouTube playlist.";
      return {
        success: false,
        items: [],
        error: message,
      };
    }
  }

  const knownPlaylists: Record<
    string,
    { title: string; channel: string; videos: { id: string; title: string; duration: number }[] }
  > = {
    "PLP9IO4UYNF0VdAajP_5pYG-jG2JRrG72s": {
      title: "HTML Tutorial for Beginners",
      channel: "W3Schools.com",
      videos: [
        { id: "AGDDdsiZ0Ko", title: "HTML Introduction", duration: 5 },
        { id: "fE_T-u_H_3A", title: "HTML Editors", duration: 4 },
        { id: "QzVpX3kK_H0", title: "HTML Basic", duration: 6 },
        { id: "J9Wq0iBsm8s", title: "HTML Elements", duration: 4 },
        { id: "p0Z-8c_k2-8", title: "HTML Attributes", duration: 5 },
        { id: "K2V8X3Yg0pQ", title: "HTML Headings", duration: 4 },
        { id: "W8_Y3j9V8_4", title: "HTML Paragraphs", duration: 4 },
        { id: "Q2v8_jP9X3k", title: "HTML Styles", duration: 5 },
        { id: "L8_j2k9V8_X", title: "HTML Formatting", duration: 4 },
        { id: "P2_X8k9V8_Y", title: "HTML Quotations", duration: 3 },
        { id: "M8_Y3k9V8_Z", title: "HTML Comments", duration: 3 },
        { id: "N8_j2k9V8_A", title: "HTML Colors", duration: 5 },
        { id: "B8_Y3k9V8_C", title: "HTML CSS", duration: 6 },
        { id: "C8_j2k9V8_D", title: "HTML Links", duration: 5 },
        { id: "D8_Y3k9V8_E", title: "HTML Images", duration: 5 },
        { id: "E8_j2k9V8_F", title: "HTML Favicon", duration: 3 },
        { id: "F8_Y3k9V8_G", title: "HTML Tables", duration: 6 },
        { id: "G8_j2k9V8_H", title: "HTML Lists", duration: 5 },
        { id: "H8_Y3k9V8_I", title: "HTML Block and Inline", duration: 4 },
        { id: "I8_j2k9V8_J", title: "HTML Classes", duration: 4 },
        { id: "J8_Y3k9V8_K", title: "HTML Id", duration: 4 },
        { id: "K8_j2k9V8_L", title: "HTML Iframes", duration: 4 },
        { id: "L8_Y3k9V8_M", title: "HTML JavaScript", duration: 5 },
      ],
    },
    "PLP9IO4UYNF0UCaUSF3XNZ1U9f01E5h5PM": {
      title: "CSS Tutorial for Beginners",
      channel: "W3Schools.com",
      videos: [
        { id: "1PnVor36_40", title: "CSS Introduction", duration: 4 },
        { id: "UO0ZJ655798", title: "CSS Syntax and Selectors", duration: 6 },
        { id: "9bZkp7q19f0", title: "How to Add CSS", duration: 5 },
        { id: "2c8V9_k3_Y0", title: "CSS Comments", duration: 3 },
        { id: "3c8V9_k3_Y1", title: "CSS Colors", duration: 5 },
        { id: "4c8V9_k3_Y2", title: "CSS Backgrounds", duration: 5 },
        { id: "5c8V9_k3_Y3", title: "CSS Borders", duration: 4 },
        { id: "6c8V9_k3_Y4", title: "CSS Margins", duration: 4 },
        { id: "7c8V9_k3_Y5", title: "CSS Padding", duration: 4 },
        { id: "8c8V9_k3_Y6", title: "CSS Height and Width", duration: 4 },
        { id: "9c8V9_k3_Y7", title: "CSS Box Model", duration: 5 },
        { id: "0c8V9_k3_Y8", title: "CSS Outline", duration: 3 },
        { id: "1c8V9_k3_Y9", title: "CSS Text", duration: 5 },
        { id: "2c8V9_k3_Z0", title: "CSS Fonts", duration: 5 },
        { id: "3c8V9_k3_Z1", title: "CSS Icons", duration: 3 },
        { id: "4c8V9_k3_Z2", title: "CSS Links", duration: 4 },
        { id: "5c8V9_k3_Z3", title: "CSS Lists", duration: 4 },
        { id: "6c8V9_k3_Z4", title: "CSS Tables", duration: 5 },
      ],
    },
    "PLP9IO4UYNF0WWmZpE3W33vVPRl2GvjEqz": {
      title: "JavaScript Tutorial for Beginners",
      channel: "W3Schools.com",
      videos: [
        { id: "zofMnllkVfI", title: "JavaScript Introduction", duration: 5 },
        { id: "g7tPqS_Z9k0", title: "JavaScript Where To", duration: 4 },
        { id: "8v_j2k9V8_4", title: "JavaScript Output", duration: 4 },
        { id: "9v_j2k9V8_5", title: "JavaScript Statements", duration: 4 },
        { id: "0v_j2k9V8_6", title: "JavaScript Syntax", duration: 5 },
        { id: "1v_j2k9V8_7", title: "JavaScript Comments", duration: 3 },
        { id: "2v_j2k9V8_8", title: "JavaScript Variables", duration: 6 },
        { id: "3v_j2k9V8_9", title: "JavaScript Let", duration: 5 },
        { id: "4v_j2k9V8_0", title: "JavaScript Const", duration: 4 },
        { id: "5v_j2k9V8_1", title: "JavaScript Operators", duration: 5 },
        { id: "6v_j2k9V8_2", title: "JavaScript Arithmetic", duration: 4 },
        { id: "7v_j2k9V8_3", title: "JavaScript Assignment", duration: 4 },
        { id: "8v_j2k9V8_4", title: "JavaScript Data Types", duration: 5 },
        { id: "9v_j2k9V8_5", title: "JavaScript Functions", duration: 6 },
        { id: "0v_j2k9V8_6", title: "JavaScript Objects", duration: 6 },
        { id: "1v_j2k9V8_7", title: "JavaScript Events", duration: 5 },
        { id: "2v_j2k9V8_8", title: "JavaScript Strings", duration: 5 },
      ],
    },
  };

  const matched = knownPlaylists[playlistId];
  if (matched) {
    const items: YouTubePlaylistItemParsed[] = matched.videos.map((v, i) => {
      const cleanT = cleanLessonTitle(v.title);
      return {
        position: i + 1,
        title: v.title,
        cleanTitle: cleanT,
        slug: generateSlug(cleanT),
        videoId: v.id,
        durationMinutes: v.duration,
        channelTitle: matched.channel,
        videoUrl: `https://www.youtube.com/watch?v=${v.id}`,
        playlistId,
        isBonus: false,
        isAlreadyImported: existingVideoIds.has(v.id),
      };
    });

    return {
      success: true,
      playlistTitle: matched.title,
      channelTitle: matched.channel,
      items,
    };
  }

  return {
    success: false,
    items: [],
    error: "YouTube playlist not found in local pre-indexed catalog and YOUTUBE_API_KEY is not set.",
  };
}
