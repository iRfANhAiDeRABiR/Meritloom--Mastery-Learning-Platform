"use client";

import * as React from "react";
import { usePathname, useSearchParams } from "next/navigation";

/**
 * Lightweight top navigation progress indicator.
 *
 * Provides immediate visual transition feedback (< 50ms) upon clicking internal links,
 * before the Next.js Server Component payload finishes streaming.
 */
export function RouteProgressBar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [isLoading, setIsLoading] = React.useState(false);
  const [progress, setProgress] = React.useState(0);
  const [visible, setVisible] = React.useState(false);

  const intervalRef = React.useRef<NodeJS.Timeout | null>(null);

  // Complete and hide progress bar when navigation destination finishes loading
  React.useEffect(() => {
    if (!isLoading) return;

    const timer = setTimeout(() => {
      setProgress(100);
      if (intervalRef.current) clearInterval(intervalRef.current);

      const hideTimer = setTimeout(() => {
        setIsLoading(false);
        setVisible(false);
        setProgress(0);
      }, 250);

      return () => clearTimeout(hideTimer);
    }, 0);

    return () => clearTimeout(timer);
  }, [pathname, searchParams, isLoading]);

  // Intercept click on internal navigation links
  React.useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      // Find closest anchor
      const target = e.target as HTMLElement | null;
      const anchor = target?.closest("a") as HTMLAnchorElement | null;
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      if (!href) return;

      // Skip non-navigating links (hash, mailto, tel, target="_blank", downloads)
      if (
        href.startsWith("#") ||
        href.startsWith("mailto:") ||
        href.startsWith("tel:") ||
        anchor.target === "_blank" ||
        anchor.hasAttribute("download") ||
        e.metaKey ||
        e.ctrlKey ||
        e.shiftKey ||
        e.altKey ||
        e.defaultPrevented
      ) {
        return;
      }

      // Check same-origin
      try {
        const url = new URL(anchor.href, window.location.href);
        if (url.origin !== window.location.origin) return;
        if (url.pathname === window.location.pathname && url.search === window.location.search) {
          return; // Same page
        }
      } catch {
        return;
      }

      // Start transition animation immediately
      if (intervalRef.current) clearInterval(intervalRef.current);

      setVisible(true);
      setIsLoading(true);
      setProgress(15);

      intervalRef.current = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) {
            if (intervalRef.current) clearInterval(intervalRef.current);
            return 90;
          }
          // Incrementally slow down as progress approaches 90%
          const step = Math.max(1, (90 - prev) / 10);
          return Math.min(90, prev + step);
        });
      }, 100);
    };

    document.addEventListener("click", handleClick, { capture: true });

    return () => {
      document.removeEventListener("click", handleClick, { capture: true });
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  if (!visible && progress === 0) return null;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed top-0 left-0 right-0 z-[9999] h-[2.5px] overflow-hidden"
    >
      <div
        className="h-full bg-gradient-to-r from-primary via-primary-hover to-mint transition-all duration-200 ease-out shadow-[0_0_8px_rgba(109,74,255,0.6)]"
        style={{
          width: `${progress}%`,
          opacity: visible ? 1 : 0,
        }}
      />
    </div>
  );
}

