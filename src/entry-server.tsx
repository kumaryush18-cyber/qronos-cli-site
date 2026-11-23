import { StrictMode } from "react";
import { renderToPipeableStream } from "react-dom/server";
import { Router } from "wouter";
import { Changelog } from "./pages/Changelog";
import { DocPage } from "./pages/DocPage";
import { Docs } from "./pages/Docs";
import { App, registerPages } from "./App";

export { breadcrumbJsonLd, headTags, jsonLd } from "./lib/head-tags";

// The browser loads these as separate chunks; the server needs them up front so
// a prerendered docs page contains the article, not a loading line.
registerPages({ Docs, DocPage, Changelog });

/**
 * Render one route to a string, for the prerender step.
 *
 * The same `<App />` the browser mounts is used here, so the HTML a crawler
 * reads and the HTML a reader sees come from one component tree. No lazy
 * components and no Suspense boundary: a boundary that exists on one side and
 * not the other is exactly the mismatch that makes hydration throw the tree away.
 */
export function render(path: string): Promise<string> {
  return new Promise((resolve, reject) => {
    let html = "";
    const stream = renderToPipeableStream(
      <StrictMode>
        <Router ssrPath={path}>
          <App />
        </Router>
      </StrictMode>,
      {
        onAllReady() {
          stream.pipe({
            write(chunk: string | Uint8Array) {
              html += typeof chunk === "string" ? chunk : new TextDecoder().decode(chunk);
              return true;
            },
            end() {
              resolve(html);
            },
            on() {
              return this;
            },
            once() {
              return this;
            },
            emit() {
              return true;
            },
          } as unknown as NodeJS.WritableStream);
        },
        onError(error) {
          reject(error instanceof Error ? error : new Error(String(error)));
        },
      },
    );
  });
}
