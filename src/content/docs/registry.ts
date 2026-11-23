import type { ComponentType } from "react";
import AgentHub from "./agent-hub.mdx";
import Commands from "./commands.mdx";
import Compaction from "./compaction.mdx";
import Environment from "./environment.mdx";
import GettingStarted from "./getting-started.mdx";
import HashlineLsp from "./hashline-lsp.mdx";
import Install from "./install.mdx";
import Memory from "./memory.mdx";
import Privacy from "./privacy.mdx";
import RetryStopRerun from "./retry-stop-rerun.mdx";
import StepNames from "./step-names.mdx";
import Troubleshooting from "./troubleshooting.mdx";
import Workflows from "./workflows.mdx";
import { DOC_PAGES } from "./manifest";
import { DOC_SOURCES as RAW_SOURCES } from "./doc-sources";
import { firstParagraph, parseHeadings, type Heading } from "@/lib/headings";

/** An MDX document: a component, nothing else. */
export type DocBody = ComponentType<{ components?: Record<string, ComponentType<Record<string, unknown>>> }>;

/**
 * Every page's body, imported explicitly.
 *
 * An explicit map, not a glob, so a page that is missing from disk fails the
 * build with a readable error instead of 404ing for a reader.
 */
const BODIES: Record<string, DocBody> = {
  "agent-hub": AgentHub,
  commands: Commands,
  compaction: Compaction,
  environment: Environment,
  "getting-started": GettingStarted,
  "hashline-lsp": HashlineLsp,
  install: Install,
  memory: Memory,
  privacy: Privacy,
  "retry-stop-rerun": RetryStopRerun,
  "step-names": StepNames,
  troubleshooting: Troubleshooting,
  workflows: Workflows,
};

/** Slugs that are known to the generator. */
export const DOC_SOURCES: Record<string, string> = RAW_SOURCES;

export function docBody(slug: string): DocBody | undefined {
  return BODIES[slug];
}

export function docHeadings(slug: string): Heading[] {
  const source = DOC_SOURCES[slug];
  return typeof source === "string" && source.length > 0 ? parseHeadings(source) : [];
}

export function docSummary(slug: string): string {
  const source = DOC_SOURCES[slug];
  if (typeof source !== "string" || source.length === 0) return "";
  return firstParagraph(source).slice(0, 160);
}

/** Slugs that have both a manifest entry and a body. Used by tests. */
export function pagesWithBodies(): string[] {
  return DOC_PAGES.filter((page) => BODIES[page.slug]).map((page) => page.slug);
}

export function slugsWithBodiesButNoPage(): string[] {
  return Object.keys(BODIES).filter((slug) => !DOC_PAGES.some((page) => page.slug === slug));
}

export function pagesWithNoBody(): string[] {
  return DOC_PAGES.filter((page) => !BODIES[page.slug]).map((page) => page.slug);
}
