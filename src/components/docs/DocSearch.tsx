import { Search } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "wouter";
import { DOC_PAGES } from "@/content/docs/manifest";
import { DOC_SOURCES } from "@/content/docs/registry";
import { buildIndex, searchEntries } from "@/lib/search";
import { cn } from "@/lib/cn";

const OPEN_EVENT = "qronos:search";

/** Anything may ask the dialog to open; the dialog owns its own state. */
export function openSearch() {
  window.dispatchEvent(new CustomEvent(OPEN_EVENT));
}

/**
 * Docs search: `cmd+K` (or `ctrl+K`) anywhere, or the button in the sidebar.
 *
 * The index is built from the MDX sources already in the bundle, so it is never
 * out of date and costs no extra request.
 */
export function DocSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [cursor, setCursor] = useState(0);
  const input = useRef<HTMLInputElement | null>(null);
  const [, navigate] = useLocation();

  const index = useMemo(() => buildIndex(DOC_PAGES, DOC_SOURCES), []);
  const hits = useMemo(() => searchEntries(index, query), [index, query]);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen((value) => !value);
      }
      if (event.key === "Escape") setOpen(false);
    }
    function onOpenEvent() {
      setOpen(true);
    }

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener(OPEN_EVENT, onOpenEvent);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener(OPEN_EVENT, onOpenEvent);
    };
  }, []);

  useEffect(() => {
    if (open) {
      setQuery("");
      setCursor(0);
      const frame = requestAnimationFrame(() => input.current?.focus());
      return () => cancelAnimationFrame(frame);
    }
    return;
  }, [open]);

  function go(hit: { slug: string; anchor?: string }) {
    setOpen(false);
    navigate(`/docs/${hit.slug}${hit.anchor ? `#${hit.anchor}` : ""}`);
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex min-h-11 w-full items-center gap-2 rounded-[9px] border border-line bg-card px-3 text-left text-[12px] text-muted transition-colors duration-[160ms] hover:border-orange-line hover:text-ink"
      >
        <Search size={14} aria-hidden />
        Search docs
        <kbd className="ml-auto rounded border border-line px-1.5 py-0.5 font-mono text-[11px] text-muted">
          ⌘K
        </kbd>
      </button>

      {open ? (
        <div
          className="fixed inset-0 z-[70] flex items-start justify-center bg-paper/80 px-4 pt-[12vh] backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label="Search documentation"
          onClick={(event) => {
            if (event.target === event.currentTarget) setOpen(false);
          }}
        >
          <div className="w-full max-w-[560px] overflow-hidden rounded-panel border border-line bg-card shadow-[0_40px_120px_-40px_rgba(0,0,0,0.9)]">
            <div className="flex items-center gap-3 border-b border-line px-4">
              <Search size={15} aria-hidden className="text-muted" />
              <input
                ref={input}
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value);
                  setCursor(0);
                }}
                onKeyDown={(event) => {
                  if (event.key === "ArrowDown") {
                    event.preventDefault();
                    setCursor((value) => Math.min(value + 1, Math.max(0, hits.length - 1)));
                  } else if (event.key === "ArrowUp") {
                    event.preventDefault();
                    setCursor((value) => Math.max(0, value - 1));
                  } else if (event.key === "Enter") {
                    const hit = hits[cursor];
                    if (hit) go(hit);
                  }
                }}
                placeholder="Search the docs…"
                aria-label="Search query"
                className="h-12 w-full bg-transparent text-[14px] text-ink outline-none placeholder:text-muted"
              />
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="font-mono text-[11px] text-muted hover:text-ink"
              >
                esc
              </button>
            </div>

            <ul className="max-h-[52vh] overflow-y-auto p-2">
              {query.trim().length < 2 ? (
                <li className="px-3 py-6 text-center text-[12.5px] text-muted">Type two letters to search.</li>
              ) : hits.length === 0 ? (
                <li className="px-3 py-6 text-center text-[12.5px] text-muted">
                  Nothing found for “{query.trim()}”.
                </li>
              ) : (
                hits.map((hit, index) => (
                  <li key={`${hit.slug}-${hit.anchor ?? "top"}`}>
                    <button
                      type="button"
                      onClick={() => go(hit)}
                      onMouseEnter={() => setCursor(index)}
                      className={cn(
                        "flex w-full flex-col gap-0.5 rounded-[7px] px-3 py-2 text-left",
                        index === cursor ? "bg-orange-soft" : "hover:bg-paper",
                      )}
                    >
                      <span className="text-[13px] font-bold text-ink">{hit.title}</span>
                      <span className="truncate font-mono text-[11px] text-muted">{hit.snippet}</span>
                    </button>
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>
      ) : null}
    </>
  );
}
