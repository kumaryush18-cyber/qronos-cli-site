import { describe, expect, it } from "vitest";
import { buildRevealTimeline, DEFAULT_REVEAL, revealDuration, revealStateAfter } from "@/lib/reveal";
import type { TerminalLine } from "@/lib/terminal";

const lines: TerminalLine[] = [
  { kind: "step", text: "Run the suite", seconds: 2, status: "ok" },
  { kind: "command", text: "npm test" },
  { kind: "output", text: "148 passed" },
  { kind: "summary", text: "Churned for 2s" },
  { kind: "prompt", text: "" },
];

describe("buildRevealTimeline", () => {
  it("starts with the step line and never moves backwards", () => {
    const events = buildRevealTimeline(lines);
    expect(events[0]).toEqual({ atMs: 0, line: 0, chars: lines[0]!.text.length });
    for (let index = 1; index < events.length; index += 1) {
      expect(events[index]!.atMs).toBeGreaterThanOrEqual(events[index - 1]!.atMs);
    }
  });

  it("types the command one character at a time, in order", () => {
    const events = buildRevealTimeline(lines, { charMs: 10, beforeCommandMs: 0 });
    const typed = events.filter((event) => event.line === 1);
    expect(typed).toHaveLength("npm test".length);
    expect(typed.map((event) => event.chars)).toEqual([1, 2, 3, 4, 5, 6, 7, 8]);
    for (let index = 1; index < typed.length; index += 1) {
      expect(typed[index]!.atMs - typed[index - 1]!.atMs).toBe(10);
    }
  });

  it("shows output as whole blocks, never letter by letter", () => {
    const events = buildRevealTimeline(lines);
    const output = events.filter((event) => event.line === 2);
    expect(output).toHaveLength(1);
    expect(output[0]!.chars).toBe("148 passed".length);
  });

  it("gives the prompt its own pause at the end", () => {
    const events = buildRevealTimeline(lines, { beforePromptMs: 900 });
    const prompt = events.find((event) => event.line === 4)!;
    const summary = events.find((event) => event.line === 3)!;
    expect(prompt.atMs - summary.atMs).toBeGreaterThanOrEqual(900);
  });

  it("finishes in about three seconds with the default timings", () => {
    const duration = revealDuration(buildRevealTimeline(lines));
    expect(duration).toBeGreaterThan(1000);
    expect(duration).toBeLessThan(4000);
  });

  it("uses the documented default character speed", () => {
    expect(DEFAULT_REVEAL.charMs).toBe(18);
  });

  it("survives a line with no text", () => {
    const events = buildRevealTimeline([{ kind: "prompt", text: "" }]);
    expect(events).toHaveLength(1);
  });
});

describe("revealStateAfter", () => {
  const events = buildRevealTimeline(lines);

  it("shows nothing before the first event", () => {
    expect(revealStateAfter(events, 0, lines.length)).toEqual({ visible: 0, commandChars: new Map(), done: false });
  });

  it("shows one line after the first event", () => {
    const state = revealStateAfter(events, 1, lines.length);
    expect(state.visible).toBe(1);
    expect(state.done).toBe(false);
  });

  it("is complete once every event is applied", () => {
    const state = revealStateAfter(events, events.length, lines.length);
    expect(state.visible).toBe(lines.length);
    expect(state.done).toBe(true);
  });

  it("does not claim done one event early", () => {
    expect(revealStateAfter(events, events.length - 1, lines.length).done).toBe(false);
  });

  it("treats a negative count as nothing applied", () => {
    expect(revealStateAfter(events, -5, lines.length).visible).toBe(0);
  });
});
