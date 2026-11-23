import { describe, expect, it } from "vitest";
import { dotRole, fitLine, TERMINAL_MAX_CHARS, terminalAsText, type TerminalLine } from "@/lib/terminal";

describe("fitLine", () => {
  it("leaves a short line alone", () => {
    expect(fitLine("npm test", 20)).toBe("npm test");
  });

  it("cuts a long line to the width, ellipsis included", () => {
    const out = fitLine("a".repeat(40), 20);
    expect(out).toHaveLength(20);
    expect(out.endsWith("...")).toBe(true);
  });

  it("does not leave a trailing space before the ellipsis", () => {
    const out = fitLine(`${"word ".repeat(20)}`, 20);
    expect(out).not.toContain(" ...");
  });

  it("uses the shared default width when none is given", () => {
    const out = fitLine("x".repeat(TERMINAL_MAX_CHARS + 50));
    expect(out).toHaveLength(TERMINAL_MAX_CHARS);
  });

  it("survives a width that is too small to hold an ellipsis", () => {
    expect(fitLine("abcdef", 2)).toBe("..");
    expect(fitLine("abcdef", 0)).toBe("");
  });
});

describe("dotRole", () => {
  it("is green when done, red when failed, grey while running", () => {
    expect(dotRole("ok")).toBe("ok");
    expect(dotRole("fail")).toBe("fail");
    expect(dotRole("running")).toBe("muted");
    expect(dotRole(undefined)).toBe("muted");
  });
});

describe("terminalAsText", () => {
  const lines: TerminalLine[] = [
    { kind: "step", text: "Run the suite", seconds: 2, status: "ok" },
    { kind: "command", text: "npm test" },
    { kind: "output", text: "12 passed" },
    { kind: "summary", text: "Churned for 2s" },
    { kind: "prompt", text: "" },
  ];

  it("draws the same glyphs the component draws", () => {
    expect(terminalAsText(lines)).toBe(
      ["● Run the suite · 2s", "  ⎿ $ npm test", "    12 passed", "✻ Churned for 2s", "> _"].join("\n"),
    );
  });

  it("omits the seconds when there are none", () => {
    expect(terminalAsText([{ kind: "step", text: "Think" }])).toBe("● Think");
  });
});
