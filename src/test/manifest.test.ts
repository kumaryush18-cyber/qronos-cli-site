import { describe, expect, it } from "vitest";
import { DOC_GROUPS, DOC_PAGES, docNeighbours, findDoc, groupedDocs } from "@/content/docs/manifest";

describe("docs manifest", () => {
  it("has a unique slug and a unique title for every page", () => {
    const slugs = DOC_PAGES.map((page) => page.slug);
    const titles = DOC_PAGES.map((page) => page.title);
    expect(new Set(slugs).size).toBe(slugs.length);
    expect(new Set(titles).size).toBe(titles.length);
  });

  it("uses slugs that are URL-safe", () => {
    for (const page of DOC_PAGES) {
      expect(page.slug).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
    }
  });

  it("gives every page a one-sentence intro that ends with a full stop", () => {
    for (const page of DOC_PAGES) {
      expect(page.intro.trim().endsWith(".")).toBe(true);
      expect(page.intro.length).toBeLessThanOrEqual(110);
    }
  });

  it("puts every page in one of the known groups", () => {
    for (const page of DOC_PAGES) {
      expect(DOC_GROUPS).toContain(page.group);
    }
  });

  it("keeps the group order fixed and drops empty groups", () => {
    const groups = groupedDocs().map((entry) => entry.group);
    expect(groups).toEqual(DOC_GROUPS.filter((group) => DOC_PAGES.some((page) => page.group === group)));
    for (const entry of groupedDocs()) {
      expect(entry.pages.length).toBeGreaterThan(0);
    }
  });

  it("loses no page when grouping", () => {
    const grouped = groupedDocs().flatMap((entry) => entry.pages.map((page) => page.slug));
    expect(grouped.sort()).toEqual(DOC_PAGES.map((page) => page.slug).sort());
  });

  it("links neighbours in manifest order", () => {
    const first = DOC_PAGES[0]!.slug;
    const last = DOC_PAGES[DOC_PAGES.length - 1]!.slug;
    expect(docNeighbours(first).prev).toBeUndefined();
    expect(docNeighbours(first).next?.slug).toBe(DOC_PAGES[1]!.slug);
    expect(docNeighbours(last).next).toBeUndefined();
    expect(docNeighbours(last).prev?.slug).toBe(DOC_PAGES[DOC_PAGES.length - 2]!.slug);
  });

  it("finds a page by slug and nothing by a slug that is not there", () => {
    expect(findDoc("workflows")?.title).toBe("Workflows");
    expect(findDoc("nope")).toBeUndefined();
    expect(docNeighbours("nope")).toEqual({});
  });
});
