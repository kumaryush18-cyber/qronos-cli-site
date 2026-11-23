import type { DocPage } from "@/content/docs/manifest";
import { parseHeadings } from "./headings";

export interface SearchEntry {
  readonly slug: string;
  readonly title: string;
  readonly group: string;
  readonly intro: string;
  /** Heading text and its anchor, so a result can land on the right section. */
  readonly headings: readonly { text: string; id: string }[];
  readonly text: string;
}

export interface SearchHit {
  readonly slug: string;
  readonly title: string;
  readonly anchor?: string;
  readonly snippet: string;
  readonly score: number;
}

/**
 * Build the index from the raw MDX that is already in the bundle.
 *
 * No build step and no fetched JSON: the docs cannot be indexed with yesterday's
 * text, because the index is made from the same strings the page renders.
 */
export function buildIndex(
  pages: readonly DocPage[],
  sources: Record<string, string>,
): SearchEntry[] {
  return pages.flatMap((page) => {
    const source = sources[page.slug] ?? "";
    if (source.length === 0) return [];
    const headings = parseHeadings(source).map((heading) => ({ text: heading.text, id: heading.id }));
    return [
      {
        slug: page.slug,
        title: page.title,
        group: page.group,
        intro: page.intro,
        headings,
        text: plain(source),
      },
    ];
  });
}

/** Strip markdown so a snippet reads like a sentence. */
export function plain(source: string): string {
  return source
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`([^`]*)`/g, "$1")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/[*_>|]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function snippetAround(text: string, needle: string, radius = 60): string {
  const at = text.toLowerCase().indexOf(needle);
  if (at < 0) return text.slice(0, 120);
  const start = Math.max(0, at - radius);
  const end = Math.min(text.length, at + needle.length + radius);
  return `${start > 0 ? "…" : ""}${text.slice(start, end).trim()}${end < text.length ? "…" : ""}`;
}

/**
 * Rank results: a title beats a heading beats the body.
 *
 * Deliberately simple and synchronous — a docs site with forty pages does not
 * need a fuzzy engine, and a predictable order is easier to trust.
 */
export function searchEntries(entries: readonly SearchEntry[], query: string, limit = 8): SearchHit[] {
  const needle = query.trim().toLowerCase();
  if (needle.length < 2) return [];

  const hits: SearchHit[] = [];
  for (const entry of entries) {
    const title = entry.title.toLowerCase();
    const heading = entry.headings.find((item) => item.text.toLowerCase().includes(needle));
    const body = entry.text.toLowerCase().includes(needle);

    if (!title.includes(needle) && !heading && !body) continue;

    const score = title.startsWith(needle) ? 100 : title.includes(needle) ? 80 : heading ? 50 : 20;
    hits.push({
      slug: entry.slug,
      title: entry.title,
      ...(heading && !title.includes(needle) ? { anchor: heading.id } : {}),
      snippet: heading ? heading.text : snippetAround(entry.text, needle),
      score,
    });
  }

  return hits.sort((a, b) => b.score - a.score || a.title.localeCompare(b.title)).slice(0, limit);
}
