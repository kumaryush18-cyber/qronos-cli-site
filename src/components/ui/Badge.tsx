import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export interface BadgeProps {
  readonly children: ReactNode;
  readonly className?: string;
  readonly tone?: "neutral" | "orange" | "ok";
}

const TONES = {
  neutral: "border-line text-muted",
  orange: "border-orange-line bg-orange-soft text-orange",
  ok: "border-ok/30 text-ok",
} as const;

/** Small mono chip. Never the only carrier of a meaning. */
export function Badge({ children, className, tone = "neutral" }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-3 py-1 font-mono text-[11px] uppercase tracking-[0.14em]",
        TONES[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
