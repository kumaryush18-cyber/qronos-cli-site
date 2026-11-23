import { describe, expect, it } from "vitest";
import { cleanInline, firstParagraph, parseHeadings } from "@/lib/headings";

const page = [
  "# Title",
  "",
  "Intro line.",
  "",
  "## Getting there",
  "",
  "Some text.",
  "",
  "```bash",
  "## not a heading",
  "```",
  "",
  "### With `code` and **bold**",
  "",
  "## Getting there",
  "",
  "Repeated heading.",
].join("\n");

describe("parseHeadings", () => {
  it("reads h2 and h3 only, in order", () => {
    const headings = parseHeadings(page);
    expect(headings.map((heading) => heading.text)).toEqual(["Getting there", "With code and bold", "Getting there"]);
    expect(headings.map((heading) => heading.depth)).toEqual([2, 3, 2]);
  });

  it("ignores a heading inside a fenced block", () => {
    expect(parseHeadings(page).some((heading) => heading.text === "not a heading")).toBe(false);
  });

  it("makes unique ids for repeated headings, like rehype-slug", () => {
    const ids = parseHeadings(page).map((heading) => heading.id);
    expect(ids).toEqual(["getting-there", "with-code-and-bold", "getting-there-1"]);
  });

  it("writes ids that are safe in a URL", () => {
    for (const heading of parseHeadings("## A/B: what now? (really)")) {
      expect(heading.id).toMatch(/^[a-z0-9-]+$/);
    }
  });

  it("handles an empty document", () => {
    expect(parseHeadings("")).toEqual([]);
  });
});

describe("cleanInline", () => {
  it("removes inline code, bold, italic and links", () => {
    expect(cleanInline("Use `npm` for **this** and *that* and [docs](/docs)")).toBe(
      "Use npm for this and that and docs",
    );
  });
});

describe("firstParagraph", () => {
  it("skips the title, fences, lists and quotes", () => {
    expect(firstParagraph(page)).toBe("Intro line.");
  });

  it("returns nothing for a document with no prose", () => {
    expect(firstParagraph("## Only a heading")).toBe("");
  });
});
