import { useEffect, useState } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

/**
 * True when the reader asked the system for less motion.
 *
 * Guards `matchMedia` because jsdom does not implement it, and a test that
 * crashes on a missing browser API is a test that hides the real bug.
 */
export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(() => readPreference());

  useEffect(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") return;
    const media = window.matchMedia(QUERY);
    const listener = (event: MediaQueryListEvent) => setReduced(event.matches);
    setReduced(media.matches);

    if (typeof media.addEventListener === "function") {
      media.addEventListener("change", listener);
      return () => media.removeEventListener("change", listener);
    }
    // Safari before 14 only had the old listener.
    media.addListener(listener);
    return () => media.removeListener(listener);
  }, []);

  return reduced;
}

function readPreference(): boolean {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") return false;
  return window.matchMedia(QUERY).matches;
}
