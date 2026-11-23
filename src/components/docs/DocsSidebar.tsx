import { Link, useLocation } from "wouter";
import { DocSearch } from "./DocSearch";
import { groupedDocs, type DocPage } from "@/content/docs/manifest";
import { cn } from "@/lib/cn";

export interface DocsSidebarProps {
  readonly className?: string;
}

/** Grouped, sticky navigation for the docs. Order comes from the manifest. */
export function DocsSidebar({ className }: DocsSidebarProps) {
  const [pathname] = useLocation();

  return (
    <nav aria-label="Documentation" className={cn("flex flex-col gap-6", className)}>
      <DocSearch />
      {groupedDocs().map(({ group, pages }) => (
        <div key={group} className="flex flex-col gap-2">
          <p className="font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-muted">{group}</p>
          <ul className="flex flex-col gap-0.5">
            {pages.map((page: DocPage) => {
              const active = pathname === `/docs/${page.slug}`;
              return (
                <li key={page.slug}>
                  <Link
                    href={`/docs/${page.slug}`}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "block rounded-[7px] px-2 py-1.5 text-[12.5px] transition-colors duration-[160ms]",
                      active ? "bg-orange-soft text-orange" : "text-muted hover:bg-card hover:text-ink",
                    )}
                  >
                    {page.title}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}
