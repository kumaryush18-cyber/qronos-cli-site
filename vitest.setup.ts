import "@testing-library/jest-dom/vitest";
import { afterEach } from "vitest";
import { cleanup } from "@testing-library/react";

// Every test starts from an empty document: a leaked component from one test
// has broken an unrelated assertion more than once in this codebase's history.
afterEach(() => cleanup());

// jsdom has no matchMedia. Default the tests to "the reader asked for less
// motion": the hero then renders complete on the first paint, which keeps the
// route tests free of animation timers. The animated path has its own tests.
Object.defineProperty(window, "matchMedia", {
  configurable: true,
  value: (query: string) => ({
    matches: query.includes("prefers-reduced-motion"),
    media: query,
    onchange: null,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => false,
  }),
});

// jsdom does not implement scrolling. The app calls scrollTo on every route
// change, so a stub keeps the output free of "Not implemented" noise without
// hiding a real problem: nothing in the app depends on the scroll position.
Object.defineProperty(window, "scrollTo", { configurable: true, value: () => {} });
Object.defineProperty(window.HTMLElement.prototype, "scrollIntoView", {
  configurable: true,
  value: () => {},
});
