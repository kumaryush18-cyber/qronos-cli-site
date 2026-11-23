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
    // Overwritten by canonicalFor in metaFor; kept so the shape is complete.
    canonical: `${SITE.url}/docs/`,
  },
  "/changelog": {
    title: "Changelog — Qronos CLI",
    description: "Every release, newest first, with what changed and why.",
    canonical: `${SITE.url}/changelog/`,
  },
  "/404": {
    title: "Page not found — Qronos CLI",
    description: "That page left the session. Try the docs.",
    canonical: `${SITE.url}/404`,
  },
};

/**
 * Absolute URL for a route.
 *
 * Every prerendered page except the home page is a directory on the host, so
 * `/docs/workflows` and `/changelog` both answer with a 301 to the version with a
 * trailing slash. The canonical form is the URL that answers 200: a canonical
 * that points at a redirect is a small lie that costs a round trip. The home page
 * is a file and keeps no trailing slash.
 */
export function canonicalFor(path: string): string {
  const clean = path.split("?")[0]?.split("#")[0] ?? "/";
  if (clean === "/" || clean === "") return SITE.url;
  return `${SITE.url}${clean.replace(/\/+$/, "")}/`;
}

export function metaFor(path: string): PageMeta {
  const clean = (path.split("?")[0] ?? "/").split("#")[0] ?? "/";
  const fixed = STATIC[clean];
  // One rule for the canonical everywhere: the fixed entries carry a URL written
  // by hand, and a hand-written URL drifts from the host's redirect rule.
  if (fixed) return { ...fixed, canonical: canonicalFor(clean) };

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
  // to the reader, so it gets the 404 metadata — through the same canonical rule
  // as every other route, so the two 404 forms cannot disagree.
  const notFound = STATIC["/404"] ?? DEFAULT_META;
  return { ...notFound, canonical: canonicalFor("/404") };
}

/** Every route the sitemap must contain. */
export function sitemapPaths(): string[] {
  return ["/", "/docs", "/changelog", ...DOC_PAGES.map((page) => `/docs/${page.slug}`)];
}
