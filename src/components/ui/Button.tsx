import type { ReactNode } from "react";
import { Link } from "wouter";
import { cn } from "@/lib/cn";

export type ButtonVariant = "primary" | "ghost";
export type ButtonSize = "md" | "lg";

export interface ButtonProps {
  readonly children: ReactNode;
  /** Route ("/docs"), section ("/#features") or absolute URL. */
  readonly href?: string;
  readonly onClick?: () => void;
  readonly variant?: ButtonVariant;
  readonly size?: ButtonSize;
  readonly className?: string;
  readonly external?: boolean;
}

const BASE =
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[9px] font-extrabold transition-[transform,background-color,border-color,box-shadow] duration-[160ms] ease-[var(--ease-out)] active:scale-[0.97]";

const VARIANTS: Record<ButtonVariant, string> = {
  primary: cn(
    "border border-orange-line bg-orange-soft text-orange",
    "hover:border-orange hover:shadow-[0_0_28px_var(--orange-glow)] hover:-translate-y-px",
  ),
  ghost: "border border-transparent text-muted hover:text-ink hover:underline underline-offset-4",
};

const SIZES: Record<ButtonSize, string> = {
  md: "px-5 py-3 text-[13px]",
  lg: "px-6 py-3.5 text-[14px]",
};

/**
 * One button, two looks. Internal routes go through wouter so the page does not
 * reload; hash links and absolute URLs are plain anchors, because wouter cannot
 * scroll to a section for us.
 */
export function Button({
  children,
  href,
  onClick,
  variant = "primary",
  size = "md",
  className,
  external = false,
}: ButtonProps) {
  const classes = cn(BASE, VARIANTS[variant], SIZES[size], className);

  if (!href) {
    return (
      <button type="button" onClick={onClick} className={classes}>
        {children}
      </button>
    );
  }

  const isPlainAnchor = external || href.includes("#") || href.startsWith("http") || href.startsWith("mailto:");

  if (isPlainAnchor) {
    const rel = external || href.startsWith("http") ? "noreferrer noopener" : undefined;
    const target = external || href.startsWith("http") ? "_blank" : undefined;
    return (
      <a href={href} className={classes} {...(rel ? { rel } : {})} {...(target ? { target } : {})}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={classes}>
      {children}
    </Link>
  );
}
