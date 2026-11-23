import { useEffect, useState } from "react";
import type { Heading } from "@/lib/headings";
import { cn } from "@/lib/cn";

export interface DocTocProps {
  readonly headings: readonly Heading[];
  readonly className?: string;
}

/**
 * "On this page", with the current section marked.
 *
 * The active heading is found with an IntersectionObserver rather than a scroll
 * handler: one callback per crossing instead of one per pixel scrolled.
 */
export function DocToc({ headings, className }: DocTocProps) {
  const [activeId, setActiveId] = useState<string>(headings[0]?.id ?? "");

  useEffect(() => {
    if (headings.length === 0) return;
    if (typeof IntersectionObserver !== "function") return;

    const elements = headings
      .map((heading) => document.getElementById(heading.id))
      .filter((element): element is HTMLElement => element !== null);

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (visible?.target.id) setActiveId(visible.target.id);
      },
      { rootMargin: "-96px 0px -70% 0px", threshold: 0 },
    );

    for (const element of elements) observer.observe(element);
    return () => observer.disconnect();
  }, [headings]);

  if (headings.length === 0) return null;

  return (
    <nav aria-label="On this page" className={cn("flex flex-col gap-2", className)}>
      <p className="font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-muted">On this page</p>
      <ul className="flex flex-col gap-1 border-l border-line">
        {headings.map((heading) => (
          <li key={heading.id}>
            <a
              href={`#${heading.id}`}
              aria-current={activeId === heading.id ? "location" : undefined}
              className={cn(
                "-ml-px block border-l-2 py-1 text-[12px] leading-snug transition-colors duration-[160ms]",
                heading.depth === 2 ? "pl-3" : "pl-5",
                activeId === heading.id
                  ? "border-orange text-orange"
                  : "border-transparent text-muted hover:text-ink",
              )}
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
