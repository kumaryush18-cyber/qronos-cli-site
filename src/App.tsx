import { useEffect, useState, type ComponentType } from "react";
import { Route, Switch, useLocation } from "wouter";
import { Footer } from "./components/layout/Footer";
import { Nav } from "./components/layout/Nav";
import { Seo } from "./components/ui/Seo";
import { Home } from "./pages/Home";
import { NotFound } from "./pages/NotFound";
import { useReveal } from "./lib/use-reveal";

/**
 * Route-level code splitting without Suspense.
 *
 * Why not `React.lazy`: a Suspense boundary that exists on the client but not in
 * the prerendered file makes React throw the prerendered tree away and re-render
 * the page (a hydration mismatch). So the pages are held in a small registry
 * instead. `main.tsx` fills it *before* hydration, and a client-side navigation
 * fills it in an effect. A route whose component is not ready renders the same
 * "Loading…" block every time, never a suspense fallback.
 */
type DocsPage = ComponentType;
type DocPageType = ComponentType<{ slug: string }>;

interface Pages {
  Docs?: DocsPage;
  DocPage?: DocPageType;
  Changelog?: DocsPage;
}

const pages: Pages = {};
const listeners = new Set<() => void>();

function publish(next: Pages) {
  Object.assign(pages, next);
  for (const listener of listeners) listener();
}

/** Which modules a path needs. Empty for the home page, which is always loaded. */
function modulesFor(path: string): ("Docs" | "DocPage" | "Changelog")[] {
  if (path.startsWith("/docs/")) return ["DocPage"];
  if (path.startsWith("/docs")) return ["Docs"];
  if (path.startsWith("/changelog")) return ["Changelog"];
  return [];
}

function missingFor(path: string): boolean {
  return modulesFor(path).some((key) => pages[key] === undefined);
}

/**
 * Load what this path needs. Called by `main.tsx` before hydration and by the
 * router whenever a navigation lands on a page whose chunk is not loaded yet.
 */
export async function preloadRoute(path: string): Promise<void> {
  const key = modulesFor(path)[0];
  if (!key || pages[key]) return;

  if (key === "DocPage") {
    const module = await import("./pages/DocPage");
    publish({ DocPage: module.DocPage });
  } else if (key === "Docs") {
    const module = await import("./pages/Docs");
    publish({ Docs: module.Docs });
  } else {
    const module = await import("./pages/Changelog");
    publish({ Changelog: module.Changelog });
  }
}

/** Used by the prerender entry so the server renders the real page, not a fallback. */
export function registerPages(next: Pages): void {
  publish(next);
}

/** Shown while a chunk is in flight. Sized so its arrival does not shift the page. */
function RouteFallback() {
  return (
    <div className="flex min-h-[62vh] items-center justify-center" aria-busy="true" aria-live="polite">
      <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted">Loading…</p>
    </div>
  );
}

/**
 * Scroll handling for a single-page site.
 *
 * A new path starts at the top; a hash link (`/#features`) scrolls to the
 * section after the browser has laid the page out. Without the second case,
 * moving from `/docs` to `/#features` would land at the top of the home page.
 */
function useScrollReset(path: string) {
  useEffect(() => {
    const hash = window.location.hash.replace(/^#/, "");
    if (!hash) {
      window.scrollTo({ top: 0, behavior: "auto" });
      return;
    }

    const frame = requestAnimationFrame(() => {
      const target = document.getElementById(hash);
      if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
    return () => cancelAnimationFrame(frame);
  }, [path]);
}

function Site() {
  const [path] = useLocation();
  const [, rerender] = useState(0);

  useScrollReset(path);
  useReveal(path);

  // A chunk that arrives after the route changed must repaint the route.
  useEffect(() => {
    const notify = () => rerender((value) => value + 1);
    listeners.add(notify);
    if (missingFor(path)) void preloadRoute(path);
    return () => {
      listeners.delete(notify);
    };
  }, [path]);

  const { Docs, DocPage, Changelog } = pages;

  return (
    <div className="flex min-h-screen flex-col">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-[7px] focus:bg-card focus:px-3 focus:py-2 focus:font-mono focus:text-[11px]"
      >
        Skip to content
      </a>

      <Seo path={path} />
      <Nav />

      <main id="main" className="flex-1">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/docs">{Docs ? <Docs /> : <RouteFallback />}</Route>
          <Route path="/docs/:slug">
            {(params: { slug: string }) =>
              DocPage ? <DocPage slug={params.slug} /> : <RouteFallback />
            }
          </Route>
          <Route path="/changelog">{Changelog ? <Changelog /> : <RouteFallback />}</Route>
          <Route component={NotFound} />
        </Switch>
      </main>

      <Footer />
    </div>
  );
}

export function App() {
  return <Site />;
}
