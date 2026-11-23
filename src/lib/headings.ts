import GithubSlugger from "github-slugger";

export interface Heading {
  readonly depth: 2 | 3;
  readonly text: string;
  readonly id: string;
}

/**
 * Read the headings out of an MDX file.
 *
 * The ids come from `github-slugger`, which is the same library `rehype-slug`
 * uses, so the table of contents cannot point at an id the page never had. A
 * fence is skipped: a `## comment` inside a code block is not a heading.
 */
export function parseHeadings(source: string): Heading[] {
  const slugger = new GithubSlugger();
  const headings: Heading[] = [];
  let inFence = false;

  for (const line of source.split("\n")) {
    const trimmed = line.trim();

    if (trimmed.startsWith("```") || trimmed.startsWith("~~~")) {
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;

    const match = /^(#{2,3})\s+(.*)$/.exec(trimmed);
    if (!match) continue;

    const text = cleanInline((match[2] ?? "").trim());
    if (text.length === 0) continue;

    headings.push({ depth: (match[1]?.length === 2 ? 2 : 3) as 2 | 3, text, id: slugger.slug(text) });
  }

  return headings;
}

/** Strip the markdown that can appear inside a heading. */
export function cleanInline(text: string): string {
  return text
    .replace(/`([^`]*)`/g, "$1")
    .replace(/\*\*([^*]*)\*\*/g, "$1")
    .replace(/\*([^*]*)\*/g, "$1")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .trim();
}

/** The first paragraph of a page, for the search index and its description. */
export function firstParagraph(source: string): string {
  let inFence = false;

  for (const line of source.split("\n")) {
    const trimmed = line.trim();
    if (trimmed.startsWith("```") || trimmed.startsWith("~~~")) {
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;
    if (trimmed.length === 0) continue;
    if (trimmed.startsWith("#")) continue;
    if (trimmed.startsWith("|") || trimmed.startsWith("-") || trimmed.startsWith(">")) continue;
    return cleanInline(trimmed);
  }

  return "";
}
