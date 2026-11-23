import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/** The 1220px content column. Every page content sits inside one of these. */
export function Shell({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("mx-auto w-full max-w-[1220px] px-[22px] sm:px-7", className)}>{children}</div>;
}

export interface SectionProps {
  readonly children: ReactNode;
  readonly id?: string;
  /** Tighter spacing for stacked sections, heavier for the first one. */
  readonly spacing?: "normal" | "tight";
  readonly className?: string;
  readonly labelledBy?: string;
}

/** Vertical rhythm: 130px desktop, 78px mobile, from brand.md §4. */
export function Section({ children, id, spacing = "normal", className, labelledBy }: SectionProps) {
  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      className={cn(
        spacing === "normal" ? "py-[78px] sm:py-[112px]" : "py-12 sm:py-16",
        "scroll-mt-[96px]",
        className,
      )}
    >
      <Shell>{children}</Shell>
    </section>
  );
}
