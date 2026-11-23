import { useEffect, useRef, useState } from "react";
import { buildRevealTimeline, revealStateAfter, type RevealEvent } from "@/lib/reveal";
import type { TerminalLine } from "@/lib/terminal";

export interface TerminalReveal {
  /** How many lines are visible. */
  readonly visible: number;
  /** Typed characters per line, for the command line only. */
  readonly commandChars: ReadonlyMap<number, number>;
  /** True once the last event has been applied. */
  readonly done: boolean;
}

export interface UseTerminalRevealOptions {
  /** When false the block renders complete on the first paint. */
  readonly animate: boolean;
}

/**
 * Walk a reveal timeline with one timer at a time.
 *
 * One timer, cleared on unmount and on any dependency change, means no drifting
 * interval and no state update after the component is gone. Motion is decoration:
 * if anything about it fails, the final state is still correct.
 */
export function useTerminalReveal(
  lines: readonly TerminalLine[],
  { animate }: UseTerminalRevealOptions,
): TerminalReveal {
  const events = useRef<RevealEvent[]>([]);
  const [index, setIndex] = useState(0);

  if (events.current.length === 0) {
    events.current = buildRevealTimeline(lines);
  }

  useEffect(() => {
    if (!animate) {
      setIndex(events.current.length);
      return;
    }

    setIndex(0);
    let current = 0;
    let timer: ReturnType<typeof setTimeout> | undefined;

    const step = () => {
      current += 1;
      setIndex(current);
      if (current >= events.current.length) return;
      const previous = events.current[current - 1]?.atMs ?? 0;
      const next = events.current[current]?.atMs ?? previous;
      timer = setTimeout(step, Math.max(0, next - previous));
    };

    const first = events.current[0]?.atMs ?? 0;
    timer = setTimeout(step, Math.max(0, first));

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [animate, lines]);

  const state = revealStateAfter(events.current, index, lines.length);
  return { visible: state.visible, commandChars: state.commandChars, done: state.done };
}
