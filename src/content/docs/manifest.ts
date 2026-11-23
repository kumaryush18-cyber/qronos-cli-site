/**
 * The documentation manifest: the one list that decides the sidebar order, the
 * prev/next links, the sitemap and the page titles.
 *
 * Adding a page means adding one entry here. Nothing else sorts docs.
 */
export interface DocPage {
  readonly slug: string;
  readonly title: string;
  /** One sentence, used on the docs index and in the page <meta>. */
  readonly intro: string;
  readonly group: DocGroup;
}

export type DocGroup = "Start here" | "The agent" | "Deep dives" | "Operate";

export const DOC_GROUPS: readonly DocGroup[] = ["Start here", "The agent", "Deep dives", "Operate"];

export const DOC_PAGES: readonly DocPage[] = [
  {
    slug: "getting-started",
    title: "Getting started",
    intro: "From nothing to a first edit in two minutes.",
    group: "Start here",
  },
  {
    slug: "install",
    title: "Install",
    intro: "npx, global, or a pinned version; what each one does.",
    group: "Start here",
  },
  {
    slug: "commands",
    title: "Commands",
    intro: "Every slash command, what it does, and what it costs.",
    group: "The agent",
  },
  {
    slug: "workflows",
    title: "Workflows",
    intro: "The script API, the caps, and how to steer a run that is already going.",
    group: "Deep dives",
  },
  {
    slug: "memory",
    title: "Memory",
    intro: "What is remembered, where it is stored, and how to make it forget.",
    group: "Deep dives",
  },
  {
    slug: "compaction",
    title: "Compaction",
    intro: "How a long session is summarised without losing the facts that matter.",
    group: "Deep dives",
  },
  {
    slug: "hashline-lsp",
    title: "Hashline & LSP",
    intro: "Tags that make edits safe, and diagnostics without installing a server.",
    group: "Deep dives",
  },
  {
    slug: "agent-hub",
    title: "Agent Hub",
    intro: "Watch subagents work, and chat with one while the others run.",
    group: "Deep dives",
  },
  {
    slug: "step-names",
    title: "Step names",
    intro: "The optional sentence above a shell call, and why it is optional.",
    group: "Deep dives",
  },
  {
    slug: "retry-stop-rerun",
    title: "Retry, stop, rerun",
    intro: "Three keys that fix a run without starting over.",
    group: "Operate",
  },
  {
    slug: "environment",
    title: "Environment",
    intro: "Every QRONOS_* variable, its default, and its clamp.",
    group: "Operate",
  },
  {
    slug: "troubleshooting",
    title: "Troubleshooting",
    intro: "The errors people actually hit, and the one-line fix.",
    group: "Operate",
  },
  {
    slug: "privacy",
    title: "Privacy",
    intro: "What is stored on your machine, and what is never sent anywhere.",
    group: "Operate",
  },
];

/** Pages grouped for the sidebar, groups in fixed order. */
export function groupedDocs(pages: readonly DocPage[] = DOC_PAGES): { group: DocGroup; pages: DocPage[] }[] {
  return DOC_GROUPS.map((group) => ({
    group,
    pages: pages.filter((page) => page.group === group),
  })).filter((entry) => entry.pages.length > 0);
}

export function findDoc(slug: string): DocPage | undefined {
  return DOC_PAGES.find((page) => page.slug === slug);
}

/** Neighbours in manifest order, not in group order: prev/next crosses groups. */
export function docNeighbours(slug: string): { prev?: DocPage; next?: DocPage } {
  const index = DOC_PAGES.findIndex((page) => page.slug === slug);
  if (index < 0) return {};
  const prev = index > 0 ? DOC_PAGES[index - 1] : undefined;
  const next = index < DOC_PAGES.length - 1 ? DOC_PAGES[index + 1] : undefined;
  return { ...(prev ? { prev } : {}), ...(next ? { next } : {}) };
}
