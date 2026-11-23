import { ArrowLeft, ArrowRight } from "lucide-react";
import { Link } from "wouter";
import { DocToc } from "@/components/docs/DocToc";
import { DocsSidebar } from "@/components/docs/DocsSidebar";
import { mdxComponents } from "@/components/docs/mdx-components";
import { Shell } from "@/components/layout/Shell";
import { Callout } from "@/components/ui/Callout";
import { docNeighbours, findDoc } from "@/content/docs/manifest";
import { docBody, docHeadings } from "@/content/docs/registry";
import { Reveal } from "@/components/ui/Reveal";
import { useMediaQuery } from "@/lib/use-media-query";
import { NotFound } from "./NotFound";

/**
 * One documentation page: the MDX body, a table of contents built from the real
 * heading ids, and links to the neighbours in manifest order.
 */
export function DocPage({ slug }: { slug: string }) {
  const page = findDoc(slug);
  const Body = docBody(slug);
  if (!page || !Body) return <NotFound />;

  const headings = docHeadings(slug);
  const { prev, next } = docNeighbours(slug);
  // One table of contents in the DOM, not two: CSS-hidden copies are still read
  // aloud by a screen reader and still cost work on every render.
  const wide = useMediaQuery("(min-width: 1280px)");
  // On a phone the full page list would push the article below twelve links.
  // A disclosure keeps the article one tap away instead of one thumb-scroll.
  const large = useMediaQuery("(min-width: 1024px)");

  return (
    <Shell>
      <div className="grid gap-10 py-12 lg:grid-cols-[180px_minmax(0,1fr)] lg:gap-12 xl:grid-cols-[180px_minmax(0,1fr)_170px]">
        <aside className="lg:sticky lg:top-[102px] lg:self-start">
          {large ? (
            <DocsSidebar />
          ) : (
            <details className="rounded-card border border-line bg-card p-3">
              <summary className="flex min-h-11 cursor-pointer items-center font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-muted">
                Browse all docs
              </summary>
              <DocsSidebar className="mt-2" />
            </details>
          )}
        </aside>

        <article className="flex min-w-0 max-w-[735px] flex-col">
          <Reveal as="header" className="flex flex-col gap-3 border-b border-line pb-6">
            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted">{page.group}</p>
            <h1 className="text-[clamp(30px,4vw,42px)] leading-[1.06] tracking-[-0.06em]">{page.title}</h1>
            <p className="text-[14px] leading-relaxed text-muted">{page.intro}</p>
          </Reveal>

          {headings.length > 0 && !wide ? (
            <details className="my-6 rounded-card border border-line bg-card p-3">
              <summary className="cursor-pointer font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-muted">
                On this page
              </summary>
              <DocToc headings={headings} className="mt-3" />
            </details>
          ) : null}

          <Reveal index={1} className="min-w-0 pt-6">
            <Body components={mdxComponents} />
          </Reveal>

          <Callout tone="honest" title="Found a mistake?">
            This page is generated from the CLI repository. If something here does not match what the tool does,
            open an issue — the wording is checked against the code, not written from memory.
          </Callout>

          <nav aria-label="Pagination" className="mt-8 flex items-stretch justify-between gap-3 border-t border-line pt-6">
            {prev ? (
              <Link
                href={`/docs/${prev.slug}`}
                className="group flex min-w-0 flex-col gap-1 text-[12.5px] text-muted hover:text-ink"
              >
                <span className="flex items-center gap-1 font-mono text-[11px] uppercase tracking-[0.16em]">
                  <ArrowLeft size={12} aria-hidden /> Previous
                </span>
                <span className="truncate font-bold">{prev.title}</span>
              </Link>
            ) : (
              <span />
            )}
            {next ? (
              <Link
                href={`/docs/${next.slug}`}
                className="group flex min-w-0 flex-col items-end gap-1 text-right text-[12.5px] text-muted hover:text-ink"
              >
                <span className="flex items-center gap-1 font-mono text-[11px] uppercase tracking-[0.16em]">
                  Next <ArrowRight size={12} aria-hidden />
                </span>
                <span className="truncate font-bold">{next.title}</span>
              </Link>
            ) : (
              <span />
            )}
          </nav>
        </article>

        <aside className="hidden xl:sticky xl:top-[102px] xl:block xl:self-start">
          {wide ? <DocToc headings={headings} /> : null}
        </aside>
      </div>
    </Shell>
  );
}
