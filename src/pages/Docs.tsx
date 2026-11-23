import { ArrowRight } from "lucide-react";
import { Link } from "wouter";
import { DocsSidebar } from "@/components/docs/DocsSidebar";
import { Eyebrow } from "@/components/layout/Eyebrow";
import { Shell } from "@/components/layout/Shell";
import { groupedDocs } from "@/content/docs/manifest";

export function Docs() {
  return (
    <Shell>
      <div className="grid gap-10 py-14 lg:grid-cols-[190px_minmax(0,1fr)] lg:gap-14">
        <aside className="lg:sticky lg:top-[102px] lg:self-start">
          <DocsSidebar />
        </aside>

        <div className="flex min-w-0 flex-col gap-8">
          <header className="flex flex-col gap-4">
            <Eyebrow>Documentation</Eyebrow>
            <h1 className="heading">Everything the CLI does, written down.</h1>
            <p className="lead">
              Thirteen pages, no marketing. Each one says what the feature does, what it costs and where it stops.
            </p>
          </header>

          {groupedDocs().map(({ group, pages }) => (
            <section key={group} className="flex flex-col gap-3">
              <h2 className="font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-muted">{group}</h2>
              <ul className="grid gap-3 sm:grid-cols-2">
                {pages.map((page) => (
                  <li key={page.slug}>
                    <Link
                      href={`/docs/${page.slug}`}
                      className="group flex h-full flex-col gap-1.5 rounded-card border border-line bg-card p-4 transition-colors duration-[160ms] hover:border-orange-line"
                    >
                      <span className="flex items-center gap-2 text-[14px] font-bold text-ink">
                        {page.title}
                        <ArrowRight
                          size={13}
                          aria-hidden
                          className="opacity-0 transition-opacity duration-[160ms] group-hover:opacity-100"
                        />
                      </span>
                      <span className="text-[12.5px] leading-relaxed text-muted">{page.intro}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </div>
    </Shell>
  );
}
