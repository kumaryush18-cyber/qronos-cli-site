import { describe, expect, it } from "vitest";
import { DOC_PAGES } from "@/content/docs/manifest";
import {
  DOC_SOURCES,
  docBody,
  docHeadings,
  docSummary,
  pagesWithBodies,
  pagesWithNoBody,
  slugsWithBodiesButNoPage,
} from "@/content/docs/registry";
import { buildIndex, plain, searchEntries } from "@/lib/search";

describe("docs registry", () => {
  it("has a body for every page in the manifest, and no orphans", () => {
    expect(pagesWithNoBody()).toEqual([]);
    expect(slugsWithBodiesButNoPage()).toEqual([]);
    expect(pagesWithBodies()).toHaveLength(DOC_PAGES.length);
  });

  it("has raw source for every page", () => {
    for (const page of DOC_PAGES) {
      expect((DOC_SOURCES[page.slug] ?? "").length).toBeGreaterThan(80);
    }
  });

  it("gives every page at least two h2 sections", () => {
    for (const page of DOC_PAGES) {
      const h2 = docHeadings(page.slug).filter((heading) => heading.depth === 2);
      expect(h2.length, `${page.slug} needs sections`).toBeGreaterThanOrEqual(2);
    }
  });

  it("never repeats an h1 inside the body, because the page header has it", () => {
    for (const page of DOC_PAGES) {
      const source = DOC_SOURCES[page.slug] ?? "";
      expect(source.trimStart().startsWith("# "), `${page.slug} starts with an h1`).toBe(false);
    }
  });

  it("has unique ids inside every page", () => {
    for (const page of DOC_PAGES) {
      const ids = docHeadings(page.slug).map((heading) => heading.id);
      expect(new Set(ids).size, `${page.slug} repeats a heading id`).toBe(ids.length);
    }
  });

  it("can describe a page with one sentence from its body", () => {
    for (const page of DOC_PAGES) {
      expect(docSummary(page.slug).length).toBeGreaterThan(20);
      expect(docSummary(page.slug).length).toBeLessThanOrEqual(160);
    }
  });

  it("loads a body component for a known slug and nothing for an unknown one", () => {
    expect(docBody("workflows")).toBeTypeOf("function");
    expect(docBody("nope")).toBeUndefined();
  });
});

describe("search", () => {
  const index = buildIndex(DOC_PAGES, DOC_SOURCES);

  it("indexes every page", () => {
    expect(index).toHaveLength(DOC_PAGES.length);
  });

  it("finds a page by its title", () => {
    const hits = searchEntries(index, "compaction");
    expect(hits[0]?.slug).toBe("compaction");
  });

  it("finds a heading and returns its anchor", () => {
    const hits = searchEntries(index, "language server, bundled");
    expect(hits.length).toBeGreaterThan(0);
    expect(hits[0]?.slug).toBe("hashline-lsp");
    expect(hits[0]?.anchor).toBe("language-server-bundled");
  });

  it("gives no anchor when the match is the page title", () => {
    const hits = searchEntries(index, "privacy");
    expect(hits[0]?.anchor).toBeUndefined();
  });

  it("needs two letters before it answers", () => {
    expect(searchEntries(index, "a")).toEqual([]);
    expect(searchEntries(index, "  ")).toEqual([]);
  });

  it("says nothing when there is no match", () => {
    expect(searchEntries(index, "zzzzzqqq")).toEqual([]);
  });

  it("puts a title match above a body-only match", () => {
    const hits = searchEntries(index, "workflows");
    expect(hits[0]?.slug).toBe("workflows");
  });

  it("strips markdown from the searchable text", () => {
    expect(plain("## Title\n\nUse `qronos` **now** [docs](/docs)")).toBe("Title Use qronos now docs");
  });
});
