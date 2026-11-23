import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export type CalloutTone = "note" | "warning" | "honest";

export interface CalloutProps {
  readonly children: ReactNode;
  readonly tone?: CalloutTone;
  readonly title?: string;
  readonly className?: string;
}

const TONES: Record<CalloutTone, { border: string; label: string; title: string }> = {
  note: { border: "border-l-orange", label: "Note", title: "Note" },
  warning: { border: "border-l-fail", label: "Careful", title: "Careful" },
  honest: { border: "border-l-orange-pale", label: "The limit", title: "The limit" },
};

/**
 * Three kinds only, from brand.md §6: a note, a warning, and the honest limit
 * of a claim. The tone also names itself in text, so colour is never the only
 * signal.
 */
export function Callout({ children, tone = "note", title, className }: CalloutProps) {
  const spec = TONES[tone];
  return (
    <aside
      className={cn("rounded-r-[9px] border-l-2 bg-orange-soft/40 px-4 py-3 text-[13px] leading-relaxed", spec.border, className)}
    >
      <p className="mb-1 font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-ink">{title ?? spec.title}</p>
      <div className="text-muted [&_a]:text-orange [&_a]:underline [&_code]:text-ink">{children}</div>
    </aside>
  );
}
