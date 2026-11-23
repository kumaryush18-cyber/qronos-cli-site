import { useEffect, useState } from "react";

/**
 * True when the viewport matches `query`.
 *
 * Used to render **one** copy of a repeated element (the table of contents)
 * instead of two copies hidden with CSS: a hidden duplicate is still read aloud
 * by a screen reader and still costs DOM work.
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") return false;
    return window.matchMedia(query).matches;
  });

  useEffect(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") return;
    const list = window.matchMedia(query);
    const onChange = (event: MediaQueryListEvent) => setMatches(event.matches);
    setMatches(list.matches);
    list.addEventListener("change", onChange);
    return () => list.removeEventListener("change", onChange);
  }, [query]);

  return matches;
}
