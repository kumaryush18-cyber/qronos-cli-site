import type { PanelAgent, PanelAgentState } from "./copy";

/**
 * One glyph and one word per agent state.
 *
 * The word matters: a colour alone cannot say "you stopped this". A replayed
 * agent is blue because it is the opposite of new work — it costs nothing.
 */
export const PANEL_STATE: Record<PanelAgentState, { glyph: string; label: string; tone: string }> = {
  done: { glyph: "✓", label: "done", tone: "text-ok" },
  failed: { glyph: "✗", label: "failed", tone: "text-fail" },
  stopped: { glyph: "⊘", label: "stopped by you", tone: "text-stop" },
  replayed: { glyph: "↺", label: "replayed · no tokens", tone: "text-info" },
  running: { glyph: "·", label: "running", tone: "text-orange" },
};

export interface PanelCounts {
  readonly total: number;
  readonly done: number;
  readonly failed: number;
  readonly stopped: number;
  readonly replayed: number;
  readonly running: number;
}

/** Count every state, so the header can say "4 of 8" without guessing. */
export function countStates(agents: readonly PanelAgent[]): PanelCounts {
  const counts = { total: agents.length, done: 0, failed: 0, stopped: 0, replayed: 0, running: 0 };
  for (const agent of agents) counts[agent.state] += 1;
  return counts;
}

/**
 * A one-line summary for a phase, e.g. "3 done · 1 failed".
 *
 * States with no agents are left out, so a finished phase does not read
 * "0 failed, 0 stopped, 0 running".
 */
export function summarizeCounts(counts: PanelCounts): string {
  const parts: string[] = [];
  if (counts.done) parts.push(`${counts.done} done`);
  if (counts.replayed) parts.push(`${counts.replayed} replayed`);
  if (counts.failed) parts.push(`${counts.failed} failed`);
  if (counts.stopped) parts.push(`${counts.stopped} stopped`);
  if (counts.running) parts.push(`${counts.running} running`);
  return parts.length > 0 ? parts.join(" · ") : "no agents";
}

/**
 * Compact form for a narrow column: "✓2 ✗1 ⊘1".
 *
 * The words are still there for a screen reader; this string is only drawn
 * when the column is tight, because a wrapped summary made every phase row a
 * different height.
 */
export function compactCounts(counts: PanelCounts): { glyph: string; label: string }[] {
  const order: PanelAgentState[] = ["done", "replayed", "failed", "stopped", "running"];
  return order
    .filter((state) => counts[state] > 0)
    .map((state) => ({
      glyph: `${PANEL_STATE[state].glyph}${counts[state]}`,
      label: `${counts[state]} ${PANEL_STATE[state].label}`,
    }));
}

/** Tokens are display strings ("3.1k"); the panel never does arithmetic on them. */
export function tokensForPhase(agents: readonly PanelAgent[]): string {
  return `${agents.length} agent${agents.length === 1 ? "" : "s"}`;
}
