import { useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { cn } from "@/lib/cn";

export interface Tab {
  readonly id: string;
  readonly label: string;
  readonly panel: ReactNode;
}

export interface TabsProps {
  readonly tabs: readonly Tab[];
  readonly defaultId?: string;
  readonly label: string;
  readonly className?: string;
}

/**
 * Tabs with the keyboard behaviour people expect: arrow keys move, Home and End
 * jump to the ends, and the focused tab is also the open one.
 *
 * Only the selected panel is in the DOM. Rendering all panels hidden would put
 * two copy buttons with the same text on the page, and a test that clicks
 * "Copy" would have to guess which one it meant.
 */
export function Tabs({ tabs, defaultId, label, className }: TabsProps) {
  const [activeId, setActiveId] = useState(defaultId ?? tabs[0]?.id ?? "");
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);

  const active = tabs.find((tab) => tab.id === activeId) ?? tabs[0];

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const index = tabs.findIndex((tab) => tab.id === active?.id);
    const last = tabs.length - 1;
    let next = index;

    if (event.key === "ArrowRight") next = index >= last ? 0 : index + 1;
    else if (event.key === "ArrowLeft") next = index <= 0 ? last : index - 1;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = last;
    else return;

    event.preventDefault();
    const target = tabs[next];
    if (!target) return;
    setActiveId(target.id);
    buttons.current[next]?.focus();
  }

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <div
        role="tablist"
        aria-label={label}
        onKeyDown={onKeyDown}
        className="flex gap-1 rounded-[9px] border border-line bg-card p-1"
      >
        {tabs.map((tab, index) => {
          const selected = tab.id === active?.id;
          return (
            <button
              key={tab.id}
              ref={(node) => {
                buttons.current[index] = node;
              }}
              type="button"
              role="tab"
              id={`tab-${tab.id}`}
              aria-selected={selected}
              aria-controls={`panel-${tab.id}`}
              tabIndex={selected ? 0 : -1}
              onClick={() => setActiveId(tab.id)}
              className={cn(
                "min-h-9 flex-1 rounded-[7px] px-3 font-mono text-[11px] uppercase tracking-[0.12em] transition-colors duration-[160ms]",
                selected ? "bg-orange-soft text-orange" : "text-muted hover:text-ink",
              )}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {active ? (
        <div role="tabpanel" id={`panel-${active.id}`} aria-labelledby={`tab-${active.id}`}>
          {active.panel}
        </div>
      ) : null}
    </div>
  );
}
