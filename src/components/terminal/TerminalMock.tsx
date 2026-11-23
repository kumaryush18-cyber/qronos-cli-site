import { cn } from "@/lib/cn";
import { dotRole, fitLine, type TerminalLine } from "@/lib/terminal";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";
import { useTerminalReveal } from "./use-terminal-reveal";

export interface TerminalMockProps {
  readonly lines: readonly TerminalLine[];
  readonly title?: string;
  readonly className?: string;
  /** Typed reveal. Turned off automatically for reduced-motion readers. */
  readonly animate?: boolean;
}

const DOT: Record<"ok" | "fail" | "muted", string> = {
  ok: "bg-ok",
  fail: "bg-fail",
  muted: "bg-muted",
};

/**
 * The site's only "screenshot", drawn from data.
 *
 * Every line is cut to a fixed width so the block can never scroll sideways,
 * and the whole block carries a plain-text label so a screen reader hears the
 * same thing the picture shows — in full, even while the drawing is still
 * typing.
 */
export function TerminalMock({ lines, title = "qronos", className, animate = false }: TerminalMockProps) {
  const reduced = usePrefersReducedMotion();
  const { visible, commandChars, done } = useTerminalReveal(lines, { animate: animate && !reduced });

  return (
    <figure
      aria-busy={animate && !done ? true : undefined}
      className={cn(
        "overflow-hidden rounded-card border border-line bg-card text-left shadow-[0_30px_80px_-40px_rgba(0,0,0,0.9)]",
        className,
      )}
    >
      <div className="flex items-center gap-2 border-b border-line px-4 py-2.5">
        <span className="shimmer font-mono text-[11px] font-bold tracking-[-0.02em]">{title}</span>
        <span className="ml-auto font-mono text-[11px] uppercase tracking-[0.16em] text-muted">zsh</span>
      </div>

      <div className="min-h-[196px] px-4 py-4 font-mono text-[12px] leading-[1.85] sm:text-[12.5px]">
        {lines.slice(0, visible).map((line, index) => (
          <TerminalRow key={`${line.kind}-${index}`} line={line} shownChars={commandChars.get(index)} />
        ))}
      </div>

      <figcaption className="sr-only">
        <span>A terminal running Qronos CLI.</span>
        {lines.map((line, index) => (
          <span key={`sr-${line.kind}-${index}`}>{` ${line.text}`}</span>
        ))}
      </figcaption>
    </figure>
  );
}

function TerminalRow({ line, shownChars }: { line: TerminalLine; shownChars?: number }) {
  switch (line.kind) {
    case "step": {
      const role = dotRole(line.status);
      return (
        <div className="flex items-start gap-2">
          <span aria-hidden className={cn("mt-[7px] size-1.5 shrink-0 rounded-full", DOT[role])} />
          <span className="text-ink">
            {fitLine(line.text)}
            {line.seconds === undefined ? null : <span className="text-muted">{` · ${line.seconds}s`}</span>}
          </span>
        </div>
      );
    }
    case "command": {
      const text = shownChars === undefined ? line.text : line.text.slice(0, shownChars);
      const typing = shownChars !== undefined && shownChars < line.text.length;
      return (
        <div className="flex items-start gap-2 pl-[14px]">
          <span aria-hidden className="text-muted">
            ⎿
          </span>
          <span className="text-muted">
            <span className="text-orange">$</span> <span className="text-ink">{fitLine(text)}</span>
            {typing ? <span className="cursor ml-0.5 align-middle" aria-hidden /> : null}
          </span>
        </div>
      );
    }
    case "output":
      return <div className="whitespace-pre pl-[28px] text-muted">{fitLine(line.text)}</div>;
    case "summary":
      return (
        <div className="mt-1 text-muted">
          <span aria-hidden className="text-orange-pale">
            ✻{" "}
          </span>
          {fitLine(line.text)}
        </div>
      );
    case "prompt":
      return (
        <div className="mt-1 flex items-center gap-2">
          <span aria-hidden className="text-orange">
            ›
          </span>
          <span className="cursor" aria-hidden />
        </div>
      );
  }
}
