import { useEffect } from "react";

/**
 * Reveal every `[data-reveal]` element when it scrolls into view.
 *
 * One observer for the whole page, plus a MutationObserver so a lazily loaded
 * route is picked up without asking each page to register itself. Elements are
 * unobserved once revealed: the animation runs once, and a reader who scrolls
 * back up is not made to watch it again.
 */
export function useReveal(path: string) {
  useEffect(() => {
    if (typeof IntersectionObserver !== "function") return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add("is-in");
          observer.unobserve(entry.target);
        }
      },
      // Start a little before the element is fully on screen, so the motion
      // finishes as it settles rather than after the reader has arrived.
      { rootMargin: "0px 0px -8% 0px", threshold: 0.05 },
    );

    const watch = (root: ParentNode) => {
      for (const element of root.querySelectorAll<HTMLElement>("[data-reveal]:not(.is-in)")) {
        observer.observe(element);
      }
    };

    watch(document);

    // A route change replaces the page after this effect ran, and a lazy route
    // arrives even later. Watching additions catches both without a timeout.
    const mutations = new MutationObserver((records) => {
      for (const record of records) {
        for (const node of record.addedNodes) {
          if (node.nodeType !== Node.ELEMENT_NODE) continue;
          const element = node as HTMLElement;
          if (element.matches("[data-reveal]")) observer.observe(element);
          watch(element);
        }
      }
    });
    mutations.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      mutations.disconnect();
    };
  }, [path]);
}
