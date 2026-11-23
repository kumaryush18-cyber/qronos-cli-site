import type { ElementType, ReactNode } from "react";
import { cn } from "@/lib/cn";

export interface RevealProps {
  readonly children: ReactNode;
  /** Position in the group; each step adds 55 ms of delay (capped by the CSS). */
  readonly index?: number;
  readonly as?: ElementType;
  readonly className?: string;
}

/**
 * A block that fades and rises into place once, when it first comes into view.
 *
 * The hidden state lives in CSS behind `.js-motion`, and the reveal is driven by
 * `useReveal` in `App`. Nothing here waits for a timer, so a slow machine shows
 * the content late rather than shows it late *and* jumps.
 */
export function Reveal({ children, index = 0, as: Tag = "div", className }: RevealProps) {
  return (
    <Tag
      data-reveal=""
      // A data attribute, not an inline style: React serialises a custom
      // property in `style` as `--reveal-i:0` on the server and `--reveal-i: 0;`
      // in the browser, and that difference is enough to fail hydration.
      data-i={String(Math.min(index, 8))}
      className={cn(className)}
    >
      {children}
    </Tag>
  );
}
