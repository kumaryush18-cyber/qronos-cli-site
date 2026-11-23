import { useEffect, useLayoutEffect, useState } from "react";

/** `useLayoutEffect` warns during server rendering, so fall back there. */
const useBeforePaint = typeof window === "undefined" ? useEffect : useLayoutEffect;

/**
 * True when the viewport matches `query`.
 *
 * The first render is always `false`, on the server and in the browser, so the
 * prerendered HTML and the hydrating client agree. The real value is applied
 * before the first paint, so a desktop reader never sees the phone layout for a
 * frame — but hydration stays clean, which is the part that would break the page.
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useBeforePaint(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") return;
    const list = window.matchMedia(query);
    setMatches(list.matches);

    const onChange = (event: MediaQueryListEvent) => setMatches(event.matches);
    list.addEventListener("change", onChange);
    return () => list.removeEventListener("change", onChange);
  }, [query]);

  return matches;
}
