/**
 * A represented terminal line. The terminal mock is the site's only
 * "screenshot", so it is parsed from structured data instead of being a
 * picture: nothing can leak, and the text stays selectable.
 */
export type TerminalLine =
  | { kind: "step"; text: string; seconds?: number; status?: "ok" | "running" | "fail" }
  | { kind: "command"; text: string }
  | { kind: "output"; text: string }
  | { kind: "summary"; text: string }
  | { kind: "prompt"; text: string };

/** Longest line the mock ever draws before it is cut with an ellipsis. */
export const TERMINAL_MAX_CHARS = 96;

/**
 * Cut one line so the block never scrolls sideways.
 *
 * Uses one character per cell: the mock is monospace and the copy is ASCII, so
 * a width function would be ceremony. Anything non-monospace must not be put
 * through here.
 */
export function fitLine(text: string, max: number = TERMINAL_MAX_CHARS): string {
  if (max <= 3) return ".".repeat(Math.max(0, max));
  if (text.length <= max) return text;
  return `${text.slice(0, max - 3).trimEnd()}...`;
}

/** The colour role of the dot in front of a step line. A running step is grey. */
export function dotRole(status?: "ok" | "running" | "fail"): "ok" | "fail" | "muted" {
  if (status === "ok") return "ok";
  if (status === "fail") return "fail";
  return "muted";
}

/**
 * A plain-text rendering of the block, used for the accessible label and for
 * tests. One line in, one line out — the mock never invents a line.
 */
export function terminalAsText(lines: readonly TerminalLine[]): string {
  return lines
    .map((line) => {
      switch (line.kind) {
        case "step":
          return `● ${line.text}${line.seconds === undefined ? "" : ` · ${line.seconds}s`}`;
        case "command":
          return `  ⎿ $ ${line.text}`;
        case "output":
          return `    ${line.text}`;
        case "summary":
          return `✻ ${line.text}`;
        case "prompt":
          return "> _";
      }
    })
    .join("\n");
}
