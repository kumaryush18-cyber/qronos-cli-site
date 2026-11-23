/**
 * Page metadata. One function decides title and description for every route so
 * the SPA and the prerender step (P4) cannot disagree.
 */
import { DOC_PAGES, findDoc } from "@/content/docs/manifest";
import { SITE } from "./site";

export interface PageMeta {
  readonly title: string;
  readonly description: string;
  readonly canonical: string;
}

export const DEFAULT_META: PageMeta = {
  title: "Qronos CLI — the terminal that thinks in workflows",
  description: SITE.description,
  canonical: SITE.url,
};

const STATIC: Record<string, PageMeta> = {
  "/": DEFAULT_META,
  "/docs": {
    title: "Qronos CLI documentation",
    description:
      "Install, commands, workflows, memory, compaction and every environment variable, in one place.",
    canonical: `${SITE.url}/docs`,
  },
  "/changelog": {
    title: "Changelog — Qronos CLI",
    description: "Every release, newest first, with what changed and why.",
    canonical: `${SITE.url}/changelog`,
  },
  "/404": {
    title: "Page not found — Qronos CLI",
    description: "That page left the session. Try the docs.",
    canonical: `${SITE.url}/404`,
  },
};

/** Absolute URL for a route, without a trailing slash (except the root). */
export function canonicalFor(path: string): string {
  const clean = path.split("?")[0]?.split("#")[0] ?? "/";
  if (clean === "/" || clean === "") return SITE.url;
  return `${SITE.url}${clean.replace(/\/+$/, "")}`;
}

export function metaFor(path: string): PageMeta {
  const clean = (path.split("?")[0] ?? "/").split("#")[0] ?? "/";
  const fixed = STATIC[clean];
  if (fixed) return fixed;

  const docSlug = /^\/docs\/([^/]+)\/?$/.exec(clean)?.[1];
  if (docSlug) {
    const page = findDoc(docSlug);
    if (page) {
      return {
        title: `${page.title} — Qronos CLI`,
        description: page.intro,
        canonical: canonicalFor(clean),
      };
    }
  }

  // An unknown docs slug is still a docs page to the crawler, but it is a 404
  // to the reader, so it gets the 404 metadata.
  return STATIC["/404"] ?? DEFAULT_META;
}

/** Every route the sitemap must contain. */
export function sitemapPaths(): string[] {
  return ["/", "/docs", "/changelog", ...DOC_PAGES.map((page) => `/docs/${page.slug}`)];
}
