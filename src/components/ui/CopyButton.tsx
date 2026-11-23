import { useEffect, useRef, useState } from "react";
import { copyText } from "@/lib/clipboard";
import { cn } from "@/lib/cn";

type CopyState = "idle" | "copied" | "failed";

export interface CopyButtonProps {
  readonly text: string;
  readonly label?: string;
  readonly copiedLabel?: string;
  readonly className?: string;
  /** Announce the result to screen readers; off for a purely visual chip. */
  readonly live?: boolean;
}

const RESET_MS = 1500;

/**
 * Copies `text` and says "Copied" only when the clipboard really took it.
 *
 * A failed copy says "Copy failed" so nobody walks to a terminal with an empty
 * paste buffer. The timer is cleared on unmount: setting state after unmount
 * was a real crash source in the panel work.
 */
export function CopyButton({
  text,
  label = "Copy",
  copiedLabel = "Copied",
  className,
  live = true,
}: CopyButtonProps) {
  const [state, setState] = useState<CopyState>("idle");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  async function onClick() {
    const ok = await copyText(text);
    setState(ok ? "copied" : "failed");
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setState("idle"), RESET_MS);
  }

  const shown = state === "copied" ? copiedLabel : state === "failed" ? "Copy failed" : label;

  return (
    <button
      type="button"
      onClick={onClick}
      data-state={state}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-[9px] border border-line px-3.5 py-2",
        "font-mono text-[11px] font-medium tracking-wide text-muted",
        "transition-colors duration-[160ms] hover:border-orange-line hover:text-ink",
        state === "copied" && "border-orange-line text-orange",
        state === "failed" && "border-fail/40 text-fail",
        className,
      )}
    >
      {shown}
      {live ? (
        <span className="sr-only" role="status" aria-live="polite">
          {state === "copied" ? "Copied to clipboard" : state === "failed" ? "Copy failed" : ""}
        </span>
      ) : null}
    </button>
  );
}
