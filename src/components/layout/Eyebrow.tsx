import { cn } from "@/lib/cn";

export interface EyebrowProps {
  readonly children: string;
  /** Shows a small pulsing dot before the text — used once per page at most. */
  readonly dot?: boolean;
  readonly className?: string;
}

/** The mono, uppercase 10px label above a section heading. */
export function Eyebrow({ children, dot = false, className }: EyebrowProps) {
  return (
    <p className={cn("eyebrow", className)}>
      {dot ? <span aria-hidden className="size-1.5 rounded-full bg-orange" /> : null}
      {children}
    </p>
  );
}
