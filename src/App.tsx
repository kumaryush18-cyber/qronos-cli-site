import { useEffect } from "react";
import { Route, Switch, useLocation } from "wouter";
import { Footer } from "./components/layout/Footer";
import { Nav } from "./components/layout/Nav";
import { Seo } from "./components/ui/Seo";
import { Changelog } from "./pages/Changelog";
import { DocPage } from "./pages/DocPage";
import { Docs } from "./pages/Docs";
import { Home } from "./pages/Home";
import { NotFound } from "./pages/NotFound";

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
  useScrollReset(path);

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
          <Route path="/docs" component={Docs} />
          <Route path="/docs/:slug">{(params: { slug: string }) => <DocPage slug={params.slug} />}</Route>
          <Route path="/changelog" component={Changelog} />
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
