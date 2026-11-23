/**
 * The hero terminal's reveal, as data.
 *
 * The animation is a list of events with absolute times, built by a pure
 * function, so it can be tested without a browser and without waiting: the
 * component only walks the list. A test that sleeps for 2.5 s to check an
 * animation is a test that fails on a slow machine.
 */
import type { TerminalLine } from "./terminal";

export interface RevealEvent {
  /** Milliseconds from the start of the reveal. */
  readonly atMs: number;
  /** Which line becomes visible (or grows). */
  readonly line: number;
  /** How many characters of that line are shown. Whole line for non-command. */
  readonly chars: number;
}

export interface RevealOptions {
  /** Time per typed character on a command line. */
  readonly charMs?: number;
  /** Pause before the command starts typing. */
  readonly beforeCommandMs?: number;
  /** Time before each non-command line appears. */
  readonly lineMs?: number;
  /** Extra pause before the closing prompt. */
  readonly beforePromptMs?: number;
}

export const DEFAULT_REVEAL: Required<RevealOptions> = {
  charMs: 18,
  beforeCommandMs: 320,
  lineMs: 170,
  beforePromptMs: 360,
};

/**
 * Build the event list.
 *
 * A command line is the only one that types, because that is what a real
 * terminal does: a command is typed, output arrives as blocks.
 */
export function buildRevealTimeline(
  lines: readonly TerminalLine[],
  options: RevealOptions = {},
): RevealEvent[] {
  const config = { ...DEFAULT_REVEAL, ...options };
  const events: RevealEvent[] = [];
  let at = 0;

  lines.forEach((line, index) => {
    if (line.kind === "command") {
      at += config.beforeCommandMs;
      for (let chars = 1; chars <= line.text.length; chars += 1) {
        events.push({ atMs: at, line: index, chars });
        at += config.charMs;
      }
      return;
    }

    if (line.kind === "prompt") at += config.beforePromptMs;
    else if (index > 0) at += config.lineMs;

    events.push({ atMs: at, line: index, chars: line.text.length });
  });

  return events;
}

/** Total length of the reveal, so a caller can say when it is over. */
export function revealDuration(events: readonly RevealEvent[]): number {
  return events.reduce((last, event) => Math.max(last, event.atMs), 0);
}

/** The state the block is in after applying the first `count` events. */
export function revealStateAfter(
  events: readonly RevealEvent[],
  count: number,
  lineCount: number,
): { visible: number; commandChars: Map<number, number>; done: boolean } {
  const applied = events.slice(0, Math.max(0, count));
  const commandChars = new Map<number, number>();
  let visible = 0;

  for (const event of applied) {
    visible = Math.max(visible, event.line + 1);
    commandChars.set(event.line, event.chars);
  }

  return { visible, commandChars, done: count >= events.length || visible >= lineCount };
}
