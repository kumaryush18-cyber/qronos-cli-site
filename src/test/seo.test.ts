import { describe, expect, it } from "vitest";
import { applyMeta } from "@/components/ui/Seo";
import { DOC_PAGES } from "@/content/docs/manifest";
import { canonicalFor, DEFAULT_META, metaFor, sitemapPaths } from "@/lib/seo";
import { SITE } from "@/lib/site";

describe("canonicalFor", () => {
  it("keeps the root as the bare origin", () => {
    expect(canonicalFor("/")).toBe(SITE.url);
  });

  it("drops a trailing slash and any query or hash", () => {
    expect(canonicalFor("/docs/workflows/?from=nav#top")).toBe(`${SITE.url}/docs/workflows`);
  });
});

describe("metaFor", () => {
  it("has a title, a description and a canonical URL on every route", () => {
    for (const path of sitemapPaths()) {
      const meta = metaFor(path);
      expect(meta.title.length).toBeGreaterThan(0);
      expect(meta.description.length).toBeGreaterThan(20);
      expect(meta.canonical.startsWith(SITE.url)).toBe(true);
    }
  });

  it("names the page in the title", () => {
    expect(metaFor("/docs/memory").title).toBe("Memory — Qronos CLI");
    expect(metaFor("/docs/memory").description).toBe(
      "What is remembered, where it is stored, and how to make it forget.",
    );
  });

  it("treats an unknown docs slug as a 404, not as a page", () => {
    expect(metaFor("/docs/does-not-exist")).toBe(metaFor("/404"));
  });

  it("ignores a query string when matching", () => {
    expect(metaFor("/docs?ref=readme").title).toBe(metaFor("/docs").title);
  });

  it("falls back to the home metadata for an unknown route", () => {
    expect(metaFor("/nowhere")).toBe(metaFor("/404"));
    expect(DEFAULT_META.canonical).toBe(SITE.url);
  });
});

describe("sitemapPaths", () => {
  it("lists every doc page exactly once", () => {
    const paths = sitemapPaths();
    expect(new Set(paths).size).toBe(paths.length);
    for (const page of DOC_PAGES) {
      expect(paths).toContain(`/docs/${page.slug}`);
    }
  });
});

describe("applyMeta", () => {
  it("writes the title, description, canonical and social tags", () => {
    const doc = document.implementation.createHTMLDocument("test");
    applyMeta(metaFor("/docs/commands"), doc);

    expect(doc.title).toBe("Commands — Qronos CLI");
    expect(doc.head.querySelector('meta[name="description"]')?.getAttribute("content")).toBe(
      "Every slash command, what it does, and what it costs.",
    );
    expect(doc.head.querySelector('link[rel="canonical"]')?.getAttribute("href")).toBe(
      `${SITE.url}/docs/commands`,
    );
    expect(doc.head.querySelector('meta[property="og:title"]')?.getAttribute("content")).toBe(
      "Commands — Qronos CLI",
    );
    expect(doc.head.querySelector('meta[name="twitter:card"]')?.getAttribute("content")).toBe(
      "summary_large_image",
    );
  });

  it("updates the same tag instead of adding a second one", () => {
    const doc = document.implementation.createHTMLDocument("test");
    applyMeta(metaFor("/docs"), doc);
    applyMeta(metaFor("/changelog"), doc);

    expect(doc.head.querySelectorAll('meta[name="description"]')).toHaveLength(1);
    expect(doc.head.querySelectorAll('link[rel="canonical"]')).toHaveLength(1);
    expect(doc.title).toBe("Changelog — Qronos CLI");
  });
});
