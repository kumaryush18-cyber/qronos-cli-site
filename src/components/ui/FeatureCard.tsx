import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/cn";

export interface FeatureCardProps {
  readonly step: string;
  readonly title: string;
  readonly body: string;
  readonly icon: LucideIcon;
  readonly className?: string;
}

/**
 * One feature. Equal height across the grid (the grid does that), a mono step
 * number for rhythm, and a soft orange icon tile.
 */
export function FeatureCard({ step, title, body, icon: Icon, className }: FeatureCardProps) {
  return (
    <article
      className={cn(
        "group flex h-full flex-col gap-4 rounded-card border border-line bg-card p-6",
        "transition-[transform,border-color] duration-[160ms] ease-[var(--ease-out)]",
        "hover:-translate-y-[5px] hover:border-orange-line",
        className,
      )}
    >
      <div className="flex items-center justify-between">
        <span className="grid size-[38px] place-items-center rounded-[10px] bg-orange-soft text-orange">
          <Icon size={18} strokeWidth={1.5} aria-hidden />
        </span>
        <span className="font-mono text-[11px] tracking-[0.16em] text-muted">{step}</span>
      </div>

      <h3 className="text-[19px] leading-tight tracking-[-0.045em] sm:text-[20px]">{title}</h3>
      <p className="text-[13.5px] leading-[1.75] text-muted">{body}</p>
    </article>
  );
}
