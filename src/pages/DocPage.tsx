import { ArrowLeft, ArrowRight } from "lucide-react";
import { Link } from "wouter";
import { DocsSidebar } from "@/components/docs/DocsSidebar";
import { Shell } from "@/components/layout/Shell";
import { Callout } from "@/components/ui/Callout";
import { docNeighbours, findDoc } from "@/content/docs/manifest";
import { NotFound } from "./NotFound";

/**
 * One documentation page.
 *
 * In P1 the page structure, sidebar, neighbours and metadata are real; the body
 * comes from MDX in P3. The placeholder says so out loud instead of pretending
 * to be documentation.
 */
export function DocPage({ slug }: { slug: string }) {
  const page = findDoc(slug);
  if (!page) return <NotFound />;

  const { prev, next } = docNeighbours(slug);

  return (
    <Shell>
      <div className="grid gap-10 py-14 lg:grid-cols-[190px_minmax(0,1fr)_150px] lg:gap-14">
        <aside className="lg:sticky lg:top-[102px] lg:self-start">
          <DocsSidebar />
        </aside>

        <article className="flex min-w-0 max-w-[735px] flex-col gap-6">
          <header className="flex flex-col gap-3 border-b border-line pb-6">
            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted">{page.group}</p>
            <h1 className="text-[clamp(30px,4vw,44px)] leading-[1.06] tracking-[-0.06em]">{page.title}</h1>
            <p className="text-[14px] leading-relaxed text-muted">{page.intro}</p>
          </header>

          <Callout tone="note" title="Draft page">
            The layout, order, metadata and links for this page are finished. Its body is written in phase P3 from
            the CLI repository, so it cannot drift from what the code actually does.
          </Callout>

          <nav aria-label="Pagination" className="mt-4 flex items-stretch justify-between gap-3 border-t border-line pt-6">
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

        <aside className="hidden lg:sticky lg:top-[102px] lg:block lg:self-start">
          <p className="font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-muted">On this page</p>
          <p className="mt-2 text-[12px] leading-relaxed text-muted">Headings appear here in P3.</p>
        </aside>
      </div>
    </Shell>
  );
}
